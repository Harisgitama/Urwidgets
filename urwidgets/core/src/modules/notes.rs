use serde::{Deserialize, Serialize};
use chrono::Utc;

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NoteRecord {
    pub id: String,
    pub title: String,
    pub body: String,
    pub pinned: bool,
    pub tags: Vec<String>,
    pub updated_at_iso: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct NotesPayload {
    pub notes: Vec<NoteRecord>,
}

pub struct NotesModule {
    pub notes: Vec<NoteRecord>,
}

impl NotesModule {
    pub fn new_defaults() -> Self {
        Self {
            notes: vec![
                NoteRecord {
                    id: "note-1".into(),
                    title: "Desktop Widget Architecture".into(),
                    body: "Keep all 10 Plasmoids backed by a single urwidgets-daemon process over org.urwidgets.Daemon1 D-Bus.".into(),
                    pinned: true,
                    tags: vec!["Architecture".into(), "Plasma 5".into()],
                    updated_at_iso: "2026-11-09T07:45:00Z".into(),
                },
                NoteRecord {
                    id: "note-2".into(),
                    title: "Reading & Study Notes".into(),
                    body: "Visual hierarchy through weight and proportion. Avoid noisy hover toolbars on desktop widgets.".into(),
                    pinned: false,
                    tags: vec!["Design".into()],
                    updated_at_iso: "2026-11-08T19:20:00Z".into(),
                },
            ],
        }
    }

    pub fn upsert_note(&mut self, id: &str, title: &str, body: &str, pinned: bool) -> NoteRecord {
        let now_iso = Utc::now().to_rfc3339();
        for n in &mut self.notes {
            if n.id == id {
                n.title = title.to_string();
                n.body = body.to_string();
                n.pinned = pinned;
                n.updated_at_iso = now_iso;
                return n.clone();
            }
        }
        let rec = NoteRecord {
            id: id.to_string(),
            title: title.to_string(),
            body: body.to_string(),
            pinned,
            tags: vec![],
            updated_at_iso: now_iso,
        };
        self.notes.insert(0, rec.clone());
        rec
    }

    pub fn delete_note(&mut self, id: &str) {
        self.notes.retain(|n| n.id != id);
    }

    pub fn current_payload(&self) -> NotesPayload {
        NotesPayload {
            notes: self.notes.clone(),
        }
    }
}
