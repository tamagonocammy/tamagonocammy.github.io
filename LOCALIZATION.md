# Localización / Localization

## Español

### ¿Qué está localizado?

La startpage ahora está completamente localizada al español por defecto. Los siguientes elementos están traducidos:

- **Interfaz de búsqueda**: Placeholders de búsqueda para Google y Gemini
- **Resultados de búsqueda**: Títulos y mensajes de carga
- **Fechas y horas**: Nombres de días, meses, AM/PM
- **Clima**: Descripciones de condiciones meteorológicas

### Cambiar el idioma

Para cambiar el idioma, abre la consola del navegador (F12) y ejecuta:

```javascript
// Cambiar a inglés
window.i18n.setLocale('en');
location.reload();

// Cambiar a español
window.i18n.setLocale('es');
location.reload();

// Cambiar a esperanto
window.i18n.setLocale('eo');
location.reload();
```

Tu preferencia de idioma se guarda automáticamente en `localStorage`.

### Idiomas disponibles

- **es** - Español (predeterminado)
- **en** - English
- **eo** - Esperanto

### Agregar un nuevo idioma

1. Abre `src/common/i18n.js`
2. Agrega un nuevo objeto de idioma en `translations`:

```javascript
const translations = {
  es: { ... },
  en: { ... },
  fr: {  // Nuevo idioma
    search: {
      placeholder_google: "Rechercher sur Google...",
      placeholder_gemini: "Demander à Gemini...",
      results_title: "Résultats Gemini",
      loading: "Interroger Gemini...",
    },
    time: {
      days: {
        full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      },
      // ... etc
    }
  }
};
```

3. Establece el nuevo idioma:

```javascript
window.i18n.setLocale('fr');
```

---

## English

### What's localized?

The startpage is now fully localized to Spanish by default. The following elements are translated:

- **Search interface**: Search placeholders for Google and Gemini
- **Search results**: Titles and loading messages
- **Date and time**: Day names, month names, AM/PM
- **Weather**: Weather condition descriptions

### Change language

To change the language, open the browser console (F12) and run:

```javascript
// Switch to English
window.i18n.setLocale('en');
location.reload();

// Switch to Spanish
window.i18n.setLocale('es');
location.reload();

// Switch to Esperanto
window.i18n.setLocale('eo');
location.reload();
```

Your language preference is automatically saved in `localStorage`.

### Available languages

- **es** - Español (default)
- **en** - English
- **eo** - Esperanto

### Adding a new language

1. Open `src/common/i18n.js`
2. Add a new language object in `translations`:

```javascript
const translations = {
  es: { ... },
  en: { ... },
  fr: {  // New language
    search: {
      placeholder_google: "Rechercher sur Google...",
      placeholder_gemini: "Demander à Gemini...",
      results_title: "Résultats Gemini",
      loading: "Interroger Gemini...",
    },
    time: {
      days: {
        full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      },
      // ... etc
    }
  }
};
```

3. Set the new language:

```javascript
window.i18n.setLocale('fr');
```

### API Reference

#### `window.i18n.t(key)`

Get a translation by key using dot notation:

```javascript
window.i18n.t('search.placeholder_google')  // "Buscar en Google..."
window.i18n.t('time.periods.am')            // "AM"
```

#### `window.i18n.setLocale(locale)`

Change the current locale:

```javascript
window.i18n.setLocale('en')  // Switch to English
window.i18n.setLocale('es')  // Switch to Spanish
```

#### `window.i18n.getDays(short = false)`

Get localized day names:

```javascript
window.i18n.getDays()        // ["Domingo", "Lunes", "Martes", ...]
window.i18n.getDays(true)    // ["Dom", "Lun", "Mar", ...]
```

#### `window.i18n.getMonths(short = false)`

Get localized month names:

```javascript
window.i18n.getMonths()      // ["Enero", "Febrero", "Marzo", ...]
window.i18n.getMonths(true)  // ["Ene", "Feb", "Mar", ...]
```

#### `window.i18n.getOrdinal(num)`

Get ordinal suffix for a number:

```javascript
window.i18n.getOrdinal(1)    // "º" (Spanish)
window.i18n.getOrdinal(2)    // "º" (Spanish)
// In English: "st", "nd", "rd", "th"
```

