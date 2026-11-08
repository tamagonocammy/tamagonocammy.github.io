/**
 * OpenWeatherMap client: current conditions, the next few 3-hour forecast slots,
 * a 3-day outlook and air quality.
 * Results are cached in localStorage so new tabs render instantly and the shared
 * demo key isn't hit on every page load.
 */
class WeatherForecastClient {
  static CACHE_TTL_MS = 10 * 60 * 1000;
  static HOURLY_SLOTS = 5;
  static DAILY_DAYS = 3;

  constructor(location) {
    this.location = location;
    this.appId = localStorage.getItem("OWM_API_KEY") || window.OWM_API_KEY || advanced_config?.weather?.apiKey || "50a34e070dd5c09a99554b57ab7ea7e2";
    this.language = advanced_config?.weather?.language || "eo";
    // v2: entries carry daily/rainChance/airQuality
    this.cacheKey = `weatherCache:v2:${location}:${this.language}`;

    const params = `q=${encodeURIComponent(location)}&units=metric&lang=${this.language}&appid=${this.appId}`;
    this.currentUrl = `https://api.openweathermap.org/data/2.5/weather?${params}`;
    // The full 5-day / 3-hour list: the first slots feed the hourly row, the rest the daily outlook
    this.forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}`;
  }

  /**
   * Returns cached weather when it is fresh enough, otherwise fetches it.
   * Pass force = true to skip the cache.
   */
  async getWeather(force = false) {
    if (!force) {
      const cached = this.readCache();
      if (cached) return cached;
    }

    const [current, forecast] = await Promise.all([this.fetchJson(this.currentUrl), this.fetchJson(this.forecastUrl)]);

    if (current.error) {
      console.warn(window.i18n?.t("weather.api_error") || "Weather API returned an error:", current.message);
      return current;
    }

    // Air quality needs coordinates, which only the current-weather answer gives us
    const air = current.coord
      ? await this.fetchJson(
          `https://api.openweathermap.org/data/2.5/air_pollution?lat=${current.coord.lat}&lon=${current.coord.lon}&appid=${this.appId}`,
        )
      : { error: true };

    const weather = {
      ...this.parseCurrent(current),
      // A failed forecast or air-quality call shouldn't hide the current weather; the popup just skips those rows.
      hourly: forecast.error ? [] : this.parseForecast(forecast, current),
      daily: forecast.error ? [] : this.parseDaily(forecast, current),
      rainChance: forecast.error ? null : this.parseRainChance(forecast),
      airQuality: air.error ? null : this.parseAirQuality(air),
      fetchedAt: Date.now(),
    };

    this.writeCache(weather);
    return weather;
  }

  async fetchJson(url) {
    try {
      const res = await fetch(url);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { error: true, status: res.status, message: this.describeError(res.status, data) };
      return data;
    } catch (err) {
      return { error: true, message: err?.message || String(err) };
    }
  }

  describeError(status, data) {
    const t = (key, fallback) => {
      const value = window.i18n?.t(key);
      return value && value !== key ? value : fallback;
    };
    if (status === 401) return t("weather.errors.invalid_key", "Invalid API key");
    if (status === 404) return t("weather.errors.city_not_found", "City not found");
    if (status === 429) return t("weather.errors.rate_limited", "Too many requests, try again later");
    return data?.message || `HTTP ${status}`;
  }

  parseCurrent(data) {
    const now = data.dt * 1000;
    const sunrise = data.sys.sunrise * 1000;
    const sunset = data.sys.sunset * 1000;

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      windKmh: Math.round((data.wind?.speed || 0) * 3.6),
      sunrise,
      sunset,
      timezone: data.timezone,
      isDay: now >= sunrise && now < sunset,
      condition: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
    };
  }

  parseForecast(data, current) {
    return (data.list || []).slice(0, WeatherForecastClient.HOURLY_SLOTS).map((slot) => ({
      time: slot.dt * 1000,
      temperature: Math.round(slot.main.temp),
      condition: slot.weather[0].main.toLowerCase(),
      // OWM marks each slot "d"/"n"; fall back to the current sunrise/sunset window.
      isDay: slot.sys?.pod ? slot.sys.pod === "d" : this.isDaytime(slot.dt * 1000, current),
    }));
  }

  /**
   * Groups the 3-hour slots by the city's local day and summarizes the next few days
   * (today is skipped: the popup already shows it). The icon comes from the slot closest to midday.
   */
  parseDaily(data, current) {
    const dayMs = 24 * 60 * 60 * 1000;
    const offset = current.timezone * 1000;
    const dayOf = (ms) => Math.floor((ms + offset) / dayMs);
    const today = dayOf(current.dt * 1000);

    const days = new Map();
    for (const slot of data.list || []) {
      const day = dayOf(slot.dt * 1000);
      if (day <= today) continue;
      if (!days.has(day)) days.set(day, []);
      days.get(day).push(slot);
    }

    return [...days.entries()].slice(0, WeatherForecastClient.DAILY_DAYS).map(([day, slots]) => {
      const hourOf = (slot) => (((slot.dt * 1000 + offset) % dayMs) / 3600000);
      const midday = slots.reduce((best, slot) => (Math.abs(hourOf(slot) - 12) < Math.abs(hourOf(best) - 12) ? slot : best));
      return {
        weekday: new Date(day * dayMs).getUTCDay(),
        tempMin: Math.round(Math.min(...slots.map((s) => s.main.temp_min))),
        tempMax: Math.round(Math.max(...slots.map((s) => s.main.temp_max))),
        condition: midday.weather[0].main.toLowerCase(),
        rainChance: Math.round(Math.max(...slots.map((s) => s.pop || 0)) * 100),
      };
    });
  }

  /** Chance of rain over the next 3 hours, in percent. */
  parseRainChance(data) {
    const next = data.list?.[0];
    return next ? Math.round((next.pop || 0) * 100) : null;
  }

  /** OWM air quality index: 1 (good) to 5 (very poor), plus the fine-particle reading. */
  parseAirQuality(data) {
    const entry = data.list?.[0];
    if (!entry?.main?.aqi) return null;
    return { index: entry.main.aqi, pm25: Math.round(entry.components?.pm2_5 ?? 0) };
  }

  isDaytime(ms, current) {
    const dayMs = 24 * 60 * 60 * 1000;
    const timeOfDay = (t) => (((t + current.timezone * 1000) % dayMs) + dayMs) % dayMs;
    const t = timeOfDay(ms);
    return t >= timeOfDay(current.sys.sunrise * 1000) && t < timeOfDay(current.sys.sunset * 1000);
  }

  readCache() {
    try {
      const cached = JSON.parse(localStorage.getItem(this.cacheKey));
      if (cached && Date.now() - cached.fetchedAt < WeatherForecastClient.CACHE_TTL_MS) return cached;
    } catch {
      // Corrupt or unavailable storage: just fetch.
    }
    return null;
  }

  writeCache(weather) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(weather));
    } catch {
      // Storage full or blocked: caching is best-effort.
    }
  }
}
