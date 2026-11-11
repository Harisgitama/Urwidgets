use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AgendaItem {
    pub id: String,
    pub title: String,
    pub date_iso: String,
    pub start_time: String,
    pub end_time: String,
    pub category: String,
    pub completed: bool,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct AgendaPayload {
    pub items: Vec<AgendaItem>,
}

pub struct AgendaModule {
    items: Vec<AgendaItem>,
}

impl AgendaModule {
    pub fn new_with_defaults() -> Self {
        Self {
            items: vec![
                AgendaItem {
                    id: "evt-1".into(),
                    title: "Design System & WidgetWall Review".into(),
                    date_iso: "2026-11-08".into(),
                    start_time: "09:30".into(),
                    end_time: "10:45".into(),
                    category: "Architecture".into(),
                    completed: false,
                },
                AgendaItem {
                    id: "evt-2".into(),
                    title: "KDE Plasma 5 QML Compositor Profiling".into(),
                    date_iso: "2026-11-08".into(),
                    start_time: "13:00".into(),
                    end_time: "14:15".into(),
                    category: "Engineering".into(),
                    completed: false,
                },
                AgendaItem {
                    id: "evt-3".into(),
                    title: "Evening Reading & Studio Reset".into(),
                    date_iso: "2026-11-09".into(),
                    start_time: "16:30".into(),
                    end_time: "17:30".into(),
                    category: "Personal".into(),
                    completed: true,
                },
            ],
        }
    }

    pub fn add_event(&mut self, title: &str, start_time: &str, end_time: &str, category: &str) -> AgendaItem {
        let item = AgendaItem {
            id: format!("evt-{}", chrono::Utc::now().timestamp_millis()),
            title: title.to_string(),
            date_iso: chrono::Local::now().format("%Y-%m-%d").to_string(),
            start_time: start_time.to_string(),
            end_time: end_time.to_string(),
            category: category.to_string(),
            completed: false,
        };
        self.items.push(item.clone());
        item
    }

    pub fn update_event(&mut self, id: &str, title: &str, start_time: &str, end_time: &str, category: &str) -> Option<AgendaItem> {
        for item in &mut self.items {
            if item.id == id {
                item.title = title.to_string();
                item.start_time = start_time.to_string();
                item.end_time = end_time.to_string();
                item.category = category.to_string();
                return Some(item.clone());
            }
        }
        None
    }

    pub fn toggle_completed(&mut self, id: &str) -> Option<AgendaItem> {
        for item in &mut self.items {
            if item.id == id {
                item.completed = !item.completed;
                return Some(item.clone());
            }
        }
        None
    }

    pub fn delete_event(&mut self, id: &str) {
        self.items.retain(|i| i.id != id);
    }

    pub fn current_payload(&self) -> AgendaPayload {
        AgendaPayload {
            items: self.items.clone(),
        }
    }
}
