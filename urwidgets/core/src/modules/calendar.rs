use chrono::{Datelike, Local, NaiveDate};
use serde::Serialize;

#[derive(Clone, Debug, Serialize)]
pub struct CalendarCell {
    pub day: u32,
    pub in_current_month: bool,
    pub is_today: bool,
    pub has_event: bool,
}

#[derive(Clone, Debug, Serialize)]
pub struct CalendarPayload {
    pub year: i32,
    pub month: u32,
    pub month_name: String,
    pub today_day: u32,
    pub locale: String,
    pub first_day_of_week: u8,
    pub weekday_headers: Vec<String>,
    pub days_in_month: u32,
    pub leading_empty_cells: u32,
    pub cells: Vec<CalendarCell>,
}

pub struct CalendarModule {
    pub locale: String,
    pub first_day_of_week: u8,
    pub year: i32,
    pub month: u32,
}

impl CalendarModule {
    pub fn new(locale: &str, first_day_of_week: u8) -> Self {
        let now = Local::now();
        Self {
            locale: locale.to_string(),
            first_day_of_week,
            year: now.year(),
            month: now.month(),
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        match cmd {
            "prev" => {
                if self.month == 1 {
                    self.month = 12;
                    self.year -= 1;
                } else {
                    self.month -= 1;
                }
            }
            "next" => {
                if self.month == 12 {
                    self.month = 1;
                    self.year += 1;
                } else {
                    self.month += 1;
                }
            }
            "today" => {
                let now = Local::now();
                self.year = now.year();
                self.month = now.month();
            }
            "locale:id-ID" => self.locale = "id-ID".into(),
            "locale:en-US" => self.locale = "en-US".into(),
            "firstday:0" => self.first_day_of_week = 0,
            "firstday:1" => self.first_day_of_week = 1,
            _ => {}
        }
    }

    pub fn current_payload(&self) -> CalendarPayload {
        let now = Local::now();
        let month_names_en = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ];
        let month_names_id = [
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember",
        ];

        let headers_sun_en = vec!["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        let headers_mon_en = vec!["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        let headers_sun_id = vec!["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
        let headers_mon_id = vec!["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

        let is_id = self.locale.starts_with("id");
        let month_idx = (self.month.saturating_sub(1) as usize).min(11);
        let month_name = if is_id {
            month_names_id[month_idx].to_string()
        } else {
            month_names_en[month_idx].to_string()
        };

        let raw_headers = match (is_id, self.first_day_of_week) {
            (true, 0) => headers_sun_id,
            (true, _) => headers_mon_id,
            (false, 0) => headers_sun_en,
            (false, _) => headers_mon_en,
        };

        let first_date = NaiveDate::from_ymd_opt(self.year, self.month, 1)
            .unwrap_or_else(|| NaiveDate::from_ymd_opt(2026, 1, 1).unwrap());
        let next_month_first = if self.month == 12 {
            NaiveDate::from_ymd_opt(self.year + 1, 1, 1).unwrap()
        } else {
            NaiveDate::from_ymd_opt(self.year, self.month + 1, 1).unwrap()
        };
        let days_in_month = (next_month_first - first_date).num_days() as u32;
        let wf = first_date.weekday().num_days_from_sunday();
        let leading = if self.first_day_of_week == 1 {
            (wf + 6) % 7
        } else {
            wf
        };

        let mut cells = Vec::with_capacity(42);
        for _ in 0..leading {
            cells.push(CalendarCell {
                day: 0,
                in_current_month: false,
                is_today: false,
                has_event: false,
            });
        }
        for d in 1..=days_in_month {
            let is_today = self.year == now.year() && self.month == now.month() && d == now.day();
            let has_event = d == now.day() || d == 12 || d == 18 || d == 24;
            cells.push(CalendarCell {
                day: d,
                in_current_month: true,
                is_today,
                has_event,
            });
        }
        while cells.len() < 42 {
            cells.push(CalendarCell {
                day: 0,
                in_current_month: false,
                is_today: false,
                has_event: false,
            });
        }

        CalendarPayload {
            year: self.year,
            month: self.month,
            month_name,
            today_day: now.day(),
            locale: self.locale.clone(),
            first_day_of_week: self.first_day_of_week,
            weekday_headers: raw_headers.into_iter().map(String::from).collect(),
            days_in_month,
            leading_empty_cells: leading,
            cells,
        }
    }
}
