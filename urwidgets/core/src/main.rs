mod config;
mod database;
mod ipc;
mod modules;
mod scheduler;
mod service;

use std::error::Error;
use std::sync::{Arc, Mutex};
use database::Database;
use service::UrWidgetsService;
use modules::{alarms::AlarmModule, music::MusicModule, photos::PhotoModule};

#[tokio::main(flavor = "current_thread")]
async fn main() -> Result<(), Box<dyn Error>> {
    // Fast-path CLI mode for zero-overhead native Rust execution from QML & Tauri
    let args: Vec<String> = std::env::args().collect();
    if args.len() >= 2 {
        match args[1].as_str() {
            "play-alarm" => {
                let path = args.get(2).map(|s| s.as_str()).unwrap_or("~/Music/");
                let vol = args.get(3).and_then(|s| s.parse::<u8>().ok()).unwrap_or(85);
                let loop_mode = args.get(4).map(|s| s == "true" || s == "1").unwrap_or(false);
                AlarmModule::spawn_alarm_audio_detached(path, vol, loop_mode);
                return Ok(());
            }
            "stop-alarm" => {
                AlarmModule::stop_alarm_audio_pid_file();
                return Ok(());
            }
            "scan-music" => {
                let path = args.get(2).map(|s| s.as_str()).unwrap_or("~/Music/");
                for file_path in MusicModule::scan_local_path_files(path) {
                    println!("{}", file_path);
                }
                return Ok(());
            }
            "play-music" => {
                let target = args.get(2).map(|s| s.as_str()).unwrap_or("~/Music/");
                let vol = args.get(3).and_then(|s| s.parse::<u8>().ok()).unwrap_or(80);
                MusicModule::spawn_music_audio_detached(target, vol);
                return Ok(());
            }
            "stop-music" => {
                MusicModule::stop_music_audio_pid_file();
                return Ok(());
            }
            "scan-photos" => {
                let dir = args.get(2).map(|s| s.as_str()).unwrap_or("~/Pictures");
                for url in PhotoModule::scan_photo_directory(dir) {
                    println!("{}", url);
                }
                return Ok(());
            }
            _ => {}
        }
    }

    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    log::info!(
        "Starting urwidgets-daemon v{} (WidgetWall Edition — shared backend for 10 KDE Plasma 5 widgets)",
        env!("CARGO_PKG_VERSION")
    );

    let db_path = database::resolve_db_path()?;
    let db = Arc::new(Mutex::new(Database::open(&db_path)?));
    let service = Arc::new(UrWidgetsService::new(Arc::clone(&db))?);

    let ipc_handle = ipc::spawn_ipc_server(Arc::clone(&service)).await?;
    let sched_handle = scheduler::spawn_scheduler(Arc::clone(&service));

    log::info!("urwidgets-daemon ready on session D-Bus (org.urwidgets.Daemon)");

    tokio::select! {
        _ = tokio::signal::ctrl_c() => {
            log::info!("Received shutdown signal, checkpointing SQLite WAL.");
        }
        res = ipc_handle => {
            if let Err(e) = res {
                log::error!("D-Bus server exited with error: {}", e);
            }
        }
        _ = sched_handle => {}
    }

    if let Ok(guard) = db.lock() {
        let _ = guard.checkpoint_wal();
    }
    Ok(())
}
