use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct PomodoroPayload {
    pub phase: String,
    pub status: String,
    pub remaining_secs: u32,
    pub total_secs: u32,
    pub completed_sessions: u32,
    pub study_mins: u32,
    pub short_break_mins: u32,
    pub long_break_mins: u32,
}

pub struct PomodoroModule {
    state: PomodoroPayload,
}

impl PomodoroModule {
    pub fn new(study_mins: u32, short_break_mins: u32, long_break_mins: u32) -> Self {
        let total = study_mins * 60;
        Self {
            state: PomodoroPayload {
                phase: "Focus".into(),
                status: "Idle".into(),
                remaining_secs: total,
                total_secs: total,
                completed_sessions: 3,
                study_mins,
                short_break_mins,
                long_break_mins,
            },
        }
    }

    pub fn is_running(&self) -> bool {
        self.state.status == "Running"
    }

    pub fn tick_one_sec(&mut self) {
        if self.state.remaining_secs > 1 {
            self.state.remaining_secs -= 1;
        } else {
            self.state.remaining_secs = 0;
            self.state.status = "Idle".into();
            if self.state.phase == "Focus" || self.state.phase == "Study" {
                self.state.completed_sessions += 1;
            }
        }
    }

    pub fn apply_action(&mut self, action: &str) {
        match action {
            "start" | "resume" => self.state.status = "Running".into(),
            "pause" => self.state.status = "Paused".into(),
            "reset" => {
                self.state.status = "Idle".into();
                self.state.remaining_secs = self.state.total_secs;
            }
            "phase:study" | "phase:focus" => {
                self.state.phase = "Focus".into();
                self.state.status = "Idle".into();
                self.state.total_secs = self.state.study_mins * 60;
                self.state.remaining_secs = self.state.total_secs;
            }
            "phase:short" => {
                self.state.phase = "Short Break".into();
                self.state.status = "Idle".into();
                self.state.total_secs = self.state.short_break_mins * 60;
                self.state.remaining_secs = self.state.total_secs;
            }
            "phase:long" => {
                self.state.phase = "Long Break".into();
                self.state.status = "Idle".into();
                self.state.total_secs = self.state.long_break_mins * 60;
                self.state.remaining_secs = self.state.total_secs;
            }
            _ => {
                if let Some(rest) = action.strip_prefix("durations:") {
                    let parts: Vec<u32> = rest.split(':').filter_map(|s| s.parse().ok()).collect();
                    if parts.len() == 3 {
                        self.state.study_mins = parts[0].clamp(1, 120);
                        self.state.short_break_mins = parts[1].clamp(1, 60);
                        self.state.long_break_mins = parts[2].clamp(1, 90);
                        self.state.total_secs = self.state.study_mins * 60;
                        self.state.remaining_secs = self.state.total_secs;
                    }
                }
            }
        }
    }

    pub fn current_payload(&self) -> PomodoroPayload {
        self.state.clone()
    }
}
