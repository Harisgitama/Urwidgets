use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fs;
use std::path::Path;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PhotoCropRecord {
    pub zoom: f32,
    pub offset_x: i32,
    pub offset_y: i32,
    pub fit_mode: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PhotoPayload {
    pub directory: String,
    pub slideshow_mode: bool,
    pub interval_secs: u32,
    pub current_index: usize,
    pub crop_fill: bool,
    pub slides: Vec<String>,
    pub crops: HashMap<String, PhotoCropRecord>,
}

pub struct PhotoModule {
    state: PhotoPayload,
}

impl PhotoModule {
    pub fn normalize_dir_path(raw: &str) -> String {
        let trimmed = raw
            .trim()
            .trim_matches(|c: char| c == '"' || c as u32 == 39);
        let without_scheme = trimmed.strip_prefix("file://").unwrap_or(trimmed);
        let decoded = without_scheme.replace("%20", " ");
        if decoded == "~" {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/Pictures", home);
            }
        }
        if let Some(rest) = decoded.strip_prefix("~/") {
            if let Ok(home) = std::env::var("HOME") {
                return format!("{}/{}", home, rest);
            }
        }
        decoded
    }

    pub fn is_supported_image(path: &Path) -> bool {
        path.is_file()
            && path
                .extension()
                .and_then(|e| e.to_str())
                .map(|ext| {
                    matches!(
                        ext.to_ascii_lowercase().as_str(),
                        "jpg" | "jpeg" | "png" | "webp" | "svg"
                    )
                })
                .unwrap_or(false)
    }

    pub fn scan_photo_directory(raw_dir: &str) -> Vec<String> {
        let clean = Self::normalize_dir_path(raw_dir);
        if clean.is_empty() {
            return Vec::new();
        }
        let p = Path::new(&clean);
        if Self::is_supported_image(p) {
            return vec![format!("file://{}", clean)];
        }
        let mut urls: Vec<String> = Vec::new();
        if p.is_dir() {
            if let Ok(entries) = fs::read_dir(p) {
                let mut subdirs: Vec<std::path::PathBuf> = Vec::new();
                for entry in entries.flatten() {
                    let ep = entry.path();
                    if Self::is_supported_image(&ep) {
                        urls.push(format!("file://{}", ep.to_string_lossy()));
                    } else if ep.is_dir() {
                        subdirs.push(ep);
                    }
                }
                subdirs.sort();
                for sub in subdirs {
                    if let Ok(sub_entries) = fs::read_dir(&sub) {
                        for se in sub_entries.flatten() {
                            let sp = se.path();
                            if Self::is_supported_image(&sp) {
                                urls.push(format!("file://{}", sp.to_string_lossy()));
                            }
                        }
                    }
                }
            }
        }
        urls.sort();
        urls.truncate(80);
        urls
    }

    pub fn new(directory: &str, interval_secs: u32) -> Self {
        let mut slides = Self::scan_photo_directory(directory);
        if slides.is_empty() {
            slides = vec![
                "../images/photo_widget_architecture.jpg".into(),
                "../images/photo_widget_botanical.jpg".into(),
                "../images/alpine_mist_wallpaper.jpg".into(),
            ];
        }
        Self {
            state: PhotoPayload {
                directory: directory.to_string(),
                slideshow_mode: true,
                interval_secs,
                current_index: 0,
                crop_fill: true,
                slides,
                crops: HashMap::new(),
            },
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        match cmd {
            "next" => {
                if !self.state.slides.is_empty() {
                    self.state.current_index = (self.state.current_index + 1) % self.state.slides.len();
                }
            }
            "prev" => {
                if !self.state.slides.is_empty() {
                    let n = self.state.slides.len();
                    self.state.current_index = (self.state.current_index + n - 1) % n;
                }
            }
            "toggle_crop" => {
                self.state.crop_fill = !self.state.crop_fill;
            }
            "toggle_slideshow" => {
                self.state.slideshow_mode = !self.state.slideshow_mode;
            }
            _ => {
                if let Some(dir) = cmd.strip_prefix("dir:") {
                    let clean_dir = dir.trim().to_string();
                    let scanned = Self::scan_photo_directory(&clean_dir);
                    if !scanned.is_empty() {
                        self.state.slides = scanned;
                        self.state.current_index = 0;
                    }
                    self.state.directory = clean_dir;
                } else if let Some(iv) = cmd.strip_prefix("interval:") {
                    if let Ok(secs) = iv.trim().parse::<u32>() {
                        self.state.interval_secs = secs.clamp(3, 3600);
                    }
                } else if let Some(rest) = cmd.strip_prefix("crop:") {
                    let parts: Vec<&str> = rest.split('|').collect();
                    if parts.len() >= 5 {
                        let photo_url = parts[0].to_string();
                        let zoom: f32 = parts[1].parse::<f32>().unwrap_or(1.0_f32).clamp(1.0_f32, 2.5_f32);
                        let offset_x: i32 = parts[2].parse::<i32>().unwrap_or(0_i32).clamp(-240_i32, 240_i32);
                        let offset_y: i32 = parts[3].parse::<i32>().unwrap_or(0_i32).clamp(-240_i32, 240_i32);
                        let fit_mode = parts[4].to_string();
                        self.state.crops.insert(
                            photo_url,
                            PhotoCropRecord {
                                zoom,
                                offset_x,
                                offset_y,
                                fit_mode,
                            },
                        );
                    }
                }
            }
        }
    }

    pub fn current_payload(&self) -> PhotoPayload {
        self.state.clone()
    }
}
