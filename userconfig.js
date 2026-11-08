/**
 * ==================================================================================
 *  USER CONFIGURATION
 * ==================================================================================
 *  This file is the central control panel for your startpage.
 *  Here you can configure:
 *  - Automatic Theme System (Light/Dark mode)
 *  - Weather location and settings
 *  - Clock format & Multi-timezone support
 *  - Local Assets (Fonts & Icons) for offline use
 *  - Tabs, categories, and links (the core navigation)
 *  - Advanced settings like API keys and system behavior
 *
 *  Tips:
 *  - Changes usually take effect immediately upon saving and refreshing.
 *  - If something breaks, check the browser console for errors.
 *
 *  GEMINI API KEY CONFIGURATION:
 *  To use Gemini AI search, you need to set your API key.
 *  Get a free API key at: https://makersuite.google.com/app/apikey
 *
 *  Option 1: Set it here (not recommended for public repos)
 *  window.GEMINI_API_KEY = "your-api-key-here";
 *
 *  Option 2: Set it in browser console (recommended)
 *  Run this in your browser's dev tools console:
 *  localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');
 * ==================================================================================
 */

// Palette Selection
// -----------------
// Define your preferred light and dark themes.
// The system automatically switches based on your OS/browser settings.
// Available: latte (light) / frappe / macchiato / mocha (dark)
// All Gemini AI features work with any palette - colors auto-adapt!
const preferredLightTheme = latte;
const preferredDarkTheme = mocha;
let palette = initThemeSystem(preferredLightTheme, preferredDarkTheme);

