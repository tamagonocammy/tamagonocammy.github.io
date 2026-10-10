/**
 * Weather Component.
 * Displays current weather condition and temperature for a configured location.
 * Click opens a popup with details and the next hours; toggle button inside swaps C/F.
 * Refreshes every 15 minutes, and when the tab becomes visible with stale data.
 *
 * @extends {Component}
 */
class Weather extends Component {
  refs = {
    temperature: ".weather-temperature-value",
    condition: ".weather-condition-icon",
    scale: ".weather-temperature-scale",
    description: ".weather-description",
    popupIcon: ".weather-popup-icon",
    popupTemp: ".weather-popup-temp-value",
    popupScale: ".weather-popup-temp-scale",
    popupCondition: ".weather-popup-condition",
    popupFeels: ".weather-popup-feels",
    popupDetails: ".weather-popup-details",
    humidity: ".weather-humidity",
    wind: ".weather-wind",
    sunrise: ".weather-sunrise",
    sunset: ".weather-sunset",
    hourly: ".weather-popup-hourly",
  };

  /**
   * Mapping of raw weather conditions (from API) to Tabler icons and palette colors.
   * nightIcon/nightColor are used between sunset and sunrise when present.
   * Only icons shipped in src/css/tabler-icons.min.css may be used here.
   */
  forecasts = [
    { conditions: ["clear"], icon: "ti-sun", color: "yellow", nightIcon: "ti-moon-stars", nightColor: "lavender" },
    { conditions: ["clouds"], icon: "ti-cloud", color: "overlay2", nightColor: "lavender" },
    { conditions: ["mist", "fog", "haze", "smoke", "dust", "sand", "ash"], icon: "ti-mist", color: "overlay2" },
    { conditions: ["drizzle", "rain"], icon: "ti-cloud-rain", color: "blue" },
    { conditions: ["snow"], icon: "ti-snowflake", color: "sky" },
    { conditions: ["thunderstorm"], icon: "ti-cloud-storm", color: "peach" },
    { conditions: ["squall"], icon: "ti-wind", color: "teal" },
    { conditions: ["tornado"], icon: "ti-tornado", color: "red" },
  ];

  static REFRESH_INTERVAL_MS = 15 * 60 * 1000;

  location;
  weather = null;
  popupOpen = false;
  _refreshTimer = null;
  _closeOnOutsideClick = null;
  _closeOnEscape = null;
  _closeOnOtherPopup = null;
  _refreshOnVisible = null;

  constructor() {
    super();
    this.setDependencies();
    // setEvents() is called after render() in connectedCallback
  }

  setDependencies() {
    this.location = CONFIG.temperature.location;
    this.temperatureScale = CONFIG.temperature.scale;
    this.weatherForecast = new WeatherForecastClient(this.location);
  }

