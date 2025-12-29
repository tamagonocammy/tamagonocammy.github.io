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
            font: 300 9pt 'Roboto', sans-serif;
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
    if (this.isExtended) {
      this.refs.clock.textContent = date.strftime(CONFIG.clock.format_extended);
    } else {
      this.refs.clock.textContent = date.strftime(CONFIG.clock.format);
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
