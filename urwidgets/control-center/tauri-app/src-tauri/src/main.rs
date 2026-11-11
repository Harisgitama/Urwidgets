#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::process::{Command, Stdio};
use serde::Serialize;
use urwidgets_daemon::modules::alarms::AlarmModule;
use urwidgets_daemon::modules::music::MusicModule;
use urwidgets_daemon::modules::photos::PhotoModule;

#[derive(Serialize)]
struct AuthorInfo {
    author: &'static str,
    portfolio_label: &'static str,
    portfolio_url: &'static str,
    instagram_label: &'static str,
    instagram_url: &'static str,
    github_url: &'static str,
}

#[tauri::command]
fn tauri_get_author_info() -> AuthorInfo {
    AuthorInfo {
        author: "Haris Gitama",
        portfolio_label: "rissaxie.com",
        portfolio_url: "https://rissaxie.com",
        instagram_label: "@hrisgtaa_",
        instagram_url: "https://www.instagram.com/hrisgtaa_/",
        github_url: "https://github.com/Harisgitama",
    }
}

#[tauri::command]
fn tauri_open_external_url(url: String) -> Result<(), String> {
    if !url.starts_with("https://") && !url.starts_with("http://") {
        return Err("Only http/https URLs are allowed".to_string());
    }
    Command::new("xdg-open")
        .arg(&url)
        .stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn tauri_play_alarm(path: String, volume: u8, loop_playback: bool) -> Result<String, String> {
    let resolved = AlarmModule::resolve_playable_sound(&path);
    AlarmModule::spawn_alarm_audio_detached(&resolved, volume, loop_playback);
    Ok(resolved)
}

#[tauri::command]
fn tauri_stop_alarm() -> Result<(), String> {
    AlarmModule::stop_alarm_audio_pid_file();
    Ok(())
}

#[tauri::command]
fn tauri_scan_music(path: String) -> Result<Vec<String>, String> {
    Ok(MusicModule::scan_local_path_files(&path))
}

#[tauri::command]
fn tauri_play_music(path: String, volume: u8) -> Result<String, String> {
    let resolved = MusicModule::resolve_playable_target(&path);
    MusicModule::spawn_music_audio_detached(&resolved, volume);
    Ok(resolved)
}

#[tauri::command]
fn tauri_stop_music() -> Result<(), String> {
    MusicModule::stop_music_audio_pid_file();
    Ok(())
}

#[tauri::command]
fn tauri_scan_photos(path: String) -> Result<Vec<String>, String> {
    Ok(PhotoModule::scan_photo_directory(&path))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            tauri_get_author_info,
            tauri_open_external_url,
            tauri_play_alarm,
            tauri_stop_alarm,
            tauri_scan_music,
            tauri_play_music,
            tauri_stop_music,
            tauri_scan_photos
        ])
        .run(tauri::generate_context!())
        .expect("error while running URWidgets Tauri Control Center");
}
