use std::sync::Arc;
use std::time::Duration;
use tokio::task::JoinHandle;
use chrono::Local;
use crate::service::UrWidgetsService;

pub fn spawn_scheduler(service: Arc<UrWidgetsService>) -> JoinHandle<()> {
    tokio::spawn(async move {
        let mut elapsed_secs: u32 = 0;
        let mut last_alarm_minute = String::new();

        loop {
            let pomo_running = {
                let pomo = service.pomodoro.lock().unwrap();
                pomo.is_running()
            };

            let sleep_secs: u64 = if pomo_running { 1 } else { 5 };
            tokio::time::sleep(Duration::from_secs(sleep_secs)).await;

            if pomo_running {
                let mut pomo = service.pomodoro.lock().unwrap();
                if pomo.is_running() {
                    pomo.tick_one_sec();
                }
            }

            // Event-driven minute boundary check for Clock Alarms + Audio Priority coordination
            let now_hhmm = Local::now().format("%H:%M").to_string();
            if now_hhmm != last_alarm_minute {
                last_alarm_minute = now_hhmm.clone();
                let triggered_due = {
                    let mut alarms = service.alarms.lock().unwrap();
                    alarms.check_and_trigger_due(&now_hhmm);
                    !alarms.active_due_ids.is_empty()
                };
                if triggered_due {
                    if let Ok(mut music) = service.music.lock() {
                        music.on_alarm_triggered();
                    }
                }
            }

            elapsed_secs = elapsed_secs.wrapping_add(sleep_secs as u32);
            if elapsed_secs >= 1800 {
                elapsed_secs = 0;
                let mut weather = service.weather.lock().unwrap();
                weather.refresh_if_due();
            }
        }
    })
}
