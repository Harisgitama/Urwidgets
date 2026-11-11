use rusqlite::{params, Connection, Result as SqlResult};
use std::path::{Path, PathBuf};
use std::fs;
use crate::modules::agenda::AgendaItem;
use crate::modules::pomodoro::PomodoroPayload;
use crate::modules::alarms::AlarmRecord;
use crate::modules::notes::NoteRecord;
use crate::modules::backgrounds::WidgetBackgroundRecord;

#[derive(Clone, Debug, serde::Serialize, serde::Deserialize)]
pub struct WidgetPreferenceRecord {
    pub widget_id: String,
    pub appearance: String,
    pub theme_style: String,
    pub accent_color: String,
    pub icon_style: String,
    pub background_color: String,
    pub background_image: String,
    pub opacity: f32,
    pub shadow_level: i32,
    pub custom_settings: String,
    pub updated_at: i64,
}

pub struct Database {
    conn: Connection,
}

pub fn resolve_db_path() -> Result<PathBuf, Box<dyn std::error::Error>> {
    let base = dirs::data_local_dir().unwrap_or_else(|| PathBuf::from("/tmp"));
    let dir = base.join("urwidgets");
    fs::create_dir_all(&dir)?;
    Ok(dir.join("urwidgets.sqlite3"))
}

impl Database {
    pub fn open(path: &Path) -> SqlResult<Self> {
        let conn = Connection::open(path)?;
        conn.execute_batch(
            "PRAGMA journal_mode = WAL;
             PRAGMA synchronous = NORMAL;
             PRAGMA temp_store = MEMORY;
             PRAGMA foreign_keys = ON;",
        )?;
        let db = Self { conn };
        db.init_and_migrate_schema()?;
        Ok(db)
    }

