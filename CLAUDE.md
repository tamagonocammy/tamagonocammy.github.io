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

Registered components (`src/common/module.js`): `tabs-list`, `weather-forecast`, `current-time`, `now-playing`, `status-bar`.

Components are disabled by adding their name to `CONFIG.disabled` in `userconfig.js`.

### Motion

`Component.motionStyles` (in `component.js`) is injected into every shadow root ahead of the component's own style:

- Easing/duration tokens on `:host`: `--ease-out`, `--ease-in-out`, `--ease-spring`, `--dur-fast/base/slow`. Use these instead of ad-hoc curves
- A `prefers-reduced-motion: reduce` guard that collapses all animations/transitions (it has to live here: document CSS can't reach shadow DOM)
- Popups hide with `.hidden` = opacity/transform/visibility (not `display: none`) so both open and close animate
- Entrance animations use `animation-fill-mode: backwards` so no transform lingers afterwards. A leftover transform on `#panels` would become the containing block for the fixed search overlay
- Transition specific properties, not `all` (exception: `.search-modal`, whose JS-timed morph animates size and position together)

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

### Script Load Order

Scripts in `index.html` load in this order, because each file uses globals defined by the ones before it (a component loaded before `userconfig.js` fails with an undefined `CONFIG`):

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

### Internationalization

`i18n.js` provides `window.i18n.t('key')` and `window.i18n.setLocale('en')`.

- Default locale set in `advanced_config.i18n.defaultLocale`
- Available locales: `es` (Spanish), `en` (English), `eo` (Esperanto)
- Use `window.i18n.t()` for all user-facing strings

**Translation structure** includes: `search.*`, `time.days/months/periods`, `weather.conditions`, `settings.*`

Component-specific notes live next to the code: `src/components/statusbar/CLAUDE.md` (AI search with Claude/Gemini, prefixes, shortcuts), `src/components/weather/CLAUDE.md` (weather API) and `src/components/nowplaying/CLAUDE.md` (Apple Music helper).

### Offline Support

`sw.js` is a service worker registered from `index.html` (guarded to skip `file://`). Cache-first for the app shell (local html/css/js), falls back to network for anything uncached, and explicitly bypasses caching for `api.openweathermap.org`, `generativelanguage.googleapis.com` and `api.anthropic.com` so weather/AI stay live. The gitignored `secrets.js` (local API keys) is never cached.

- Bump `CACHE_VERSION` in `sw.js` when app-shell files change — old caches are evicted on `activate`
- Only takes effect over `http(s)`; does nothing when the file is opened directly (`file://`)

### Error Handling

Return standardized error objects, don't throw:

```javascript
// Correct
return { error: true, message: "API failed" };

// Incorrect
throw new Error("API failed");
```
