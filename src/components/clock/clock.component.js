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
            transition: color 0.2s ease;
        }

        .clock-time:hover {
            color: ${CONFIG.palette.maroon};
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
      this.refs.clock = date.toLocaleString("es-CO", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    } else {
      this.refs.clock = date.toLocaleString("es-CO", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
    }
  }

  toggleView() {
    this.isExtended = !this.isExtended;
    this.setTime();
  }

  connectedCallback() {
    this.render().then(() => {
      this.setTime();
      this.setIconColor();

      // Add click event listener to toggle view
      this.refs.clock.addEventListener("click", () => this.toggleView());
      this.refs.icon.addEventListener("click", () => this.toggleView());

      setInterval(() => this.setTime(), 1000);
    });
  }
}
