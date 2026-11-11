use chrono::Local;
use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct ClockPayload {
    pub time_str: String,
    pub seconds_str: String,
    pub am_pm: String,
    pub date_str: String,
    pub weekday_str: String,
    pub use_24h: bool,
    pub show_seconds: bool,
    pub next_wakeup_ms: u64,
}

pub struct ClockModule;

impl ClockModule {
    pub fn new() -> Self {
        Self
    }

    pub fn current_payload(&self, use_24h: bool, show_seconds: bool) -> ClockPayload {
        let now = Local::now();
        let time_str = if use_24h {
            now.format("%H:%M").to_string()
        } else {
            now.format("%-I:%M").to_string()
        };
        let seconds_str = now.format("%S").to_string();
        let am_pm = now.format("%p").to_string();
        let date_str = now.format("%a, %b %-d").to_string();
        let weekday_str = now.format("%A").to_string();
        let next_wakeup_ms = if show_seconds { 1000 } else { 60_000 };

        ClockPayload {
            time_str,
            seconds_str,
            am_pm,
            date_str,
            weekday_str,
            use_24h,
            show_seconds,
            next_wakeup_ms,
        }
    }
}
