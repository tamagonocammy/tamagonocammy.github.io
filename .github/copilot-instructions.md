# Copilot Instructions for Catppuccin Startpage

## Project Overview

**Catppuccin Startpage** is a minimalist, aesthetic browser startpage built with vanilla JavaScript Web Components. It features a tabbed interface for organizing bookmarks, integrated weather widget, clock display, and **Google Gemini AI search integration** with dual search mode (Google/Gemini toggle).

### Core Philosophy
- **Minimalism**: Clean UI with reduced visual noise
- **No Build Tool**: Pure vanilla JS using Web Components API—no npm, webpack, or transpilation
- **Automatic Theme System**: Auto-switch light/dark based on OS/browser (`theme.js`)
- **Catppuccin Color Palettes**: Four supported palettes (Latte, Frappé, Macchiato, Mocha) defined in `palette.js`
- **Configuration-Driven**: All customization happens via `userconfig.js`

---

## Architecture & Data Flow

### Component System (Web Components)

All UI elements extend the base `Component` class ([src/common/component.js](../src/common/component.js#L1)):

```javascript
class Component extends HTMLElement {
  style() { /* return CSS string */ }
  template() { /* return HTML string */ }
  imports() { /* return array of resource links */ }
}
```

**Registered Components** ([src/common/module.js](../src/common/module.js)):
- `<tabs-list>` – Main tab navigation + bookmark container
- `<weather-forecast>` – Weather widget
- `<current-time>` – Clock display
- `<status-bar>` – Search bar with Gemini AI integration

### Config System (Proxy-Based)

[src/common/config.js](../src/common/config.js#L1) defines the `Config` manager:
- `userconfig.js` is the **only file users edit** and is responsible for instantiating `CONFIG` via `new Config(default_config, palette)`
- `Config` merges `userconfig.js` values with localStorage persistence
- Auto-saves any property change via Proxy `set` trap
- Setting `overrideStorage: true` in `userconfig.js` prevents localStorage override (**except** `tabs`, which always sync from file)

### Automatic Theme System (Light/Dark)

[src/common/theme.js](../src/common/theme.js) provides auto theme selection:
- `initThemeSystem(preferredLightTheme, preferredDarkTheme)` chooses the initial palette based on `prefers-color-scheme`
- Listens for OS theme changes and reloads by default (unless you pass a callback)
- `userconfig.js` typically sets:
  - `preferredLightTheme` (e.g. `latte`)
  - `preferredDarkTheme` (e.g. `mocha`)
  - `palette = initThemeSystem(preferredLightTheme, preferredDarkTheme)`

### Dual Search Engine (Gemini Integration)

[src/components/statusbar/statusbar.component.js](../src/components/statusbar/statusbar.component.js#L12) implements toggle between Google and Gemini.

### Internationalization (i18n)

[src/common/i18n.js](../src/common/i18n.js#L1) provides translation API:
```javascript
window.i18n.t('search.placeholder_google') // Get translated string
window.i18n.setLocale('en') // Switch language
```
- **Languages**: Spanish (`es`) default, English (`en`) available.
- **Config**: Set `advanced_config.i18n.defaultLocale` in `userconfig.js` or `localStorage.setItem('locale', 'en')`.

---

## Key Files & Patterns

| File | Purpose |
|------|---------|
| [userconfig.js](../userconfig.js#L1) | **ONLY config file users edit** – tabs, palette, location, Gemini key, advanced settings |
| [src/common/palette.js](../src/common/palette.js) | Color palette definitions (Catppuccin flavors) |
| [src/common/theme.js](../src/common/theme.js) | Automatic light/dark theme detection (`prefers-color-scheme`) |
| [src/common/storage.js](../src/common/storage.js) | localStorage abstraction layer |
| [src/common/utils.js](../src/common/utils.js) | Utility functions (DOM queries, event helpers) |
| [src/common/strftime.js](../src/common/strftime.js) | Time formatting (respects locale) |
| [index.html](../index.html#L1) | Single HTML file – loads scripts in strict order (palette → utils → config → components) |

### Script Load Order (Critical)
1. `palette.js` – Defines palettes before any palette usage
2. `theme.js` – Auto-selects light/dark palette from system preference
3. `utils.js`, `storage.js`, `actions.js`
4. `config.js` – Defines `Config` class (does not instantiate `CONFIG`)
5. **`userconfig.js`** – User configuration; instantiates `CONFIG`
6. `i18n.js`, `strftime.js`, `component.js`
7. Component implementations
8. `module.js` – Registers components

### Naming Conventions
- **CSS Classes**: kebab-case (`.search-overlay`, `.link-icon`)
- **Component Properties**: camelCase references (`.externalRefs`, `.currentTabIndex`)
- **Static Methods**: Used for reusable HTML generation (e.g., `Links.getIcon()`, `Category.getAll()`)

---

## Development Patterns

### Adding a New Component
1. Create file: `src/components/[name]/[name].component.js`
2. Extend `Component` class with `style()`, `template()`, `imports()` methods
3. Register in [src/common/module.js](../src/common/module.js) and add to `index.html`
4. Call `this.activate()` after rendering in `connectedCallback()`

Example structure:
```javascript
class MyComponent extends Component {
  constructor() { super(); }
  imports() { return [this.resources.icons.tabler]; }
  style() { return `/* CSS here */`; }
  template() { return `<!-- HTML here -->`; }
  connectedCallback() {
    this.shadow.innerHTML = `${await this.loadStyles()}${this.template()}`;
    this.activate();
  }
  activate() { /* wire up event listeners */ }
}
```

### Styling Components
- Use **shadow DOM** (`this.attachShadow({ mode: "open" })`)
- Return CSS as string from `style()` method
- Reference `CONFIG.palette.*` colors (e.g., `${CONFIG.palette.base}`)
- Icons from: Material Icons, Tabler Icons, or CryptoFont
- **Performance**: Avoid frequent DOM queries; cache refs in `refs` object and populate in `activate()`
- Shadow DOM **prevents CSS leakage** but also prevents external styles from affecting component

### Weather API Integration
[src/components/weather/weather.api.js](../src/components/weather/weather.api.js) pattern:
```javascript
class WeatherForecastClient {
  constructor(location) {
    // Reads API key and language from `advanced_config.weather`
    this.appId = advanced_config?.weather?.apiKey || "YOUR_KEY";
    const language = advanced_config?.weather?.language || "es";
    this.url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(location)}&units=metric&lang=${language}&appid=${this.appId}`;
  }
  async getWeather() { /* fetch and parse */ }
}
```
- Free tier limits: 60 calls/minute; stores temp/condition/description
- Called periodically; cache results to avoid rate limits
- Return normalized object: `{ temperature, condition, description }`

### Gemini API Integration
[src/components/statusbar/statusbar.component.js](../src/components/statusbar/statusbar.component.js) implements the AI logic:

```javascript
async queryGemini(query) {
  const apiKey = localStorage.getItem("GEMINI_API_KEY") || window.GEMINI_API_KEY;
  if (!apiKey) return { error: true, message: "setup link" };

  // Uses settings from `advanced_config.gemini` with sensible defaults
  // model: advanced_config.gemini.model (default: gemini-3-flash-preview)
  // temperature: advanced_config.gemini.temperature (default: 0.7)
  // maxOutputTokens: advanced_config.gemini.maxOutputTokens (default: 2048)
  // POST to generativelanguage.googleapis.com/v1beta/models/${model}:generateContent
  // Response path: data.candidates[0].content.parts[0].text
}
```
- **API Key**: Checks `localStorage` first, then `window.GEMINI_API_KEY` (from `userconfig.js`).
- **Markdown**: Custom `formatMarkdown()` method handles:
    - Code blocks with syntax highlighting style
    - Tables
    - Images
    - Blockquotes, Lists, Headers
- **Error Handling**: Returns standardized error objects displayed in the UI.

### localStorage & Config Persistence
- Use `Storage` class for namespaced key access: `new Storage("config").get("setting")`
- Gemini key stored separately: `localStorage.setItem('GEMINI_API_KEY', 'key')`
- `CONFIG` object auto-saves via Proxy trap—modify `CONFIG.myProperty = value` to persist
- `overrideStorage: true` forces userconfig values; tabs always override

### Event Handling & Keyboard Shortcuts
Implement in `activate()` method after DOM is ready.
**Current Shortcuts**:
- **`/`**: Open search overlay, focus input
- **`Tab`**: Toggle between Google Search and Gemini AI (only when input focused)
- **`Escape`**: Close search modal, clear results
- **`Enter`**: Submit search query

### State Management & References
Store DOM references in `refs` object and cache in `activate()`:
```javascript
refs = {
  input: ".search-input",
  overlay: ".search-overlay",
  results: ".search-results"
};
activate() {
  this.input = this.shadow.querySelector(this.refs.input);
  this.overlay = this.shadow.querySelector(this.refs.overlay);
}
```
- Reduces repeated `querySelector` calls (performance)
- Updates persist when CONFIG changes via Proxy
- Component state stored in instance variables; reset on palette change if needed

---

## Configuration Details (`userconfig.js`)

The `advanced_config` object in `userconfig.js` controls system-wide behavior:

```javascript
const advanced_config = {
  gemini: {
    model: "gemini-3-flash-preview", // Check Google AI docs for latest models
    temperature: 0.7, // 0.0 - 1.0 (creative)
    maxOutputTokens: 2048,
  },
  weather: {
    apiKey: "...", // OpenWeatherMap Key
    language: "es", // "en", "es", "fr", etc.
  },
  i18n: {
    defaultLocale: "es", // "es" or "en"
  },
  storage: {
    keyPrefix: "",
  },
};
```

---

## Error Handling Patterns

### API Errors
Return standardized error objects (not throwing):
```javascript
// ❌ WRONG
throw new Error("API failed");

// ✅ RIGHT
return { error: true, message: "Failed to fetch weather" };
if (error) return { error: true, message: error.message };
```
- UI checks `response.error` to determine if result or error message
- Always provide actionable messages: "Get free API key at https://makersuite.google.com/app/apikey"
- Log errors to console for debugging: `console.warn("Weather API returned an error:", err)`

### Config Validation
- Validate user config in `default_config` structure before merging
- Check for required fields (location, palette, etc.) with sensible defaults
- If field missing, `autoConfig()` in config.js falls back to `defaults` object

### Shadow DOM Content Errors
- Always catch async operations in `connectedCallback()`: `await this.loadStyles()`
- If `template()` returns null, component is silent (use for optional components)
- If `imports()` fails, component still renders but styling may break—log failures

---

## Performance Considerations

### Shadow DOM & Rendering
- Shadow DOM **isolates styles** but increases render tree depth
- Avoid frequent `innerHTML` assignments; batch DOM updates
- Cache query results in instance variables; don't re-query each frame
- Use CSS transitions instead of JS animations (GPU-accelerated)

### API Calls
- Weather: Call once per component lifecycle, cache result
- Gemini: User-initiated; no polling; 60 req/min free tier limit
- Debounce search input to avoid firing multiple Gemini calls

### Config Proxy Overhead
- Proxy `set` trap fires on every CONFIG property change
- Batch updates when possible: `Object.assign(CONFIG, {...})` still triggers trap
- Avoid circular references in CONFIG object

### Component Initialization Order
- Critical: Scripts load in order defined in `index.html`
- `palette.js` must load before any color references
- `config.js` must load before components access `CONFIG`
- Violation causes "undefined CONFIG" errors

---

## Common Tasks

### Modify Search Behavior
Edit `toggleSearchEngine()` and `handleSearch()` in [statusbar.component.js](../src/components/statusbar/statusbar.component.js)

### Add a New Palette
1. Add color object to [src/common/palette.js](../src/common/palette.js)
2. Reference in `userconfig.js`: `const palette = your_new_palette;`

### Fix Gemini Integration
- Verify API key set: `localStorage.getItem('GEMINI_API_KEY')` in browser console
- Check free tier limits at https://makersuite.google.com/app/apikey
- Response error format: Check `data.candidates[0].content.parts[0].text` path

### Localize UI Strings
Add keys to `translations` object in [src/common/i18n.js](../src/common/i18n.js), then use `window.i18n.t('key.path')`

---

## Testing & Debugging

- **No unit tests** – Project relies on manual browser testing (open `index.html` in Firefox/Chrome)
- **Console API**: `CONFIG`, `window.i18n.t()`, `Actions.activate('component-name')`
- **Palette Switching**: Set `window.CONFIG.palette = mocha; location.reload();` to test themes
- **Check Shadows**: Use DevTools Inspector; shadow DOM is visible if you enable "Show user agent shadow DOM"

---

## External Dependencies (CDN-Only)

- **Fonts**: Roboto, Nunito, Raleway, Fira Sans (Google Fonts)
- **Icons**: Tabler Icons (CDN), Material Icons
- **CSS**: awoo.min.css (custom utility framework)
- **APIs**: Google Generative Language (Gemini), OpenWeatherMap

No npm packages or build dependencies—all loaded at runtime.

---

## When Contributing Code

- Preserve vanilla JS approach; **avoid adding frameworks**
- Test all Catppuccin palettes
- Ensure i18n strings use `window.i18n.t()` for user-facing text
- Update `LOCALIZATION.md` if adding i18n keys
- Document Gemini API changes in `GEMINI_SETUP.md`
- Follow existing indentation (2 spaces) and shadow DOM patterns

---

## Debugging with Console

```javascript
// Inspect CONFIG state
console.log(CONFIG);

// Test i18n
window.i18n.t('search.placeholder_google');

// Manually activate component
Actions.activate('current-time');

// Test palette change (without reload)
window.CONFIG.palette = mocha;

// Check API key
localStorage.getItem('GEMINI_API_KEY');

// Get current component references
console.log(RenderedComponents);

// Test weather fetch
new WeatherForecastClient("Bogota").getWeather().then(console.log);

// Inspect shadow DOM
// DevTools → Settings → Preferences → Show user agent shadow DOM
```
