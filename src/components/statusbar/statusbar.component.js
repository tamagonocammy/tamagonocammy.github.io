class Statusbar extends Component {
  externalRefs = {};

  refs = {
    categories: ".categories ul",
    tabs: "#tabs ul li",
    indicator: ".indicator",
    fastlink: ".fastlink",
  };

  currentTabIndex = 0;
  searchEngine = "google"; // "google" or "gemini"

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
          counter-increment: tabs;
          display: flex;
          width: 100%;
          height: 100%;
          position: relative;
          align-items: center;
          text-align: center;
          justify-content: center;
          font-family: 'tabler-icons' !important;
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
          transition: all .1s;
          cursor: pointer;
          line-height: 0;
          height: 100%;
      }

      #tabs ul li:not(:last-child):hover {
          background: ${CONFIG.palette.surface0};
      }

      #tabs ul li:nth-child(1)[active]:not(:last-child)::after {
          color: ${CONFIG.palette.green};
      }

      #tabs ul li:nth-child(2)[active]:not(:last-child)::after {
          color: ${CONFIG.palette.peach};
      }

      #tabs ul li:nth-child(3)[active]:not(:last-child)::after {
          color: ${CONFIG.palette.red};
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
        }

        .search-modal {
            position: relative;
            width: 600px;
            max-width: 90vw;
            background: ${CONFIG.palette.base};
            border-radius: 16px;
            box-shadow: 0 10px 30px ${CONFIG.palette.crust}4D;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
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
            animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 0.6;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.1);
            }
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

        .search-engine-icon.gemini {
            color: ${CONFIG.palette.mauve};
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
            transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
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
            font-family: 'Fira Sans', sans-serif;
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

        <!-- Search overlay -->
        <div class="search-overlay">
            <div class="search-modal">
                <div class="loading-icon">
                    <i class="ti ti-sparkles"></i>
                </div>
                <div class="search-header">
                    <i class="ti ti-brand-google search-engine-icon google"></i>
                    <input type="text" class="search-input" placeholder="${window.i18n ? window.i18n.t("search.placeholder_google") : "Buscar en Google..."}"/>
                    <i class="ti ti-search search-icon"></i>
                </div>
                <div class="search-results">
                    <div class="results-header">
                        <div class="results-title">
                            <i class="ti ti-sparkles"></i>
                            <span class="gemini-results-title">${window.i18n ? window.i18n.t("search.results_title") : "Resultados de Gemini"}</span>
                        </div>
                    </div>
                    <div class="results-content">
                        <div class="loading-spinner">
                            <div class="spinner"></div>
                            <div class="loading-text">${window.i18n ? window.i18n.t("search.loading") : "Preguntándole a Gemini..."}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
  }

  async queryGemini(query) {
    // Get API key from localStorage or userconfig
    const apiKey = localStorage.getItem("GEMINI_API_KEY") || window.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        error: true,
        message:
          'Gemini API key not configured. Please set your API key in localStorage with key "GEMINI_API_KEY" or define window.GEMINI_API_KEY in userconfig.js. Get your free API key at: https://makersuite.google.com/app/apikey',
      };
    }
    // Use advanced_config for Gemini settings with fallbacks
    const model = advanced_config?.gemini?.model || "gemini-3-flash-preview";
    const temperature = advanced_config?.gemini?.temperature ?? 0.7;
    const maxOutputTokens = advanced_config?.gemini?.maxOutputTokens ?? 2048;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: query,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: temperature,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: maxOutputTokens,
            },
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Failed to get response from Gemini");
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error("No response generated");
      }

      return { text };
    } catch (error) {
      return {
        error: true,
        message: `Error: ${error.message}`,
      };
    }
  }

  formatMarkdown(text) {
    if (!text) return "";

    // Simple markdown to HTML conversion
    let html = text;

    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, "<pre><code>$2</code></pre>");

    // Bold
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Inline code
    html = html.replace(/`(.+?)`/g, "<code>$1</code>");

    // Headers
    html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

    // Lists
    // Unordered
    html = html.replace(/^\* (.+)$/gm, '<li class="ul-item">$1</li>');
    html = html.replace(/^- (.+)$/gm, '<li class="ul-item">$1</li>');

    // Ordered
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="ol-item">$1</li>');

    // Wrap Unordered
    html = html.replace(/(<li class="ul-item">.*<\/li>\n?)+/g, "<ul>$&</ul>");

    // Wrap Ordered
    html = html.replace(/(<li class="ol-item">.*<\/li>\n?)+/g, "<ol>$&</ol>");

    // Clean up classes
    html = html.replace(/class="ul-item"/g, "");
    html = html.replace(/class="ol-item"/g, "");

    // Links
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Paragraphs
    html = html
      .split("\n\n")
      .map((para) => {
        if (!para.startsWith("<") && para.trim() !== "") {
          return `<p>${para}</p>`;
        }
        return para;
      })
      .join("\n");

    return html;
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

    // Update placeholder and icon based on current engine
    const updateSearchEngine = () => {
      if (this.searchEngine === "google") {
        searchInput.placeholder = window.i18n ? window.i18n.t("search.placeholder_google") : "Search Google...";
        engineIcon.className = "ti ti-brand-google search-engine-icon google";
      } else {
        searchInput.placeholder = window.i18n ? window.i18n.t("search.placeholder_gemini") : "Ask Gemini...";
        engineIcon.className = "ti ti-sparkles search-engine-icon gemini";
      }
    };

    // Open search overlay when icon is clicked
    searchTrigger.onclick = () => {
      searchOverlay.classList.add("active");
      searchInput.focus();
    };

    // Function to close with animation
    const closeWithAnimation = () => {
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
        searchHeader.classList.remove("hidden");
        loadingIcon.classList.remove("active");
        searchInput.value = "";
      }, 800);
    };

    // Function to close search box with animation
    const closeSearchBox = () => {
      // Start blur fadeout and shrink search box
      searchOverlay.classList.add("closing");
      searchModal.classList.add("search-closing");

      // Close and reset after animation
      setTimeout(() => {
        searchOverlay.classList.remove("active");
        searchOverlay.classList.remove("closing");
        searchModal.classList.remove("search-closing");
        searchHeader.classList.remove("hidden");
        searchInput.value = "";
      }, 500);
    };

    // Close search overlay when clicking outside
    searchOverlay.addEventListener("click", (e) => {
      if (e.target === searchOverlay) {
        // If results are showing, animate collapse
        if (searchResults.classList.contains("active")) {
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
          if (searchResults.classList.contains("active")) {
            closeWithAnimation();
          } else {
            // If just search box, animate close
            closeSearchBox();
          }
        }
      }
    });

    // Handle Tab key to toggle search engine
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        this.searchEngine = this.searchEngine === "google" ? "gemini" : "google";
        updateSearchEngine();
      }
    });

    // Handle search
    searchInput.addEventListener("keypress", async (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
          if (this.searchEngine === "google") {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
          } else {
            // Step 1: Hide search header
            searchHeader.classList.add("hidden");

            // Step 2: After header fades, compress to loading icon
            setTimeout(() => {
              searchModal.classList.add("loading");
              loadingIcon.classList.add("active");
            }, 300);

            // Query Gemini
            const result = await this.queryGemini(query);

            // Step 3: Expand to full results window
            setTimeout(() => {
              loadingIcon.classList.remove("active");
              searchModal.classList.remove("loading");
              searchModal.classList.add("expanded");
              searchOverlay.classList.add("results-showing");

              // Small delay for smooth expansion
              setTimeout(() => {
                searchResults.classList.add("active");
              }, 100);
            }, 800);

            // Update content after expansion animation
            setTimeout(() => {
              if (result.error) {
                resultsContent.innerHTML = `
                <div class="error-message">
                  <h3>Error</h3>
                  <p>${result.message}</p>
                  ${
                    !localStorage.getItem("GEMINI_API_KEY") && !window.GEMINI_API_KEY
                      ? `
                    <p style="margin-top: 15px;">
                      <strong>To set up your API key:</strong><br>
                      1. Get a free API key at <a href="https://makersuite.google.com/app/apikey" target="_blank">Google AI Studio</a><br>
                      2. Open browser console (F12) and run:<br>
                      <code style="display: block; margin-top: 5px; padding: 10px; background: ${CONFIG.palette.mantle};">localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');</code><br>
                      3. Reload the page
                    </p>
                  `
                      : ""
                  }
                </div>
              `;
              } else {
                const formattedHtml = this.formatMarkdown(result.text);
                resultsContent.innerHTML = `
                <div class="gemini-response">
                  ${formattedHtml}
                </div>
              `;
              }
            }, 900);

            // Clear search input
            searchInput.value = "";
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
