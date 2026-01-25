// ============================================
// GEMINI API KEY CONFIGURATION
// ============================================
// To use Gemini AI search, you need to set your API key.
// Get a free API key at: https://makersuite.google.com/app/apikey
//
// Option 1: Set it here (not recommended for public repos)
// window.GEMINI_API_KEY = "your-api-key-here";
//
// Option 2: Set it in browser console (recommended)
// localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');
// ============================================

// latte / frappe / macchiato / mocha
// All Gemini AI features work with any palette - colors auto-adapt!
// Try switching between: latte (light), frappe, macchiato, mocha (dark)
const palette = mocha;

const default_config = {
  overrideStorage: true,
  temperature: {
    location: "Bogota",
    scale: "C",
  },
  clock: {
    format: "h:i p",
    format_extended: "a, b d | h:i p",
    iconColor: palette.maroon,
  },
  disabled: [],
  openLastVisitedTab: true,
  tabs: [
    {
      name: "M i l i e",
      background_url: "src/img/banners/cbg-4.gif",
      categories: [
        {
          name: "principal",
          links: [
            {
              name: "gemini",
              url: "https://gemini.google.com",
              icon: "sparkles",
              icon_color: palette.mauve,
            },
            {
              name: "maps",
              url: "https://maps.google.com",
              icon: "map-2",
              icon_color: palette.red,
            },
            {
              name: "reykunyu",
              url: "https://reykunyu.lu/",
              icon: "book-2",
              icon_color: palette.lavender,
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
              name: "notebooklm",
              url: "https://notebooklm.google.com",
              icon: "notebook",
              icon_color: palette.peach,
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
            {
              name: "linkedin",
              url: "https://www.linkedin.com",
              icon: "brand-linkedin",
              icon_color: palette.sky,
            },
          ],
        },
        {
          name: "streaming",
          links: [
            {
              name: "netflix",
              url: "https://netflix.com",
              icon: "brand-netflix",
              icon_color: palette.red,
            },
            {
              name: "apple tv",
              url: "https://tv.apple.com/",
              icon: "brand-apple",
              icon_color: palette.text,
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
          ],
        },
      ],
    },
    {
      name: "dev",
      background_url: "src/img/banners/cbg-8.gif",
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
              name: "stackoverflow",
              url: "https://stackoverflow.com",
              icon: "brand-stackoverflow",
              icon_color: palette.blue,
            },
            {
              name: "mdn",
              url: "https://developer.mozilla.org",
              icon: "brand-firefox",
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
              name: "kaggle",
              url: "https://www.kaggle.com",
              icon: "brain",
              icon_color: palette.green,
            },
            {
              name: "leetcode",
              url: "https://leetcode.com",
              icon: "code-plus",
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
              name: "genbeta",
              url: "https://www.genbeta.com//",
              icon: "versions",
              icon_color: palette.teal,
            },
            {
              name: "hackernews",
              url: "https://news.ycombinator.com",
              icon: "brand-redhat",
              icon_color: palette.peach,
            },
            {
              name: "xataka",
              url: "https://www.xataka.com/",
              icon: "binary-tree",
              icon_color: palette.green,
            },
            {
              name: "dev.to",
              url: "https://dev.to",
              icon: "code-dots",
              icon_color: palette.lavender,
            },
          ],
        },
      ],
    },
    {
      name: "c h i l l",
      background_url: "src/img/banners/cbg-11.gif",
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
              name: "epicgames",
              url: "https://store.epicgames.com",
              icon: "brand-fortnite",
              icon_color: palette.red,
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
              icon: "device-gamepad-2",
              icon_color: palette.yellow,
            },
          ],
        },
        {
          name: "vídeo",
          links: [
            {
              name: "holodex",
              url: "https://holodex.net",
              icon: "player-play",
              icon_color: palette.teal,
            },
            {
              name: "tiktok",
              url: "https://www.tiktok.com",
              icon: "brand-tiktok",
              icon_color: palette.red,
            },
            {
              name: "twitch",
              url: "https://www.twitch.tv",
              icon: "brand-twitch",
              icon_color: palette.mauve,
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
    model: "gemini-3-flash-preview",      // Model to use (check Google AI docs for latest)
    temperature: 0.7,                      // Randomness: 0.0 (deterministic) to 1.0 (creative)
    maxOutputTokens: 2048,                 // Maximum response length
  },

  // Weather API Settings
  weather: {
    apiKey: "50a34e070dd5c09a99554b57ab7ea7e2",  // OpenWeatherMap free tier key
    language: "es",                               // Language code: "es", "en", "fr", etc.
  },

  // Internationalization (i18n)
  i18n: {
    defaultLocale: "es",    // Default language: "es" (Spanish), "en" (English)
  },

  // localStorage Configuration
  storage: {
    keyPrefix: "",          // Custom prefix for localStorage keys (empty = no prefix)
  },
};

const CONFIG = new Config(default_config, palette);

const root = document.querySelector(":root");
root.style.setProperty("--bg", palette.mantle);
root.style.setProperty("--accent", palette.green);
