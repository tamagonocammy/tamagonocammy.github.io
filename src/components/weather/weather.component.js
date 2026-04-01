/**
 * Weather Component.
 * Displays current weather condition and temperature for a configured location.
 * Click opens a popup with details; toggle button inside swaps C/F.
 *
 * @extends {Component}
 */
class Weather extends Component {
  refs = {
    temperature: ".weather-temperature-value",
    condition: ".weather-condition-icon",
    scale: ".weather-temperature-scale",
    description: ".weather-description",
  };

  /**
   * Mapping of raw weather conditions (from API) to icon names and colors.
   * tablerIcon: Tabler icon class used in the popup.
   * icon/color: Material icon and color class used in the inline widget.
   */
  forecasts = [
    {
      conditions: ["clear"],
      icon: "wb_sunny",
      tablerIcon: "ti-sun",
      color: "sunny",
    },
    {
      conditions: ["clouds", "smoke", "dust", "sand", "ash"],
      icon: "cloud_queue",
      tablerIcon: "ti-cloud",
      color: "cloudy",
    },
    {
      conditions: ["mist", "fog", "haze"],
      icon: "cloud_queue",
      tablerIcon: "ti-mist",
      color: "cloudy",
    },
    {
      conditions: ["drizzle"],
      icon: "opacity",
      tablerIcon: "ti-cloud-drizzle",
      color: "cloudy",
    },
    {
      conditions: ["rain"],
      icon: "opacity",
      tablerIcon: "ti-cloud-rain",
      color: "cloudy",
    },
    {
      conditions: ["snow"],
      icon: "opacity",
      tablerIcon: "ti-snowflake",
      color: "cloudy",
    },
    {
      conditions: ["thunderstorm"],
      icon: "bolt",
      tablerIcon: "ti-cloud-storm",
      color: "cloudy",
    },
    {
      conditions: ["squall"],
      icon: "cloud_queue",
      tablerIcon: "ti-wind",
      color: "cloudy",
    },
    {
      conditions: ["tornado"],
      icon: "cloud_queue",
      tablerIcon: "ti-tornado",
      color: "cloudy",
    },
  ];

  location;
  popupOpen = false;
  _closeOnOutsideClick = null;
  _closeOnEscape = null;
  _closeOnOtherPopup = null;

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

