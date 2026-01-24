# Copilot Instructions for Catppuccin Startpage

## Project Overview

**Catppuccin Startpage** is a minimalist, aesthetic browser startpage built with vanilla JavaScript Web Components. It features a tabbed interface for organizing bookmarks, integrated weather widget, clock display, and **Google Gemini AI search integration** with dual search mode (Google/Gemini toggle).

### Core Philosophy
- **Minimalism**: Clean UI with reduced visual noise
- **No Build Tool**: Pure vanilla JS using Web Components API—no npm, webpack, or transpilation
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

[src/common/config.js](../src/common/config.js#L1) creates a reactive config object:
- Merges `userconfig.js` defaults with localStorage persistence
- Auto-saves any property change via Proxy `set` trap
- Setting `overrideStorage: true` in `userconfig.js` prevents localStorage override (except for tabs)

### Dual Search Engine (Gemini Integration)

[src/components/statusbar/statusbar.component.js](../src/components/statusbar/statusbar.component.js#L12) implements toggle:
- **Press Tab** in search input to switch between Google Search and Gemini AI
- API key stored in `localStorage.GEMINI_API_KEY` or `window.GEMINI_API_KEY` (set in `userconfig.js`)
- `queryGemini()` method calls Google Generative Language API (v1beta, gemini-3-flash-preview model)
- Markdown formatting via `formatMarkdown()` converts response to styled HTML

### Internationalization (i18n)

[src/common/i18n.js](../src/common/i18n.js#L1) provides translation API:
```javascript
window.i18n.t('search.placeholder_google') // Get translated string
window.i18n.setLocale('en') // Switch language
```
Supported: Spanish (default), English. Add new language by extending `translations` object.

---

## Key Files & Patterns

| File | Purpose |
|------|---------|
| [userconfig.js](../userconfig.js#L1) | **ONLY config file users edit** – tabs, palette, location, Gemini key |
| [src/common/palette.js](../src/common/palette.js) | Color palette definitions (Catppuccin flavors) |
| [src/common/storage.js](../src/common/storage.js) | localStorage abstraction layer |
| [src/common/utils.js](../src/common/utils.js) | Utility functions (DOM queries, event helpers) |
| [src/common/strftime.js](../src/common/strftime.js) | Time formatting (respects locale) |
| [index.html](../index.html#L1) | Single HTML file – loads scripts in strict order (palette → utils → config → components) |

### Script Load Order (Critical)
1. `palette.js` – Defines palettes before CONFIG access
2. `utils.js`, `storage.js`, `actions.js`
3. `config.js` – Creates CONFIG object from `userconfig.js`
4. `i18n.js`, `strftime.js`, `component.js`
5. **`userconfig.js`** – User's configuration
6. Component implementations
7. `module.js` – Registers components

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
    this.appId = "50a34e070dd5c09a99554b57ab7ea7e2"; // free tier key
    this.url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&lang=es&appid=${this.appId}`;
  }
  async getWeather() { /* fetch and parse */ }
}
```
- Free tier limits: 60 calls/minute; stores temp/condition/description
- Called periodically; cache results to avoid rate limits
- Return normalized object: `{ temperature, condition, description }`

### Gemini API Integration
[src/components/statusbar/statusbar.component.js](../src/components/statusbar/statusbar.component.js#L630-L690):
```javascript
async queryGemini(query) {
  const apiKey = localStorage.getItem("GEMINI_API_KEY") || window.GEMINI_API_KEY;
  if (!apiKey) return { error: true, message: "setup link" };
  // POST to generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent
  // Response path: data.candidates[0].content.parts[0].text
}
```
- **Always check API key exists** before making request
- Error object format: `{ error: true, message: "user-friendly text" }`
- Uses gemini-3-flash-preview (free tier model)
- Temperature: 0.7, maxOutputTokens: 2048
- Markdown formatting applied via `formatMarkdown()` method

### localStorage & Config Persistence
- Use `Storage` class for namespaced key access: `new Storage("config").get("setting")`
- Gemini key stored separately: `localStorage.setItem('GEMINI_API_KEY', 'key')`
- `CONFIG` object auto-saves via Proxy trap—modify `CONFIG.myProperty = value` to persist
- `overrideStorage: true` forces userconfig values; tabs always override

### Event Handling & Keyboard Shortcuts
Implement in `activate()` method after DOM is ready:
```javascript
this.shadow.addEventListener("keydown", (e) => {
  if (e.key === "Tab") { /* toggle search engine */ }
  if (e.key === "/") { /* open search */ }
  if (e.key === "Escape") { /* close overlay */ }
});
```
- **Tab key**: Switches search engine (Google ↔ Gemini) while in search input
- **/key**: Opens search overlay from any page
- **Escape**: Closes search modal and clears results
- Listen on `this.shadow` to ensure shadow DOM capture

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

## Keyboard Shortcuts Reference

| Key | Action | Component |
|-----|--------|-----------|
| `/` | Open search overlay, focus input | statusbar |
| `Tab` | Toggle between Google Search and Gemini AI | statusbar |
| `Escape` | Close search modal, clear results | statusbar |
| `Enter` | Submit search query | statusbar |

Implement via `addEventListener("keydown", ...)` in `activate()` method.

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
Edit `toggleSearchEngine()` and `handleSearch()` in [statusbar.component.js](../src/components/statusbar/statusbar.component.js#L900+)

### Add a New Palette
1. Add color object to [src/common/palette.js](../src/common/palette.js)
2. Reference in `userconfig.js`: `const palette = your_new_palette;`

### Fix Gemini Integration
- Verify API key set: `localStorage.getItem('GEMINI_API_KEY')` in browser console
- Check free tier limits at https://makersuite.google.com/app/apikey
- Response error format: Check `data.candidates[0].content.parts[0].text` path

### Localize UI Strings
Add keys to `translations` object in [src/common/i18n.js](../src/common/i18n.js#L1), then use `window.i18n.t('key.path')`

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

## Edge Cases & Gotchas

### Shadow DOM Quirks
- `display: none` on custom element hides content but component still renders
- External CSS cannot style shadow DOM—must be inline or in `style()` method
- `querySelectorAll()` doesn't cross shadow boundary; use component's `this.shadow.querySelectorAll()`
- `:host` selector targets the custom element itself

### Config Merge Behavior
- `userconfig.js` completely overrides `defaults` for defined properties
- Nested objects (e.g., `tabs`) are **replaced, not merged**—provide complete structure
- `overrideStorage: true` prevents localStorage persistence **except tabs** (always persistent)
- Changing CONFIG at runtime via `CONFIG.palette = mocha` requires `location.reload()` to apply to all components

### Gemini API Specifics
- Free tier: 60 requests/minute across all projects using same API key
- Model `gemini-3-flash-preview` is latest; check API docs for model changes
- Response structure: `data.candidates[0].content.parts[0].text`—all levels must exist or returns error
- Temperature 0.7 = moderate randomness; adjust `generationConfig.temperature` for determinism

### Weather API
- Location must match OpenWeatherMap city database (e.g., "Bogota", not "bogota")
- Language code "es" only works for Spanish translations; "en" for English
- Free tier caches results ~30 min; rapid calls return cached data
- Missing location silently fails—no error thrown; check browser console

### Locale Handling
- Default locale is **Spanish** (`es`)—change in `i18n.js` or call `window.i18n.setLocale('en')`
- `strftime.js` requires `window.i18n` to be loaded before use (date formatting)
- Month/day names come from i18n translations; fallback to English if i18n missing
- Locale persists in localStorage as `i18nLocale`

### Component Lifecycle
- `constructor()` fires once at definition
- `connectedCallback()` fires when element inserted in DOM
- `disconnectedCallback()` fires when removed (cleanup here)
- Shadow DOM lifecycle: attach → load styles → load template → `activate()`
- Never access `CONFIG` or `window.i18n` in constructor; they may not exist yet

---

## About This File: AI Agent Compatibility

**This file is specifically formatted for GitHub Copilot** (`.github/copilot-instructions.md`).

### Other AI Agents
Different agents use their own instruction formats:
- **Cursor**: `.cursorrules` file
- **Claude (Claude.dev/API)**: `.claude` or `AGENT.md` conventions (not standardized)
- **Windsurf**: `.windsurfrules` file
- **Generic agents**: `README.md`, `CONTRIBUTING.md`, or `AGENT.md`

### Can other agents use this file?
- **GitHub Copilot**: ✅ Yes (designed for this)
- **Cursor**: ⚠️ Partial (will read it but prefers `.cursorrules`)
- **Claude agents**: ⚠️ Partial (manual agent can reference it as documentation)
- **Generic agents**: ✅ Yes (treat as best-practice documentation)

### Universal Value
The **content and patterns** in this file are language-agnostic and apply to any AI agent working on this codebase. If you want other agents to use similar guidance, consider creating `.cursorrules` or `.clinerules` with adapted instructions.

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

---