### Translation Structure

The translation objects follow this structure:

```javascript
{
  search: {
    placeholder_google: string,
    placeholder_gemini: string,
    results_title: string,
    loading: string,
    error_no_api_key: string,
    error_generic: string,
    setup_title: string,
    setup_step_1: string,
    setup_step_2: string,
    setup_step_3: string
  },
  time: {
    days: {
      full: string[7],
      short: string[7]
    },
    months: {
      full: string[12],
      short: string[12]
    },
    periods: {
      am: string,
      pm: string
    },
    ordinals: {
      1?: string,
      2?: string,
      3?: string,
      default: string
    }
  },
  weather: {
    conditions: {
      clouds: string,
      mist: string,
      haze: string,
      smoke: string,
      drizzle: string,
      snow: string,
      rain: string,
      clear: string,
      thunderstorm: string
    }
  },
  settings: {
    title: string,
    theme: string,
    language: string,
    temperature: string,
    location: string
  }
}
```

---

## Esperanto

### Kio estas lokalizita?

La startpage nun estas plene tradukita al Esperanto. La jenaj elementoj estas tradukitaj:

- **Serĉa interfaco**: Placeholders por Google kaj Gemini
- **Serĉrezultoj**: Titoloj kaj ŝargmesaĝoj
- **Datoj kaj horoj**: Nomoj de tagoj, monatoj, atm/ptm
- **Vetero**: Priskriboj de veteraj kondiĉoj

### Ŝanĝi la lingvon

Por ŝanĝi la lingvon, malfermu la retumilan konzolon (F12) kaj rulu:

```javascript
// Ŝanĝi al angla
window.i18n.setLocale('en');
location.reload();

// Ŝanĝi al hispana
window.i18n.setLocale('es');
location.reload();

// Ŝanĝi al esperanto
window.i18n.setLocale('eo');
location.reload();
```

Via lingvoprefero estas aŭtomate konservita en `localStorage`.

### Disponeblaj lingvoj

- **es** - Español (apriora)
- **en** - English
- **eo** - Esperanto

### Aldoni novan lingvon

1. Malfermu `src/common/i18n.js`
2. Aldonu novan lingvo-objekton en `translations`:

```javascript
const translations = {
  es: { ... },
  en: { ... },
  eo: { ... },
  fr: {  // Nova lingvo
    search: {
      placeholder_google: "Rechercher sur Google...",
      placeholder_gemini: "Demander à Gemini...",
      results_title: "Résultats Gemini",
      loading: "Interroger Gemini...",
    },
    time: {
      days: {
        full: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
      },
      // ... ktp
    }
  }
};
```

3. Agordu la novan lingvon:

```javascript
window.i18n.setLocale('fr');
```

### API-referenco

#### `window.i18n.t(key)`

Ricevu tradukon laŭ ŝlosilo per punktnotacio:

```javascript
window.i18n.t('search.placeholder_google')  // "Serĉi per Google..."
window.i18n.t('time.periods.am')            // "atm"
```

#### `window.i18n.setLocale(locale)`

Ŝanĝu la aktualan lokalon:

```javascript
window.i18n.setLocale('en')  // Ŝanĝi al angla
window.i18n.setLocale('es')  // Ŝanĝi al hispana
window.i18n.setLocale('eo')  // Ŝanĝi al esperanto
```

#### `window.i18n.getDays(short = false)`

Ricevu lokaligitajn tagnomojn:

```javascript
window.i18n.getDays()        // ["Dimanĉo", "Lundo", "Mardo", ...]
window.i18n.getDays(true)    // ["Dim", "Lun", "Mar", ...]
```

#### `window.i18n.getMonths(short = false)`

Ricevu lokaligitajn monatnomojn:

```javascript
window.i18n.getMonths()      // ["Januaro", "Februaro", "Marto", ...]
window.i18n.getMonths(true)  // ["Jan", "Feb", "Mar", ...]
```

#### `window.i18n.getOrdinal(num)`

Ricevu ordinalan sufikson por nombro:

```javascript
window.i18n.getOrdinal(1)    // "a" (Esperanto)
window.i18n.getOrdinal(2)    // "a" (Esperanto)
// En la hispana: "º"
// En la angla: "st", "nd", "rd", "th"
```