    /// Versioned non-destructive SQLite schema migration (preserves all existing user data)
    fn init_and_migrate_schema(&self) -> SqlResult<()> {
        self.conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS kv_settings (
                key TEXT PRIMARY KEY,
                value_json TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS themes (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                is_preset INTEGER NOT NULL DEFAULT 0,
                payload_json TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS agenda_events (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                date_iso TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                category TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0
            );
            CREATE INDEX IF NOT EXISTS idx_agenda_date ON agenda_events(date_iso);

            CREATE TABLE IF NOT EXISTS weather_cache (
                location_key TEXT PRIMARY KEY,
                payload_json TEXT NOT NULL,
                fetched_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS pomodoro_state (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                phase TEXT NOT NULL,
                status TEXT NOT NULL,
                remaining_secs INTEGER NOT NULL,
                total_secs INTEGER NOT NULL,
                completed_sessions INTEGER NOT NULL DEFAULT 0,
                study_mins INTEGER NOT NULL DEFAULT 25,
                short_break_mins INTEGER NOT NULL DEFAULT 5,
                long_break_mins INTEGER NOT NULL DEFAULT 15
            );

            -- Migration v2: Alarms, Notes, Todo List, and Per-Widget Custom Image Backgrounds
            CREATE TABLE IF NOT EXISTS alarms (
                id TEXT PRIMARY KEY,
                time_hhmm TEXT NOT NULL,
                label TEXT NOT NULL,
                enabled INTEGER NOT NULL DEFAULT 1,
                repeat_days_json TEXT NOT NULL DEFAULT '[]',
                ringtone_id TEXT NOT NULL,
                custom_audio_path TEXT NOT NULL DEFAULT '',
                snooze_mins INTEGER NOT NULL DEFAULT 10,
                snoozed_until TEXT
            );

            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                body TEXT NOT NULL,
                pinned INTEGER NOT NULL DEFAULT 0,
                tags_json TEXT NOT NULL DEFAULT '[]',
                updated_at_iso TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS todo_items (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                completed INTEGER NOT NULL DEFAULT 0,
                priority TEXT NOT NULL DEFAULT 'medium',
                category TEXT NOT NULL DEFAULT 'General',
                due_date TEXT NOT NULL DEFAULT '',
                order_index INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS widget_backgrounds (
                widget_id TEXT PRIMARY KEY,
                enabled INTEGER NOT NULL DEFAULT 0,
                image_path TEXT NOT NULL DEFAULT '',
                fit_mode TEXT NOT NULL DEFAULT 'cover',
                position TEXT NOT NULL DEFAULT 'center',
                overlay_mode TEXT NOT NULL DEFAULT 'auto',
                overlay_opacity REAL NOT NULL DEFAULT 0.35,
                color_tint TEXT NOT NULL DEFAULT '',
                text_contrast TEXT NOT NULL DEFAULT 'auto'
            );

            -- Migration v3 (URWidgets v3.0.0): Music Player Queue & Streams + Photo Frame Non-Destructive Crops
            CREATE TABLE IF NOT EXISTS music_queue (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                artist TEXT NOT NULL,
                album TEXT NOT NULL,
                duration_secs INTEGER NOT NULL DEFAULT 0,
                cover_url TEXT NOT NULL DEFAULT '',
                source_type TEXT NOT NULL DEFAULT 'local',
                file_or_stream_url TEXT NOT NULL,
                order_index INTEGER NOT NULL DEFAULT 0
            );

            CREATE TABLE IF NOT EXISTS music_streams (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                stream_url TEXT NOT NULL UNIQUE,
                added_at INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS photo_crops (
                photo_url TEXT PRIMARY KEY,
                zoom REAL NOT NULL DEFAULT 1.0,
                offset_x INTEGER NOT NULL DEFAULT 0,
                offset_y INTEGER NOT NULL DEFAULT 0,
                fit_mode TEXT NOT NULL DEFAULT 'cover'
            );

            -- Migration v4 (URWidgets v3.0.1): Per-Widget Independent Preferences (todo_items preserved non-destructively)
            CREATE TABLE IF NOT EXISTS widget_preferences (
                widget_id TEXT PRIMARY KEY,
                appearance TEXT NOT NULL DEFAULT 'inherit',
                theme_style TEXT NOT NULL DEFAULT 'inherit',
                accent_color TEXT NOT NULL DEFAULT 'inherit',
                icon_style TEXT NOT NULL DEFAULT 'filled',
                background_color TEXT NOT NULL DEFAULT '',
                background_image TEXT NOT NULL DEFAULT '',
                opacity REAL NOT NULL DEFAULT 0.86,
                shadow_level INTEGER NOT NULL DEFAULT 2,
                custom_settings TEXT NOT NULL DEFAULT '{}',
                updated_at INTEGER NOT NULL DEFAULT 0
            );

            PRAGMA user_version = 4;",
        )
    }

    pub fn save_pomodoro(&self, p: &PomodoroPayload) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO pomodoro_state (id, phase, status, remaining_secs, total_secs, completed_sessions, study_mins, short_break_mins, long_break_mins)
             VALUES (1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
             ON CONFLICT(id) DO UPDATE SET
               phase = excluded.phase,
               status = excluded.status,
               remaining_secs = excluded.remaining_secs,
               total_secs = excluded.total_secs,
               completed_sessions = excluded.completed_sessions,
               study_mins = excluded.study_mins,
               short_break_mins = excluded.short_break_mins,
               long_break_mins = excluded.long_break_mins",
            params![
                p.phase,
                p.status,
                p.remaining_secs,
                p.total_secs,
                p.completed_sessions,
                p.study_mins,
                p.short_break_mins,
                p.long_break_mins
            ],
        )?;
        Ok(())
    }

    pub fn upsert_agenda_event(&self, item: &AgendaItem) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO agenda_events (id, title, date_iso, start_time, end_time, category, completed)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
             ON CONFLICT(id) DO UPDATE SET
               title = excluded.title,
               date_iso = excluded.date_iso,
               start_time = excluded.start_time,
               end_time = excluded.end_time,
               category = excluded.category,
               completed = excluded.completed",
            params![
                item.id,
                item.title,
                item.date_iso,
                item.start_time,
                item.end_time,
                item.category,
                if item.completed { 1 } else { 0 }
            ],
        )?;
        Ok(())
    }

    pub fn delete_agenda_event(&self, id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM agenda_events WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn upsert_alarm(&self, alarm: &AlarmRecord) -> SqlResult<()> {
        let repeat_json = serde_json::to_string(&alarm.repeat_days).unwrap_or_else(|_| "[]".into());
        self.conn.execute(
            "INSERT INTO alarms (id, time_hhmm, label, enabled, repeat_days_json, ringtone_id, custom_audio_path, snooze_mins, snoozed_until)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(id) DO UPDATE SET
               time_hhmm = excluded.time_hhmm,
               label = excluded.label,
               enabled = excluded.enabled,
               repeat_days_json = excluded.repeat_days_json,
               ringtone_id = excluded.ringtone_id,
               custom_audio_path = excluded.custom_audio_path,
               snooze_mins = excluded.snooze_mins,
               snoozed_until = excluded.snoozed_until",
            params![
                alarm.id,
                alarm.time_hhmm,
                alarm.label,
                if alarm.enabled { 1 } else { 0 },
                repeat_json,
                alarm.ringtone_id,
                alarm.custom_audio_path,
                alarm.snooze_mins,
                alarm.snoozed_until
            ],
        )?;
        Ok(())
    }

    pub fn delete_alarm(&self, id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM alarms WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn upsert_note(&self, note: &NoteRecord) -> SqlResult<()> {
        let tags_json = serde_json::to_string(&note.tags).unwrap_or_else(|_| "[]".into());
        self.conn.execute(
            "INSERT INTO notes (id, title, body, pinned, tags_json, updated_at_iso)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)
             ON CONFLICT(id) DO UPDATE SET
               title = excluded.title,
               body = excluded.body,
               pinned = excluded.pinned,
               tags_json = excluded.tags_json,
               updated_at_iso = excluded.updated_at_iso",
            params![
                note.id,
                note.title,
                note.body,
                if note.pinned { 1 } else { 0 },
                tags_json,
                note.updated_at_iso
            ],
        )?;
        Ok(())
    }

    pub fn delete_note(&self, id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM notes WHERE id = ?1", params![id])?;
        Ok(())
    }

    pub fn upsert_widget_preference(&self, pref: &WidgetPreferenceRecord) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO widget_preferences (widget_id, appearance, theme_style, accent_color, icon_style, background_color, background_image, opacity, shadow_level, custom_settings, updated_at)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)
             ON CONFLICT(widget_id) DO UPDATE SET
               appearance = excluded.appearance,
               theme_style = excluded.theme_style,
               accent_color = excluded.accent_color,
               icon_style = excluded.icon_style,
               background_color = excluded.background_color,
               background_image = excluded.background_image,
               opacity = excluded.opacity,
               shadow_level = excluded.shadow_level,
               custom_settings = excluded.custom_settings,
               updated_at = excluded.updated_at",
            params![
                pref.widget_id,
                pref.appearance,
                pref.theme_style,
                pref.accent_color,
                pref.icon_style,
                pref.background_color,
                pref.background_image,
                pref.opacity,
                pref.shadow_level,
                pref.custom_settings,
                pref.updated_at
            ],
        )?;
        Ok(())
    }