const default_config = {
  // Allow these settings to override whatever is saved in localStorage.
  // Useful when testing new configs.
  overrideStorage: true,

  // Weather Widget Configuration
  temperature: {
    location: "Bogota",
    scale: "C",
  },

  // Clock Widget Configuration
  clock: {
    format: "I:i p",
    format_extended: "A, o B Y | I:i p",
    iconColor: palette.teal,
  },

  // Additional Clocks (Optional)
  // Add more timezones to display next to the main clock
  additionalClocks: [
    // {
    //   label: "NYC",
    //   timezone: "America/New_York",
    //   format: "H:i",
    //   icon_color: palette.peach,
    // },
  ],

  // Components to hide (e.g. ['weather', 'clock'])
  disabled: [],

  // Local assets (fonts and icons)
  localIcons: true,
  localFonts: true,

  // Tab Behavior
  openLastVisitedTab: true,

  // Search Prefixes
  // Start a search with "!key" to send it straight to that site, e.g. "!yt lofi" or "!rk kaltxì".
  // "%s" is replaced by the rest of the query; a prefix with nothing after it opens `home`.
  // Unknown prefixes go to DuckDuckGo, which understands its own !bangs too.
  searchPrefixes: {
    g: { name: "Google", url: "https://www.google.com/search?q=%s", icon: "brand-google", color: palette.blue },
    yt: { name: "YouTube", url: "https://www.youtube.com/results?search_query=%s", home: "https://youtube.com", icon: "brand-youtube", color: palette.red },
    w: { name: "Wikipedia", url: "https://es.wikipedia.org/w/index.php?search=%s", icon: "brand-wikipedia", color: palette.blue },
    wk: { name: "Wiktionary", url: "https://en.wiktionary.org/wiki/Special:Search?search=%s", icon: "vocabulary", color: palette.peach },
    rk: { name: "Reykunyu", url: "https://reykunyu.lu/?q=%s", home: "https://reykunyu.lu/", icon: "book-2", color: palette.lavender },
    dl: { name: "DeepL", url: "https://www.deepl.com/translator#auto/es/%s", icon: "language", color: palette.sapphire },
    gh: { name: "GitHub", url: "https://github.com/search?q=%s", home: "https://github.com", icon: "brand-github", color: palette.green },
    mdn: { name: "MDN", url: "https://developer.mozilla.org/search?q=%s", icon: "books", color: palette.blue },
    lb: { name: "Letterboxd", url: "https://letterboxd.com/search/%s/", home: "https://letterboxd.com", icon: "movie", color: palette.green },
  },

  // --------------------------------------------------------------------------------
  // TABS & LINKS
  // --------------------------------------------------------------------------------
  // Structure:
  // - Tab (e.g., "Home", "Dev")
  //   - Category (e.g., "Social", "News")
  //     - Link (Name, URL, Icon, Color)
  // --------------------------------------------------------------------------------
  tabs: [
    {
      name: "M i l l i e",
      color: palette.lavender,
      background_url: "src/img/banners/banner_21.gif",
      categories: [
        {
          name: "principal",
          links: [
            {
              name: "chatgpt",
              url: "https://chatgpt.com",
              icon: "brand-openai",
              icon_color: palette.green,
            },
            {
              name: "wikipedia",
              url: "https://es.wikipedia.org/wiki/Wikipedia:Portada",
              icon: "brand-wikipedia",
              icon_color: palette.blue,
            },
            {
              name: "youtube",
              url: "https://youtube.com",
              icon: "brand-youtube",
              icon_color: palette.red,
            },
            {
              name: "archive.org",
              url: "https://archive.org",
              icon: "building-bank",
              icon_color: palette.peach,
            },
            {
              name: "neocities",
              url: "https://neocities.org",
              icon: "cat",
              icon_color: palette.pink,
            },
          ],
        },
        {
          name: "trabajo",
          links: [
            {
              name: "gmail",
              url: "https://mail.google.com",
              icon: "brand-gmail",
              icon_color: palette.green,
            },
            {
              name: "deepl",
              url: "https://www.deepl.com/translator",
              icon: "language",
              icon_color: palette.sapphire,
            },
            {
              name: "drive",
              url: "https://drive.google.com/drive/home",
              icon: "brand-google-drive",
              icon_color: palette.blue,
            },
            {
              name: "docs",
              url: "https://docs.google.com",
              icon: "file-text",
              icon_color: palette.teal,
            },
          ],
        },
        {
          name: "lenguas",
          links: [
            {
              name: "reykunyu",
              url: "https://reykunyu.lu/",
              icon: "book-2",
              icon_color: palette.lavender,
            },
            {
              name: "learnnavi",
              url: "https://learnnavi.org",
              icon: "leaf",
              icon_color: palette.teal,
            },
            {
              name: "wiktionary",
              url: "https://en.wiktionary.org",
              icon: "vocabulary",
              icon_color: palette.peach,
            },
            {
              name: "conworkshop",
              url: "https://conworkshop.com",
              icon: "writing",
              icon_color: palette.mauve,
            },
          ],
        },
      ],
    },
    {
      name: "dev",
      color: palette.green,
      background_url: "src/img/banners/banner_17.gif",
      categories: [
        {
          name: "recursos",
          links: [
            {
              name: "github",
              url: "https://github.com",
              icon: "brand-github",
              icon_color: palette.green,
            },
            {
              name: "devdocs",
              url: "https://devdocs.io",
              icon: "books",
              icon_color: palette.blue,
            },
            {
              name: "caniuse",
              url: "https://caniuse.com",
              icon: "browser-check",
              icon_color: palette.mauve,
            },
            {
              name: "codepen",
              url: "https://codepen.io",
              icon: "brand-codepen",
              icon_color: palette.lavender,
            },
          ],
        },
        {
          name: "desafíos",
          links: [
            {
              name: "advent of code",
              url: "https://adventofcode.com",
              icon: "christmas-tree",
              icon_color: palette.green,
            },
            {
              name: "leetcode",
              url: "https://leetcode.com",
              icon: "brand-leetcode",
              icon_color: palette.peach,
            },
            {
              name: "exercism",
              url: "https://exercism.org",
              icon: "code-minus",
              icon_color: palette.red,
            },
            {
              name: "monkeytype",
              url: "https://monkeytype.com",
              icon: "keyboard",
              icon_color: palette.yellow,
            },
          ],
        },
        {
          name: "blogs",
          links: [
            {
              name: "ars technica",
              url: "https://arstechnica.com",
              icon: "atom",
              icon_color: palette.teal,
            },
            {
              name: "hackernews",
              url: "https://news.ycombinator.com",
              icon: "brand-ycombinator",
              icon_color: palette.peach,
            },
            {
              name: "xataka",
              url: "https://www.xataka.com/",
              icon: "binary-tree",
              icon_color: palette.green,
            },
            {
              name: "lobste.rs",
              url: "https://lobste.rs",
              icon: "news",
              icon_color: palette.red,
            },
          ],
        },
      ],
    },
    {
      name: "c h i l l",
      color: palette.rosewater,
      background_url: "src/img/banners/banner_20.webp",
      categories: [
        {
          name: "redes sociales",
          links: [
            {
              name: "twitter",
              url: "https://twitter.com",
              icon: "brand-twitter",
              icon_color: palette.teal,
            },
            {
              name: "instagram",
              url: "https://www.instagram.com",
              icon: "brand-instagram",
              icon_color: palette.peach,
            },
            {
              name: "reddit",
              url: "https://www.reddit.com/",
              icon: "brand-reddit",
              icon_color: palette.red,
            },
            {
              name: "discord",
              url: "https://discord.com/app",
              icon: "brand-discord",
              icon_color: palette.lavender,
            },
            {
              name: "letterboxd",
              url: "https://letterboxd.com",
              icon: "brand-letterboxd",
              icon_color: palette.green,
            },
          ],
        },
        {
          name: "juegos",
          links: [
            {
              name: "steam",
              url: "https://store.steampowered.com",
              icon: "brand-steam",
              icon_color: palette.text,
            },
            {
              name: "gog",
              url: "https://www.gog.com",
              icon: "device-gamepad-2",
              icon_color: palette.mauve,
            },
            {
              name: "itch.io",
              url: "https://itch.io",
              icon: "brand-itch",
              icon_color: palette.yellow,
            },
            {
              name: "twitch",
              url: "https://www.twitch.tv",
              icon: "brand-twitch",
              icon_color: palette.mauve,
            },
          ],
        },
        {
          name: "vídeo",
          links: [
            {
              name: "netflix",
              url: "https://netflix.com",
              icon: "brand-netflix",
              icon_color: palette.red,
            },
            {
              name: "disney+",
              url: "https://www.disneyplus.com/",
              icon: "brand-disney",
              icon_color: palette.green,
            },
            {
              name: "prime video",
              url: "https://www.primevideo.com",
              icon: "brand-amazon",
              icon_color: palette.teal,
            },
            {
              name: "apple tv",
              url: "https://tv.apple.com/",
              icon: "brand-apple",
              icon_color: palette.text,
            },
            {
              name: "crunchyroll",
              url: "https://www.crunchyroll.com",
              icon: "eye",
              icon_color: palette.peach,
            },
          ],
        },
      ],
    },
  ],
};

