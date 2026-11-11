use std::sync::Arc;
use tokio::task::JoinHandle;
use zbus::{interface, ConnectionBuilder};
use crate::service::UrWidgetsService;
use crate::database::WidgetPreferenceRecord;

pub struct DbusDaemonInterface {
    service: Arc<UrWidgetsService>,
}

#[interface(name = "org.urwidgets.Daemon1")]
impl DbusDaemonInterface {
    async fn get_snapshot(&self) -> String {
        self.service.snapshot_json()
    }

    async fn set_theme(&self, theme_id: &str) -> bool {
        let themes = self.service.themes.lock().unwrap();
        if themes.iter().any(|t| t.id == theme_id) {
            *self.service.active_theme_id.lock().unwrap() = theme_id.to_string();
            true
        } else {
            false
        }
    }

    async fn alarm_action(&self, cmd: &str) -> String {
        let (payload_json, has_active_due) = {
            let mut alarms = self.service.alarms.lock().unwrap();
            if let Some(deleted_id) = cmd.strip_prefix("delete|") {
                alarms.apply_command(cmd);
                if let Ok(db) = self.service.db.lock() {
                    let _ = db.delete_alarm(deleted_id.trim());
                }
            } else if let Some(updated) = alarms.apply_command(cmd) {
                if let Ok(db) = self.service.db.lock() {
                    let _ = db.upsert_alarm(&updated);
                }
            }
            let payload = alarms.current_payload();
            let has_due = !payload.active_due_ids.is_empty();
            (serde_json::to_string(&payload).unwrap_or_default(), has_due)
        };

        // Coordinate Audio Priority: Alarm pauses Music Player while ringing, resumes when cleared
        if let Ok(mut music) = self.service.music.lock() {
            if has_active_due {
                music.on_alarm_triggered();
            } else {
                music.on_alarm_cleared();
            }
        }

        payload_json
    }

