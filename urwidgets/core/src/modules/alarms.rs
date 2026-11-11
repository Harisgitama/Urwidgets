use serde::{Deserialize, Serialize};
use std::path::Path;
use std::process::{Command, Stdio};
use std::sync::{Arc, Mutex};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AlarmRecord {
    pub id: String,
    pub time_hhmm: String,
    pub label: String,
    pub enabled: bool,
    pub repeat_days: Vec<String>,
    pub one_time_date: Option<String>,
    pub ringtone_id: String,
    pub custom_audio_path: String,
    pub snooze_mins: u32,
    pub snoozed_until: Option<String>,
    pub volume: u8,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AlarmsPayload {
    pub alarms: Vec<AlarmRecord>,
    pub active_due_ids: Vec<String>,
}

pub struct AlarmModule {
    pub alarms: Vec<AlarmRecord>,
    pub active_due_ids: Vec<String>,
    active_audio_pid: Arc<Mutex<Option<u32>>>,
}

impl AlarmModule {
    pub fn new_defaults() -> Self {
        Self {
            alarms: vec![
                AlarmRecord {
                    id: "alm-wake".into(),
                    time_hhmm: "07:00".into(),
                    label: "Wake Up".into(),
                    enabled: true,
                    repeat_days: vec!["Mon".into(), "Tue".into(), "Wed".into(), "Thu".into(), "Fri".into()],
                    one_time_date: None,
                    ringtone_id: "freedesktop-alarm".into(),
                    custom_audio_path: "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga".into(),
                    snooze_mins: 10,
                    snoozed_until: None,
                    volume: 85,
                },
                AlarmRecord {
                    id: "alm-study".into(),
                    time_hhmm: "08:00".into(),
                    label: "Morning Study".into(),
                    enabled: true,
                    repeat_days: vec!["Mon".into(), "Tue".into(), "Wed".into(), "Thu".into(), "Fri".into(), "Sat".into(), "Sun".into()],
                    one_time_date: None,
                    ringtone_id: "gentle-chime".into(),
                    custom_audio_path: "/usr/share/sounds/freedesktop/stereo/complete.oga".into(),
                    snooze_mins: 5,
                    snoozed_until: None,
                    volume: 80,
                },
                AlarmRecord {
                    id: "alm-lunch".into(),
                    time_hhmm: "12:30".into(),
                    label: "Lunch Reminder".into(),
                    enabled: false,
                    repeat_days: vec!["Mon".into(), "Wed".into(), "Fri".into()],
                    one_time_date: None,
                    ringtone_id: "plasma-bell".into(),
                    custom_audio_path: "/usr/share/sounds/freedesktop/stereo/bell.oga".into(),
                    snooze_mins: 15,
                    snoozed_until: None,
                    volume: 75,
                },
            ],
            active_due_ids: Vec::new(),
            active_audio_pid: Arc::new(Mutex::new(None)),
        }
    }

    pub fn normalize_audio_path(raw: &str) -> String {
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

    pub fn is_supported_audio_file(path: &Path) -> bool {
        path.is_file()
            && path
                .extension()
                .and_then(|ext| ext.to_str())
                .map(|ext| {
                    matches!(
                        ext.to_ascii_lowercase().as_str(),
                        "mp3" | "wav" | "ogg" | "oga" | "flac" | "m4a" | "aac" | "opus"
                    )
                })
                .unwrap_or(false)
    }

    pub fn find_first_audio_in_dir(dir: &Path) -> Option<String> {
        let entries = std::fs::read_dir(dir).ok()?;
        let mut files: Vec<String> = Vec::new();
        let mut subdirs: Vec< std::path::PathBuf > = Vec::new();
        for entry in entries.flatten() {
            let p = entry.path();
            if Self::is_supported_audio_file(&p) {
                files.push(p.to_string_lossy().to_string());
            } else if p.is_dir() {
                subdirs.push(p);
            }
        }
        files.sort();
        if let Some(first) = files.into_iter().next() {
            return Some(first);
        }
        subdirs.sort();
        for sub in subdirs {
            if let Ok(sub_entries) = std::fs::read_dir(&sub) {
                let mut sub_files: Vec<String> = sub_entries
                    .flatten()
                    .map(|e| e.path())
                    .filter(|p| Self::is_supported_audio_file(p))
                    .map(|p| p.to_string_lossy().to_string())
                    .collect();
                sub_files.sort();
                if let Some(first_sub) = sub_files.into_iter().next() {
                    return Some(first_sub);
                }
            }
        }
        None
    }

    pub fn resolve_playable_sound(custom_path: &str) -> String {
        let normalized = Self::normalize_audio_path(custom_path);
        if !normalized.is_empty() {
            let p = Path::new(&normalized);
            if p.is_file() {
                return normalized;
            }
            if p.is_dir() {
                if let Some(found) = Self::find_first_audio_in_dir(p) {
                    return found;
                }
            }
        }
        if let Ok(home) = std::env::var("HOME") {
            let music_dir = format!("{}/Music", home);
            let mp = Path::new(&music_dir);
            if mp.is_dir() {
                if let Some(found) = Self::find_first_audio_in_dir(mp) {
                    return found;
                }
            }
        }
        let fallbacks = [
            "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga",
            "/usr/share/sounds/freedesktop/stereo/complete.oga",
            "/usr/share/sounds/freedesktop/stereo/bell.oga",
            "/usr/share/sounds/freedesktop/stereo/message-new-instant.oga",
            "/usr/share/sounds/alsa/Front_Center.wav",
        ];
        for fb in fallbacks {
            if Path::new(fb).is_file() {
                return fb.to_string();
            }
        }
        normalized
    }

    pub fn stop_alarm_audio_pid_file() {
        let pid_file = "/tmp/urwidgets-alarm-audio.pid";
        if let Ok(raw_pid) = std::fs::read_to_string(pid_file) {
            let clean_pid = raw_pid.trim();
            if !clean_pid.is_empty() {
                let _ = Command::new("kill")
                    .args(["-TERM", clean_pid])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            }
            let _ = std::fs::remove_file(pid_file);
        }
    }

    pub fn stop_alarm_audio(&self) {
        Self::stop_alarm_audio_pid_file();
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

    pub fn spawn_alarm_audio_detached(raw_path: &str, volume: u8, loop_playback: bool) -> Option<u32> {
        Self::stop_alarm_audio_pid_file();
        let resolved_path = Self::resolve_playable_sound(raw_path);
        let vol_str = volume.clamp(10, 100).to_string();
        let pid_file = "/tmp/urwidgets-alarm-audio.pid";

        let mut candidates: Vec<(&str, Vec<String>)> = Vec::new();

        let mut mpv_args = vec![
            "--no-video".to_string(),
            "--really-quiet".to_string(),
            format!("--volume={}", vol_str),
        ];
        if loop_playback {
            mpv_args.push("--loop-file=inf".to_string());
        }
        mpv_args.push(resolved_path.clone());
        candidates.push(("mpv", mpv_args));

        let mut ff_args = vec![
            "-nodisp".to_string(),
            "-autoexit".to_string(),
            "-loglevel".to_string(),
            "quiet".to_string(),
            "-volume".to_string(),
            vol_str.clone(),
        ];
        if loop_playback {
            ff_args.push("-loop".to_string());
            ff_args.push("0".to_string());
        }
        ff_args.push(resolved_path.clone());
        candidates.push(("ffplay", ff_args));

        let mut vlc_args = vec![
            "--intf".to_string(),
            "dummy".to_string(),
            "--play-and-exit".to_string(),
            "--quiet".to_string(),
        ];
        if loop_playback {
            vlc_args.push("--loop".to_string());
        }
        vlc_args.push(resolved_path.clone());
        candidates.push(("cvlc", vlc_args));

        candidates.push((
            "gst-play-1.0",
            vec!["--quiet".to_string(), resolved_path.clone()],
        ));
        candidates.push(("pw-play", vec![resolved_path.clone()]));
        candidates.push(("paplay", vec![resolved_path.clone()]));
        candidates.push(("aplay", vec!["-q".to_string(), resolved_path.clone()]));
        candidates.push((
            "canberra-gtk-play",
            vec!["-f".to_string(), resolved_path.clone()],
        ));
        candidates.push((
            "canberra-gtk-play",
            vec!["-i".to_string(), "alarm-clock-elapsed".to_string()],
        ));

        for (bin, args) in candidates {
            if let Ok(child) = Command::new(bin)
                .args(&args)
                .stdin(Stdio::null())
                .stdout(Stdio::null())
                .stderr(Stdio::null())
                .spawn()
            {
                let pid = child.id();
                let _ = std::fs::write(pid_file, pid.to_string());
                return Some(pid);
            }
        }
        None
    }

    pub fn spawn_alarm_audio(&self, raw_path: &str, volume: u8, loop_playback: bool) {
        self.stop_alarm_audio();
        if let Some(pid) = Self::spawn_alarm_audio_detached(raw_path, volume, loop_playback) {
            if let Ok(mut g) = self.active_audio_pid.lock() {
                *g = Some(pid);
            }
        }
    }

    pub fn add_minutes_hhmm(hhmm: &str, add_mins: u32) -> String {
        let parts: Vec<&str> = hhmm.split(':').collect();
        let h: u32 = parts.first().and_then(|s| s.parse().ok()).unwrap_or(7);
        let m: u32 = parts.get(1).and_then(|s| s.parse().ok()).unwrap_or(0);
        let total = (h * 60 + m + add_mins) % 1440;
        format!("{:02}:{:02}", total / 60, total % 60)
    }

    pub fn check_and_trigger_due(&mut self, current_hhmm: &str) {
        let mut sound_to_play: Option<(String, u8, String)> = None;
        for alarm in &mut self.alarms {
            if !alarm.enabled {
                continue;
            }
            let target = alarm.snoozed_until.as_deref().unwrap_or(&alarm.time_hhmm);
            if target == current_hhmm {
                if !self.active_due_ids.contains(&alarm.id) {
                    self.active_due_ids.push(alarm.id.clone());
                }
                alarm.snoozed_until = None;
                sound_to_play = Some((
                    alarm.custom_audio_path.clone(),
                    alarm.volume,
                    alarm.label.clone(),
                ));
            }
        }
        if let Some((path, vol, label_copy)) = sound_to_play {
            std::thread::spawn(move || {
                let _ = Command::new("notify-send")
                    .args([
                        "-a",
                        "URWidgets Clock Alarm",
                        &label_copy,
                        "Alarm is ringing — Snooze or Dismiss in Clock widget",
                    ])
                    .stdout(Stdio::null())
                    .stderr(Stdio::null())
                    .status();
            });
            self.spawn_alarm_audio(&path, vol, true);
        }
    }

    pub fn apply_command(&mut self, cmd: &str) -> Option<AlarmRecord> {
        let parts: Vec<&str> = cmd.split('|').collect();
        match parts.first().copied() {
            Some("toggle") if parts.len() >= 2 => {
                let id = parts[1];
                for a in &mut self.alarms {
                    if a.id == id {
                        a.enabled = !a.enabled;
                        a.snoozed_until = None;
                        return Some(a.clone());
                    }
                }
                None
            }
            Some("stop") | Some("dismiss") if parts.len() >= 2 => {
                let id = parts[1];
                self.active_due_ids.retain(|x| x != id);
                self.stop_alarm_audio();
                for a in &mut self.alarms {
                    if a.id == id {
                        a.snoozed_until = None;
                        if a.repeat_days.is_empty() {
                            a.enabled = false;
                        }
                        return Some(a.clone());
                    }
                }
                None
            }
            Some("snooze") if parts.len() >= 2 => {
                let id = parts[1];
                let custom_mins: Option<u32> = parts.get(2).and_then(|s| s.parse().ok());
                self.active_due_ids.retain(|x| x != id);
                self.stop_alarm_audio();
                let now_hhmm = chrono::Local::now().format("%H:%M").to_string();
                for a in &mut self.alarms {
                    if a.id == id {
                        let mins = custom_mins.unwrap_or(a.snooze_mins).clamp(1, 180);
                        a.snoozed_until = Some(Self::add_minutes_hhmm(&now_hhmm, mins));
                        return Some(a.clone());
                    }
                }
                None
            }
            Some("add") | Some("edit") | Some("upsert") if parts.len() >= 6 => {
                let id = parts[1].to_string();
                let time_hhmm = parts[2].to_string();
                let label = if parts[3].trim().is_empty() { "Alarm".to_string() } else { parts[3].trim().to_string() };
                let repeat_days: Vec<String> = parts[4]
                    .split(',')
                    .map(|s| s.trim().to_string())
                    .filter(|s| !s.is_empty())
                    .collect();
                let snooze_mins: u32 = parts[5].parse::<u32>().unwrap_or(10_u32).clamp(1_u32, 180_u32);
                let custom_audio_path = parts
                    .get(6)
                    .map(|s| Self::normalize_audio_path(s))
                    .filter(|s| !s.is_empty())
                    .unwrap_or_else(|| "/usr/share/sounds/freedesktop/stereo/alarm-clock-elapsed.oga".into());

                // Support both (ringtone|volume|date) from QML and (ringtone|date|volume)
                let p7 = parts.get(7).map(|s| s.trim()).unwrap_or("");
                let p8 = parts.get(8).map(|s| s.trim()).unwrap_or("");
                let (one_time_date, volume) = if let Ok(v7) = p7.parse::<u8>() {
                    let date_opt = if p8.is_empty() { None } else { Some(p8.to_string()) };
                    (date_opt, v7.clamp(10_u8, 100_u8))
                } else {
                    let date_opt = if p7.is_empty() { None } else { Some(p7.to_string()) };
                    let v8 = p8.parse::<u8>().unwrap_or(85_u8).clamp(10_u8, 100_u8);
                    (date_opt, v8)
                };

                if let Some(existing) = self.alarms.iter_mut().find(|a| a.id == id) {
                    existing.time_hhmm = time_hhmm;
                    existing.label = label;
                    existing.repeat_days = repeat_days;
                    existing.snooze_mins = snooze_mins;
                    existing.custom_audio_path = custom_audio_path;
                    existing.one_time_date = one_time_date;
                    existing.volume = volume;
                    existing.enabled = true;
                    return Some(existing.clone());
                } else {
                    let rec = AlarmRecord {
                        id,
                        time_hhmm,
                        label,
                        enabled: true,
                        repeat_days,
                        one_time_date,
                        ringtone_id: "custom".into(),
                        custom_audio_path,
                        snooze_mins,
                        snoozed_until: None,
                        volume,
                    };
                    self.alarms.push(rec.clone());
                    return Some(rec);
                }
            }
            Some("set_global_ringtone") if parts.len() >= 2 => {
                let clean_path = Self::normalize_audio_path(parts[1]);
                if !clean_path.is_empty() {
                    for a in &mut self.alarms {
                        a.ringtone_id = "custom".into();
                        a.custom_audio_path = clean_path.clone();
                    }
                    return self.alarms.first().cloned();
                }
                None
            }
            Some("set_ringtone") if parts.len() >= 3 => {
                let clean_path = Self::normalize_audio_path(parts[2]);
                if !clean_path.is_empty() {
                    for a in &mut self.alarms {
                        a.ringtone_id = "custom".into();
                        a.custom_audio_path = clean_path.clone();
                    }
                    return self.alarms.first().cloned();
                }
                None
            }
            Some("delete") if parts.len() >= 2 => {
                let id = parts[1];
                self.active_due_ids.retain(|x| x != id);
                self.stop_alarm_audio();
                self.alarms.retain(|a| a.id != id);
                None
            }
            Some("preview") if parts.len() >= 2 => {
                let path = parts[1].to_string();
                let vol = parts.get(2).and_then(|s| s.parse::<u8>().ok()).unwrap_or(85_u8);
                self.spawn_alarm_audio(&path, vol, false);
                None
            }
            Some("trigger_due") if parts.len() >= 2 => {
                let path = parts[1].to_string();
                let vol = parts.get(2).and_then(|s| s.parse::<u8>().ok()).unwrap_or(85_u8);
                self.spawn_alarm_audio(&path, vol, true);
                None
            }
            Some("stop_preview") => {
                self.stop_alarm_audio();
                None
            }
            _ => None,
        }
    }

    pub fn current_payload(&self) -> AlarmsPayload {
        AlarmsPayload {
            alarms: self.alarms.clone(),
            active_due_ids: self.active_due_ids.clone(),
        }
    }
}
