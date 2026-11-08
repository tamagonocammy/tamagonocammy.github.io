# Status bar notes

## Gemini AI Integration

Implemented in `statusbar.component.js`. Press `/` to open search, `Tab` to toggle between DuckDuckGo and Gemini.

- API key: `localStorage.setItem('GEMINI_API_KEY', 'key')` or `window.GEMINI_API_KEY` in `userconfig.js`
- Configurable via `advanced_config.gemini` (model, fallbackModels, temperature, maxOutputTokens, thinkingLevel)
- `thinkingLevel` (default `"low"`) is sent as `generationConfig.thinkingConfig`; if a model rejects it (HTTP 400 mentioning thinking), the request is resent without it
- When Google answers "busy" (429/500/503/504) before any text arrives, retries the main model once after 2s, then tries each of `fallbackModels` and notes which model answered
- Streams the answer (`streamGenerateContent?alt=sse`) and re-renders the markdown as chunks arrive, with code block highlighting
