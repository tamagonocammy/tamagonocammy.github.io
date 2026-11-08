# Status bar notes

## Gemini AI Integration

Implemented in `statusbar.component.js`. Press `/` to open search (`g` opens it in Gemini mode), `Tab` to toggle between DuckDuckGo and Gemini.

- API key: `localStorage.setItem('GEMINI_API_KEY', 'key')` or `window.GEMINI_API_KEY` in `userconfig.js`
- Configurable via `advanced_config.gemini` (model, fallbackModels, temperature, maxOutputTokens, thinkingLevel)
- `thinkingLevel` (default `"low"`) is sent as `generationConfig.thinkingConfig`; if a model rejects it (HTTP 400 mentioning thinking), the request is resent without it
- When Google answers "busy" (429/500/503/504) before any text arrives, retries the main model once after 2s, then tries each of `fallbackModels` and notes which model answered
- Streams the answer (`streamGenerateContent?alt=sse`) and re-renders the markdown as chunks arrive, with code block highlighting
- Quick actions (`advanced_config.gemini.quickActions`): buttons under the input in Gemini mode. Click or `Alt+1..9` arms one; Enter sends its `prompt` with `{q}` (query) and `{lang}` (`translateTo`). Clicking a button with text already typed sends right away. Labels come from `search.actions.<id>` unless `label` is set
- A quick action's `tools` (e.g. `urlContext`, `googleSearch`) go into `requestBody.tools`; a 400 mentioning tools/grounding retries without them. Web-search grounding sources (`groundingMetadata.groundingChunks`) are listed under the answer

## Search prefixes

`CONFIG.searchPrefixes` (`userconfig.js`): `!key rest` goes straight to `url` with `%s` replaced, or to `home` (else the URL's origin) when nothing follows. Works in both engines; unknown prefixes fall through to DuckDuckGo (which has its own bangs). `searchPrefixes` is in `Config.FILE_ONLY`, so the file always wins over localStorage, like `tabs`. The line under the input shows where Enter will go.

## Keyboard shortcuts

`handleKeyPress` (bound to `document.onkeydown`): `1-9` tab, `←/→` or `h/l` previous/next, `/` search, `g` Gemini, `w` weather popup, `?` cheat sheet (`.shortcuts-overlay`, built by `shortcutsHtml()`; keep it in sync when adding shortcuts). Skipped while typing (`isTyping()` walks into shadow roots), with Cmd/Ctrl/Alt held, or while search is open.