    async fn note_upsert(&self, id: &str, title: &str, body: &str, pinned: bool) -> String {
        let mut notes = self.service.notes.lock().unwrap();
        let rec = notes.upsert_note(id, title, body, pinned);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.upsert_note(&rec);
        }
        serde_json::to_string(&notes.current_payload()).unwrap_or_default()
    }

    async fn note_delete(&self, id: &str) -> String {
        let mut notes = self.service.notes.lock().unwrap();
        notes.delete_note(id);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.delete_note(id);
        }
        serde_json::to_string(&notes.current_payload()).unwrap_or_default()
    }

    async fn set_widget_preferences(
        &self,
        widget_id: &str,
        appearance: &str,
        theme_style: &str,
        accent_color: &str,
        icon_style: &str,
        background_color: &str,
        background_image: &str,
        opacity: f32,
        shadow_level: i32,
        custom_settings: &str,
    ) -> bool {
        let rec = WidgetPreferenceRecord {
            widget_id: widget_id.to_string(),
            appearance: appearance.to_string(),
            theme_style: theme_style.to_string(),
            accent_color: accent_color.to_string(),
            icon_style: icon_style.to_string(),
            background_color: background_color.to_string(),
            background_image: background_image.to_string(),
            opacity,
            shadow_level,
            custom_settings: custom_settings.to_string(),
            updated_at: chrono::Utc::now().timestamp(),
        };
        if let Ok(db) = self.service.db.lock() {
            db.upsert_widget_preference(&rec).is_ok()
        } else {
            false
        }
    }

    async fn reset_widget_preferences(&self, widget_id: &str) -> bool {
        if let Ok(db) = self.service.db.lock() {
            db.reset_widget_preference(widget_id).is_ok()
        } else {
            false
        }
    }

    async fn set_widget_background(&self, widget_id: &str, image_path: &str, fit_mode: &str, overlay_opacity: f32) -> String {
        let mut bgs = self.service.backgrounds.lock().unwrap();
        let rec = bgs.set_background(widget_id, image_path, fit_mode, overlay_opacity);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.upsert_widget_background(&rec);
        }
        serde_json::to_string(&bgs.current_payload()).unwrap_or_default()
    }

    async fn calendar_action(&self, cmd: &str) -> String {
        let mut cal = self.service.calendar.lock().unwrap();
        cal.apply_command(cmd);
        serde_json::to_string(&cal.current_payload()).unwrap_or_default()
    }

    async fn pomodoro_action(&self, action: &str) -> String {
        let payload = {
            let mut pomo = self.service.pomodoro.lock().unwrap();
            pomo.apply_action(action);
            pomo.current_payload()
        };
        if let Ok(db) = self.service.db.lock() {
            let _ = db.save_pomodoro(&payload);
        }
        serde_json::to_string(&payload).unwrap_or_default()
    }

    async fn weather_action(&self, cmd: &str) -> String {
        let payload = {
            let mut w = self.service.weather.lock().unwrap();
            w.apply_command(cmd);
            w.cached_payload()
        };
        if let Ok(db) = self.service.db.lock() {
            let json = serde_json::to_string(&payload).unwrap_or_default();
            let _ = db.save_weather_cache(&payload.location, &json, chrono::Utc::now().timestamp());
        }
        serde_json::to_string(&payload).unwrap_or_default()
    }

    async fn add_agenda_event(&self, title: &str, start_time: &str, end_time: &str, category: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        let item = agenda.add_event(title, start_time, end_time, category);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.upsert_agenda_event(&item);
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn update_agenda_event(&self, id: &str, title: &str, start_time: &str, end_time: &str, category: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        if let Some(updated) = agenda.update_event(id, title, start_time, end_time, category) {
            if let Ok(db) = self.service.db.lock() {
                let _ = db.upsert_agenda_event(&updated);
            }
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn toggle_agenda_event(&self, id: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        if let Some(updated) = agenda.toggle_completed(id) {
            if let Ok(db) = self.service.db.lock() {
                let _ = db.upsert_agenda_event(&updated);
            }
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn delete_agenda_event(&self, id: &str) -> String {
        let mut agenda = self.service.agenda.lock().unwrap();
        agenda.delete_event(id);
        if let Ok(db) = self.service.db.lock() {
            let _ = db.delete_agenda_event(id);
        }
        serde_json::to_string(&agenda.current_payload()).unwrap_or_default()
    }

    async fn photo_action(&self, cmd: &str) -> String {
        let mut photos = self.service.photos.lock().unwrap();
        photos.apply_command(cmd);
        serde_json::to_string(&photos.current_payload()).unwrap_or_default()
    }

    async fn quick_action_command(&self, cmd: &str) -> String {
        let mut qa = self.service.quick_actions.lock().unwrap();
        qa.apply_command(cmd);
        serde_json::to_string(&qa.current_payload()).unwrap_or_default()
    }

    async fn get_system_metrics(&self) -> String {
        let mut sys = self.service.sysmon.lock().unwrap();
        serde_json::to_string(&sys.sample()).unwrap_or_default()
    }

    async fn music_action(&self, cmd: &str, arg: &str) -> String {
        let mut music = self.service.music.lock().unwrap();
        music.apply_command(cmd, arg);
        serde_json::to_string(&music.current_payload()).unwrap_or_default()
    }
}

pub async fn spawn_ipc_server(
    service: Arc<UrWidgetsService>,
) -> Result<JoinHandle<Result<(), zbus::Error>>, Box<dyn std::error::Error>> {
    let iface = DbusDaemonInterface { service };
    let handle = tokio::spawn(async move {
        let _conn = ConnectionBuilder::session()?
            .name("org.urwidgets.Daemon")?
            .serve_at("/org/urwidgets/Daemon", iface)?
            .build()
            .await?;
        std::future::pending::<Result<(), zbus::Error>>().await
    });
    Ok(handle)
}
