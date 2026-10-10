/**
 * OpenWeatherMap client: current conditions plus the next few 3-hour forecast slots.
 * Results are cached in localStorage so new tabs render instantly and the shared
 * demo key isn't hit on every page load.
 */
class WeatherForecastClient {
  static CACHE_TTL_MS = 10 * 60 * 1000;
  static HOURLY_SLOTS = 5;

  constructor(location) {
    this.location = location;
    this.appId = localStorage.getItem("OWM_API_KEY") || window.OWM_API_KEY || advanced_config?.weather?.apiKey || "50a34e070dd5c09a99554b57ab7ea7e2";
    this.language = advanced_config?.weather?.language || "eo";
    this.cacheKey = `weatherCache:${location}:${this.language}`;

    const params = `q=${encodeURIComponent(location)}&units=metric&lang=${this.language}&appid=${this.appId}`;
    this.currentUrl = `https://api.openweathermap.org/data/2.5/weather?${params}`;
    this.forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?${params}&cnt=${WeatherForecastClient.HOURLY_SLOTS}`;
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

    const weather = {
      ...this.parseCurrent(current),
      // A failed forecast shouldn't hide the current weather; the popup just skips the row.
      hourly: forecast.error ? [] : this.parseForecast(forecast, current),
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
    return (data.list || []).map((slot) => ({
      time: slot.dt * 1000,
      temperature: Math.round(slot.main.temp),
      condition: slot.weather[0].main.toLowerCase(),
      // OWM marks each slot "d"/"n"; fall back to the current sunrise/sunset window.
      isDay: slot.sys?.pod ? slot.sys.pod === "d" : this.isDaytime(slot.dt * 1000, current),
    }));
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
