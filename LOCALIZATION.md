# Localization Guide (es / en / eo)

This project includes built-in i18n support for:

- `es` (Spanish)
- `en` (English)
- `eo` (Esperanto)

## Current Default Locale

Locale priority is:

1. `localStorage.locale`
2. `advanced_config.i18n.defaultLocale`
3. fallback: `eo`

In the current repository config (`userconfig.js`), `advanced_config.i18n.defaultLocale` is set to `eo`.

## Change Language

Open browser console (`F12`) and run:

```javascript
window.i18n.setLocale('en');
location.reload();
```

Examples:

```javascript
window.i18n.setLocale('es');
window.i18n.setLocale('eo');
```

## What Is Localized

- Search placeholders and Gemini status text
- Friendly Gemini error messages and setup guidance
- Weather conditions + weather error/fallback copy
- Day/month names, AM/PM terms, ordinals
- Time format strings (short and extended)
- Tab category labels (`principal`, `trabajo`, etc.)

## i18n API

### `window.i18n.t(key)`

```javascript
window.i18n.t('search.placeholder_google');
window.i18n.t('weather.conditions.fog');
```

### `window.i18n.setLocale(locale)`

```javascript
window.i18n.setLocale('en');
```

### `window.i18n.getDays(short = false)` / `getMonths(short = false)`

```javascript
window.i18n.getDays();
window.i18n.getMonths(true);
```

### `window.i18n.getTimeFormat(isExtended = false)`

```javascript
window.i18n.getTimeFormat(false); // short
window.i18n.getTimeFormat(true);  // extended
```

### `window.i18n.getOrdinal(num)`

```javascript
window.i18n.getOrdinal(1);
```

## Add a New Language

1. Open `src/common/i18n.js`
2. Add locale object in `translations`
3. Include all required keys
4. Set locale with `window.i18n.setLocale('xx')`
5. Reload and test Gemini, weather, clock, tabs

## Required Translation Shape

```javascript
{
  search: {
    placeholder_google: string,
    placeholder_gemini: string,
    results_title: string,
    loading: string,
    error_title_friendly: string,
    error_body_friendly: string,
    error_details_summary: string,
    error_failed_response: string,
    error_no_response: string,
    error_no_api_key: string,
    error_generic: string,
    setup_title: string,
    setup_step_1: string,
    setup_step_2: string,
    setup_step_3: string,
    setup_key_placeholder: string
  },
  time: {
    days: { full: string[7], short: string[7] },
    months: { full: string[12], short: string[12] },
    periods: { am: string, pm: string },
    ordinals: { 1?: string, 2?: string, 3?: string, default: string },
    formats: { short: string, extended: string }
  },
  weather: {
    api_error: string,
    unavailable: string,
    unavailable_hint: string,
    error_details_summary: string,
    conditions: {
      clouds: string,
      mist: string,
      fog: string,
      haze: string,
      smoke: string,
      dust: string,
      sand: string,
      ash: string,
      squall: string,
      tornado: string,
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
  },
  tabs: {
    categories: {
      principal: string,
      trabajo: string,
      streaming: string,
      recursos: string,
      desafios: string,
      blogs: string,
      redes_sociales: string,
      juegos: string,
      video: string
    }
  }
}
```