    pub fn reset_widget_preference(&self, widget_id: &str) -> SqlResult<()> {
        self.conn.execute("DELETE FROM widget_preferences WHERE widget_id = ?1", params![widget_id])?;
        Ok(())
    }

    pub fn upsert_widget_background(&self, bg: &WidgetBackgroundRecord) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO widget_backgrounds (widget_id, enabled, image_path, fit_mode, position, overlay_mode, overlay_opacity, color_tint, text_contrast)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
             ON CONFLICT(widget_id) DO UPDATE SET
               enabled = excluded.enabled,
               image_path = excluded.image_path,
               fit_mode = excluded.fit_mode,
               position = excluded.position,
               overlay_mode = excluded.overlay_mode,
               overlay_opacity = excluded.overlay_opacity,
               color_tint = excluded.color_tint,
               text_contrast = excluded.text_contrast",
            params![
                bg.widget_id,
                if bg.enabled { 1 } else { 0 },
                bg.image_path,
                bg.fit_mode,
                bg.position,
                bg.overlay_mode,
                bg.overlay_opacity,
                bg.color_tint,
                bg.text_contrast
            ],
        )?;
        Ok(())
    }

    pub fn save_weather_cache(&self, location: &str, payload_json: &str, ts: i64) -> SqlResult<()> {
        self.conn.execute(
            "INSERT INTO weather_cache (location_key, payload_json, fetched_at)
             VALUES (?1, ?2, ?3)
             ON CONFLICT(location_key) DO UPDATE SET
               payload_json = excluded.payload_json,
               fetched_at = excluded.fetched_at",
            params![location, payload_json, ts],
        )?;
        Ok(())
    }

    pub fn checkpoint_wal(&self) -> SqlResult<()> {
        self.conn.execute_batch("PRAGMA wal_checkpoint(TRUNCATE);")
    }
}
