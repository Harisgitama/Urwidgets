use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct QuickActionEntry {
    pub id: String,
    pub label: String,
    pub icon_name: String,
    pub command: String,
    pub category: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct QuickActionsPayload {
    pub columns: u8,
    pub actions: Vec<QuickActionEntry>,
}

pub struct QuickActionsModule {
    columns: u8,
    actions: Vec<QuickActionEntry>,
}

impl QuickActionsModule {
    pub fn new_defaults() -> Self {
        Self {
            columns: 2,
            actions: vec![
                QuickActionEntry {
                    id: "qa-files".into(),
                    label: "Files".into(),
                    icon_name: "system-file-manager".into(),
                    command: "dolphin ~".into(),
                    category: "Folder".into(),
                },
                QuickActionEntry {
                    id: "qa-terminal".into(),
                    label: "Terminal".into(),
                    icon_name: "utilities-terminal".into(),
                    command: "konsole".into(),
                    category: "Application".into(),
                },
                QuickActionEntry {
                    id: "qa-projects".into(),
                    label: "Projects".into(),
                    icon_name: "folder-development".into(),
                    command: "xdg-open ~/Projects".into(),
                    category: "Folder".into(),
                },
                QuickActionEntry {
                    id: "qa-settings".into(),
                    label: "Settings".into(),
                    icon_name: "preferences-system".into(),
                    command: "systemsettings5".into(),
                    category: "System".into(),
                },
            ],
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        if let Some(cols) = cmd.strip_prefix("columns:") {
            if let Ok(c) = cols.parse::<u8>() {
                self.columns = c.clamp(1, 4);
            }
        }
    }

    pub fn current_payload(&self) -> QuickActionsPayload {
        QuickActionsPayload {
            columns: self.columns,
            actions: self.actions.clone(),
        }
    }
}
