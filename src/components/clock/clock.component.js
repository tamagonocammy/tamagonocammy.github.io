// Clock component for displaying main time and additional timezone clocks
class Clock extends Component {
  // References to DOM elements for the clock component
  refs = {
    clockContainer: ".clock-container",
    icon: ".clock-icon",
    mainClockTime: "#main-clock .clock-time",
  };

  calendarOpen = false;
  calendarViewDate = new Date();
  _closeOnOutsideClick = null;
  _closeOnEscape = null;

  /**
   * Initialise the clock component
   */
  constructor() {
    super();
  }

  /**
   * Set up click event handler to open/close calendar popup
   */
  setEvents() {
    const wrapper = this.shadow.querySelector('.clock-wrapper');
    wrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleCalendar();
    });

    const prevBtn = this.shadow.querySelector('.cal-prev');
    const nextBtn = this.shadow.querySelector('.cal-next');
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateMonth(-1);
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.navigateMonth(1);
    });

    this._closeOnOutsideClick = (e) => {
      if (!e.composedPath().includes(this)) this.closeCalendar();
    };
    this._closeOnEscape = (e) => {
      if (e.key === 'Escape') this.closeCalendar();
    };

    document.addEventListener('click', this._closeOnOutsideClick);
    document.addEventListener('keydown', this._closeOnEscape);
  }

  toggleCalendar() {
    this.calendarOpen ? this.closeCalendar() : this.openCalendar();
  }

  openCalendar() {
    this.calendarViewDate = new Date();
    this.calendarOpen = true;
    const popup = this.shadow.querySelector('.calendar-popup');
    if (popup) {
      popup.classList.remove('hidden');
      this.updateCalendar();
    }
  }

  closeCalendar() {
    this.calendarOpen = false;
    const popup = this.shadow.querySelector('.calendar-popup');
    if (popup) popup.classList.add('hidden');
  }

  navigateMonth(delta) {
    const container = this.shadow.querySelector('.cal-grid-container');
    if (container) {
      container.classList.remove('anim-next', 'anim-prev');
      void container.offsetWidth; // force reflow to restart animation
      container.classList.add(delta > 0 ? 'anim-next' : 'anim-prev');
    }
    const d = this.calendarViewDate;
    this.calendarViewDate = new Date(d.getFullYear(), d.getMonth() + delta, 1);
    this.updateCalendar();
  }

  updateCalendar() {
    const year = this.calendarViewDate.getFullYear();
    const month = this.calendarViewDate.getMonth();

    const months = window.i18n.getMonths(false);
    const days = window.i18n.getDays(true);
    const today = new Date();

    const header = this.shadow.querySelector('.cal-month-year');
    if (header) {
      const monthName = months[month].charAt(0).toUpperCase() + months[month].slice(1);
      header.textContent = `${monthName} ${year}`;
    }

    const container = this.shadow.querySelector('.cal-grid-container');
    if (!container) return;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '<div class="cal-grid">';

    days.forEach(d => {
      html += `<div class="cal-day-header">${d}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
      html += '<div class="cal-day empty"></div>';
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const isToday =
        d === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();
      html += `<div class="cal-day${isToday ? ' today' : ''}">${d}</div>`;
    }

    html += '</div>';
    container.innerHTML = html;
  }

  disconnectedCallback() {
    if (this._closeOnOutsideClick) {
      document.removeEventListener('click', this._closeOnOutsideClick);
    }
    if (this._closeOnEscape) {
      document.removeEventListener('keydown', this._closeOnEscape);
    }
    super.disconnectedCallback?.();
  }

  /**
   * Import required fonts and icons for the clock display
   * @returns {Array<string>} Array of resource imports
   */
  imports() {
    return [this.getIconResource('material'), this.getFontResource('lato')];
  }

  /**
   * Define the style for the clock component using the current palette
   * @returns {string} CSS styles for the clock component
   */
  style() {
    return `
        .clock-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
            height: 100%;
            min-height: 32px;
        }

        .clock-time {
            white-space: nowrap;
            font: 700 9pt 'Lato', sans-serif;
            color: ${CONFIG.palette.text};
            letter-spacing: .5px;
            margin: 0;
        }

        .clock-date {
            white-space: nowrap;
            font: 300 9pt 'Lato', sans-serif;
            color: ${CONFIG.palette.text};
            letter-spacing: .5px;
            margin: 0;
        }

        .clock-label {
            font: 300 9pt 'Lato', sans-serif;
            color: ${CONFIG.palette.text};
            margin-right: 2px;
            letter-spacing: .5px;
            white-space: nowrap;
        }

        .clock-wrapper {
            display: flex;
            align-items: center;
            position: relative;
            height: 100%;
            cursor: pointer;
        }

        .clock-icon {
            font-size: 10pt;
            margin-right: 5px;
            transform: translateY(-0.5px);
        }

        .clock-item {
            display: flex;
            align-items: center;
            height: 100%;
        }

        /* Calendar popup */
        .calendar-popup {
            position: absolute;
            bottom: calc(100% + 8px);
            right: 0;
            background: ${CONFIG.palette.mantle};
            border: 1px solid ${CONFIG.palette.surface1};
            border-radius: 8px;
            padding: 12px;
            width: 210px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35);
            z-index: 100;
        }

        .calendar-popup.hidden {
            display: none;
        }

        .cal-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
        }

        .cal-month-year {
            font: 600 9pt 'Lato', sans-serif;
            color: ${CONFIG.palette.text};
        }

        .cal-nav {
            background: none;
            border: none;
            color: ${CONFIG.palette.subtext0};
            cursor: pointer;
            font-size: 15px;
            padding: 0 5px;
            border-radius: 4px;
            line-height: 1;
        }

        .cal-nav:hover {
            background: ${CONFIG.palette.surface1};
            color: ${CONFIG.palette.text};
        }

        .cal-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 2px;
        }

        .cal-day-header {
            font: 600 7pt 'Lato', sans-serif;
            color: ${CONFIG.palette.subtext0};
            text-align: center;
            padding: 2px 0 5px;
            text-transform: uppercase;
        }

        .cal-day {
            font: 400 8pt 'Lato', sans-serif;
            color: ${CONFIG.palette.text};
            text-align: center;
            padding: 3px 1px;
            border-radius: 50%;
            cursor: default;
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cal-day.empty {
            visibility: hidden;
        }

        .cal-day.today {
            background: ${CONFIG.palette.mauve};
            color: ${CONFIG.palette.base};
            font-weight: 700;
        }

        @keyframes cal-slide-from-right {
            from { opacity: 0; transform: translateX(10px); }
            to   { opacity: 1; transform: translateX(0); }
        }

        @keyframes cal-slide-from-left {
            from { opacity: 0; transform: translateX(-10px); }
            to   { opacity: 1; transform: translateX(0); }
        }

        .cal-grid-container.anim-next {
            animation: cal-slide-from-right 0.18s ease;
        }

        .cal-grid-container.anim-prev {
            animation: cal-slide-from-left 0.18s ease;
        }
    `;
  }

  /**
   * Render the clock icon and time template
   * @returns {string} HTML template for the clock component
   */
  template() {
    return `
        <div class="clock-container">
            <div class="clock-wrapper">
                <span class="material-icons clock-icon">schedule</span>
                <div id="main-clock" class="clock-item">
                    <span class="clock-date"></span>
                    <p class="clock-time"></p>
                </div>
                <div class="calendar-popup hidden">
                    <div class="cal-header">
                        <button class="cal-nav cal-prev" aria-label="${window.i18n?.t('calendar.prev') || 'Previous month'}">&#8249;</button>
                        <span class="cal-month-year"></span>
                        <button class="cal-nav cal-next" aria-label="${window.i18n?.t('calendar.next') || 'Next month'}">&#8250;</button>
                    </div>
                    <div class="cal-grid-container"></div>
                </div>
            </div>
            ${this.renderAdditionalClocks()}
        </div>
    `;
  }

  /**
   * Render additional clocks if configured
   * @returns {string} HTML for additional timezone clocks
   */
  renderAdditionalClocks() {
    if (!CONFIG.additionalClocks || !CONFIG.additionalClocks.length) {
      return '';
    }

    return CONFIG.additionalClocks.map((clock, index) => {
      return `
        <div class="clock-wrapper">
            <span class="material-icons clock-icon additional-icon-${index}">public</span>
            <div id="additional-clock-${index}" class="clock-item">
                <span class="clock-label">${clock.label || clock.timezone}</span>
                <p class="clock-time"></p>
            </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Set the icon colour based on the configuration
   * @returns {void}
   */
  setIconColor() {
    if (this.shadow) {
      const mainIcon = this.shadow.querySelector('.clock-icon:not([class*="additional-icon"])');
      if (mainIcon) {
        mainIcon.style.color = CONFIG.clock.icon_color;
      }

      // Set colours for additional clock icons if they exist
      if (CONFIG.additionalClocks && CONFIG.additionalClocks.length) {
        CONFIG.additionalClocks.forEach((clock, index) => {
          const additionalIcon = this.shadow.querySelector(`.additional-icon-${index}`);
          if (additionalIcon) {
            additionalIcon.style.color = clock.icon_color || CONFIG.clock.icon_color;
          }
        });
      }
    }
  }

  /**
   * Update the displayed time using the configured format
   * @returns {void}
   */
  setTime() {
    if (this.shadow) {
      const mainClockElement = this.shadow.querySelector('#main-clock .clock-time');
      const dateElement = this.shadow.querySelector('#main-clock .clock-date');
      const date = new Date();
      const localizedFormat = window.i18n?.getTimeFormat(false);
      const defaultFormat = localizedFormat || CONFIG.clock.format || "H:i";

      if (mainClockElement && dateElement) {
        dateElement.style.display = 'none';
        mainClockElement.textContent = date.strftime(defaultFormat, CONFIG.clock.locale);
      }

      // Update additional clocks if they exist
      if (CONFIG.additionalClocks && CONFIG.additionalClocks.length) {
        CONFIG.additionalClocks.forEach((clock, index) => {
          const clockElement = this.shadow.querySelector(`#additional-clock-${index} .clock-time`);
          if (clockElement) {
            let timezoneDate;

            if (clock.timezone) {
              timezoneDate = Date.createWithTimezone(clock.timezone);
            } else if (clock.timezoneOffset !== undefined) {
              timezoneDate = Date.createWithTimezoneOffset(clock.timezoneOffset);
            } else {
              timezoneDate = new Date();
            }

            clockElement.textContent = timezoneDate.strftime(clock.format || defaultFormat, clock.locale || CONFIG.clock.locale);
          }
        });
      }
    }
  }

  /**
   * Initialise the clock and update every second
   * @returns {void}
   */
  connectedCallback() {
    this.render().then(() => {
      setTimeout(() => {
        this.setEvents();
        this.setTime();
        this.setIconColor();
        setInterval(() => this.setTime(), 1000);
      }, 100);
    });
  }
}
