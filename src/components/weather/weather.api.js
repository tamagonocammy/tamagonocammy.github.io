/**
 * Open-Meteo client: current conditions, the next few hours, a 3-day outlook and air quality.
 * No API key needed. The city name is geocoded once and the coordinates are kept in localStorage;
 * weather results are cached so new tabs render instantly.
 */
class WeatherForecastClient {
  static CACHE_TTL_MS = 10 * 60 * 1000;
  static HOURLY_SLOTS = 5;
  static HOURLY_STEP = 3; // hours between slots in the popup's hourly row
  static DAILY_DAYS = 3;

  /**
   * WMO weather codes (what Open-Meteo returns) to the condition names the component
   * maps to icons and translations.
   */
  static CONDITIONS = [
    { codes: [0, 1], condition: "clear", description: "clear sky" },
    { codes: [2, 3], condition: "clouds", description: "cloudy" },
    { codes: [45, 48], condition: "fog", description: "fog" },
    { codes: [51, 53, 55, 56, 57], condition: "drizzle", description: "drizzle" },
    { codes: [61, 63, 65, 66, 67, 80, 81, 82], condition: "rain", description: "rain" },
    { codes: [71, 73, 75, 77, 85, 86], condition: "snow", description: "snow" },
    { codes: [95, 96, 99], condition: "thunderstorm", description: "thunderstorm" },
  ];

  constructor(location) {
    this.location = location;
    // v3: Open-Meteo data
    this.cacheKey = `weatherCache:v3:${location}`;
    this.placeKey = `weatherPlace:v1:${location}`;
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

    const place = await this.resolvePlace();
    if (place.error) {
      console.warn(window.i18n?.t("weather.api_error") || "Weather API returned an error:", place.message);
      return place;
    }

    const coords = `latitude=${place.latitude}&longitude=${place.longitude}`;
    const forecastUrl =
      `https://api.open-meteo.com/v1/forecast?${coords}` +
      "&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day" +
      "&hourly=temperature_2m,weather_code,is_day,precipitation_probability" +
      "&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max" +
      `&timezone=auto&forecast_days=${WeatherForecastClient.DAILY_DAYS + 1}&timeformat=unixtime&wind_speed_unit=kmh`;
    const airUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?${coords}&current=european_aqi,pm2_5`;

    const [forecast, air] = await Promise.all([this.fetchJson(forecastUrl), this.fetchJson(airUrl)]);

    if (forecast.error) {
      console.warn(window.i18n?.t("weather.api_error") || "Weather API returned an error:", forecast.message);
      return forecast;
    }

    const weather = {
      ...this.parseCurrent(forecast),
      // A missing hourly/daily block or a failed air-quality call shouldn't hide the current weather;
      // the popup just skips those rows.
      hourly: this.parseHourly(forecast),
      daily: this.parseDaily(forecast),
      rainChance: this.parseRainChance(forecast),
      airQuality: air.error ? null : this.parseAirQuality(air),
      fetchedAt: Date.now(),
    };

    this.writeCache(weather);
    return weather;
  }

  /**
   * Turns the configured location into coordinates, once (cities don't move).
   * Accepts "City" or "City, CC" (ISO country code) to pick between same-named places;
   * without a country, the most populated match wins (so "Bogota" is Bogotá, Colombia).
   */
  async resolvePlace() {
    try {
      const saved = JSON.parse(localStorage.getItem(this.placeKey));
      if (saved?.latitude !== undefined) return saved;
    } catch {
      // Corrupt or unavailable storage: look it up again.
    }

    const [name, country] = this.location.split(",").map((part) => part.trim());
    const data = await this.fetchJson(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=10&format=json`,
    );
    if (data.error) return data;

    const results = data.results || [];
    const match = country ? results.find((r) => r.country_code?.toLowerCase() === country.toLowerCase()) : results[0];
    if (!match) return { error: true, status: 404, message: this.describeError(404) };

