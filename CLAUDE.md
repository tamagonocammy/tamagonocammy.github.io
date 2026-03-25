# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aesthetic browser startpage in Catppuccin style, built with vanilla JavaScript Web Components. Zero build tools—pure HTML/CSS/JS loaded directly in the browser.

## Development Commands

No build, test, or lint commands exist. The project uses `pre-commit` for basic file checks:

```bash
# One-time setup
pre-commit install

# Run checks manually on all files
pre-commit run --all-files
```

Testing is manual: open `index.html` in a browser. Use DevTools with "Show user agent shadow DOM" enabled to inspect components.

## Architecture

### Component System (Web Components)

All UI components extend the base `Component` class (`src/common/component.js`), which provides shadow DOM encapsulation, resource management, and rendering utilities.

```javascript
class MyComponent extends Component {
  imports() { return [this.resources.icons.tabler]; }
  style() { return `/* CSS */`; }
  template() { return `<!-- HTML -->`; }
  connectedCallback() {
    this.render();
    this.activate(); // Wire up event listeners here
  }
}
```

Registered components (`src/common/module.js`): `tabs-list`, `weather-forecast`, `current-time`, `status-bar`.

Components are disabled by adding their name to `CONFIG.disabled` in `userconfig.js`.

### Config System (Proxy-Based)

`userconfig.js` is the **only file users edit**. It instantiates the global `CONFIG` object via `new Config(default_config, palette)`.

- Config values persist to localStorage automatically via Proxy `set` trap
- `overrideStorage: true` in `userconfig.js` forces file values over localStorage (except `tabs`, which always sync from file)
- Access palette colors via `CONFIG.palette.*` (e.g., `${CONFIG.palette.base}`)

### Automatic Theme System

`theme.js` provides `initThemeSystem(preferredLightTheme, preferredDarkTheme)`:

- Detects `prefers-color-scheme` and selects appropriate palette
- Listens for OS theme changes and reloads page by default
- Returns the active palette object to be passed to `Config`

### Script Load Order (Critical)

Scripts in `index.html` must load in this exact order:

1. `palette.js` — Defines Catppuccin color objects
2. `theme.js` — Auto-selects light/dark palette
3. `utils.js`, `storage.js`, `actions.js`
4. `config.js` — Defines `Config` class
5. **`userconfig.js`** — User configuration; instantiates `CONFIG`
6. `i18n.js`, `strftime.js`, `component.js`
7. Component implementations (`*/**.component.js`)
8. `module.js` — Registers components

### Component Conventions

- **CSS Classes**: kebab-case (`.search-overlay`)
- **Properties**: camelCase (`.currentTabIndex`)
- Cache DOM references in `activate()` using `this.refs` proxy, not repeated `querySelector` calls
- Shadow DOM prevents CSS leakage but also prevents external styles from affecting components

### Gemini AI Integration

Implemented in `statusbar.component.js`. Press `/` to open search, `Tab` to toggle between Google and Gemini.

- API key: `localStorage.setItem('GEMINI_API_KEY', 'key')` or `window.GEMINI_API_KEY` in `userconfig.js`
- Configurable via `advanced_config.gemini` (model, temperature, maxOutputTokens)
- Returns markdown-formatted responses with code block highlighting

### Internationalization

`i18n.js` provides `window.i18n.t('key')` and `window.i18n.setLocale('en')`.

- Default locale set in `advanced_config.i18n.defaultLocale`
- Available locales: `es` (Spanish), `en` (English), `eo` (Esperanto)
- Use `window.i18n.t()` for all user-facing strings

**i18n API:**

```javascript
window.i18n.t('search.placeholder_google')     // Get translation by dot-notation key
window.i18n.setLocale('en')                   // Switch language (persists to localStorage)
window.i18n.getDays(short = false)            // Get localized day names
window.i18n.getMonths(short = false)          // Get localized month names
window.i18n.getOrdinal(num)                   // Get ordinal suffix (e.g., "º", "st")
```

**Translation structure** includes: `search.*`, `time.days/months/periods`, `weather.conditions`, `settings.*`

### Weather API

`weather.component.js` + `weather.api.js`. Free OpenWeatherMap tier (60 calls/minute).

- Configure location in `userconfig.js` `temperature.location`
- API key and language in `advanced_config.weather`

### Storage Abstraction

`storage.js` provides namespaced localStorage access:

```javascript
const storage = new Storage("config");
storage.set("key", value);
storage.get("key");
storage.hasValue("key");
storage.save(jsonString);
```

- Gemini API key stored separately: `localStorage.setItem('GEMINI_API_KEY', 'key')`
- Language preference: `localStorage.setItem('locale', 'en')`

### Error Handling

Return standardized error objects, don't throw:

```javascript
// Correct
return { error: true, message: "API failed" };

// Incorrect
throw new Error("API failed");
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `/` | Open search overlay, focus input |
| `Tab` | Toggle between Google Search and Gemini AI (when input focused) |
| `Enter` | Execute search / submit query |
| `Escape` | Close search modal, clear results |

### Component Resources

Components import resources via `imports()` method:

**Fonts** (Google Fonts or local in `src/fonts/`):
- `this.resources.fonts.roboto/lato/nunito/raleway`
- `this.resources.localFonts.*` (when `CONFIG.localFonts` is true)

**Icons**:
- `this.resources.icons.material` / `materialLocal`
- `this.resources.icons.tabler` (Tabler Icons)
- `this.resources.icons.cryptofont`

**Libraries**:
- `this.resources.libs.awoo` / `awooLocal` (CSS utility framework)

Use `getFontResource()`, `getIconResource()`, `getLibraryResource()` helpers to respect `CONFIG.localIcons`/`CONFIG.localFonts` settings.

### Debugging

Open browser console (F12) and use these globals:

```javascript
// Inspect current config
console.log(CONFIG);

// Test translations
window.i18n.t('search.placeholder_google');

// Activate component manually
Actions.activate('status-bar');

// Test palette change
window.CONFIG.palette = mocha;

// Get rendered component references
console.log(RenderedComponents);

// Test weather API
new WeatherForecastClient("Bogota").getWeather().then(console.log);

// Check Gemini key
localStorage.getItem('GEMINI_API_KEY');
```

Enable "Show user agent shadow DOM" in DevTools settings to inspect component internals.

## Key Files

| File | Purpose |
|------|---------|
| `userconfig.js` | **Only user-edited config** — tabs, bookmarks, palette, API keys |
| `src/common/palette.js` | Catppuccin color definitions (latte, frappe, macchiato, mocha) |
| `src/common/theme.js` | Automatic light/dark theme detection |
| `src/common/config.js` | Proxy-based Config class with auto-save |
| `src/common/component.js` | Base Web Component class |
| `src/common/module.js` | Component registration |
| `src/common/i18n.js` | Localization system |
