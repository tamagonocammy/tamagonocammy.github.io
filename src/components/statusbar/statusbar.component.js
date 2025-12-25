class Statusbar extends Component {
  externalRefs = {};

  refs = {
    categories: ".categories ul",
    tabs: "#tabs ul li",
    indicator: ".indicator",
    fastlink: ".fastlink",
  };

  currentTabIndex = 0;
  searchEngine = "google"; // "google" or "perplexity"

  constructor() {
    super();

    this.setDependencies();
  }

  setDependencies() {
    this.externalRefs = {
      categories: this.parentNode.querySelectorAll(this.refs.categories),
    };
  }

  imports() {
    return [
      this.resources.fonts.roboto,
      this.resources.icons.material,
      this.resources.icons.tabler,
      this.resources.libs.awoo,
    ];
  }

  style() {
    return `
      *:not(:defined) { display: none; }

      #tabs,
      #tabs .widgets,
      #tabs ul li:last-child {
          position: absolute;
      }

      #tabs {
          width: 100%;
          height: 100%;
      }

      #tabs ul {
          counter-reset: tabs;
          height: 100%;
          position: relative;
          list-style: none;
          margin-left: 1em;
      }

      #tabs ul li:not(:last-child)::after {
          content: counter(tabs, cjk-ideographic);
          counter-increment: tabs;
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
          align-items: center;
          text-align: center;
          justify-content: center;
      }

      #tabs ul li:not(:last-child) {
          width: 35px;
          text-align: center;
          font: 700 13px 'Yu Gothic', serif;
          color: ${CONFIG.palette.text};
          padding: 6px 0;
          transition: all .1s;
          cursor: pointer;
          line-height: 0;
          height: 100%;
      }

      #tabs ul li:not(:last-child):hover {
          background: ${CONFIG.palette.surface0};
      }

      #tabs ul li:last-child {
          --flavour: var(--accent);
          width: 35px;
          height: 3px;
          background: var(--flavour);
          bottom: 0;
          transition: all .3s;
      }

      #tabs ul li[active]:not(:last-child) {
          color: ${CONFIG.palette.text};
          font-size: 13px;
          padding: 6px 0;
      }

      #tabs ul li[active]:nth-child(2) ~ li:last-child { margin: 0 0 0 35px; }
      #tabs ul li[active]:nth-child(3) ~ li:last-child { margin: 0 0 0 70px; }
      #tabs ul li[active]:nth-child(4) ~ li:last-child { margin: 0 0 0 105px; }
      #tabs ul li[active]:nth-child(5) ~ li:last-child { margin: 0 0 0 140px; }

      #tabs ul li[active]:nth-child(1) ~ li:last-child {
          --flavour: ${CONFIG.palette.green};
      }

      #tabs ul li[active]:nth-child(2) ~ li:last-child {
          --flavour: ${CONFIG.palette.peach};
      }

      #tabs ul li[active]:nth-child(3) ~ li:last-child {
          --flavour: ${CONFIG.palette.red};
      }

      #tabs ul li[active]:nth-child(4) ~ li:last-child {
          --flavour: ${CONFIG.palette.blue};
      }

      #tabs ul li[active]:nth-child(5) ~ li:last-child {
          --flavour: ${CONFIG.palette.mauve};
      }

      .widgets {
          right: 0;
          margin: auto;
          height: 32px;
          color: #fff;
          font-size: 12px;
      }

      .widgets:hover .edit {
          margin: 0;
      }

      .widget {
          position: relative;
          height: 100%;
          padding: 0 1em;
      }

      .widget:first-child {
          padding-left: 2em;
      }

      .widget:last-child {
          padding-right: 2em;
      }

      .widget:hover {
          cursor: pointer;
          background: rgba(255, 255, 255, .05);
      }

      #tabs > cols {
          position: relative;
          grid-template-columns: [chat-tab] 35px [tabs] auto [widgets] auto;
      }

      #tabs .time span {
          font-weight: 400;
      }

      #tabs i {
          font-size: 14pt !important;
      }

      .widget:not(:first-child)::before {
          content: '';
          position: absolute;
          display: block;
          left: 0;
          height: calc(100% - 15px);
          width: 1px;
          background: rgb(255 255 255 / 10%);
      }

      .fastlink {
          border: 0;
          background: ${CONFIG.palette.mantle};
          color: ${CONFIG.palette.green};
          cursor: pointer;
          border-radius: 5px 15px 15px 5px;
      }

      .fastlink:hover {
          filter: brightness(1.2);
      }

      .fastlink-icon {
        width: 70%;
      }
      .search-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(10px);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;  // Increased z-index
        pointer-events: none;  // Only capture events when active
    }

        .search-overlay.active {
            display: flex;
        }

        .search-modal {
            position: relative;
            width: 600px;
            padding: 20px;
            background: ${CONFIG.palette.base};
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .search-input {
            width: 100%;
            padding: 16px 45px 16px 45px;
            background: ${CONFIG.palette.mantle};
            color: ${CONFIG.palette.text};
            border: 2px solid ${CONFIG.palette.surface0};
            border-radius: 12px;
            font-family: 'Fira Sans', sans-serif;
            font-size: 18px;
            transition: all 0.3s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: ${CONFIG.palette.green};
            background: ${CONFIG.palette.surface0};
        }

        .search-icon {
            position: absolute;
            right: 35px;
            top: 50%;
            transform: translateY(-50%);
            color: ${CONFIG.palette.overlay0};
            font-size: 20px;
        }

        .search-engine-icon {
            position: absolute;
            left: 35px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
            transition: color 0.3s ease;
        }

        .search-engine-icon.google {
            color: ${CONFIG.palette.blue};
        }

        .search-engine-icon.perplexity {
            color: ${CONFIG.palette.mauve};
        }

        .search-engine-indicator {
            margin-top: 10px;
            text-align: center;
            font-size: 12px;
            color: ${CONFIG.palette.overlay1};
            font-weight: 300;
        }
    `;
  }

  template() {
    return `
        <div id="tabs">
            <cols>
                <button class="+ fastlink" id="search-trigger">
                    <img class="fastlink-icon" src="src/img/favicon.png"/>
                </button>
                <ul class="- indicator"></ul>
                <div class="+ widgets col-end">
                    <current-time class="+ widget"></current-time>
                    <weather-forecast class="+ widget weather"></weather-forecast>
                </div>
            </cols>
        </div>

        <!-- Search overlay outside the tabs div -->
        <div class="search-overlay">
            <div class="search-modal">
                <i class="ti ti-brand-google search-engine-icon google"></i>
                <input type="text" class="search-input" placeholder="Search Google..."/>
                <i class="ti ti-search search-icon"></i>
            </div>
        </div>`;
  }

  setEvents() {
    // Your existing tab handlers
    this.refs.tabs.forEach((tab) => (tab.onclick = ({ target }) => this.handleTabChange(target)));

    document.onkeydown = (e) => this.handleKeyPress(e);
    document.onwheel = (e) => this.handleWheelScroll(e);

    // Replace the fastlink click handler with our new search overlay logic
    const searchTrigger = this.shadow.querySelector("#search-trigger");
    const searchOverlay = this.shadow.querySelector(".search-overlay");
    const searchInput = this.shadow.querySelector(".search-input");
    const engineIcon = this.shadow.querySelector(".search-engine-icon");

    // Update placeholder and icon based on current engine
    const updateSearchEngine = () => {
      if (this.searchEngine === "google") {
        searchInput.placeholder = "Search Google...";
        engineIcon.className = "ti ti-brand-google search-engine-icon google";
      } else {
        searchInput.placeholder = "Ask Perplexity...";
        engineIcon.className = "ti ti-sparkles search-engine-icon perplexity";
      }
    };

    // Open search overlay when icon is clicked
    searchTrigger.onclick = () => {
      searchOverlay.classList.add("active");
      searchInput.focus();
    };

    // Close overlay when clicking outside
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        searchOverlay.classList.remove("active");
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchOverlay.classList.contains("active")) {
        searchOverlay.classList.remove("active");
      }
    });

    // Handle Tab key to toggle search engine
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        this.searchEngine = this.searchEngine === "google" ? "perplexity" : "google";
        updateSearchEngine();
      }
    });

    // Handle search
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
          if (this.searchEngine === "google") {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          } else {
            window.location.href = `https://www.perplexity.ai/search?q=${encodeURIComponent(query)}`;
          }
        }
      }
    });

    // Optional: Keyboard shortcut to open search (press '/')
    document.addEventListener("keydown", (e) => {
      if (e.key === "/" && !searchOverlay.classList.contains("active")) {
        e.preventDefault();
        searchOverlay.classList.add("active");
        searchInput.focus();
      }
    });

    // Keep your last visited tab logic
    if (CONFIG.openLastVisitedTab) {
      window.onbeforeunload = () => this.saveCurrentTab();
    }
  }

  saveCurrentTab() {
    localStorage.lastVisitedTab = this.currentTabIndex;
  }

  openLastVisitedTab() {
    if (!CONFIG.openLastVisitedTab) return;
    this.activateByKey(localStorage.lastVisitedTab);
  }

  handleTabChange(tab) {
    this.activateByKey(Number(tab.getAttribute("tab-index")));
  }

  handleWheelScroll(event) {
    if (!event) return;

    let { target, wheelDelta } = event;

    if (target.shadow && target.shadow.activeElement) return;

    let activeTab = -1;
    this.refs.tabs.forEach((tab, index) => {
      if (tab.getAttribute("active") === "") {
        activeTab = index;
      }
    });

    if (wheelDelta > 0) {
      this.activateByKey((activeTab + 1) % (this.refs.tabs.length - 1));
    } else {
      this.activateByKey(activeTab - 1 < 0 ? this.refs.tabs.length - 2 : activeTab - 1);
    }
  }

  handleKeyPress(event) {
    if (!event) return;

    let { target, key } = event;

    if (target.shadow && target.shadow.activeElement) return;

    if (Number.isInteger(parseInt(key)) && key <= this.externalRefs.categories.length) {
      this.activateByKey(key - 1);
    }
  }

  activateByKey(key) {
    if (key < 0) return;
    this.currentTabIndex = key;

    this.activate(this.refs.tabs, this.refs.tabs[key]);
    this.activate(this.externalRefs.categories, this.externalRefs.categories[key]);
  }

  createTabs() {
    const categoriesCount = this.externalRefs.categories.length;

    for (let i = 0; i <= categoriesCount; i++) {
      this.refs.indicator.innerHTML += `<li tab-index=${i} ${i == 0 ? "active" : ""}></li>`;
    }
  }

  activate(target, item) {
    target.forEach((i) => i.removeAttribute("active"));
    item.setAttribute("active", "");
  }

  connectedCallback() {
    this.render().then(() => {
      this.createTabs();
      this.setEvents();
      this.openLastVisitedTab();
    });
  }
}