    const place = { latitude: match.latitude, longitude: match.longitude };
    try {
      localStorage.setItem(this.placeKey, JSON.stringify(place));
    } catch {
      // Best-effort.
    }
    return place;
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
    if (status === 404) return t("weather.errors.city_not_found", "City not found");
    if (status === 429) return t("weather.errors.rate_limited", "Too many requests, try again later");
    return data?.reason || `HTTP ${status}`;
  }

  /** WMO code to { condition, description }; unknown codes count as cloudy. */
  conditionOf(code) {
    return WeatherForecastClient.CONDITIONS.find((c) => c.codes.includes(code)) || WeatherForecastClient.CONDITIONS[1];
  }

  parseCurrent(data) {
    const { current, daily } = data;
    const { condition, description } = this.conditionOf(current.weather_code);
    return {
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      tempMin: Math.round(daily.temperature_2m_min[0]),
      tempMax: Math.round(daily.temperature_2m_max[0]),
      humidity: current.relative_humidity_2m,
      windKmh: Math.round(current.wind_speed_10m),
      sunrise: daily.sunrise[0] * 1000,
      sunset: daily.sunset[0] * 1000,
      timezone: data.utc_offset_seconds,
      isDay: current.is_day === 1,
      condition,
      description,
    };
  }

  /** Index of the first hourly entry that is still ahead of now. */
  nextHourIndex(data) {
    const now = data.current.time;
    const index = data.hourly.time.findIndex((t) => t > now);
    return index === -1 ? data.hourly.time.length : index;
  }

  /** The next few hours, every HOURLY_STEP hours. */
  parseHourly(data) {
    if (!data.hourly?.time) return [];
    const { time, temperature_2m, weather_code, is_day } = data.hourly;
    const slots = [];
    for (let i = this.nextHourIndex(data); i < time.length && slots.length < WeatherForecastClient.HOURLY_SLOTS; i += WeatherForecastClient.HOURLY_STEP) {
      slots.push({
        time: time[i] * 1000,
        temperature: Math.round(temperature_2m[i]),
        condition: this.conditionOf(weather_code[i]).condition,
        isDay: is_day[i] === 1,
      });
    }
    return slots;
  }

  /**
   * The next few days (today is skipped: the popup already shows it).
   * The icon comes from the midday hour rather than the daily code, which reports the day's
   * worst weather and would show rain for any afternoon shower.
   */
  parseDaily(data) {
    if (!data.daily?.time || !data.hourly?.time) return [];
    const { daily, hourly } = data;
    const offset = data.utc_offset_seconds;

    return daily.time.slice(1, WeatherForecastClient.DAILY_DAYS + 1).map((dayStart, n) => {
      const i = n + 1;
      const middayIndex = hourly.time.indexOf(dayStart + 12 * 3600);
      return {
        weekday: new Date((dayStart + offset) * 1000).getUTCDay(),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        tempMax: Math.round(daily.temperature_2m_max[i]),
        condition: this.conditionOf(middayIndex === -1 ? null : hourly.weather_code[middayIndex]).condition,
        rainChance: daily.precipitation_probability_max[i] ?? 0,
      };
    });
  }

  /** Highest chance of rain over the next 3 hours, in percent. */
  parseRainChance(data) {
    const chances = data.hourly?.precipitation_probability;
    if (!chances) return null;
    const start = this.nextHourIndex(data);
    const next = chances.slice(start, start + 3).filter((c) => c !== null);
    return next.length ? Math.max(...next) : null;
  }

  /**
   * European AQI (0-100+) folded into the component's 1 (good) to 5 (very poor) scale,
   * using the EAQI's own bands of 20, plus the fine-particle reading.
   */
  parseAirQuality(data) {
    const aqi = data.current?.european_aqi;
    if (aqi === null || aqi === undefined) return null;
    return {
      index: Math.min(5, Math.max(1, Math.ceil(aqi / 20))),
      pm25: Math.round(data.current.pm2_5 ?? 0),
    };
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
