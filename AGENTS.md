# AGENTS.md

This file provides guidance to Codex when working with code in this repository.

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

Registered components (`src/common/module.js`): `tabs-list`, `weather-forecast`, `current-time`, `now-playing`, `status-bar`.

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

### AI Search (Claude, Gemini as backup)

AI search lives in `statusbar.component.js`. Press `g` (or `/` then `Tab`) for AI mode. It asks **Claude** first and falls back to **Gemini**. Internal names still say `gemini` (`searchEngine`, CSS classes, i18n keys such as `placeholder_gemini`); the user-facing strings say Claude, except the results title and loading text, which name the provider answering.

- Providers: `advanced_config.assistant.providers` (default `["claude", "gemini"]`); per-provider settings in `advanced_config.claude` and `advanced_config.gemini`. Shared settings (`systemInstruction`, `translateTo`, `quickActions`) live in `advanced_config.assistant`
- Keys (`apiKey()`): `localStorage` `CLAUDE_API_KEY` / `GEMINI_API_KEY` → gitignored `secrets.js` (`window.startpageSecrets.claude()`) → `window.CLAUDE_API_KEY` / `window.GEMINI_API_KEY`. The repo is public: never commit a key
- `queryAI()` walks `aiAttempts()` (every provider/model with a key). Busy or unreachable (0/429/5xx/529) before any text: one retry after 2s on the first model, then the next model/provider, with a note saying who answered. 401/402/403 or a credit/billing 400 skips that provider; so does a Claude refusal (note: `fallback_note_refused`)
- Picking a provider: `@g` / `@c` (also `@gemini` / `@claude`) sends one question to that provider first, from either engine (`parseAiPrefix()`). The **Ask Gemini / Ask Claude** button under an answer re-runs the same prompt on the other provider inside the open panel (`askAI({ inPlace: true })`). Both pass `options.provider` to `queryAI()`; `aiAttempts(preferred)` moves it to the front, so the other stays as backup
- Claude (`streamClaude`): Messages API from the browser with `anthropic-dangerous-direct-browser-access: true`, streamed SSE, `output_config.effort`, no `temperature`. Web search (`web_search_20250305`) is attached to every question unless `claude.webSearch` is false (`userconfig.js` ships `false`, so only the web quick action searches); web fetch (`web_fetch_20250910`) for `urlContext` actions or any question containing a URL. Sources = cited URLs
- Gemini (`streamGemini`): `streamGenerateContent?alt=sse`, key in the `x-goog-api-key` header, `thinkingLevel` → `generationConfig.thinkingConfig` (dropped if a model rejects it)
- `systemPrompt()` appends today's date. Full details: `src/components/statusbar/CLAUDE.md` and `AI_SETUP.md`

### Internationalization

`i18n.js` provides `window.i18n.t('key')` and `window.i18n.setLocale('en')`.

- Default locale set in `advanced_config.i18n.defaultLocale`
- Available locales: `es` (Spanish), `en` (English), `eo` (Esperanto)
- Use `window.i18n.t()` for all user-facing strings

**i18n API:**

```javascript
window.i18n.t('search.placeholder_duckduckgo')     // Get translation by dot-notation key
window.i18n.setLocale('en')                   // Switch language (persists to localStorage)
window.i18n.getDays(short = false)            // Get localized day names
window.i18n.getMonths(short = false)          // Get localized month names
window.i18n.getOrdinal(num)                   // Get ordinal suffix (e.g., "º", "st")
```

**Translation structure** includes: `search.*`, `time.days/months/periods`, `weather.conditions`, `settings.*`

### Weather API

`weather.component.js` + `weather.api.js`. [Open-Meteo](https://open-meteo.com): free, no API key.

- Configure location in `userconfig.js` `temperature.location`: `"City"` or `"City, CC"` (ISO country code) to pick between same-named places. Without a country, the most populated match wins
- The location is geocoded once (`geocoding-api.open-meteo.com`) and the coordinates kept in localStorage (`weatherPlace:v1:<location>`); clear that key if a city resolves to the wrong place
- Then `/v1/forecast` (current + hourly + daily, `timezone=auto`, unix times) and `air-quality-api` (European AQI, folded into the 1-5 scale in bands of 20) run in parallel. Hourly row = next 5 slots, every 3 hours; 3-day outlook icon comes from the midday hour, not the daily code (which reports the day's worst weather); rain chance = max over the next 3 hours. A failed air call only hides that row
- WMO weather codes map to the component's condition names in `WeatherForecastClient.CONDITIONS`; condition text comes from `weather.conditions.*` translations
- Caches the result in localStorage (`weatherCache:v3:<location>`; bump the version when the cached shape changes) for 10 minutes, so new tabs render instantly; the component refreshes every 15 minutes and when a tab becomes visible with stale data
- A failed refresh keeps showing the last good data; HTTP 404/429 map to translated messages (`weather.errors.*`)
- Icons are Tabler only (inline and popup), with night variants; use only glyphs present in `src/css/tabler-icons.min.css` (e.g. `ti-cloud-drizzle` and `ti-cloud-moon` are missing)

### Offline Support

`sw.js` is a service worker registered from `index.html` (guarded to skip `file://`). Cache-first for the app shell (local html/css/js), falls back to network for anything uncached, and explicitly bypasses caching for the Open-Meteo APIs, `generativelanguage.googleapis.com` and `api.anthropic.com` so weather/AI stay live. The gitignored `secrets.js` is never cached.

- Bump `CACHE_VERSION` in `sw.js` when app-shell files change — old caches are evicted on `activate`
- Only takes effect over `http(s)`; does nothing when the file is opened directly (`file://`)

### Storage Abstraction

`storage.js` provides namespaced localStorage access:

```javascript
const storage = new Storage("config");
storage.set("key", value);
storage.get("key");
storage.hasValue("key");
storage.save(jsonString);
```

- AI keys stored separately: `localStorage.setItem('CLAUDE_API_KEY', 'key')` (and `GEMINI_API_KEY` for the backup)
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
| `g` | Open search in AI mode |
| `/` | Open search overlay, focus input |
| `Tab` | Toggle between DuckDuckGo and AI search (when input focused) |
| `@g …` / `@c …` | Ask Gemini / Claude first (typed before a question) |
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
window.i18n.t('search.placeholder_duckduckgo');

// Activate component manually
Actions.activate('status-bar');

// Test palette change
window.CONFIG.palette = mocha;

// Get rendered component references
console.log(RenderedComponents);

// Test weather API
new WeatherForecastClient("Bogota").getWeather().then(console.log);

// Check AI keys
localStorage.getItem('CLAUDE_API_KEY');
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
| `sw.js` | Service worker — caches the app shell for offline use (registered from `index.html`, http/https only) |