    document.addEventListener('click', this._closeOnOutsideClick);
    document.addEventListener('keydown', this._closeOnEscape);
    document.addEventListener('startpage:popup-open', this._closeOnOtherPopup);
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
    super.disconnectedCallback?.();
  }

  imports() {
    return [this.getIconResource("material"), this.getIconResource("tabler"), this.getFontResource("lato")];
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

      .weather-temperature-location {
          display: none;
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

      .weather-condition-icon.sunny {
          color: ${CONFIG.palette.yellow};
      }

      .weather-condition-icon.cloudy {
          color: ${CONFIG.palette.blue};
      }

      /* Weather popup */
      .weather-popup {
          position: absolute;
          bottom: calc(100% + 8px);
          right: 0;
          background: ${CONFIG.palette.mantle};
          border: 1px solid ${CONFIG.palette.surface1};
          border-radius: 8px;
          padding: 16px;
          width: 170px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
          z-index: 100;
          cursor: default;
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

      .weather-popup-icon.sunny {
          color: ${CONFIG.palette.yellow};
      }

      .weather-popup-icon.cloudy {
          color: ${CONFIG.palette.blue};
      }

      .weather-popup-icon.error {
          color: ${CONFIG.palette.subtext0};
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
          text-transform: capitalize;
          text-align: center;
      }

      .weather-popup-meta {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          width: 100%;
          border-top: 1px solid ${CONFIG.palette.surface1};
          padding-top: 8px;
          margin-top: 4px;
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
    return `
      <div class="weather-wrapper">
        <p class="weather-temperature">
            <span class="weather-icon"><i class="material-icons weather-condition-icon sunny">wb_sunny</i></span>
            <span class="weather-temperature-value">1</span>
            º<span class="weather-temperature-scale">${this.temperatureScale}</span>
            <span class="weather-description"></span>
        </p>

        <div class="weather-popup hidden">
          <div class="weather-popup-body">
            <i class="ti ti-sun weather-popup-icon sunny"></i>
            <div class="weather-popup-temp">
              <span class="weather-popup-temp-value">--</span>
              <span class="weather-popup-temp-scale">°${this.temperatureScale}</span>
            </div>
            <div class="weather-popup-condition"></div>
            <div class="weather-popup-meta">
              <span class="weather-popup-location-label">${window.i18n?.t('weather.popup.location') || 'Location'}</span>
              <span class="weather-popup-location-value">${this.location}</span>
            </div>
            <button class="weather-popup-toggle">${window.i18n?.t('weather.popup.toggle_scale') || '°C / °F'}</button>
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
    this.setTemperature();
  }

  /**
   * Converts a given temperature to the current active scale.
   */
  convertScale(temperature) {
    if (this.temperatureScale === "F") return this.toF(temperature);
    return temperature;
  }

  /**
   * Fetches the latest weather data and updates the UI.
   */
  async setWeather() {
    this.weather = await this.weatherForecast.getWeather();
    if (this.weather?.error) {
      // Inline widget error state
      this.refs.condition.textContent = "cloud_off";
      this.refs.condition.className = "material-icons weather-condition-icon cloudy";
      this.refs.temperature.textContent = "--";
      this.refs.scale.textContent = this.temperatureScale;

      const details = this.weather.message ? ` (${this.weather.message})` : "";
      this.refs.description.textContent = `${window.i18n?.t("weather.unavailable") || "Weather unavailable"}${
        window.i18n?.t("weather.unavailable_hint") ? ` ${window.i18n.t("weather.unavailable_hint")}` : ""
      }`;
      this.refs.description.title = `${window.i18n?.t("weather.error_details_summary") || "Technical details"}${details}`;

      // Popup error state
      const icon = this.shadow.querySelector('.weather-popup-icon');
      const val  = this.shadow.querySelector('.weather-popup-temp-value');
      const cond = this.shadow.querySelector('.weather-popup-condition');
      if (icon) icon.className = 'ti ti-cloud-off weather-popup-icon error';
      if (val)  val.textContent = '--';
      if (cond) cond.textContent = window.i18n?.t('weather.unavailable') || 'Weather unavailable';
      return;
    }

    this.setTemperature();
  }

  /**
   * Updates the DOM elements with the current weather data (inline + popup).
   */
  setTemperature() {
    const { temperature, condition, description } = this.weather;
    const { icon, color, tablerIcon } = this.getForecast(condition);

    // Inline widget
    this.refs.temperature.textContent = this.convertScale(temperature);
    this.refs.condition.textContent = icon;
    this.refs.scale.textContent = this.temperatureScale;
    this.refs.condition.className = "material-icons weather-condition-icon";
    this.refs.condition.classList.add(color);

    const weatherKey = `weather.conditions.${condition.toLowerCase()}`;
    const translatedCondition = window.i18n?.t(weatherKey);
    const displayCondition = translatedCondition && translatedCondition !== weatherKey ? translatedCondition : description;
    this.refs.description.textContent = `${this.location}: ${displayCondition}`;

    // Popup
    this._updatePopup({ temperature, tablerIcon, color, displayCondition });
  }

  _updatePopup({ temperature, tablerIcon, color, displayCondition }) {
    const icon = this.shadow.querySelector('.weather-popup-icon');
    const val  = this.shadow.querySelector('.weather-popup-temp-value');
    const scl  = this.shadow.querySelector('.weather-popup-temp-scale');
    const cond = this.shadow.querySelector('.weather-popup-condition');
    const loc  = this.shadow.querySelector('.weather-popup-location-value');

    if (icon) icon.className = `ti ${tablerIcon} weather-popup-icon ${color}`;
    if (val)  val.textContent  = this.convertScale(temperature);
    if (scl)  scl.textContent  = `°${this.temperatureScale}`;
    if (cond) cond.textContent = displayCondition;
    if (loc)  loc.textContent  = this.location;
  }

  /**
   * Finds the matching forecast configuration for a given condition string.
   */
  getForecast(condition) {
    for (const forecast of this.forecasts) {
      if (forecast.conditions.includes(condition)) return forecast;
    }
    return this.forecasts[0];
  }

  async connectedCallback() {
    await this.render();
    this.setEvents();
    await this.setWeather();
  }
}
