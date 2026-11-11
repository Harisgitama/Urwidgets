use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct WidgetBackgroundRecord {
    pub widget_id: String,
    pub enabled: bool,
    pub image_path: String,
    pub fit_mode: String,
    pub position: String,
    pub overlay_mode: String,
    pub overlay_opacity: f32,
    pub color_tint: String,
    pub text_contrast: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct BackgroundsPayload {
    pub items: HashMap<String, WidgetBackgroundRecord>,
}

pub struct BackgroundsModule {
    pub items: HashMap<String, WidgetBackgroundRecord>,
}

impl BackgroundsModule {
    pub fn new_defaults() -> Self {
        Self {
            items: HashMap::new(),
        }
    }

    pub fn set_background(
        &mut self,
        widget_id: &str,
        image_path: &str,
        fit_mode: &str,
        overlay_opacity: f32,
    ) -> WidgetBackgroundRecord {
        let rec = WidgetBackgroundRecord {
            widget_id: widget_id.to_string(),
            enabled: !image_path.trim().is_empty(),
            image_path: image_path.to_string(),
            fit_mode: fit_mode.to_string(),
            position: "center".to_string(),
            overlay_mode: "auto".to_string(),
            overlay_opacity: overlay_opacity.clamp(0.0, 0.85),
            color_tint: String::new(),
            text_contrast: "auto".to_string(),
        };
        self.items.insert(widget_id.to_string(), rec.clone());
        rec
    }

    pub fn current_payload(&self) -> BackgroundsPayload {
        BackgroundsPayload {
            items: self.items.clone(),
        }
    }
}
