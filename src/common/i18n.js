// ============================================
// INTERNATIONALIZATION (i18n) MODULE
// ============================================
// Default language: Esperanto (eo)
// Available languages: en, es, eo

const translations = {
  es: {
    // Search interface
    search: {
      placeholder_duckduckgo: "Buscar en DuckDuckGo...",
      placeholder_gemini: "Preguntarle a Gemini...",
      results_title: "Resultados de Gemini",
      loading: "Preguntándole a Gemini...",
      error_title_friendly: "No pudimos completar la solicitud",
      error_body_friendly: "Inténtalo de nuevo en unos segundos.",
      error_details_summary: "Detalles técnicos",
      error_failed_response: "No se pudo obtener respuesta de Gemini",
      error_no_response: "No se generó ninguna respuesta",
      error_max_tokens: "La respuesta se cortó porque alcanzó el límite de tokens (maxOutputTokens)",
      error_blocked: "Gemini bloqueó la respuesta por sus filtros de seguridad",
      fallback_note: "Respondió {model} porque {primary} estaba saturado",
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
      unavailable: "No se pudo obtener el clima ahora",
      unavailable_hint: "Reintentando en la próxima actualización.",
      error_details_summary: "Detalles técnicos",
      popup: {
        location: "Ubicación",
        toggle_scale: "Cambiar escala",
        feels_like: "Sensación térmica",
        humidity: "Humedad",
        wind: "Viento",
        sunrise: "Amanecer",
        sunset: "Atardecer",
      },
      errors: {
        invalid_key: "Clave de API no válida",
        city_not_found: "Ciudad no encontrada",
        rate_limited: "Demasiadas solicitudes, intenta más tarde",
      },
      conditions: {
        clouds: "Nublado",
        mist: "Neblina",
        fog: "Niebla",
        haze: "Bruma",
        smoke: "Humo",
        dust: "Polvo",
        sand: "Arena",
        ash: "Ceniza volcánica",
        squall: "Turbonada",
        tornado: "Tornado",
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

    calendar: {
      prev: "Mes anterior",
      next: "Mes siguiente",
    },
  },

  en: {
    // Search interface
    search: {
      placeholder_duckduckgo: "Search DuckDuckGo...",
      placeholder_gemini: "Ask Gemini...",
      results_title: "Gemini Results",
      loading: "Asking Gemini...",
      error_title_friendly: "We couldn't complete the request",
      error_body_friendly: "Please try again in a few seconds.",
      error_details_summary: "Technical details",
      error_failed_response: "Failed to get response from Gemini",
      error_no_response: "No response generated",
      error_max_tokens: "The response was cut off because it hit the token limit (maxOutputTokens)",
      error_blocked: "Gemini blocked the response with its safety filters",
      fallback_note: "Answered by {model} because {primary} was busy",
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
      unavailable: "Weather is unavailable right now",
      unavailable_hint: "Will retry on the next refresh.",
      error_details_summary: "Technical details",
      popup: {
        location: "Location",
        toggle_scale: "Toggle scale",
        feels_like: "Feels like",
        humidity: "Humidity",
        wind: "Wind",
        sunrise: "Sunrise",
        sunset: "Sunset",
      },
      errors: {
        invalid_key: "Invalid API key",
        city_not_found: "City not found",
        rate_limited: "Too many requests, try again later",
      },
      conditions: {
        clouds: "Cloudy",
        mist: "Mist",
        fog: "Fog",
        haze: "Haze",
        smoke: "Smoke",
        dust: "Dust",
        sand: "Sand",
        ash: "Ash",
        squall: "Squall",
        tornado: "Tornado",
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

    calendar: {
      prev: "Previous month",
      next: "Next month",
    },
  },

  eo: {
    // Search interface
    search: {
      placeholder_duckduckgo: "Serĉi per DuckDuckGo...",
      placeholder_gemini: "Demandu al Gemini...",
      results_title: "Rezultoj de Gemini",
      loading: "Demandas al Gemini...",
      error_title_friendly: "Ni ne povis plenumi la peton",
      error_body_friendly: "Bonvolu reprovi post kelkaj sekundoj.",
      error_details_summary: "Teknikaj detaloj",
      error_failed_response: "Malsukcesis ricevi respondon de Gemini",
      error_no_response: "Neniu respondo estis generita",
      error_max_tokens: "La respondo estis tranĉita ĉar ĝi atingis la ĵetonan limon (maxOutputTokens)",
      error_blocked: "Gemini blokis la respondon per siaj sekurecaj filtriloj",
      fallback_note: "Respondis {model} ĉar {primary} estis tro okupata",
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
      unavailable: "Vetero ne haveblas nun",
      unavailable_hint: "Reprovo okazos ĉe la sekva ĝisdatigo.",
      error_details_summary: "Teknikaj detaloj",
      popup: {
        location: "Loko",
        toggle_scale: "Ŝanĝi skalon",
        feels_like: "Sentiĝas kiel",
        humidity: "Humideco",
        wind: "Vento",
        sunrise: "Sunleviĝo",
        sunset: "Sunsubiro",
      },
      errors: {
        invalid_key: "Nevalida API-ŝlosilo",
        city_not_found: "Urbo ne trovita",
        rate_limited: "Tro da petoj, reprovu poste",
      },
      conditions: {
        clouds: "Nubeta",
        mist: "Nebulo",
        fog: "Nebulo densa",
        haze: "Brumeto",
        smoke: "Fumo",
        dust: "Polvo",
        sand: "Sablo",
        ash: "Vulkana cindro",
        squall: "Subita ŝtormvento",
        tornado: "Tornado",
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

    calendar: {
      prev: "Antaŭa monato",
      next: "Sekva monato",
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
