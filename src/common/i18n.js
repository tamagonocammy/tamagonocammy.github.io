// ============================================
// INTERNATIONALIZATION (i18n) MODULE
// ============================================
// Default language: Esperanto (eo)
// Available languages: en, es, eo

const translations = {
  es: {
    // Search interface
    search: {
      placeholder_google: "Buscar en Google...",
      placeholder_gemini: "Preguntarle a Gemini...",
      results_title: "Resultados de Gemini",
      loading: "Preguntándole a Gemini...",
      error_failed_response: "No se pudo obtener respuesta de Gemini",
      error_no_response: "No se generó ninguna respuesta",
      error_no_api_key: "Clave de API de Gemini no configurada. Configura tu clave en localStorage con la clave \"GEMINI_API_KEY\" o define window.GEMINI_API_KEY en userconfig.js. Obtén tu clave gratuita en: https://makersuite.google.com/app/apikey",
      error_generic: "Error",
      setup_title: "Para configurar tu clave de API:",
      setup_step_1: "Obtén una clave gratuita en",
      setup_step_2: "Abre la consola del navegador (F12) y ejecuta:",
      setup_step_3: "Recarga la página",
      setup_key_placeholder: "tu-api-key-aqui",
    },

    // Date and time
    time: {
      days: {
        full: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
        short: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
      },
      months: {
        full: [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ],
        short: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
      },
      periods: {
        am: "AM",
        pm: "PM",
      },
      ordinals: {
        default: "º",
      },
      formats: {
        short: "H:i",
        extended: "e \\d\\e B \\d\\e Y | H:i",
      },
    },

    // Weather
    weather: {
      api_error: "La API del clima devolvió un error:",
      conditions: {
        clouds: "Nublado",
        mist: "Neblina",
        haze: "Bruma",
        smoke: "Humo",
        drizzle: "Llovizna",
        snow: "Nieve",
        rain: "Lluvia",
        clear: "Despejado",
        thunderstorm: "Tormenta",
      },
    },

    // Settings
    settings: {
      title: "Configuración",
      theme: "Tema",
      language: "Idioma",
      temperature: "Temperatura",
      location: "Ubicación",
    },

    tabs: {
      categories: {
        principal: "Principal",
        trabajo: "Trabajo",
        streaming: "Streaming",
        recursos: "Recursos",
        desafios: "Desafíos",
        blogs: "Blogs",
        redes_sociales: "Redes sociales",
        juegos: "Juegos",
        video: "Vídeo",
      },
    },
  },

  en: {
    // Search interface
    search: {
      placeholder_google: "Search Google...",
      placeholder_gemini: "Ask Gemini...",
      results_title: "Gemini Results",
      loading: "Asking Gemini...",
      error_failed_response: "Failed to get response from Gemini",
      error_no_response: "No response generated",
      error_no_api_key: "Gemini API key not configured. Please set your API key in localStorage with key \"GEMINI_API_KEY\" or define window.GEMINI_API_KEY in userconfig.js. Get your free API key at: https://makersuite.google.com/app/apikey",
      error_generic: "Error",
      setup_title: "To set up your API key:",
      setup_step_1: "Get a free API key at",
      setup_step_2: "Open browser console (F12) and run:",
      setup_step_3: "Reload the page",
      setup_key_placeholder: "your-api-key-here",
    },

    // Date and time
    time: {
      days: {
        full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      },
      months: {
        full: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      },
      periods: {
        am: "AM",
        pm: "PM",
      },
      ordinals: {
        1: "st",
        2: "nd",
        3: "rd",
        default: "th",
      },
      formats: {
        short: "I:i p",
        extended: "B e, Y | I:i p",
      },
    },

    // Weather
    weather: {
      api_error: "Weather API returned an error:",
      conditions: {
        clouds: "Cloudy",
        mist: "Mist",
        haze: "Haze",
        smoke: "Smoke",
        drizzle: "Drizzle",
        snow: "Snow",
        rain: "Rain",
        clear: "Clear",
        thunderstorm: "Thunderstorm",
      },
    },

    // Settings
    settings: {
      title: "Settings",
      theme: "Theme",
      language: "Language",
      temperature: "Temperature",
      location: "Location",
    },

    tabs: {
      categories: {
        principal: "Main",
        trabajo: "Work",
        streaming: "Streaming",
        recursos: "Resources",
        desafios: "Challenges",
        blogs: "Blogs",
        redes_sociales: "Social media",
        juegos: "Games",
        video: "Video",
      },
    },
  },

  eo: {
    // Search interface
    search: {
      placeholder_google: "Serĉi per Google...",
      placeholder_gemini: "Demandu al Gemini...",
      results_title: "Rezultoj de Gemini",
      loading: "Demandas al Gemini...",
      error_failed_response: "Malsukcesis ricevi respondon de Gemini",
      error_no_response: "Neniu respondo estis generita",
      error_no_api_key: "API-ŝlosilo de Gemini ne agordita. Bonvolu agordi vian API-ŝlosilon en localStorage kun la ŝlosilo \"GEMINI_API_KEY\" aŭ difini window.GEMINI_API_KEY en userconfig.js. Ricevu vian senpagan API-ŝlosilon ĉe: https://makersuite.google.com/app/apikey",
      error_generic: "Eraro",
      setup_title: "Por agordi vian API-ŝlosilon:",
      setup_step_1: "Ricevu senpagan API-ŝlosilon ĉe",
      setup_step_2: "Malfermu retumilan konzolon (F12) kaj rulu:",
      setup_step_3: "Reŝargu la paĝon",
      setup_key_placeholder: "via-api-slosilo-ci-tie",
    },

    // Date and time
    time: {
      days: {
        full: ["dimanĉo", "lundo", "mardo", "merkredo", "ĵaŭdo", "vendredo", "sabato"],
        short: ["dim", "lun", "mar", "mer", "ĵaŭ", "ven", "sab"],
      },
      months: {
        full: [
          "januaro",
          "februaro",
          "marto",
          "aprilo",
          "majo",
          "junio",
          "julio",
          "aŭgusto",
          "septembro",
          "oktobro",
          "novembro",
          "decembro",
        ],
        short: ["jan", "feb", "mar", "apr", "maj", "jun", "jul", "aŭg", "sep", "okt", "nov", "dec"],
      },
      periods: {
        am: "atm",
        pm: "ptm",
      },
      ordinals: {
        default: "-a",
      },
      formats: {
        short: "H:i",
        extended: "o B Y | H:i",
      },
    },

    // Weather
    weather: {
      api_error: "Vetera API redonis eraron:",
      conditions: {
        clouds: "Nubeta",
        mist: "Nebulo",
        haze: "Brumeto",
        smoke: "Fumo",
        drizzle: "Pluveto",
        snow: "Neĝo",
        rain: "Pluvo",
        clear: "Klara",
        thunderstorm: "Ŝtormo",
      },
    },

    // Settings
    settings: {
      title: "Agordoj",
      theme: "Etoso",
      language: "Lingvo",
      temperature: "Temperaturo",
      location: "Loko",
    },

    tabs: {
      categories: {
        principal: "Ĉefa",
        trabajo: "Laboro",
        streaming: "Fluado",
        recursos: "Rimedoj",
        desafios: "Defioj",
        blogs: "Blogoj",
        redes_sociales: "Sociaj retoj",
        juegos: "Ludoj",
        video: "Video",
      },
    },
  },
};

