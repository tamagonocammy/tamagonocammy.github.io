class Statusbar extends Component {
  externalRefs = {};

  refs = {
    categories: ".categories ul",
    tabs: "#tabs ul li",
    indicator: ".indicator",
    fastlink: ".fastlink",
  };

  currentTabIndex = 0;
  searchEngine = "duckduckgo"; // "duckduckgo" or "gemini"
  quickActionIndex = null; // armed Gemini quick action, if any

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
      this.getFontResource("lato"),
      this.getIconResource("material"),
      this.getIconResource("tabler"),
      this.getLibraryResource("awoo"),
    ];
  }

  style() {
    let tabStyles = "";
    CONFIG.tabs.forEach((tab, index) => {
      const i = index + 1;
      tabStyles += `
      #tabs ul li:nth-child(${i})[active]:not(:last-child)::after {
          color: ${tab.color};
      }

      #tabs ul li[active]:nth-child(${i}) ~ li:last-child {
          transform: translateX(${index * 35}px);
          --flavour: ${tab.color};
      }
      `;
    });

    return `
      ${tabStyles}

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
          counter-increment: tabs;
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
          align-items: center;
          text-align: center;
          justify-content: center;
          font-family: 'tabler-icons' !important;
          transition: color .25s ease, transform .3s var(--ease-spring);
      }

      #tabs ul li:not(:last-child):hover::after {
          transform: translateY(-2px);
      }

      #tabs ul li[active]:not(:last-child)::after {
          animation: tab-icon-pop .4s var(--ease-spring);
      }

      @keyframes tab-icon-pop {
          40% { transform: scale(1.25); }
      }

      #tabs ul li:nth-child(1):not(:last-child)::after {
          content: "\\ea9c";  /* ti-home icon */
      }

      #tabs ul li:nth-child(2):not(:last-child)::after {
          content: "\\ea77";  /* ti-code icon */
      }

      #tabs ul li:nth-child(3):not(:last-child)::after {
          content: "\\ea8d";  /* ti-device-tv icon */
      }

      #tabs ul li:not(:last-child) {
          width: 35px;
          text-align: center;
          font: 700 13px 'Yu Gothic', serif;
          color: ${CONFIG.palette.text};
          padding: 6px 0;
          transition: background-color .2s ease;
          cursor: pointer;
          line-height: 0;
          height: 100%;
      }

      #tabs ul li:not(:last-child):hover {
          background: ${CONFIG.palette.surface0};
      }

      /* Dynamic icon colors handled above */

      #tabs ul li:last-child {
          --flavour: var(--accent);
          width: 35px;
          height: 3px;
          background: var(--flavour);
          bottom: 0;
          border-radius: 3px 3px 0 0;
          transition: transform .45s var(--ease-spring), background-color .3s ease;
      }

      #tabs ul li[active]:not(:last-child) {
          color: ${CONFIG.palette.text};
          font-size: 13px;
          padding: 6px 0;
      }

      /* Dynamic margin handled above */

      /* Dynamic flavour colors handled above */

      .widgets {
          right: 0;
          margin: auto;
          height: 32px;
          color: ${CONFIG.palette.text};
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

      .widget {
          transition: background-color .2s ease;
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

      /* While nothing plays, the now-playing widget is hidden and shouldn't leave a divider or gap.
         (Hidden from here: the "+" layout class outranks the component's own :host rule) */
      now-playing:not([active]) {
          display: none !important;
      }

      now-playing:not([active]) + .widget {
          padding-left: 2em;
      }

      now-playing:not([active]) + .widget::before {
          display: none;
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
          transition: filter .2s ease;
      }

      .fastlink:hover {
          filter: brightness(1.2);
      }

      .fastlink-icon {
        width: 70%;
        transition: transform .35s var(--ease-spring);
      }

      .fastlink:hover .fastlink-icon {
          transform: scale(1.1) rotate(-8deg);
      }

      .fastlink:active .fastlink-icon {
          transform: scale(.9);
          transition-duration: .08s;
      }
      .search-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(15px);
      background: ${CONFIG.palette.crust}4D;
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      pointer-events: none;
      transition: backdrop-filter 0.5s ease, background 0.5s ease, opacity 0.3s ease;
  }

      .search-overlay.results-showing {
          background: ${CONFIG.palette.crust}33;
          backdrop-filter: blur(20px);
      }

      .search-overlay.closing {
          backdrop-filter: blur(0px);
          background: ${CONFIG.palette.crust}00;
          opacity: 0;
      }

        .search-overlay.active {
            display: flex;
            pointer-events: all;
            animation: overlay-in .35s var(--ease-out) backwards;
        }

        @keyframes overlay-in {
            from {
                opacity: 0;
                backdrop-filter: blur(0px);
            }
        }

        /* "backwards" hands control back to the transitions (loading, expand, close) once done */
        .search-overlay.active .search-modal {
            animation: modal-in .45s var(--ease-spring) backwards;
        }

        @keyframes modal-in {
            from {
                opacity: 0;
                transform: translateY(-12px) scale(.94);
            }
        }

        .search-modal {
            position: relative;
            width: 600px;
            max-width: 90vw;
            background: ${CONFIG.palette.base};
            border-radius: 16px;
            box-shadow: 0 10px 30px ${CONFIG.palette.crust}4D;
            transition: all 0.5s var(--ease-in-out);
            overflow: hidden;
        }

        .search-modal.loading {
            width: 80px;
            height: 80px;
            border-radius: 50%;
        }

        .search-modal.expanded {
            width: 1200px;
            max-width: 90vw;
        }

        .search-modal.collapsing {
            width: 0px;
            height: 0px;
            border-radius: 50%;
            opacity: 0;
            transform: scale(0);
        }

        .search-modal.search-closing {
            opacity: 0;
            transform: scale(0.5);
        }

        .search-header {
            padding: 20px;
            position: relative;
            transition: opacity 0.3s ease, max-height 0.3s ease, padding 0.3s ease, transform 0.3s ease;
            overflow: hidden;
        }

        .search-header.hidden {
            opacity: 0;
            max-height: 0;
            padding: 0 20px;
            transform: scale(0.8);
        }

        .loading-icon {
            display: none;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 80px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .loading-icon.active {
            display: flex;
            opacity: 1;
        }

        .loading-icon i {
            font-size: 40px;
            color: ${CONFIG.palette.mauve};
            animation: pulse 1.6s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 0.6;
                transform: scale(1) rotate(-8deg);
            }
            50% {
                opacity: 1;
                transform: scale(1.15) rotate(8deg);
            }
        }

        .search-input {
            width: 100%;
            padding: 16px 45px 16px 45px;
            background: ${CONFIG.palette.mantle};
            color: ${CONFIG.palette.text};
            border: 2px solid ${CONFIG.palette.surface0};
            border-radius: 12px;
            font-family: 'Lato', sans-serif;
            font-size: 18px;
            transition: border-color .25s ease, background-color .25s ease, box-shadow .25s ease;
        }

        .search-input:focus {
            outline: none;
            border-color: ${CONFIG.palette.green};
            background: ${CONFIG.palette.surface0};
            box-shadow: 0 0 0 4px ${CONFIG.palette.green}26;
        }

        /* Icons are centered on the input itself, not the whole header (which grows with hint and actions) */
        .search-field {
            position: relative;
        }

        .search-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: ${CONFIG.palette.overlay0};
            font-size: 20px;
        }

        .search-engine-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 20px;
            transition: color 0.3s ease;
        }

        /* Two keyframe names so swapping engines (Tab) restarts the pop */
        .search-engine-icon.duckduckgo {
            color: ${CONFIG.palette.peach};
            animation: engine-pop-a .4s var(--ease-spring);
        }

        .search-engine-icon.gemini {
            color: ${CONFIG.palette.mauve};
            animation: engine-pop-b .4s var(--ease-spring);
        }

        @keyframes engine-pop-a {
            from { opacity: 0; transform: translateY(-50%) scale(.4) rotate(-90deg); }
        }

        .search-engine-icon.prefix {
            animation: engine-pop-a .4s var(--ease-spring);
        }

        .model-note a {
            color: ${CONFIG.palette.blue};
            text-decoration: none;
        }

        .model-note a:hover {
            text-decoration: underline;
        }

        @keyframes engine-pop-b {
            from { opacity: 0; transform: translateY(-50%) scale(.4) rotate(90deg); }
        }

        .search-engine-indicator {
            margin-top: 10px;
            text-align: center;
            font-size: 12px;
            color: ${CONFIG.palette.overlay1};
            font-weight: 300;
        }

        .search-results {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s var(--ease-out), opacity 0.3s ease;
            border-top: 0px solid ${CONFIG.palette.surface1};
            opacity: 0;
        }

        .search-results.active {
            max-height: 70vh;
            overflow-y: auto;
            border-radius: 0 0 16px 16px;
            opacity: 1;
        }

        .search-results.closing {
            max-height: 0;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.2s ease;
        }

        .results-header {
            padding: 20px 20px 10px 20px;
            background: ${CONFIG.palette.surface0};
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: sticky;
            top: 0;
            z-index: 10;
            border-radius: 16px 16px 0 0;
        }

        .results-title {
            font-size: 16px;
            font-weight: 600;
            color: ${CONFIG.palette.text};
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .results-title i {
            color: ${CONFIG.palette.mauve};
            font-size: 18px;
        }

        .results-content {
            padding: 20px;
            color: ${CONFIG.palette.text};
            font-family: 'Lato', sans-serif;
            line-height: 1.6;
        }

        .search-results::-webkit-scrollbar {
            width: 8px;
        }

        .search-results::-webkit-scrollbar-track {
            background: ${CONFIG.palette.surface0};
        }

        .search-results::-webkit-scrollbar-thumb {
            background: ${CONFIG.palette.surface2};
            border-radius: 4px;
        }

        .search-results::-webkit-scrollbar-thumb:hover {
            background: ${CONFIG.palette.overlay0};
        }

        .loading-spinner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            gap: 20px;
        }

        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid ${CONFIG.palette.surface2};
            border-top: 4px solid ${CONFIG.palette.mauve};
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .loading-text {
            color: ${CONFIG.palette.overlay1};
            font-size: 16px;
        }

        .error-message {
            padding: 20px;
            background: ${CONFIG.palette.surface0};
            border-left: 4px solid ${CONFIG.palette.red};
            border-radius: 8px;
            color: ${CONFIG.palette.text};
        }

        .model-note {
            margin-top: 16px;
            padding: 8px 12px;
            font-size: 13px;
            color: ${CONFIG.palette.subtext0};
            border-left: 3px solid ${CONFIG.palette.overlay0};
        }

        .error-message h3 {
            margin: 0 0 10px 0;
            color: ${CONFIG.palette.red};
        }

        .gemini-response {
            font-size: 16px;
            user-select: text;
            -webkit-user-select: text;
            cursor: text;
        }

        .gemini-response * {
            user-select: text;
            -webkit-user-select: text;
        }

        .gemini-response ul {
            list-style-type: disc;
            margin: 1em 0;
            padding-left: 2em;
        }

        .gemini-response ol {
            list-style-type: decimal;
            margin: 1em 0;
            padding-left: 2em;
        }

        .gemini-response li {
            display: list-item;
            margin: 0.5em 0;
        }

        .gemini-response ::selection {
            background: ${CONFIG.palette.surface2};
            color: ${CONFIG.palette.text};
        }

        .gemini-response h1,
        .gemini-response h2,
        .gemini-response h3 {
            color: ${CONFIG.palette.mauve};
            margin-top: 1.5em;
            margin-bottom: 0.5em;
        }

        .gemini-response h1 {
            font-size: 1.8em;
        }

        .gemini-response h2 {
            font-size: 1.5em;
        }

        .gemini-response h3 {
            font-size: 1.2em;
        }

        .gemini-response p {
            margin: 1em 0;
        }

        .gemini-response code {
            background: ${CONFIG.palette.surface0};
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'Fira Code', monospace;
            color: ${CONFIG.palette.peach};
        }

        .gemini-response pre {
            background: ${CONFIG.palette.surface0};
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            border-left: 4px solid ${CONFIG.palette.mauve};
        }

        .gemini-response pre code {
            background: none;
            padding: 0;
        }

        .gemini-response ul,
        .gemini-response ol {
            margin: 1em 0;
            padding-left: 2em;
        }

        .gemini-response li {
            margin: 0.5em 0;
        }

        .gemini-response a {
            color: ${CONFIG.palette.blue};
            text-decoration: none;
        }

        .gemini-response a:hover {
            text-decoration: underline;
        }

        .gemini-response blockquote {
            border-left: 4px solid ${CONFIG.palette.surface2};
            padding-left: 1em;
            margin: 1em 0;
            color: ${CONFIG.palette.overlay1};
            font-style: italic;
        }

        .gemini-response table.gemini-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
            font-size: 0.95em;
        }

        .gemini-response .gemini-table th,
        .gemini-response .gemini-table td {
            border: 1px solid ${CONFIG.palette.surface2};
            padding: 8px 12px;
            text-align: left;
        }

        .gemini-response .gemini-table th {
            background: ${CONFIG.palette.surface1};
            color: ${CONFIG.palette.mauve};
            font-weight: 600;
        }

        .gemini-response .gemini-table tr:nth-child(even) {
            background: ${CONFIG.palette.surface0};
        }

        .gemini-response .gemini-table tbody tr:hover {
            background: ${CONFIG.palette.surface1};
        }

        .gemini-response img.gemini-img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 0.5em 0;
            display: block;
        }

        .gemini-response del {
            color: ${CONFIG.palette.overlay1};
            text-decoration: line-through;
        }

        .api-key-notice {
            background: ${CONFIG.palette.yellow};
            color: ${CONFIG.palette.base};
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 500;
        }

        .api-key-notice a {
            color: ${CONFIG.palette.base};
            text-decoration: underline;
        }

        /* Status bar stays above the search overlay */
        #tabs {
            position: relative;
            z-index: 10001;
        }

        /* AI window snaps to main panel dimensions */
        .search-modal.panel-mode {
            position: fixed;
            max-width: none;
            border-radius: 5px 0 0 5px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, .2);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Results fill the full panel height */
        .search-modal.panel-mode .search-results.active {
            max-height: none;
            flex: 1;
        }

        /* Collapse animation while keeping fixed positioning */
        .search-modal.panel-mode.collapsing {
            width: 0 !important;
            height: 0 !important;
            opacity: 0;
            transform: scale(0);
            border-radius: 50% !important;
        }

        /* Line under the input: where a !prefix will send you, or which quick action is armed */
        .search-hint {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            height: 18px;
            margin-top: 10px;
            font: 400 12px 'Lato', sans-serif;
            color: ${CONFIG.palette.subtext0};
            overflow: hidden;
            transition: opacity .2s var(--ease-out), transform .2s var(--ease-out), height .25s var(--ease-out), margin-top .25s var(--ease-out);
        }

        .search-hint.hidden {
            opacity: 0;
            height: 0;
            margin-top: 0;
            transform: translateY(-4px);
        }

        .search-hint strong {
            color: var(--hint-color, ${CONFIG.palette.text});
        }

        .search-hint kbd,
        .quick-action kbd,
        .shortcut-keys kbd {
            font: 600 10px 'Lato', sans-serif;
            padding: 1px 5px;
            border-radius: 4px;
            background: ${CONFIG.palette.surface0};
            color: ${CONFIG.palette.subtext1};
            box-shadow: 0 1px 0 ${CONFIG.palette.surface2};
        }

        /* Gemini quick actions: styled like the link buttons on the tabs */
        .quick-actions {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 8px;
            max-height: 120px;
            margin-top: 12px;
            transition: opacity .25s var(--ease-out), max-height .3s var(--ease-out), margin-top .3s var(--ease-out);
        }

        .quick-actions.hidden {
            opacity: 0;
            max-height: 0;
            margin-top: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity .15s ease, max-height .25s var(--ease-out), margin-top .25s var(--ease-out), visibility 0s linear .25s;
        }

        .quick-actions:not(.hidden) .quick-action {
            animation: action-in .35s var(--ease-spring) backwards;
            animation-delay: calc(var(--i) * 35ms);
        }

        @keyframes action-in {
            from { opacity: 0; transform: translateY(8px) scale(.9); }
        }

        .quick-action {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: .4em .7em;
            border: 0;
            border-radius: 2px;
            background: ${CONFIG.palette.mantle};
            color: ${CONFIG.palette.text};
            font: 700 14px 'Lato', sans-serif;
            cursor: pointer;
            box-shadow: 0 4px ${CONFIG.palette.crust}, 0 5px 10px rgb(0 0 0 / 20%);
            margin-bottom: 4px;
            transition:
                transform .2s var(--ease-out),
                box-shadow .2s var(--ease-out),
                color .2s ease,
                background-color .2s ease;
        }

        .quick-action .ti {
            font-size: 18px;
            color: var(--action-color);
            transition: transform .3s var(--ease-spring);
        }

        .quick-action:hover,
        .quick-action:focus-visible {
            transform: translate(0, 4px);
            box-shadow: 0 0 rgba(0, 0, 0, .25), 0 -0px 5px rgba(0, 0, 0, .1);
            color: var(--action-color);
            outline: none;
        }

        .quick-action:hover .ti,
        .quick-action:focus-visible .ti {
            transform: scale(1.12) rotate(-6deg);
        }

        .quick-action:active {
            transform: translate(0, 5px) scale(.97);
            transition-duration: .06s;
        }

        /* Armed: pressed in, outlined in its own color */
        .quick-action[aria-pressed="true"] {
            transform: translate(0, 4px);
            box-shadow: inset 0 0 0 2px var(--action-color);
            color: var(--action-color);
        }

        /* Keyboard shortcuts cheat sheet (press ?) */
        .shortcuts-overlay {
            position: fixed;
            inset: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
            background: ${CONFIG.palette.crust}4D;
            backdrop-filter: blur(10px);
            transition: opacity .25s var(--ease-out), visibility 0s;
        }

        .shortcuts-overlay.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            transition: opacity .15s ease, visibility 0s linear .15s;
        }

        .shortcuts-card {
            width: 420px;
            max-width: 90vw;
            padding: 22px 24px;
            border-radius: 12px;
            background: ${CONFIG.palette.base};
            border: 1px solid ${CONFIG.palette.surface1};
            box-shadow: 0 10px 30px ${CONFIG.palette.crust}66;
            font-family: 'Lato', sans-serif;
            color: ${CONFIG.palette.text};
            transition: transform .3s var(--ease-spring);
        }

        .shortcuts-overlay.hidden .shortcuts-card {
            transform: translateY(8px) scale(.96);
        }

        .shortcuts-card h2 {
            display: flex;
            align-items: center;
            gap: 8px;
            margin: 0 0 14px;
            font-size: 15px;
            color: var(--accent);
        }

        .shortcuts-card h3 {
            margin: 14px 0 6px;
            font: 600 10px 'Lato', sans-serif;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: ${CONFIG.palette.overlay1};
        }

        .shortcut {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
            padding: 4px 0;
            font-size: 13px;
        }

        .shortcut-keys {
            display: flex;
            gap: 4px;
            white-space: nowrap;
        }

        .shortcut-keys kbd {
            font-size: 11px;
            padding: 2px 7px;
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
                    <now-playing class="+ widget"></now-playing>
                    <current-time class="+ widget"></current-time>
                    <weather-forecast class="+ widget weather"></weather-forecast>
                </div>
            </cols>
        </div>

        <!-- Search overlay -->
        <div class="search-overlay">
            <div class="search-modal">
                <div class="loading-icon">
                    <i class="ti ti-sparkles"></i>
                </div>
                <div class="search-header">
                    <div class="search-field">
                        <i class="ti ti-world search-engine-icon duckduckgo"></i>
                        <input type="text" class="search-input" placeholder="${window.i18n.t("search.placeholder_duckduckgo")}"/>
                        <i class="ti ti-search search-icon"></i>
                    </div>
                    <div class="search-hint hidden"></div>
                    <div class="quick-actions hidden">${this.quickActionsHtml()}</div>
                </div>
                <div class="search-results">
                    <div class="results-header">
                        <div class="results-title">
                            <i class="ti ti-sparkles"></i>
                            <span class="gemini-results-title">${window.i18n.t("search.results_title")}</span>
                        </div>
                    </div>
                    <div class="results-content">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <div class="loading-text">${window.i18n.t("search.loading")}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Keyboard shortcuts cheat sheet -->
        <div class="shortcuts-overlay hidden">${this.shortcutsHtml()}</div>`;
  }

  get quickActions() {
    return this.assistantConfig.quickActions || [];
  }

  quickActionLabel(action) {
    const key = `search.actions.${action.id}`;
    const translated = window.i18n.t(key);
    return action.label || (translated !== key ? translated : action.id);
  }

  quickActionsHtml() {
    return this.quickActions
      .map(
        (action, index) => `
          <button class="quick-action" type="button" data-action="${index}" aria-pressed="false"
                  style="--i: ${index}; --action-color: ${action.color || CONFIG.palette.mauve}"
                  title="Alt+${index + 1}">
            <i class="ti ti-${action.icon || "sparkles"}"></i>
            <span>${this.quickActionLabel(action)}</span>
            ${index < 9 ? `<kbd>${index + 1}</kbd>` : ""}
          </button>`,
      )
      .join("");
  }

  shortcutsHtml() {
    const t = (key) => window.i18n.t(`search.shortcuts.${key}`);
    const keys = (...list) => `<span class="shortcut-keys">${list.map((k) => `<kbd>${k}</kbd>`).join("")}</span>`;
    const row = (label, ...list) => `<div class="shortcut"><span>${label}</span>${keys(...list)}</div>`;
    const tabCount = CONFIG.tabs.length;
    return `
      <div class="shortcuts-card" role="dialog" aria-label="${t("title")}">
        <h2><i class="ti ti-keyboard"></i>${t("title")}</h2>
        <h3>${t("page")}</h3>
        ${row(t("tabs"), tabCount > 1 ? `1–${tabCount}` : "1")}
        ${row(t("prev_next"), "←", "→")}
        ${row(t("search"), "/")}
        ${row(t("gemini"), "g")}
        ${row(t("weather"), "w")}
        ${row(t("music"), "m")}
        ${row(t("help"), "?")}
        <h3>${t("in_search")}</h3>
        ${row(t("engine"), "Tab")}
        ${row(t("prefix"), "!yt …")}
        ${row(t("actions"), "Alt", "1–9")}
        ${row(t("close"), "Esc")}
      </div>`;
  }

  // Settings shared by every provider; older configs kept them under advanced_config.gemini
  get assistantConfig() {
    return { ...advanced_config?.gemini, ...advanced_config?.assistant };
  }

  // API keys: localStorage wins, then secrets.js (gitignored), then a window.* value from userconfig.js
  apiKey(provider) {
    if (provider === "claude") {
      return localStorage.getItem("CLAUDE_API_KEY") || window.startpageSecrets?.claude?.() || window.CLAUDE_API_KEY;
    }
    return localStorage.getItem("GEMINI_API_KEY") || window.GEMINI_API_KEY;
  }

  // Every provider/model to try, in order, skipping providers without a key
  aiAttempts() {
    const providers = advanced_config?.assistant?.providers || ["claude", "gemini"];
    const defaults = {
      claude: { model: "claude-haiku-5-5", fallbackModels: [] },
      gemini: { model: "gemini-3.8-flash", fallbackModels: ["gemini-3.5-flash"] },
    };
    return providers.flatMap((provider) => {
      const apiKey = this.apiKey(provider);
      const settings = { ...defaults[provider], ...advanced_config?.[provider] };
      if (!apiKey || !defaults[provider]) return [];
      const models = [settings.model, ...(settings.fallbackModels || []).filter((m) => m && m !== settings.model)];
      return models.map((model) => ({ provider, model, apiKey }));
    });
  }

  // Streams the answer: onText(textSoFar) is called as chunks arrive; resolves to { text, model, sources, fallbackFrom? } or an error object.
  // Tries advanced_config.assistant.providers in order (Claude, then Gemini by default). A model that is busy or unreachable
  // before any text arrives gets one retry after 2s (the first one only), then the next model takes over;
  // a provider that rejects the key or is out of credit is skipped altogether.
  // options.tools: tool names from a quick action ("urlContext" reads a link, "googleSearch" searches the web).
  async queryAI(query, signal, onText, options = {}) {
    const attempts = this.aiAttempts();
    if (!attempts.length) {
      return { error: true, message: window.i18n.t("search.error_no_api_key") };
    }

    // Overloaded / rate limited / temporary server trouble / network down: worth another try
    const isBusy = (error) => [0, 429, 500, 502, 503, 504, 529].includes(error.status);
    // Bad key, no credit, no access: this provider won't work today, move to the next one
    const isAccountProblem = (error) =>
      [401, 402, 403].includes(error.status) || (error.status === 400 && /credit|billing|api key/i.test(error.message));
    const requests = {};
    const primary = attempts[0];
    const skipped = new Set();

    try {
      let lastError;
      for (const [index, attempt] of attempts.entries()) {
        if (skipped.has(attempt.provider)) continue;
        const request = (requests[attempt.provider] ??=
          attempt.provider === "claude" ? this.claudeRequest(query, options) : this.geminiRequest(query, options));
        const tries = index === 0 ? 2 : 1;
        for (let attemptNo = 0; attemptNo < tries; attemptNo++) {
          try {
            const stream = attempt.provider === "claude" ? this.streamClaude : this.streamGemini;
            const result = await stream.call(this, attempt.model, request, attempt.apiKey, signal, onText);
            return attempt === primary ? result : { ...result, fallbackFrom: primary.model };
          } catch (error) {
            if (signal?.aborted || error.streamed) throw error;
            // Gemini doesn't accept the thinking level: ask again with the model's own default
            if (error.status === 400 && request.generationConfig?.thinkingConfig && /thinking/i.test(error.message)) {
              delete request.generationConfig.thinkingConfig;
              attemptNo--;
              continue;
            }
            // Same for tools (reading links, web search): answer without them rather than fail
            if (error.status === 400 && request.tools && /tool|url_?context|google_?search|grounding|web_(search|fetch)/i.test(error.message)) {
              delete request.tools;
              attemptNo--;
              continue;
            }
            lastError = error;
            if (isAccountProblem(error)) {
              skipped.add(attempt.provider);
              break;
            }
            // Never switch models for anything but "busy"
            if (!isBusy(error)) throw error;
            if (attemptNo < tries - 1) await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }
      throw lastError;
    } catch (error) {
      return {
        error: true,
        message: error?.message || window.i18n.t("search.error_generic"),
      };
    }
  }

  // The system prompt, with today's date so "latest" and "this year" mean something
  systemPrompt() {
    const today = new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    return [this.assistantConfig.systemInstruction, `Today is ${today}.`].filter(Boolean).join("\n\n");
  }

  claudeRequest(query, options) {
    const settings = advanced_config?.claude || {};
    const tools = [];
    const wants = new Set(options.tools || []);
    // Web search on every question (Claude decides whether to use it), or only for the web quick action
    if (settings.webSearch !== false || wants.has("googleSearch") || wants.has("webSearch")) {
      tools.push({ type: "web_search_20250305", name: "web_search", max_uses: settings.maxSearches ?? 3 });
    }
    // Reading links: for the summarize action, or whenever the question contains one
    if (wants.has("urlContext") || wants.has("readUrl") || /https?:\/\/\S/.test(query)) {
      tools.push({ type: "web_fetch_20250910", name: "web_fetch", max_uses: 2 });
    }
    return {
      max_tokens: settings.maxTokens ?? 4096,
      stream: true,
      system: this.systemPrompt(),
      messages: [{ role: "user", content: query }],
      ...(settings.effort ? { output_config: { effort: settings.effort } } : {}),
      ...(tools.length ? { tools } : {}),
    };
  }

  geminiRequest(query, options) {
    const settings = advanced_config?.gemini || {};
    const request = {
      contents: [{ parts: [{ text: query }] }],
      systemInstruction: { parts: [{ text: this.systemPrompt() }] },
      generationConfig: {
        temperature: settings.temperature ?? 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: settings.maxOutputTokens ?? 2048,
      },
    };
    // Less silent "thinking" before the first word = faster answers
    const thinkingLevel = settings.thinkingLevel ?? "low";
    if (thinkingLevel) request.generationConfig.thinkingConfig = { thinkingLevel };
    // Quick action tools, under Gemini's names
    const names = { googleSearch: "googleSearch", webSearch: "googleSearch", urlContext: "urlContext", readUrl: "urlContext" };
    const tools = [...new Set((options.tools || []).map((tool) => names[tool]).filter(Boolean))];
    if (tools.length) request.tools = tools.map((tool) => ({ [tool]: {} }));
    return request;
  }

  // Shared by both streams: an Error carrying .status (HTTP or stream error code; 0 = network)
  // and .streamed (whether any text had already been passed to onText).
  aiError(message, status, streamed = false) {
    return Object.assign(new Error(message), { status, streamed });
  }

  // Reads a server-sent-events body, calling handleData(json) per "data:" line and onText when the text grew
  async readEvents(response, handleData, getText, onText) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    const handleLine = (line) => {
      if (!line.startsWith("data:")) return;
      const json = line.slice(5).trim();
      if (json && json !== "[DONE]") handleData(JSON.parse(json));
    };
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop(); // keep a partial line for the next read
      const before = getText();
      lines.forEach(handleLine);
      if (getText() !== before) onText?.(getText());
    }
    handleLine(buffer.trim());
  }

  async postJson(url, headers, body, signal) {
    let response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(body),
        signal,
      });
    } catch (error) {
      if (signal?.aborted) throw error;
      throw this.aiError(error.message || window.i18n.t("search.error_failed_response"), 0);
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw this.aiError(
        errorData.error?.message || `${window.i18n.t("search.error_failed_response")} (HTTP ${response.status})`,
        response.status,
      );
    }
    return response;
  }

  // One streamed request to Claude (Messages API, called straight from the browser)
  async streamClaude(model, requestBody, apiKey, signal, onText) {
    const response = await this.postJson(
      "https://api.anthropic.com/v1/messages",
      {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        // Required for calls made from a web page; the key is the user's own and stays on this machine
        "anthropic-dangerous-direct-browser-access": "true",
      },
      { ...requestBody, model },
      signal,
    );

    let text = "";
    let reason;
    const cited = new Map(); // url -> title, from citations in the answer
    const found = new Map(); // url -> title, everything web search returned
    const errorStatus = { overloaded_error: 529, rate_limit_error: 429, api_error: 500, timeout_error: 504 };

    await this.readEvents(
      response,
      (data) => {
        if (data.type === "error") {
          throw this.aiError(
            data.error?.message || window.i18n.t("search.error_failed_response"),
            errorStatus[data.error?.type] ?? 500,
            text !== "",
          );
        }
        if (data.type === "content_block_start") {
          const block = data.content_block;
          // Several text blocks can follow each other (one per citation); keep them apart only where the model did
          if (block.type === "text" && block.text) text += block.text;
          if (block.type === "web_search_tool_result" && Array.isArray(block.content)) {
            for (const result of block.content) if (result.url) found.set(result.url, result.title || result.url);
          }
          if (block.type === "web_fetch_tool_result" && block.content?.url) {
            cited.set(block.content.url, block.content.content?.title || block.content.url);
          }
        }
        if (data.type === "content_block_delta") {
          if (data.delta.type === "text_delta") text += data.delta.text;
          if (data.delta.type === "citations_delta" && data.delta.citation?.url) {
            cited.set(data.delta.citation.url, data.delta.citation.title || data.delta.citation.url);
          }
        }
        if (data.type === "message_delta") reason = data.delta?.stop_reason || reason;
      },
      () => text,
      onText,
    );

    if (reason === "refusal" && !text) throw this.aiError(window.i18n.t("search.error_blocked"));
    if (!text.trim()) {
      if (reason === "max_tokens") throw this.aiError(window.i18n.t("search.error_max_tokens"));
      throw this.aiError(window.i18n.t("search.error_no_response") + (reason ? ` (${reason})` : ""));
    }

    // The pages the answer cites; failing that, the first few search hits
    const sources = cited.size ? cited : new Map([...found].slice(0, 5));
    return { text, model, sources: [...sources].map(([uri, title]) => ({ uri, title })) };
  }

  // One streamed request to one Gemini model
  async streamGemini(model, requestBody, apiKey, signal, onText) {
    const response = await this.postJson(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse`,
      // Send the key as a header so it stays out of URLs and request logs
      { "x-goog-api-key": apiKey },
      requestBody,
      signal,
    );

    let text = "";
    let reason;
    let blockReason;
    const sources = new Map(); // uri -> title, from web-search grounding

    await this.readEvents(
      response,
      (data) => {
        if (data.error) {
          throw this.aiError(data.error.message || window.i18n.t("search.error_failed_response"), data.error.code, text !== "");
        }
        const candidate = data.candidates?.[0];
        // A chunk can hold several parts; skip thought summaries
        for (const part of candidate?.content?.parts || []) {
          if (part.text && !part.thought) text += part.text;
        }
        for (const chunk of candidate?.groundingMetadata?.groundingChunks || []) {
          if (chunk.web?.uri) sources.set(chunk.web.uri, chunk.web.title || chunk.web.uri);
        }
        reason = candidate?.finishReason || reason;
        blockReason = data.promptFeedback?.blockReason || blockReason;
      },
      () => text,
      onText,
    );

    if (!text) {
      if (blockReason || ["SAFETY", "PROHIBITED_CONTENT", "BLOCKLIST", "SPII"].includes(reason)) {
        throw this.aiError(window.i18n.t("search.error_blocked"));
      }
      if (reason === "MAX_TOKENS") {
        throw this.aiError(window.i18n.t("search.error_max_tokens"));
      }
      throw this.aiError(window.i18n.t("search.error_no_response") + (reason ? ` (${reason})` : ""));
    }

    return { text, model, sources: [...sources].map(([uri, title]) => ({ uri, title })) };
  }

  formatMarkdown(text) {
    if (!text) return "";

    const escapeHtml = (str) => {
      if (!str) return "";
      return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    };

    let html = text;

    // 1) Extract code blocks and inline code so lists/bold/italic/etc don't touch their content
    const codeBlocks = [];
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, _lang, code) => {
      const i = codeBlocks.length;
      codeBlocks.push(code);
      return `%%CODE_${i}%%`;
    });
    const inlineCodes = [];
    html = html.replace(/`([^`\n]+)`/g, (_, code) => {
      const i = inlineCodes.length;
      inlineCodes.push(code);
      return `%%INLINE_${i}%%`;
    });

    // 2) Escape HTML to avoid XSS and broken layout from < > & in Gemini output
    html = escapeHtml(html);

    // Horizontal rules (--- or ___ or *** on own line)
    html = html.replace(/^(---|\*\*\*|___)\s*$/gm, "<hr>");

    // Blockquotes: lines starting with >
    html = html.replace(/^&gt;\s?(.+)$/gm, "<blockquote>$1</blockquote>");
    // Merge consecutive blockquotes into one
    html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

    // Lists before bold/italic, so "* item" bullets aren't mistaken for emphasis
    html = this.formatLists(html);

    // Bold (before italic so ** takes precedence)
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic: only *word*, not 2*3*4 or stray asterisks
    html = html.replace(/(?<![\w*\\])\*(?![\s*])(.+?)(?<![\s*])\*(?![\w*])/g, "<em>$1</em>");

    // Strikethrough
    html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

    // Images ![alt](url)
    html = html.replace(/!\[(.*?)\]\((.+?)\)/g, (_, alt, url) => {
      const safe = /^https?:\/\//i.test(url) ? url : '';
      return `<img src="${safe}" alt="${alt}" class="gemini-img" loading="lazy">`;
    });

    // Headers (optional space after #); h4-h6 render as h3
    html = html.replace(/^(#{1,6})\s*(.+)$/gm, (_, hashes, title) => {
      const level = Math.min(hashes.length, 3);
      return `<h${level}>${title}</h${level}>`;
    });

    // Links (URLs already escaped; allow # in href for anchors)
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, (_, text, url) => {
      const safe = /^(https?:\/\/|mailto:|#)/i.test(url) ? url : '#';
      return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });

    // Markdown tables
    // (one match = a whole run of consecutive | rows, so a table isn't split per row)
    html = html.replace(/^\|.+\|[ \t]*(?:\n\|.+\|[ \t]*)*$/gm, (block) => {
      const lines = block
        .trim()
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
      if (lines.length < 1) return block;
      const rows = lines.map((line) =>
        line
          .split("|")
          .slice(1, -1)
          .map((c) => c.trim()),
      );
      if (rows.some((row) => row.length === 0)) return block;
      let headerRow = rows[0];
      let bodyRows = rows.slice(1);
      if (bodyRows.length > 0 && bodyRows[0].every((c) => /^[\s:\-]+$/.test(c))) {
        bodyRows = bodyRows.slice(1);
      }
      const thead = "<thead><tr>" + headerRow.map((c) => "<th>" + c + "</th>").join("") + "</tr></thead>";
      const tbody =
        "<tbody>" +
        bodyRows.map((row) => "<tr>" + row.map((c) => "<td>" + c + "</td>").join("") + "</tr>").join("") +
        "</tbody>";
      return '<table class="gemini-table">' + thead + tbody + "</table>";
    });

    // Paragraphs: preserve single line breaks as <br>, and don't wrap already-HTML blocks
    html = html
      .split("\n\n")
      .map((para) => {
        const trimmed = para.trim();
        if (!trimmed.startsWith("<") && !/^%%CODE_\d+%%$/.test(trimmed) && trimmed !== "") {
          return "<p>" + trimmed.replace(/\n/g, "<br>") + "</p>";
        }
        return trimmed;
      })
      .join("\n");

    // Restore code last, escaped, so no other rule ever touches its content
    html = html.replace(/%%INLINE_(\d+)%%/g, (_, i) => `<code>${escapeHtml(inlineCodes[i])}</code>`);
    html = html.replace(/%%CODE_(\d+)%%/g, (_, i) => `<pre><code>${escapeHtml(codeBlocks[i])}</code></pre>`);

    return html;
  }

  // Turns markdown bullet/numbered lines into (nested) <ul>/<ol>, using indentation for nesting
  formatLists(text) {
    const listLine = /^(\s*)([*-]|\d+\.)\s+(.+)$/;
    const lines = text.split("\n");
    const out = [];
    const stack = [];
    let listHtml = "";

    const closeLevel = () => (listHtml += `</li></${stack.pop().type}>`);
    const openLevel = (indent, type, marker) => {
      const start = type === "ol" && parseInt(marker) !== 1 ? ` start="${parseInt(marker)}"` : "";
      stack.push({ indent, type });
      listHtml += `<${type}${start}><li>`;
    };
    const flush = () => {
      while (stack.length) closeLevel();
      // Blank lines around the list keep it out of the surrounding paragraphs
      out.push("", listHtml, "");
      listHtml = "";
    };

    lines.forEach((line, index) => {
      const match = line.match(listLine);
      if (!match) {
        // A blank line between items (a "loose" list) shouldn't end the list
        const next = lines.slice(index + 1).find((l) => l.trim() !== "");
        if (stack.length && line.trim() === "" && next && listLine.test(next)) return;
        if (stack.length) flush();
        out.push(line);
        return;
      }

      const [, spaces, marker, content] = match;
      const indent = spaces.replace(/\t/g, "    ").length;
      const type = /\d/.test(marker) ? "ol" : "ul";

      while (stack.length && stack[stack.length - 1].indent > indent) closeLevel();
      const top = stack[stack.length - 1];

      if (!top || indent > top.indent) {
        openLevel(indent, type, marker);
      } else if (top.type !== type) {
        closeLevel();
        openLevel(indent, type, marker);
      } else {
        listHtml += "</li><li>";
      }
      listHtml += content;
    });

    if (stack.length) flush();
    return out.join("\n");
  }

  setEvents() {
    // Your existing tab handlers
    this.refs.tabs.forEach((tab) => (tab.onclick = ({ target }) => this.handleTabChange(target)));

    document.onkeydown = (e) => this.handleKeyPress(e);
    document.onwheel = (e) => this.handleWheelScroll(e);

    // Search overlay elements
    const searchTrigger = this.shadow.querySelector("#search-trigger");
    const searchOverlay = this.shadow.querySelector(".search-overlay");
    const searchModal = this.shadow.querySelector(".search-modal");
    const searchInput = this.shadow.querySelector(".search-input");
    const engineIcon = this.shadow.querySelector(".search-engine-icon");

    // Results elements
    const searchResults = this.shadow.querySelector(".search-results");
    const resultsContent = this.shadow.querySelector(".results-content");
    const searchHeader = this.shadow.querySelector(".search-header");
    const loadingIcon = this.shadow.querySelector(".loading-icon");
    const searchHint = this.shadow.querySelector(".search-hint");
    const quickActionsRow = this.shadow.querySelector(".quick-actions");
    const quickActionButtons = this.shadow.querySelectorAll(".quick-action");
    const resultsTitle = this.shadow.querySelector(".gemini-results-title");
    this.shortcutsOverlay = this.shadow.querySelector(".shortcuts-overlay");
    const escapeHtml = (str) =>
      String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

    // Only one Gemini request at a time; closing the overlay cancels it
    const loadingHtml = resultsContent.innerHTML;
    let currentRequest = null;
    const cancelRequest = () => {
      currentRequest?.abort();
      currentRequest = null;
    };
    const isShowingResults = () =>
      searchResults.classList.contains("active") || searchModal.classList.contains("expanded");

    // Only touch the icon when it actually changes, so its pop animation doesn't replay on every keystroke
    const setEngineIcon = (className, color = "") => {
      if (engineIcon.className !== className) engineIcon.className = className;
      engineIcon.style.color = color;
    };
    const engineIconClass = () =>
      this.searchEngine === "duckduckgo"
        ? "ti ti-world search-engine-icon duckduckgo"
        : "ti ti-sparkles search-engine-icon gemini";

    // The line under the input: a recognized !prefix wins, then an armed quick action
    const updateHint = () => {
      const prefix = this.parsePrefix(searchInput.value.trim());
      const action = this.searchEngine === "gemini" ? this.quickActions[this.quickActionIndex] : null;

      if (prefix) {
        const { entry, rest } = prefix;
        setEngineIcon(`ti ti-${entry.icon || "arrow-right"} search-engine-icon prefix`, entry.color || "");
        const target = rest
          ? `<strong>${escapeHtml(entry.name)}</strong> · ${escapeHtml(rest)}`
          : escapeHtml(window.i18n.t("search.prefix_open").replace("{name}", entry.name)).replace(
              escapeHtml(entry.name),
              `<strong>${escapeHtml(entry.name)}</strong>`,
            );
        searchHint.style.setProperty("--hint-color", entry.color || CONFIG.palette.text);
        searchHint.innerHTML = `<i class="ti ti-arrow-right"></i> ${target} <kbd>↵</kbd>`;
        searchHint.classList.remove("hidden");
        return;
      }

      setEngineIcon(engineIconClass());
      if (action) {
        searchHint.style.setProperty("--hint-color", action.color || CONFIG.palette.mauve);
        searchHint.innerHTML = `<i class="ti ti-${action.icon || "sparkles"}" style="color: ${action.color}"></i> <strong>${escapeHtml(
          this.quickActionLabel(action),
        )}</strong> <kbd>↵</kbd>`;
        searchHint.classList.remove("hidden");
      } else {
        searchHint.classList.add("hidden");
      }
    };

    // Arm (or disarm) a quick action; null disarms all
    const selectQuickAction = (index) => {
      this.quickActionIndex = index === this.quickActionIndex ? null : index;
      quickActionButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === this.quickActionIndex)));
      updateHint();
    };

    // Update placeholder and icon based on current engine
    const updateSearchEngine = () => {
      const gemini = this.searchEngine === "gemini";
      searchInput.placeholder = window.i18n.t(gemini ? "search.placeholder_gemini" : "search.placeholder_duckduckgo");
      quickActionsRow.classList.toggle("hidden", !gemini || this.quickActions.length === 0);
      updateHint();
    };

    // Open the search overlay, optionally switching engine first (used by the / and g shortcuts)
    this.openSearch = (engine) => {
      if (engine && engine !== this.searchEngine) {
        this.searchEngine = engine;
        updateSearchEngine();
      }
      searchOverlay.classList.add("active");
      searchInput.focus();
    };

    // Open search overlay when icon is clicked
    searchTrigger.onclick = () => this.openSearch();

    // Clicking a quick action arms it; with something already typed it runs right away
    quickActionButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.dataset.action);
        if (!searchInput.value.trim()) {
          // Nothing typed yet: toggle it and go back to typing
          selectQuickAction(index);
          searchInput.focus();
          return;
        }
        if (this.quickActionIndex !== index) selectQuickAction(index);
        submitSearch();
      });
    });

    searchInput.addEventListener("input", updateHint);

    // Forget the armed action and hint once the overlay is gone
    const resetSearchState = () => {
      this.quickActionIndex = null;
      quickActionButtons.forEach((button) => button.setAttribute("aria-pressed", "false"));
      updateHint();
    };

    // Function to close with animation
    const closeWithAnimation = () => {
      cancelRequest();
      // Step 1: Start blur fadeout
      searchOverlay.classList.add("closing");

      // Step 2: Collapse results
      searchResults.classList.add("closing");
      searchResults.classList.remove("active");

      // Step 3: Shrink modal to center point
      setTimeout(() => {
        searchModal.classList.add("collapsing");
        searchModal.classList.remove("expanded");
      }, 200);

      // Step 4: Close overlay and reset everything
      setTimeout(() => {
        searchOverlay.classList.remove("active");
        searchOverlay.classList.remove("results-showing");
        searchOverlay.classList.remove("closing");
        searchResults.classList.remove("closing");
        searchModal.classList.remove("collapsing");
        searchModal.classList.remove("loading");
        searchModal.classList.remove("panel-mode");
        searchModal.style.cssText = "";
        searchHeader.classList.remove("hidden");
        loadingIcon.classList.remove("active");
        searchInput.value = "";
        resetSearchState();
      }, 800);
    };

    // Function to close search box with animation
    const closeSearchBox = () => {
      cancelRequest();
      // Start blur fadeout and shrink search box
      searchOverlay.classList.add("closing");
      searchModal.classList.add("search-closing");

      // Close and reset after animation
      setTimeout(() => {
        searchOverlay.classList.remove("active");
        searchOverlay.classList.remove("closing");
        searchModal.classList.remove("search-closing");
        searchModal.classList.remove("loading");
        loadingIcon.classList.remove("active");
        searchHeader.classList.remove("hidden");
        searchInput.value = "";
        resetSearchState();
      }, 500);
    };

    // Close search overlay when clicking outside
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        // If results are showing, animate collapse
        if (isShowingResults()) {
          closeWithAnimation();
        } else {
          // If just search box, animate close
          closeSearchBox();
        }
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (searchOverlay.classList.contains("active")) {
          // If results are showing, animate collapse
          if (isShowingResults()) {
            closeWithAnimation();
          } else {
            // If just search box, animate close
            closeSearchBox();
          }
        }
      }
    });

    // Tab toggles the search engine; Alt+1..9 arms a Gemini quick action
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        this.searchEngine = this.searchEngine === "duckduckgo" ? "gemini" : "duckduckgo";
        updateSearchEngine();
        return;
      }
      // e.code, because on macOS Alt+digit types a symbol (¡, ™, £...)
      const digit = e.altKey && !e.metaKey && !e.ctrlKey && /^Digit([1-9])$/.exec(e.code);
      if (digit && Number(digit[1]) <= this.quickActions.length) {
        e.preventDefault();
        if (this.searchEngine !== "gemini") {
          this.searchEngine = "gemini";
          updateSearchEngine();
        }
        selectQuickAction(Number(digit[1]) - 1);
      }
    });

    // Handle search
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") submitSearch();
    });

    const submitSearch = async () => {
        const query = searchInput.value.trim();
        const prefix = this.parsePrefix(query);
        if (prefix) {
          // A known !prefix goes straight to its site, whichever engine is selected
          window.location.href = this.prefixUrl(prefix);
          return;
        }
        if (query) {
          if (this.searchEngine === "duckduckgo") {
            window.location.href = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
          } else {
            // Ignore repeated Enter presses while a query is in flight
            if (currentRequest) return;
            const request = new AbortController();
            currentRequest = request;
            const isStale = () => currentRequest !== request;
            const startedAt = performance.now();
            resultsContent.innerHTML = loadingHtml;

            // An armed quick action wraps the query in its prompt and may bring tools along
            const action = this.quickActions[this.quickActionIndex];
            const prompt = action
              ? action.prompt
                  .replace(/\{lang\}/g, this.assistantConfig.translateTo || "English")
                  .replace(/\{q\}/g, query)
              : query;
            const baseTitle = window.i18n.t("search.results_title");
            resultsTitle.textContent = action ? `${baseTitle} · ${this.quickActionLabel(action)}` : baseTitle;

            // Step 1: Hide search header
            searchHeader.classList.add("hidden");

            // Step 2: After header fades, compress to loading icon
            setTimeout(() => {
              if (isStale()) return;
              searchModal.classList.add("loading");
              loadingIcon.classList.add("active");
            }, 300);

            // Ask the AI; the answer streams in chunk by chunk
            let streamedText = "";
            let canRender = false; // only draw text once the panel has expanded
            let renderQueued = false;
            const responseHtml = (text) => {
              // Close a code block that is still streaming so it renders as code meanwhile
              const fences = (text.match(/```/g) || []).length;
              return `<div class="gemini-response">${this.formatMarkdown(fences % 2 ? text + "\n```" : text)}</div>`;
            };
            const renderStream = () => {
              if (!canRender || renderQueued || isStale()) return;
              renderQueued = true;
              // At most one re-render per frame, however fast chunks arrive
              requestAnimationFrame(() => {
                renderQueued = false;
                if (!isStale()) resultsContent.innerHTML = responseHtml(streamedText);
              });
            };
            const errorHtml = (result) => {
              const apiKeyNotice = !this.aiAttempts().length
                ? `
                  <p style="margin-top: 15px;">
                    <strong>${window.i18n.t("search.setup_title")}</strong><br>
                    1. ${window.i18n.t("search.setup_step_1")} <a href="https://platform.claude.com/" target="_blank" rel="noopener noreferrer">Claude Console</a><br>
                    2. ${window.i18n.t("search.setup_step_2")}<br>
                    <code style="display: block; margin-top: 5px; padding: 10px; background: ${CONFIG.palette.mantle};">localStorage.setItem('CLAUDE_API_KEY', '${window.i18n.t("search.setup_key_placeholder")}');</code><br>
                    3. ${window.i18n.t("search.setup_step_3")}
                  </p>
                `
                : "";
              const technicalMessage = result.message ? escapeHtml(result.message) : "";
              const technicalDetails = technicalMessage
                ? `
                  <details style="margin-top: 12px;">
                    <summary>${window.i18n.t("search.error_details_summary")}</summary>
                    <pre style="margin-top: 8px; white-space: pre-wrap;">${technicalMessage}</pre>
                  </details>
                `
                : "";
              return `
              <div class="error-message">
                <h3>${window.i18n.t("search.error_title_friendly")}</h3>
                <p>${window.i18n.t("search.error_body_friendly")}</p>
                ${technicalDetails}
                ${apiKeyNotice}
              </div>
            `;
            };

            let firstChunk;
            const firstChunkArrived = new Promise((resolve) => (firstChunk = resolve));
            const resultPromise = this.queryAI(
              prompt,
              request.signal,
              (text) => {
                streamedText = text;
                firstChunk();
                renderStream();
              },
              { tools: action?.tools },
            );
            // Open the panel as soon as the answer starts (or fails)
            await Promise.race([firstChunkArrived, resultPromise]);
            // The overlay was closed while waiting: drop the answer
            if (isStale()) return;

            // Step 3: Expand to full results window, as soon as the loading animation has played
            const expandDelay = Math.max(0, 800 - (performance.now() - startedAt));
            setTimeout(() => {
              if (isStale()) return;
              loadingIcon.classList.remove("active");
              searchModal.classList.remove("loading");
              searchModal.classList.add("expanded");
              searchOverlay.classList.add("results-showing");

              // Snap modal to main panel dimensions
              const panelsRect = this.parentElement.getBoundingClientRect();
              searchModal.classList.add("panel-mode");
              searchModal.style.top = `${panelsRect.top}px`;
              searchModal.style.left = `${panelsRect.left}px`;
              searchModal.style.width = `${panelsRect.width}px`;
              searchModal.style.height = `${panelsRect.height}px`;

              // Small delay for smooth expansion
              setTimeout(() => {
                searchResults.classList.add("active");
              }, 100);
            }, expandDelay);

            // Start drawing once the panel is opening, then keep up with the stream
            setTimeout(async () => {
              if (isStale()) return;
              canRender = true;
              if (streamedText) resultsContent.innerHTML = responseHtml(streamedText);

              const result = await resultPromise;
              if (isStale()) return;
              currentRequest = null;
              if (result.error) {
                // Keep whatever already arrived, with the error below it
                resultsContent.innerHTML = (streamedText ? responseHtml(streamedText) : "") + errorHtml(result);
              } else {
                const fallbackNote = result.fallbackFrom
                  ? `<div class="model-note"><i class="ti ti-info-circle"></i> ${escapeHtml(
                      window.i18n
                        .t("search.fallback_note")
                        .replace("{model}", result.model)
                        .replace("{primary}", result.fallbackFrom),
                    )}</div>`
                  : "";
                // Pages the AI read or cited while answering
                const sourcesHtml = result.sources?.length
                  ? `<div class="model-note"><strong>${escapeHtml(window.i18n.t("search.sources"))}</strong><br>${result.sources
                      .map(
                        ({ uri, title }) =>
                          `<a href="${/^https?:\/\//i.test(uri) ? escapeHtml(uri) : "#"}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`,
                      )
                      .join(" · ")}</div>`
                  : "";
                resultsContent.innerHTML = responseHtml(result.text) + sourcesHtml + fallbackNote;
              }
            }, expandDelay + 150);

            // Clear search input
            searchInput.value = "";
            updateHint();
          }
        }
    };

    this.isSearchOpen = () => searchOverlay.classList.contains("active");

    this.shortcutsOverlay.addEventListener("click", (e) => {
      if (e.target === this.shortcutsOverlay) this.toggleShortcuts(false);
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
    // Nothing saved yet on a fresh browser
    const key = Number(localStorage.lastVisitedTab);
    if (!Number.isInteger(key)) return;
    this.activateByKey(key);
  }

  handleTabChange(tab) {
    this.activateByKey(Number(tab.getAttribute("tab-index")));
  }

  handleWheelScroll(event) {
    if (!event) return;

    let { target, wheelDelta, deltaY } = event;

    if (target.shadow && target.shadow.activeElement) return;

    // Use deltaY for better cross-platform compatibility, fallback to wheelDelta
    const delta = deltaY !== undefined ? -deltaY : wheelDelta;

    // Debounce scroll events to prevent rapid tab switching (especially on macOS with momentum scrolling)
    const now = Date.now();
    if (this._lastScrollTime && now - this._lastScrollTime < 100) {
      return;
    }
    this._lastScrollTime = now;

    // Require a minimum scroll threshold to prevent accidental tab switches
    if (Math.abs(delta) < 5) {
      return;
    }

    let activeTab = -1;
    this.refs.tabs.forEach((tab, index) => {
      if (tab.getAttribute("active") === "") {
        activeTab = index;
      }
    });

    const totalTabs = this.refs.tabs.length - 1;

    if (delta > 0) {
      // Scroll down/right: go to next tab
      const nextTab = (activeTab + 1) % totalTabs;
      this.activateByKey(nextTab);
    } else {
      // Scroll up/left: go to previous tab
      const prevTab = activeTab - 1 < 0 ? totalTabs - 1 : activeTab - 1;
      this.activateByKey(prevTab);
    }
  }

  // "!yt lofi" -> { key: "yt", entry, rest: "lofi" } when "yt" is in CONFIG.searchPrefixes, else null
  parsePrefix(query) {
    const match = /^!(\S+)(?:\s+([\s\S]*))?$/.exec(query);
    if (!match) return null;
    const key = match[1].toLowerCase();
    const entry = CONFIG.searchPrefixes?.[key];
    if (!entry?.url) return null;
    return { key, entry: { name: key, ...entry }, rest: (match[2] || "").trim() };
  }

  prefixUrl({ entry, rest }) {
    if (rest) return entry.url.replace("%s", encodeURIComponent(rest));
    if (entry.home) return entry.home;
    try {
      return new URL(entry.url.replace("%s", "")).origin;
    } catch {
      return entry.url.replace("%s", "");
    }
  }

  toggleShortcuts(open = this.shortcutsOverlay.classList.contains("hidden")) {
    this.shortcutsOverlay.classList.toggle("hidden", !open);
  }

  // True while the user is typing somewhere (search box or any field inside the components)
  isTyping() {
    let element = document.activeElement;
    for (let inner; (inner = element?.shadowRoot?.activeElement || element?.shadow?.activeElement); ) element = inner;
    return !!element && (element.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName));
  }

  handleKeyPress(event) {
    if (!event) return;
    const { key } = event;

    // Leave browser/OS shortcuts (Cmd+L, Ctrl+T...) and typing alone
    if (event.metaKey || event.ctrlKey || event.altKey || this.isTyping()) return;
    if (this.isSearchOpen?.()) return;

    const shortcutsOpen = !this.shortcutsOverlay.classList.contains("hidden");
    if (shortcutsOpen) {
      if (key === "Escape" || key === "?") {
        event.preventDefault();
        this.toggleShortcuts(false);
      }
      return;
    }

    const tabCount = this.externalRefs.categories.length;
    const step = (delta) => this.activateByKey((this.currentTabIndex + delta + tabCount) % tabCount);

    switch (key) {
      case "ArrowRight":
      case "l":
        step(1);
        break;
      case "ArrowLeft":
      case "h":
        step(-1);
        break;
      case "/":
        this.openSearch();
        break;
      case "g":
        this.openSearch("gemini");
        break;
      case "w":
        this.shadow.querySelector("weather-forecast")?.togglePopup?.();
        break;
      case "m":
        this.shadow.querySelector("now-playing")?.togglePopup?.();
        break;
      case "?":
        this.toggleShortcuts(true);
        break;
      default:
        if (/^[1-9]$/.test(key) && Number(key) <= tabCount) {
          this.activateByKey(Number(key) - 1);
          break;
        }
        return; // not ours: let the browser have it
    }
    event.preventDefault();
  }

  activateByKey(key) {
    // Also skips a saved tab that no longer exists (e.g. after removing a category)
    if (key < 0 || !this.refs.tabs[key] || !this.externalRefs.categories[key]) return;
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
