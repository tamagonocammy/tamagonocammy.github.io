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
      placeholder_gemini: "Preguntarle a Claude...",
      results_title: "Respuesta de Claude",
      loading: "Preguntándole a Claude...",
      error_title_friendly: "No pudimos completar la solicitud",
      error_body_friendly: "Inténtalo de nuevo en unos segundos.",
      error_details_summary: "Detalles técnicos",
      error_failed_response: "No se pudo obtener respuesta de la IA",
      error_no_response: "No se generó ninguna respuesta",
      error_max_tokens: "La respuesta se cortó porque alcanzó el límite de tokens (maxTokens)",
      error_blocked: "La IA bloqueó la respuesta por sus filtros de seguridad",
      fallback_note: "Respondió {model} porque {primary} estaba saturado",
      error_no_api_key: "No hay ninguna clave de API configurada. Guarda tu clave en localStorage con la clave \"CLAUDE_API_KEY\" (o \"GEMINI_API_KEY\" para Gemini). Consigue una clave de Claude en: https://platform.claude.com/",
      error_generic: "Error",
      setup_title: "Para configurar tu clave de API:",
      setup_step_1: "Consigue una clave de API en",
      setup_step_2: "Abre la consola del navegador (F12) y ejecuta:",
      setup_step_3: "Recarga la página",
      setup_key_placeholder: "tu-api-key-aqui",
      prefix_open: "Abrir {name}",
      sources: "Fuentes",
      actions: {
        translate: "Traducir",
        define: "Definir",
        summarize: "Resumir enlace",
        web: "Buscar en la web",
        eli5: "Explicar fácil",
        code: "Código",
      },
      shortcuts: {
        title: "Atajos de teclado",
        page: "En la página",
        in_search: "En la búsqueda",
        tabs: "Ir a una pestaña",
        prev_next: "Pestaña anterior / siguiente",
        search: "Abrir la búsqueda",
        gemini: "Preguntarle a Claude",
        weather: "Ver el clima",
        music: "Ver lo que suena",
        help: "Mostrar esta ayuda",
        engine: "Cambiar de buscador",
        prefix: "Ir directo a un sitio",
        actions: "Elegir una acción rápida",
        close: "Cerrar",
      },
    },

    // Now playing
    music: {
      title: "Sonando ahora",
      play: "Reproducir",
      pause: "Pausa",
      next: "Siguiente",
      previous: "Anterior",
      love: "Marcar como favorita en Last.fm",
      unlove: "Quitar de favoritas en Last.fm",
      lyrics: "Ver la letra en Genius",
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
        rain_chance: "Probabilidad de lluvia",
        air_quality: "Calidad del aire",
      },
      air: { 1: "Buena", 2: "Aceptable", 3: "Moderada", 4: "Mala", 5: "Muy mala" },
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
        lenguas: "Lenguas",
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
      placeholder_gemini: "Ask Claude...",
      results_title: "Claude's Answer",
      loading: "Asking Claude...",
      error_title_friendly: "We couldn't complete the request",
      error_body_friendly: "Please try again in a few seconds.",
      error_details_summary: "Technical details",
      error_failed_response: "Failed to get a response from the AI",
      error_no_response: "No response generated",
      error_max_tokens: "The response was cut off because it hit the token limit (maxTokens)",
      error_blocked: "The AI blocked the response with its safety filters",
      fallback_note: "Answered by {model} because {primary} was busy",
      error_no_api_key: "No AI API key configured. Save your key in localStorage under \"CLAUDE_API_KEY\" (or \"GEMINI_API_KEY\" for Gemini). Get a Claude key at: https://platform.claude.com/",
      error_generic: "Error",
      setup_title: "To set up your API key:",
      setup_step_1: "Get an API key at",
      setup_step_2: "Open browser console (F12) and run:",
      setup_step_3: "Reload the page",
      setup_key_placeholder: "your-api-key-here",
      prefix_open: "Open {name}",
      sources: "Sources",
      actions: {
        translate: "Translate",
        define: "Define",
        summarize: "Summarize link",
        web: "Search the web",
        eli5: "Explain simply",
        code: "Code",
      },
      shortcuts: {
        title: "Keyboard shortcuts",
        page: "On the page",
        in_search: "In search",
        tabs: "Go to a tab",
        prev_next: "Previous / next tab",
        search: "Open search",
        gemini: "Ask Claude",
        weather: "Show the weather",
        music: "Show what's playing",
        help: "Show this help",
        engine: "Switch search engine",
        prefix: "Jump straight to a site",
        actions: "Pick a quick action",
        close: "Close",
      },
    },

    // Now playing
    music: {
      title: "Now playing",
      play: "Play",
      pause: "Pause",
      next: "Next",
      previous: "Previous",
      love: "Love on Last.fm",
      unlove: "Unlove on Last.fm",
      lyrics: "Lyrics on Genius",
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
        rain_chance: "Chance of rain",
        air_quality: "Air quality",
      },
      air: { 1: "Good", 2: "Fair", 3: "Moderate", 4: "Poor", 5: "Very poor" },
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
        lenguas: "Languages",
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
      placeholder_gemini: "Demandu al Claude...",
      results_title: "Respondo de Claude",
      loading: "Demandas al Claude...",
      error_title_friendly: "Ni ne povis plenumi la peton",
      error_body_friendly: "Bonvolu reprovi post kelkaj sekundoj.",
      error_details_summary: "Teknikaj detaloj",
      error_failed_response: "Malsukcesis ricevi respondon de la AI",
      error_no_response: "Neniu respondo estis generita",
      error_max_tokens: "La respondo estis tranĉita ĉar ĝi atingis la ĵetonan limon (maxTokens)",
      error_blocked: "La AI blokis la respondon per siaj sekurecaj filtriloj",
      fallback_note: "Respondis {model} ĉar {primary} estis tro okupata",
      error_no_api_key: "Neniu API-ŝlosilo agordita. Konservu vian ŝlosilon en localStorage sub \"CLAUDE_API_KEY\" (aŭ \"GEMINI_API_KEY\" por Gemini). Akiru ŝlosilon de Claude ĉe: https://platform.claude.com/",
      error_generic: "Eraro",
      setup_title: "Por agordi vian API-ŝlosilon:",
      setup_step_1: "Akiru API-ŝlosilon ĉe",
      setup_step_2: "Malfermu retumilan konzolon (F12) kaj rulu:",
      setup_step_3: "Reŝargu la paĝon",
      setup_key_placeholder: "via-api-slosilo-ci-tie",
      prefix_open: "Malfermi {name}",
      sources: "Fontoj",
      actions: {
        translate: "Traduki",
        define: "Difini",
        summarize: "Resumi ligilon",
        web: "Serĉi en la reto",
        eli5: "Klarigi simple",
        code: "Kodo",
      },
      shortcuts: {
        title: "Fulmoklavoj",
        page: "En la paĝo",
        in_search: "En la serĉo",
        tabs: "Iri al langeto",
        prev_next: "Antaŭa / sekva langeto",
        search: "Malfermi la serĉon",
        gemini: "Demandi al Claude",
        weather: "Montri la veteron",
        music: "Montri la nunan kanton",
        help: "Montri ĉi tiun helpon",
        engine: "Ŝanĝi la serĉilon",
        prefix: "Iri rekte al retejo",
        actions: "Elekti rapidan agon",
        close: "Fermi",
      },
    },

    // Now playing
    music: {
      title: "Nun ludanta",
      play: "Ludi",
      pause: "Paŭzi",
      next: "Sekva",
      previous: "Antaŭa",
      love: "Ŝati en Last.fm",
      unlove: "Ne plu ŝati en Last.fm",
      lyrics: "Kantoteksto en Genius",
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
        rain_chance: "Pluvŝanco",
        air_quality: "Aerkvalito",
      },
      air: { 1: "Bona", 2: "Akceptebla", 3: "Modera", 4: "Malbona", 5: "Tre malbona" },
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
        lenguas: "Lingvoj",
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
