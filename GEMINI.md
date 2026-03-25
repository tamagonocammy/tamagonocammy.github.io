# Gemini/Copilot Developer Notes for Catppuccin Startpage

This document is a technical map for AI coding assistants and contributors.

## Project Snapshot

Catppuccin Startpage is a vanilla JS Web Components startpage (no npm/build step).

Main features:

- Config-driven tabs/categories/links (`userconfig.js`)
- Weather widget (OpenWeatherMap)
- Clock with localized short/extended formats
- Gemini + Google dual search mode in the status bar
- Internationalization (`es`, `en`, `eo`)

## Architecture

### Core files

- `userconfig.js`: user-editable configuration and `advanced_config`
- `src/common/config.js`: Proxy-based config merge/persistence
- `src/common/i18n.js`: translations + i18n API
- `src/common/strftime.js`: date/time formatting helpers
- `src/components/statusbar/statusbar.component.js`: search overlay, Gemini logic, markdown formatting
- `src/components/weather/weather.component.js`: weather UI + fallback behavior
- `src/components/weather/weather.api.js`: API fetch client
- `src/components/clock/clock.component.js`: main/additional clocks
- `src/common/theme.js`: automatic light/dark theme initialization

### Script loading order (critical)

`index.html` should keep this order:

1. `palette.js`
2. `theme.js`
3. `utils.js`, `storage.js`, `actions.js`
4. `config.js`
5. `userconfig.js` (creates global `CONFIG`)
6. `i18n.js`, `strftime.js`, `component.js`
7. component files
8. `module.js`

If order changes, components may fail with undefined globals.

## Configuration Model

`CONFIG` is built with:

```javascript
const CONFIG = new Config(default_config, palette);
```

Notes:

- Auto-persisted through Proxy `set`
- `overrideStorage: true` forces file values over localStorage
- Exception: `tabs` always sync from file

`advanced_config` currently controls:

- `gemini`: model, temperature, maxOutputTokens
- `weather`: API key and language
- `i18n`: default locale
- `storage`: localStorage key prefix

## i18n Details

`window.i18n` provides:

```javascript
window.i18n.t('search.placeholder_google');
window.i18n.setLocale('en');
window.i18n.getTimeFormat(true);
```

Locale resolution:

1. saved `localStorage.locale`
2. `advanced_config.i18n.defaultLocale`
3. fallback `eo`

Current repo config uses `eo` as default locale.

## Gemini Integration

Gemini query flow is in `statusbar.component.js` (`queryGemini`).

- Key source priority:
  1. `localStorage.getItem('GEMINI_API_KEY')`
  2. `window.GEMINI_API_KEY`
- Endpoint:
  - `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
- Model/settings from `advanced_config.gemini`
- Response path expected:
  - `data.candidates[0].content.parts[0].text`

Search UX:

- `/` opens overlay
- `Tab` toggles Google <-> Gemini while input is focused
- `Escape` closes overlay/modal
- `Enter` submits query

## Markdown Rendering in Gemini Responses

`formatMarkdown()` currently supports:

- headings, emphasis, inline code, code blocks
- lists (ordered/unordered)
- blockquotes
- links and images
- markdown tables

Implementation escapes unsafe HTML first, then restores formatted output.

## Weather Integration

`WeatherForecastClient` reads:

- `advanced_config.weather.apiKey`
- `advanced_config.weather.language`

Fetches from OpenWeatherMap and returns normalized result:

```javascript
{ temperature, condition, description }
```

On failures, returns:

```javascript
{ error: true, message: "..." }
```

UI side (`weather.component.js`) shows friendly fallback text plus optional technical details in tooltip/title.

## Clock Behavior

`clock.component.js` supports:

- compact mode (`time.formats.short`)
- extended mode (`time.formats.extended`)
- click-to-toggle compact/extended
- optional `additionalClocks` with IANA timezone names

## Theme & Palette

Theme initialization uses:

```javascript
const preferredLightTheme = latte;
const preferredDarkTheme = mocha;
let palette = initThemeSystem(preferredLightTheme, preferredDarkTheme);
```

Gemini styling is palette-aware via `CONFIG.palette.*` tokens.

## Manual Testing Checklist

- Open `index.html` in browser
- Verify `/` opens search overlay
- Toggle Google/Gemini with `Tab`
- Submit Gemini query with valid API key
- Validate markdown formatting in response
- Trigger invalid key and confirm friendly error panel
- Toggle locale (`es`/`en`/`eo`) and verify search/weather/clock text
- Test weather failure fallback text
- Test clock compact/extended toggle
- Test at least two palettes

## Common Console Commands

```javascript
console.log(CONFIG);
window.i18n.t('search.placeholder_google');
window.i18n.setLocale('en');
localStorage.getItem('GEMINI_API_KEY');
new WeatherForecastClient('Bogota').getWeather().then(console.log);
```

## Contribution Guardrails

- Keep vanilla JS approach (no framework/build migration)
- Use `window.i18n.t()` for user-facing strings
- Keep component script order intact
- Avoid hardcoded colors when palette tokens exist
- Update docs when config keys or i18n keys change