  setEvents() {
    // Wrapper click opens/closes popup (inner element, not host, so stopPropagation works correctly)
    const wrapper = this.shadow.querySelector('.weather-wrapper');
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePopup();
    });

    // Scale toggle button inside the popup
    const toggleBtn = this.shadow.querySelector('.weather-popup-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.swapScale();
      });
    }

    this._closeOnOutsideClick = (e) => {
      if (!e.composedPath().includes(this)) this.closePopup();
    };
    this._closeOnEscape = (e) => {
      if (e.key === 'Escape') this.closePopup();
    };
    this._closeOnOtherPopup = (e) => {
      if (e.detail?.id !== 'weather') this.closePopup();
    };
    // A tab left in the background misses refreshes; catch up as soon as it's visible again.
    this._refreshOnVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const age = Date.now() - (this.weather?.fetchedAt || 0);
      if (age > WeatherForecastClient.CACHE_TTL_MS) this.setWeather();
    };

    document.addEventListener('click', this._closeOnOutsideClick);
    document.addEventListener('keydown', this._closeOnEscape);
    document.addEventListener('startpage:popup-open', this._closeOnOtherPopup);
    document.addEventListener('visibilitychange', this._refreshOnVisible);
    this._refreshTimer = setInterval(() => this.setWeather(), Weather.REFRESH_INTERVAL_MS);
  }

  togglePopup() {
    this.popupOpen ? this.closePopup() : this.openPopup();
  }

  openPopup() {
    this.popupOpen = true;
    this.shadow.querySelector('.weather-popup')?.classList.remove('hidden');
    document.dispatchEvent(new CustomEvent('startpage:popup-open', { detail: { id: 'weather' } }));
  }

  closePopup() {
    this.popupOpen = false;
    this.shadow.querySelector('.weather-popup')?.classList.add('hidden');
  }

  disconnectedCallback() {
    if (this._closeOnOutsideClick) document.removeEventListener('click', this._closeOnOutsideClick);
    if (this._closeOnEscape) document.removeEventListener('keydown', this._closeOnEscape);
    if (this._closeOnOtherPopup) document.removeEventListener('startpage:popup-open', this._closeOnOtherPopup);
    if (this._refreshOnVisible) document.removeEventListener('visibilitychange', this._refreshOnVisible);
    clearInterval(this._refreshTimer);
    super.disconnectedCallback?.();
  }

  imports() {
    return [this.getIconResource("tabler"), this.getFontResource("lato")];
  }

  /**
   * One CSS class per palette color used by the condition icons.
   */
  colorClasses() {
    const colors = ["yellow", "lavender", "overlay2", "blue", "sky", "peach", "teal", "red", "subtext0"];
    return colors.map((c) => `.c-${c} { color: ${CONFIG.palette[c]}; }`).join("\n");
  }

  style() {
    return `
      .weather-wrapper {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
      }

      .weather-icon {
          margin-right: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
      }

      .weather-temperature {
          font: 300 9pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
      }

      .weather-temperature-value {
          font-weight: bold;
      }

      .weather-description {
          display: none;
          font-weight: 300;
          text-transform: capitalize;
          margin-left: 5px;
      }

      .weather-condition-icon {
          font-size: 14pt;
          line-height: 0;
      }

      ${this.colorClasses()}

      /* Weather popup */
      .weather-popup {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          background: ${CONFIG.palette.mantle};
          border: 1px solid ${CONFIG.palette.surface1};
          border-radius: 8px;
          padding: 16px;
          width: 230px;
          box-sizing: border-box;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          z-index: 100;
          cursor: default;
          font-family: 'Lato', sans-serif;
      }

      .weather-popup.hidden {
          display: none;
      }

      .weather-popup-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
      }

      .weather-popup-icon {
          font-size: 44px;
          line-height: 1;
      }

      .weather-popup-temp {
          display: flex;
          align-items: baseline;
          gap: 2px;
      }

      .weather-popup-temp-value {
          font: 700 22pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
      }

      .weather-popup-temp-scale {
          font: 300 11pt 'Lato', sans-serif;
          color: ${CONFIG.palette.subtext0};
      }

      .weather-popup-condition {
          font: 400 9pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
          text-align: center;
      }

      .weather-popup-condition::first-letter {
          text-transform: uppercase;
      }

      .weather-popup-feels {
          font: 400 8pt 'Lato', sans-serif;
          color: ${CONFIG.palette.subtext0};
          text-align: center;
      }

      .weather-popup-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 10px;
          width: 100%;
          border-top: 1px solid ${CONFIG.palette.surface1};
          padding-top: 8px;
          margin-top: 2px;
      }

      .weather-popup-details[hidden] {
          display: none;
      }

      .weather-detail {
          display: flex;
          align-items: center;
          gap: 5px;
          font: 400 8pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
          white-space: nowrap;
      }

      .weather-detail .ti {
          font-size: 13px;
          color: ${CONFIG.palette.subtext0};
      }

      .weather-popup-hourly {
          display: flex;
          justify-content: space-between;
          width: 100%;
          border-top: 1px solid ${CONFIG.palette.surface1};
          padding-top: 8px;
      }

      .weather-popup-hourly:empty {
          display: none;
      }

      .weather-hour {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3px;
          font: 400 7.5pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
      }

      .weather-hour-time {
          color: ${CONFIG.palette.subtext0};
      }

      .weather-hour .ti {
          font-size: 16px;
      }

      .weather-hour-temp {
          font-weight: 700;
      }

      .weather-popup-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          width: 100%;
          border-top: 1px solid ${CONFIG.palette.surface1};
          padding-top: 8px;
      }

      .weather-popup-location-label {
          font: 600 7pt 'Lato', sans-serif;
          color: ${CONFIG.palette.subtext0};
          text-transform: uppercase;
          letter-spacing: 0.5px;
      }

      .weather-popup-location-value {
          font: 400 9pt 'Lato', sans-serif;
          color: ${CONFIG.palette.text};
      }

      .weather-popup-toggle {
          background: none;
          border: 1px solid ${CONFIG.palette.mauve};
          border-radius: 4px;
          color: ${CONFIG.palette.mauve};
          font: 600 8pt 'Lato', sans-serif;
          padding: 3px 10px;
          cursor: pointer;
          margin-top: 2px;
      }

      .weather-popup-toggle:hover {
          background: ${CONFIG.palette.mauve};
          color: ${CONFIG.palette.base};
      }
    `;
  }

  async template() {
    const t = (key, fallback) => window.i18n?.t(key) || fallback;
    return `
      <div class="weather-wrapper">
        <p class="weather-temperature">
            <span class="weather-icon"><i class="ti ti-sun weather-condition-icon c-yellow"></i></span>
            <span class="weather-temperature-value">--</span>
            º<span class="weather-temperature-scale">${this.temperatureScale}</span>
            <span class="weather-description"></span>
        </p>

        <div class="weather-popup hidden">
          <div class="weather-popup-body">
            <i class="ti ti-sun weather-popup-icon c-yellow"></i>
            <div class="weather-popup-temp">
              <span class="weather-popup-temp-value">--</span>
              <span class="weather-popup-temp-scale">°${this.temperatureScale}</span>
            </div>
            <div class="weather-popup-condition"></div>
            <div class="weather-popup-feels"></div>
            <div class="weather-popup-details" hidden>
              <span class="weather-detail" title="${t('weather.popup.humidity', 'Humidity')}"><i class="ti ti-droplet"></i><span class="weather-humidity"></span></span>
              <span class="weather-detail" title="${t('weather.popup.wind', 'Wind')}"><i class="ti ti-wind"></i><span class="weather-wind"></span></span>
              <span class="weather-detail" title="${t('weather.popup.sunrise', 'Sunrise')}"><i class="ti ti-sunrise"></i><span class="weather-sunrise"></span></span>
              <span class="weather-detail" title="${t('weather.popup.sunset', 'Sunset')}"><i class="ti ti-sunset"></i><span class="weather-sunset"></span></span>
            </div>
            <div class="weather-popup-hourly"></div>
            <div class="weather-popup-meta">
              <span class="weather-popup-location-label">${t('weather.popup.location', 'Location')}</span>
              <span class="weather-popup-location-value">${this.location}</span>
            </div>
            <button class="weather-popup-toggle">${t('weather.popup.toggle_scale', '°C / °F')}</button>
          </div>
        </div>
      </div>`;
  }

  /**
   * Fahrenheit to Celsius conversion.
   */
  toC(f) {
    return Math.round(((f - 32) * 5) / 9);
  }

  /**
   * Celsius to Fahrenheit conversion.
   */
  toF(c) {
    return Math.round((c * 9) / 5 + 32);
  }

  /**
   * Toggles the temperature scale (C <-> F) and updates the display.
   */
  swapScale() {
    this.temperatureScale = this.temperatureScale === "C" ? "F" : "C";
    CONFIG.temperature = { ...CONFIG.temperature, scale: this.temperatureScale };
    if (this.weather && !this.weather.error) this.setTemperature();
    else this.refs.scale.textContent = this.temperatureScale;
  }

  /**
   * Converts a given temperature to the current active scale.
   */
  convertScale(temperature) {
    if (this.temperatureScale === "F") return this.toF(temperature);
    return temperature;
  }

  /**
   * Formats a timestamp as HH:MM in the city's own timezone (OWM gives its UTC offset in seconds).
   */
  formatTime(ms) {
    const d = new Date(ms + (this.weather.timezone || 0) * 1000);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  }

  /**
   * Fetches the latest weather data and updates the UI.
   * A failed refresh keeps showing the last good data instead of blanking the widget.
   */
  async setWeather() {
    const result = await this.weatherForecast.getWeather();
    if (result?.error) {
      if (this.weather && !this.weather.error) {
        console.warn(window.i18n?.t("weather.api_error") || "Weather API returned an error:", result.message);
        return;
      }
      this.weather = result;
      this.showError(result);
      return;
    }

    this.weather = result;
    this.setTemperature();
  }

  showError(error) {
    const unavailable = window.i18n?.t("weather.unavailable") || "Weather unavailable";

    // Inline widget error state
    this.refs.condition.className = "ti ti-cloud-off weather-condition-icon c-subtext0";
    this.refs.temperature.textContent = "--";
    this.refs.scale.textContent = this.temperatureScale;
    this.refs.description.textContent = `${unavailable}${
      window.i18n?.t("weather.unavailable_hint") ? ` ${window.i18n.t("weather.unavailable_hint")}` : ""
    }`;
    const details = error.message ? ` (${error.message})` : "";
    this.refs.description.title = `${window.i18n?.t("weather.error_details_summary") || "Technical details"}${details}`;

    // Popup error state: say what went wrong (bad key, unknown city...) where the user can see it
    this.refs.popupIcon.className = "ti ti-cloud-off weather-popup-icon c-subtext0";
    this.refs.popupTemp.textContent = "--";
    this.refs.popupCondition.textContent = unavailable;
    this.refs.popupFeels.textContent = error.message || "";
    this.refs.popupDetails.hidden = true;
    this.refs.hourly.innerHTML = "";
  }

  /**
   * Updates the DOM elements with the current weather data (inline + popup).
   */
  setTemperature() {
    const { temperature, condition, description, isDay } = this.weather;
    const { icon, color } = this.getForecast(condition, isDay);

    // Inline widget
    this.refs.temperature.textContent = this.convertScale(temperature);
    this.refs.scale.textContent = this.temperatureScale;
    this.refs.condition.className = `ti ${icon} weather-condition-icon c-${color}`;

    const weatherKey = `weather.conditions.${condition.toLowerCase()}`;
    const translatedCondition = window.i18n?.t(weatherKey);
    const displayCondition = translatedCondition && translatedCondition !== weatherKey ? translatedCondition : description;
    this.refs.description.textContent = `${this.location}: ${displayCondition}`;
    this.refs.description.title = "";

    this._updatePopup({ icon, color, displayCondition });
  }

  _updatePopup({ icon, color, displayCondition }) {
    const w = this.weather;
    const t = (key, fallback) => window.i18n?.t(key) || fallback;
    const deg = (value) => `${this.convertScale(value)}°`;

    this.refs.popupIcon.className = `ti ${icon} weather-popup-icon c-${color}`;
    this.refs.popupTemp.textContent = this.convertScale(w.temperature);
    this.refs.popupScale.textContent = `°${this.temperatureScale}`;
    this.refs.popupCondition.textContent = displayCondition;

    // Older cached entries may predate the detail fields; only show what we have.
    if (w.feelsLike === undefined) return;

    this.refs.popupFeels.textContent =
      `${t('weather.popup.feels_like', 'Feels like')} ${deg(w.feelsLike)} · ↑${deg(w.tempMax)} ↓${deg(w.tempMin)}`;
    this.refs.humidity.textContent = `${w.humidity}%`;
    this.refs.wind.textContent = `${w.windKmh} km/h`;
    this.refs.sunrise.textContent = this.formatTime(w.sunrise);
    this.refs.sunset.textContent = this.formatTime(w.sunset);
    this.refs.popupDetails.hidden = false;

    this.refs.hourly.innerHTML = (w.hourly || [])
      .map((slot) => {
        const forecast = this.getForecast(slot.condition, slot.isDay);
        return `
          <div class="weather-hour">
            <span class="weather-hour-time">${this.formatTime(slot.time)}</span>
            <i class="ti ${forecast.icon} c-${forecast.color}"></i>
            <span class="weather-hour-temp">${deg(slot.temperature)}</span>
          </div>`;
      })
      .join("");
  }

  /**
   * Finds the icon and color for a condition, using the night variant after dark.
   */
  getForecast(condition, isDay = true) {
    const forecast = this.forecasts.find((f) => f.conditions.includes(condition)) || this.forecasts[0];
    return {
      icon: (!isDay && forecast.nightIcon) || forecast.icon,
      color: (!isDay && forecast.nightColor) || forecast.color,
    };
  }

  async connectedCallback() {
    await this.render();
    this.setEvents();
    await this.setWeather();
  }
}
