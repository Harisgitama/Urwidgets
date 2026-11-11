use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct HourlyForecast {
    pub hour: String,
    pub temp_c: f32,
    pub condition: String,
    pub icon_name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct DailyForecast {
    pub day: String,
    pub min_c: f32,
    pub max_c: f32,
    pub condition: String,
    pub icon_name: String,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct WeatherPayload {
    pub location: String,
    pub use_celsius: bool,
    pub temp_c: f32,
    pub condition: String,
    pub icon_name: String,
    pub humidity_pct: u8,
    pub wind_kph: f32,
    pub updated_at: String,
    pub offline_cached: bool,
    pub hourly: Vec<HourlyForecast>,
    pub daily: Vec<DailyForecast>,
}

pub struct WeatherModule {
    pub location: String,
    pub use_celsius: bool,
    pub refresh_mins: u32,
    cached: WeatherPayload,
}

impl WeatherModule {
    pub fn new(location: &str, use_celsius: bool, refresh_mins: u32) -> Self {
        let cached = WeatherPayload {
            location: location.to_string(),
            use_celsius,
            temp_c: 29.0,
            condition: "Mostly Clear".to_string(),
            icon_name: "weather-clear".to_string(),
            humidity_pct: 64,
            wind_kph: 11.5,
            updated_at: "16:56".to_string(),
            offline_cached: false,
            hourly: vec![
                HourlyForecast { hour: "09:00".into(), temp_c: 23.0, condition: "Clear".into(), icon_name: "weather-clear".into() },
                HourlyForecast { hour: "12:00".into(), temp_c: 29.0, condition: "Mostly Clear".into(), icon_name: "weather-clear".into() },
                HourlyForecast { hour: "15:00".into(), temp_c: 27.0, condition: "Partly Cloudy".into(), icon_name: "weather-clouds".into() },
                HourlyForecast { hour: "18:00".into(), temp_c: 22.0, condition: "Clear".into(), icon_name: "weather-clear-night".into() },
            ],
            daily: vec![
                DailyForecast { day: "Mon".into(), min_c: 18.0, max_c: 29.0, condition: "Mostly Clear".into(), icon_name: "weather-clear".into() },
                DailyForecast { day: "Tue".into(), min_c: 19.0, max_c: 27.0, condition: "Partly Cloudy".into(), icon_name: "weather-clouds".into() },
                DailyForecast { day: "Wed".into(), min_c: 18.0, max_c: 28.0, condition: "Clear".into(), icon_name: "weather-clear".into() },
            ],
        };
        Self {
            location: location.to_string(),
            use_celsius,
            refresh_mins,
            cached,
        }
    }

    pub fn apply_command(&mut self, cmd: &str) {
        if let Some(loc) = cmd.strip_prefix("location:") {
            self.location = loc.trim().to_string();
            self.cached.location = self.location.clone();
        } else if cmd == "unit:C" {
            self.use_celsius = true;
            self.cached.use_celsius = true;
        } else if cmd == "unit:F" {
            self.use_celsius = false;
            self.cached.use_celsius = false;
        } else if cmd == "refresh" {
            self.refresh_if_due();
        }
    }

    pub fn refresh_if_due(&mut self) {
        self.cached.updated_at = chrono::Local::now().format("%H:%M").to_string();
    }

    pub fn cached_payload(&self) -> WeatherPayload {
        self.cached.clone()
    }
}
