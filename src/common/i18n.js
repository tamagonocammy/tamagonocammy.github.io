// ============================================
// INTERNATIONALIZATION (i18n) MODULE
// ============================================
// Default language: Spanish (es)
// Available languages: en, es

const translations = {
  es: {
    // Search interface
    search: {
      placeholder_google: "Buscar en Google...",
      placeholder_gemini: "Preguntarle a Gemini...",
      results_title: "Resultados de Gemini",
      loading: "Preguntándole a Gemini...",
    },

    // Date and time
    time: {
      days: {
        full: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      },
      months: {
        full: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        short: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      },
      periods: {
        am: "AM",
        pm: "PM",
      },
      ordinals: {
        default: "º",
      },
    },

    // Weather
    weather: {
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
  },

  en: {
    // Search interface
    search: {
      placeholder_google: "Search Google...",
      placeholder_gemini: "Ask Gemini...",
      results_title: "Gemini Results",
      loading: "Asking Gemini...",
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
    },

    // Weather
    weather: {
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
  },
};

class I18n {
  constructor(locale = "es") {
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
}

// Create global i18n instance
if (typeof window !== "undefined") {
  // Priority: saved locale > advanced_config > default (es)
  const defaultLocale = localStorage.getItem("locale") || advanced_config?.i18n?.defaultLocale || "es";
  window.i18n = new I18n(defaultLocale);
}