// ============================================
// ADVANCED CONFIGURATION
// ============================================
// Customize API behavior, model selection, and system defaults
// These settings control previously hardcoded values in component files
// ============================================

const advanced_config = {
  // Gemini AI Settings
  gemini: {
    model: "gemini-3.8-flash", // Model to use (check Google AI docs for latest)
    fallbackModels: ["gemini-3.5-flash"], // Tried in order when the main model is busy ([] to disable)
    temperature: 0.7, // Randomness: 0.0 (deterministic) to 1.0 (creative)
    maxOutputTokens: 2048, // Maximum response length
    thinkingLevel: "low", // Thinking before answering: "minimal" (fastest), "low", "medium", "high" (slowest), or null for the model's default
    systemInstruction:
      "Answer the user's question directly and completely in a single response. You are answering from a startpage search box: each question is sent on its own with no conversation history, so the user cannot reply to you and anything you ask back goes unanswered. Do not ask clarifying questions, do not ask for the user's opinion, and do not request further input. If something is ambiguous, make a reasonable assumption and state it briefly. Never end your response with a follow-up question or an offer to do more.",

    // Quick actions: shown as buttons under the search box in Gemini mode.
    // Click one (or press Alt+1..9) to select it; Enter then sends the prompt with {q} replaced by what you typed.
    // `label` is optional: without it the translated name (search.actions.<id>) is used.
    // `tools` are Gemini tools: urlContext lets it read a link, googleSearch grounds the answer in current results.
    translateTo: "español", // Target language for the translate action
    quickActions: [
      {
        id: "translate",
        icon: "language",
        color: palette.sapphire,
        prompt: "Translate the following into {lang}. If it is already in {lang}, translate it into English instead. Give the translation first, then one short line on any nuance worth knowing.\n\n{q}",
      },
      {
        id: "define",
        icon: "vocabulary",
        color: palette.peach,
        prompt: "Define \"{q}\": part of speech, pronunciation (IPA), meaning(s), a one-sentence etymology, and two example sentences.",
      },
      {
        id: "summarize",
        icon: "file-text",
        color: palette.teal,
        prompt: "Summarize the page at this URL in five bullet points, then one line on why it matters:\n{q}",
        tools: ["urlContext"],
      },
      {
        id: "web",
        icon: "world-search",
        color: palette.green,
        prompt: "Using current web results, answer: {q}",
        tools: ["googleSearch"],
      },
      {
        id: "eli5",
        icon: "mood-kid",
        color: palette.yellow,
        prompt: "Explain this simply, as you would to a curious ten-year-old, with one everyday analogy: {q}",
      },
      {
        id: "code",
        icon: "code",
        color: palette.mauve,
        prompt: "Answer as a senior engineer. Be brief and lead with a short code example: {q}",
      },
    ],
  },

  // Weather API Settings
  // apiKey below is the project's shared free-tier demo key (public since the
  // initial commit, rate-limited). To use your own key without committing it,
  // set it in the browser console instead — it takes priority over this value:
  //   localStorage.setItem('OWM_API_KEY', 'your-api-key-here');
  weather: {
    apiKey: "50a34e070dd5c09a99554b57ab7ea7e2", // OpenWeatherMap free tier key
    language: "eo", // Language code: "eo", "es", "en", "fr", etc.
  },

  // Internationalization (i18n)
  i18n: {
    defaultLocale: "eo", // Default language: "eo" (Esperanto), "es" (Spanish), "en" (English)
  },

  // localStorage Configuration
  storage: {
    keyPrefix: "", // Custom prefix for localStorage keys (empty = no prefix)
  },
};

const CONFIG = new Config(default_config, palette);

const root = document.querySelector(":root");
root.style.setProperty("--bg", palette.mantle);
root.style.setProperty("--accent", palette.green);