class I18n {
  constructor(locale = "eo") {
    this.locale = locale;
    this.loadLocale();
  }

  loadLocale() {
    // Try to load from localStorage first
    const savedLocale = localStorage.getItem("locale");
    if (savedLocale && translations[savedLocale]) {
      this.locale = savedLocale;
    }
  }

  setLocale(locale) {
    if (translations[locale]) {
      this.locale = locale;
      localStorage.setItem("locale", locale);
      return true;
    }
    return false;
  }

  t(key) {
    const get = (obj, path) => path.split(".").reduce((o, i) => (o ? o[i] : undefined), obj);
    const value = get(translations[this.locale], key);

    if (value !== undefined) return value; // Return value if found (even if it's null/false/0)

    // Fallback to English
    const fallbackValue = get(translations.en, key);
    if (fallbackValue !== undefined) return fallbackValue; // Return English fallback if found

    return key; // If not found in current locale or English, return the key itself
  }

  getDays(short = false) {
    return short ? this.t("time.days.short") : this.t("time.days.full");
  }

  getMonths(short = false) {
    return short ? this.t("time.months.short") : this.t("time.months.full");
  }

  getOrdinal(num) {
    const ordinals = this.t("time.ordinals");
    const lastDigit = num.toString().length > 1 ? parseInt(num.toString().split("")[1]) : num;
    return ordinals[lastDigit] || ordinals.default || "";
  }

  getTimeFormat(extended = false) {
    const key = extended ? "time.formats.extended" : "time.formats.short";
    const value = this.t(key);
    return value !== key ? value : null;
  }
}

// Create global i18n instance
if (typeof window !== "undefined") {
  // Priority: saved locale > advanced_config > default (eo)
  const defaultLocale = localStorage.getItem("locale") || advanced_config?.i18n?.defaultLocale || "eo";
  window.i18n = new I18n(defaultLocale);
}
