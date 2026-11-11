use std::sync::{Arc, Mutex};
use crate::database::Database;
use crate::config::themes::{ThemeConfig, default_presets};
use crate::modules::{
    clock::ClockModule,
    calendar::CalendarModule,
    weather::WeatherModule,
    pomodoro::PomodoroModule,
    agenda::AgendaModule,
    photos::PhotoModule,
    quick_actions::QuickActionsModule,
    system_monitor::SystemMonitorModule,
    alarms::AlarmModule,
    notes::NotesModule,
    backgrounds::BackgroundsModule,
    music::MusicModule,
};
use serde::Serialize;

#[derive(Serialize)]
pub struct DaemonSnapshot {
    pub active_theme_id: String,
    pub theme: ThemeConfig,
    pub clock: crate::modules::clock::ClockPayload,
    pub alarms: crate::modules::alarms::AlarmsPayload,
    pub calendar: crate::modules::calendar::CalendarPayload,
    pub weather: crate::modules::weather::WeatherPayload,
    pub pomodoro: crate::modules::pomodoro::PomodoroPayload,
    pub agenda: crate::modules::agenda::AgendaPayload,
    pub notes: crate::modules::notes::NotesPayload,
    pub photos: crate::modules::photos::PhotoPayload,
    pub quick_actions: crate::modules::quick_actions::QuickActionsPayload,
    pub system_monitor: crate::modules::system_monitor::SystemMetricsPayload,
    pub backgrounds: crate::modules::backgrounds::BackgroundsPayload,
    pub music: crate::modules::music::MusicPayload,
}

pub struct UrWidgetsService {
    pub db: Arc<Mutex<Database>>,
    pub active_theme_id: Mutex<String>,
    pub themes: Mutex<Vec<ThemeConfig>>,
    pub clock: ClockModule,
    pub alarms: Mutex<AlarmModule>,
    pub calendar: Mutex<CalendarModule>,
    pub weather: Mutex<WeatherModule>,
    pub pomodoro: Mutex<PomodoroModule>,
    pub agenda: Mutex<AgendaModule>,
    pub notes: Mutex<NotesModule>,
    pub photos: Mutex<PhotoModule>,
    pub quick_actions: Mutex<QuickActionsModule>,
    pub sysmon: Mutex<SystemMonitorModule>,
    pub backgrounds: Mutex<BackgroundsModule>,
    pub music: Mutex<MusicModule>,
}

impl UrWidgetsService {
    pub fn new(db: Arc<Mutex<Database>>) -> Result<Self, Box<dyn std::error::Error>> {
        let presets = default_presets();
        let active_id = "warm-minimal".to_string();
        Ok(Self {
            db,
            active_theme_id: Mutex::new(active_id),
            themes: Mutex::new(presets),
            clock: ClockModule::new(),
            alarms: Mutex::new(AlarmModule::new_defaults()),
            calendar: Mutex::new(CalendarModule::new("en-US", 1)),
            weather: Mutex::new(WeatherModule::new("Bandung, ID", true, 30)),
            pomodoro: Mutex::new(PomodoroModule::new(25, 5, 15)),
            agenda: Mutex::new(AgendaModule::new_with_defaults()),
            notes: Mutex::new(NotesModule::new_defaults()),
            photos: Mutex::new(PhotoModule::new("~/Pictures/Wallpapers", 30)),
            quick_actions: Mutex::new(QuickActionsModule::new_defaults()),
            sysmon: Mutex::new(SystemMonitorModule::new(3)),
            backgrounds: Mutex::new(BackgroundsModule::new_defaults()),
            music: Mutex::new(MusicModule::new_defaults()),
        })
    }

    pub fn snapshot_json(&self) -> String {
        let active_id = self.active_theme_id.lock().unwrap().clone();
        let themes = self.themes.lock().unwrap();
        let theme = themes
            .iter()
            .find(|t| t.id == active_id)
            .cloned()
            .unwrap_or_else(|| themes[0].clone());

        let snapshot = DaemonSnapshot {
            active_theme_id: active_id,
            theme,
            clock: self.clock.current_payload(false, false),
            alarms: self.alarms.lock().unwrap().current_payload(),
            calendar: self.calendar.lock().unwrap().current_payload(),
            weather: self.weather.lock().unwrap().cached_payload(),
            pomodoro: self.pomodoro.lock().unwrap().current_payload(),
            agenda: self.agenda.lock().unwrap().current_payload(),
            notes: self.notes.lock().unwrap().current_payload(),
            photos: self.photos.lock().unwrap().current_payload(),
            quick_actions: self.quick_actions.lock().unwrap().current_payload(),
            system_monitor: self.sysmon.lock().unwrap().sample(),
            backgrounds: self.backgrounds.lock().unwrap().current_payload(),
            music: self.music.lock().unwrap().current_payload(),
        };
        serde_json::to_string(&snapshot).unwrap_or_else(|_| "{}".to_string())
    }
}
