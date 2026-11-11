use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MusicTrackRecord {
    pub id: String,
    pub title: String,
    pub artist: String,
    pub album: String,
    pub duration_secs: u32,
    pub cover_url: String,
    pub source_type: String,
    pub file_or_stream_url: String,
    pub format: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct MusicPayload {
    pub source_type: String,
    pub active_folder_path: String,
    pub queue: Vec<MusicTrackRecord>,
    pub current_index: usize,
    pub is_playing: bool,
    pub position_secs: u32,
    pub volume: u8,
    pub is_muted: bool,
    pub paused_by_alarm: bool,
    pub shuffle: bool,
    pub repeat_mode: String,
    pub saved_streams: Vec<MusicTrackRecord>,
    pub last_error: Option<String>,
}

pub struct MusicModule {
    pub state: MusicPayload,
    previous_volume: u8,
    folder_cache: HashMap<String, Vec<MusicTrackRecord>>,
    active_audio_pid: Arc<Mutex<Option<u32>>>,
}

impl MusicModule {
    pub fn normalize_local_path(raw: &str) -> String {
        let trimmed = raw
            .trim()
            .trim_matches(|c: char| c == '"' || c as u32 == 39);
        let without_scheme = trimmed.strip_prefix("file://").unwrap_or(trimmed);
        let decoded = without_scheme.replace("%20", " ");
        if decoded == "~" {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/Music", home);
            }
        }
        if let Some(rest) = decoded.strip_prefix("~/") {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/{}", home, rest);
            }
        }
        decoded
    }

    pub fn is_supported_audio(path: &Path) -> bool {
        path.is_file()
            && path
                .extension()
                .and_then(|e| e.to_str())
                .map(|ext| {
                    matches!(
                        ext.to_ascii_lowercase().as_str(),
                        "mp3" | "flac" | "ogg" | "oga" | "wav" | "m4a" | "aac" | "opus"
                    )
                })
                .unwrap_or(false)
    }

    pub fn scan_local_path_files(folder_or_file: &str) -> Vec<String> {
        let clean = Self::normalize_local_path(folder_or_file);
        let p = Path::new(&clean);
        if Self::is_supported_audio(p) {
            return vec![clean];
        }
        let mut results: Vec<String> = Vec::new();
        if p.is_dir() {
            if let Ok(entries) = fs::read_dir(p) {
                let mut subdirs: Vec<std::path::PathBuf> = Vec::new();
                for entry in entries.flatten() {
                    let ep = entry.path();
                    if Self::is_supported_audio(&ep) {
                        results.push(ep.to_string_lossy().into_owned());
                    } else if ep.is_dir() {
                        subdirs.push(ep);
                    }
                }
                subdirs.sort();
                for sub in subdirs {
                    if let Ok(sub_entries) = fs::read_dir(&sub) {
                        for se in sub_entries.flatten() {
                            let sp = se.path();
                            if Self::is_supported_audio(&sp) {
                                results.push(sp.to_string_lossy().into_owned());
                            }
                        }
                    }
                }
            }
        }
        results.sort();
        results.truncate(120);
        results
    }

    pub fn stop_music_audio_pid_file() {
        let pid_file = "/tmp/urwidgets-music-audio.pid";
        if let Ok(raw_pid) = fs::read_to_string(pid_file) {
            let clean_pid = raw_pid.trim();
            if !clean_pid.is_empty() {
                let _ = Command::new("kill")
                    .args(["-TERM", clean_pid])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
            let _ = fs::remove_file(pid_file);
        }
    }

    pub fn spawn_music_audio_detached(raw_target: &str, volume: u8) -> Option<u32> {
        Self::stop_music_audio_pid_file();
        let trimmed = raw_target.trim();
        let target = if trimmed.starts_with("http://") || trimmed.starts_with("https://") {
            trimmed.to_string()
        } else {
            let scanned = Self::scan_local_path_files(trimmed);
            if let Some(first) = scanned.into_iter().next() {
                first
            } else if let Ok(home) = std::env::var("HOME") {
                let home_music = format!("{}/Music", home);
                Self::scan_local_path_files(&home_music)
                    .into_iter()
                    .next()
                    .unwrap_or_else(|| "/usr/share/sounds/freedesktop/stereo/complete.oga".to_string())
            } else {
                "/usr/share/sounds/freedesktop/stereo/complete.oga".to_string()
            }
        };

        let vol_str = volume.min(100).to_string();
        let pid_file = "/tmp/urwidgets-music-audio.pid";

        let candidates: Vec<(&str, Vec<String>)> = vec![
            (
                "mpv",
                vec![
                    "--no-video".to_string(),
                    "--really-quiet".to_string(),
                    format!("--volume={}", vol_str),
                    target.clone(),
                ],
            ),
            (
                "gst-play-1.0",
                vec!["--quiet".to_string(), target.clone()],
            ),
            (
                "ffplay",
                vec![
                    "-nodisp".to_string(),
                    "-autoexit".to_string(),
                    "-loglevel".to_string(),
                    "quiet".to_string(),
                    "-volume".to_string(),
                    vol_str.clone(),
                    target.clone(),
                ],
            ),
            (
                "cvlc",
                vec![
                    "--intf".to_string(),
                    "dummy".to_string(),
                    "--play-and-exit".to_string(),
                    "--quiet".to_string(),
                    target.clone(),
                ],
            ),
            ("pw-play", vec![target.clone()]),
            ("paplay", vec![target.clone()]),
            ("aplay", vec!["-q".to_string(), target.clone()]),
        ];

        for (bin, args) in candidates {
            if let Ok(child) = Command::new(bin)
                .args(&args)
                .stdin(Stdio::null())
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
            {
                let pid = child.id();
                let _ = fs::write(pid_file, pid.to_string());
                return Some(pid);
            }
        }
        None
    }

    pub fn new_defaults() -> Self {
        let default_folder = std::env::var("HOME")
            .map(|h| format!("{}/Music", h))
            .unwrap_or_else(|_| "~/Music".to_string());
        let mut queue = Self::scan_local_folder(&default_folder);
        if queue.is_empty() {
            queue = vec![
                MusicTrackRecord {
                    id: "trk-velvet-horizon".into(),
                    title: "Velvet Horizon".into(),
                    artist: "Klangwerk & Sol".into(),
                    album: "Late Night Focus Sessions".into(),
                    duration_secs: 214,
                    cover_url: "../images/photo_widget_architecture.jpg".into(),
                    source_type: "local".into(),
                    file_or_stream_url: "/usr/share/sounds/freedesktop/stereo/complete.oga".into(),
                    format: "OGA".into(),
                },
                MusicTrackRecord {
                    id: "trk-linen-rain".into(),
                    title: "Warm Linen Rain".into(),
                    artist: "Harbor Ensemble".into(),
                    album: "Nordic Minimalist Vol. 2".into(),
                    duration_secs: 188,
                    cover_url: "../images/photo_widget_botanical.jpg".into(),
                    source_type: "local".into(),
                    file_or_stream_url: "/usr/share/sounds/freedesktop/stereo/service-login.oga".into(),
                    format: "OGA".into(),
                },
                MusicTrackRecord {
                    id: "trk-subtle-drift".into(),
                    title: "Subtle Drift".into(),
                    artist: "Aura Nord".into(),
                    album: "Desktop Calm".into(),
                    duration_secs: 246,
                    cover_url: "../images/alpine_mist_wallpaper.jpg".into(),
                    source_type: "local".into(),
                    file_or_stream_url: "/usr/share/sounds/freedesktop/stereo/bell.oga".into(),
                    format: "OGA".into(),
                },
            ];
        }
        let saved_streams = vec![
            MusicTrackRecord {
                id: "stream-groove-salad".into(),
                title: "SomaFM: Groove Salad".into(),
                artist: "SomaFM Live Stream".into(),
                album: "Direct Icecast MP3 Stream".into(),
                duration_secs: 3600,
                cover_url: "../images/photo_widget_botanical.jpg".into(),
                source_type: "stream".into(),
                file_or_stream_url: "https://ice2.somafm.com/groovesalad-128-mp3".into(),
                format: "STREAM".into(),
            },
        ];
        Self {
            state: MusicPayload {
                source_type: "local".into(),
                active_folder_path: default_folder,
                queue,
                current_index: 0,
                is_playing: false,
                position_secs: 0,
                volume: 80,
                is_muted: false,
                paused_by_alarm: false,
                shuffle: false,
                repeat_mode: "all".into(),
                saved_streams,
                last_error: None,
            },
            previous_volume: 80,
            folder_cache: HashMap::new(),
            active_audio_pid: Arc::new(Mutex::new(None)),
        }
    }

    pub fn stop_playback_process(&self) {
        Self::stop_music_audio_pid_file();
        if let Ok(mut guard) = self.active_audio_pid.lock() {
            if let Some(pid) = guard.take() {
                let _ = Command::new("kill")
                    .args(["-TERM", &pid.to_string()])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
        }
    }

    pub fn start_playback_process(&self) {
        self.stop_playback_process();
        if !self.state.is_playing || self.state.paused_by_alarm || self.state.queue.is_empty() {
            return;
        }
        let idx = self.state.current_index % self.state.queue.len();
        let raw_target = self.state.queue[idx].file_or_stream_url.clone();
        let effective_vol = if self.state.is_muted { 0 } else { self.state.volume.min(100) };
        if let Some(pid) = Self::spawn_music_audio_detached(&raw_target, effective_vol) {
            if let Ok(mut g) = self.active_audio_pid.lock() {
                *g = Some(pid);
            }
        }
    }

    pub fn on_alarm_triggered(&mut self) {
        if self.state.is_playing {
            self.state.is_playing = false;
            self.state.paused_by_alarm = true;
            self.stop_playback_process();
        }
    }

    pub fn on_alarm_cleared(&mut self) {
        if self.state.paused_by_alarm {
            self.state.paused_by_alarm = false;
            self.state.is_playing = true;
            self.start_playback_process();
        }
    }

    pub fn scan_local_folder(folder_path: &str) -> Vec<MusicTrackRecord> {
        let mut tracks = Vec::new();
        let clean_folder = Self::normalize_local_path(folder_path);
        let covers = [
            "../images/photo_widget_architecture.jpg",
            "../images/photo_widget_botanical.jpg",
            "../images/alpine_mist_wallpaper.jpg",
        ];
        for (idx, file_str) in Self::scan_local_path_files(&clean_folder).into_iter().enumerate() {
            let path = Path::new(&file_str);
            let ext = path
                .extension()
                .and_then(|e| e.to_str())
                .unwrap_or("MP3")
                .to_uppercase();
            let stem = path
                .file_stem()
                .and_then(|s| s.to_str())
                .unwrap_or("Unknown Track");
            tracks.push(MusicTrackRecord {
                id: format!("local-{}", idx),
                title: stem.replace(['-', '_'], " "),
                artist: "Local Library".into(),
                album: clean_folder.clone(),
                duration_secs: 200,
                cover_url: covers[idx % covers.len()].into(),
                source_type: "local".into(),
                file_or_stream_url: file_str,
                format: ext,
            });
        }
        tracks
    }

    pub fn validate_direct_stream_url(url: &str) -> Result<(), String> {
        let clean = url.trim();
        if !(clean.starts_with("http://") || clean.starts_with("https://")) {
            return Err("Stream URL must start with http:// or https://".into());
        }
        let lower = clean.to_lowercase();
        if lower.contains("youtube.com")
            || lower.contains("youtu.be")
            || lower.contains("open.spotify.com")
            || lower.ends_with(".html")
        {
            return Err("Unsupported webpage or DRM link. Provide a direct audio file or Icecast stream.".into());
        }
        Ok(())
    }

    pub fn apply_command(&mut self, cmd: &str, arg: &str) {
        match cmd {
            "play" => {
                self.state.is_playing = !self.state.queue.is_empty();
                self.state.paused_by_alarm = false;
                self.state.last_error = None;
                self.start_playback_process();
            }
            "pause" => {
                self.state.is_playing = false;
                self.stop_playback_process();
            }
            "toggle" => {
                self.state.is_playing = !self.state.is_playing;
                self.state.paused_by_alarm = false;
                if self.state.is_playing {
                    self.start_playback_process();
                } else {
                    self.stop_playback_process();
                }
            }
            "stop" => {
                self.state.is_playing = false;
                self.state.paused_by_alarm = false;
                self.state.position_secs = 0;
                self.stop_playback_process();
            }
            "next" => {
                if !self.state.queue.is_empty() {
                    self.state.current_index = (self.state.current_index + 1) % self.state.queue.len();
                    self.state.position_secs = 0;
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "prev" => {
                if !self.state.queue.is_empty() {
                    if self.state.position_secs > 5 {
                        self.state.position_secs = 0;
                    } else {
                        self.state.current_index = (self.state.current_index + self.state.queue.len() - 1) % self.state.queue.len();
                        self.state.position_secs = 0;
                    }
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "select" => {
                if let Ok(idx) = arg.parse::<usize>() {
                    if idx < self.state.queue.len() {
                        self.state.current_index = idx;
                        self.state.position_secs = 0;
                        self.state.is_playing = true;
                        self.state.paused_by_alarm = false;
                        self.start_playback_process();
                    }
                }
            }
            "seek" => {
                if let Ok(sec) = arg.parse::<u32>() {
                    self.state.position_secs = sec;
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "volume" => {
                if let Ok(v) = arg.parse::<u8>() {
                    let clamped = v.min(100);
                    self.state.volume = clamped;
                    self.state.is_muted = clamped == 0;
                    if clamped > 0 {
                        self.previous_volume = clamped;
                    }
                    if self.state.is_playing {
                        self.start_playback_process();
                    }
                }
            }
            "mute" => {
                if self.state.is_muted {
                    self.state.is_muted = false;
                    self.state.volume = self.previous_volume.max(15);
                } else {
                    if self.state.volume > 0 {
                        self.previous_volume = self.state.volume;
                    }
                    self.state.is_muted = true;
                }
                if self.state.is_playing {
                    self.start_playback_process();
                }
            }
            "shuffle" => self.state.shuffle = !self.state.shuffle,
            "repeat" => {
                self.state.repeat_mode = match self.state.repeat_mode.as_str() {
                    "off" => "all".into(),
                    "all" => "one".into(),
                    _ => "off".into(),
                };
            }
            "scan_folder" | "set_folder" | "rescan" => {
                let clean = Self::normalize_local_path(arg);
                let scanned = if cmd != "rescan" {
                    if let Some(cached) = self.folder_cache.get(&clean) {
                        cached.clone()
                    } else {
                        let s = Self::scan_local_folder(&clean);
                        if !s.is_empty() {
                            self.folder_cache.insert(clean.clone(), s.clone());
                        }
                        s
                    }
                } else {
                    let s = Self::scan_local_folder(&clean);
                    if !s.is_empty() {
                        self.folder_cache.insert(clean.clone(), s.clone());
                    }
                    s
                };
                if !scanned.is_empty() {
                    self.state.active_folder_path = clean;
                    self.state.source_type = "local".into();
                    self.state.queue = scanned;
                    self.state.current_index = 0;
                    self.state.position_secs = 0;
                    self.state.last_error = None;
                }
            }
            "add_file" => {
                let clean = Self::normalize_local_path(arg);
                let p = Path::new(&clean);
                if p.is_file() {
                    let ext = p.extension().and_then(|e| e.to_str()).unwrap_or("MP3").to_uppercase();
                    let stem = p.file_stem().and_then(|s| s.to_str()).unwrap_or("Custom Audio").replace(['-', '_'], " ");
                    let rec = MusicTrackRecord {
                        id: format!("file-{}", self.state.queue.len() + 1),
                        title: stem,
                        artist: "Local Audio File".into(),
                        album: p.parent().map(|d| d.to_string_lossy().into_owned()).unwrap_or_else(|| "Local".into()),
                        duration_secs: 210,
                        cover_url: "../images/photo_widget_architecture.jpg".into(),
                        source_type: "local".into(),
                        file_or_stream_url: clean,
                        format: ext,
                    };
                    self.state.source_type = "local".into();
                    self.state.queue.insert(0, rec);
                    self.state.current_index = 0;
                    self.state.position_secs = 0;
                    self.state.is_playing = true;
                    self.state.paused_by_alarm = false;
                    self.state.last_error = None;
                    self.start_playback_process();
                }
            }
            "play_url" => {
                let raw = arg.trim();
                if !raw.is_empty() {
                    if raw.starts_with("http://") || raw.starts_with("https://") {
                        self.apply_command("play_stream", raw);
                    } else {
                        let clean = Self::normalize_local_path(raw);
                        if let Some(pos) = self.state.queue.iter().position(|t| t.file_or_stream_url == clean) {
                            self.state.current_index = pos;
                            self.state.position_secs = 0;
                            self.state.is_playing = true;
                            self.state.paused_by_alarm = false;
                            self.start_playback_process();
                        } else {
                            self.apply_command("add_file", &clean);
                        }
                    }
                }
            }
            "play_stream" | "set_stream" => {
                match Self::validate_direct_stream_url(arg) {
                    Ok(()) => {
                        let rec = MusicTrackRecord {
                            id: format!("stream-{}", self.state.saved_streams.len() + 1),
                            title: arg.split('/').next_back().unwrap_or("Online Audio Stream").into(),
                            artist: "Direct Online Stream".into(),
                            album: arg.into(),
                            duration_secs: 3600,
                            cover_url: "../images/photo_widget_botanical.jpg".into(),
                            source_type: "stream".into(),
                            file_or_stream_url: arg.into(),
                            format: "STREAM".into(),
                        };
                        self.state.source_type = "stream".into();
                        self.state.saved_streams.insert(0, rec);
                        self.state.queue = self.state.saved_streams.clone();
                        self.state.current_index = 0;
                        self.state.position_secs = 0;
                        self.state.is_playing = true;
                        self.state.paused_by_alarm = false;
                        self.state.last_error = None;
                        self.start_playback_process();
                    }
                    Err(e) => {
                        self.state.last_error = Some(e);
                    }
                }
            }
            _ => {}
        }
    }

    pub fn current_payload(&self) -> MusicPayload {
        self.state.clone()
    }
}
