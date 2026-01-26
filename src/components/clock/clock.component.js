class Clock extends Component {
  refs = {
    clock: ".clock-time",
    icon: ".clock-icon",
  };

  constructor() {
    super();
    this.isExtended = false;
  }

  imports() {
    return [this.resources.icons.material, this.resources.fonts.roboto];
  }

  style() {
    return `
        .clock-time {
            white-space: nowrap;
            font: 300 9pt 'Lato', sans-serif;
            color: ${CONFIG.palette.text};
            letter-spacing: .5px;
            cursor: pointer;
        }

        .clock-icon {
            font-size: 10pt;
            margin-right: 10px;
            cursor: pointer;
            transition: color 0.2s ease;
        }

        .clock-icon:hover {
            color: ${CONFIG.palette.text};
        }
    `;
  }

  template() {
    return `
        <span class="material-icons clock-icon">schedule</span>
        <p class="clock-time"></p>
    `;
  }

  setIconColor() {
    this.refs.icon.style.color = CONFIG.palette.maroon;
  }

  setTime() {
    const date = new Date();
    const lang = "es-ES";
    if (this.isExtended) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      this.refs.clock.textContent = new Intl.DateTimeFormat(lang, options).format(date);
    } else {
      const options = { hour: "numeric", minute: "numeric", hour12: true };
      this.refs.clock.textContent = new Intl.DateTimeFormat(lang, options).format(date);
    }
  }

  showExtended() {
    this.isExtended = true;
    this.setTime();
  }

  showCompact() {
    this.isExtended = false;
    this.setTime();
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();
      this.setIconColor();

      // Add hover event listeners
      this.refs.clock.addEventListener("mouseenter", () => this.showExtended());
      this.refs.clock.addEventListener("mouseleave", () => this.showCompact());
      this.refs.icon.addEventListener("mouseenter", () => this.showExtended());
      this.refs.icon.addEventListener("mouseleave", () => this.showCompact());

      setInterval(() => this.setTime(), 1000);
    });
  }
}
