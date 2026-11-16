# Status bar notes

## AI search (Claude, Gemini as backup)

Implemented in `statusbar.component.js`. Press `/` to open search (`g` opens it in AI mode), `Tab` to toggle between DuckDuckGo and AI. Internal names still say `gemini` (`searchEngine`, CSS classes, i18n keys like `placeholder_gemini`); the strings themselves say Claude, except the results title and loading text, which name the provider answering.

- Providers: `advanced_config.assistant.providers` (default `["claude", "gemini"]`), each with its own block (`advanced_config.claude`, `advanced_config.gemini`). `aiAttempts()` lists every provider/model pair that has a key; `queryAI()` walks it
- Keys (`apiKey()`): `localStorage` `CLAUDE_API_KEY` / `GEMINI_API_KEY`, then `secrets.js` (`window.startpageSecrets.claude()`), then `window.CLAUDE_API_KEY` / `window.GEMINI_API_KEY`. `secrets.js` is gitignored, loaded from `index.html` with `onerror` so github.io (where it doesn't exist) is fine, never cached by `sw.js`, and holds the key scrambled (XOR + base64, shuffled), which only keeps it out of plain sight. Never put a key in `userconfig.js`: the repo is public
- Fallback: a busy or unreachable model (0/429/5xx/529) before any text arrives gets one retry after 2s (first model only), then the next model/provider answers and the note under the answer says so. 401/402/403 or a 400 about credit/billing/key skips that provider. A Claude refusal (`stop_reason: "refusal"`, even mid-stream: the partial text is cleared) skips Claude too, and the note says it declined (`fallback_note_refused`). Other errors, or any error after text was shown, end the request
- Claude: Messages API straight from the browser (`anthropic-dangerous-direct-browser-access: true`), streamed. `effort` goes in `output_config`; no `temperature` (current models reject it). `web_search_20250305` is attached to every question unless `claude.webSearch` is false (Claude decides whether to search); `web_fetch_20250910` is added for `urlContext` actions or whenever the question contains a URL. Sources = cited URLs, else the first 5 search hits
- Picking a provider: `@g` / `@c` (or `@gemini` / `@claude`) before a question sends it to that provider first, from either engine (`parseAiPrefix()`; the hint line shows "Ask Gemini"). Under each answer, an "Ask Claude" / "Ask Gemini" button re-runs the same prompt (quick action included) on the other provider inside the open panel (`askAI({ inPlace: true })`); it's hidden when the other provider has no key or just declined. Both pass `options.provider` to `queryAI()`, and `aiAttempts(preferred)` moves that provider to the front, so the other one stays as backup. The results title and loading text follow the provider (`results_title_provider`, `loading_provider`)
- `systemPrompt()` adds today's date to `assistant.systemInstruction`
- The answer window snaps to the main panel's position and width, but `fitPanel()` sizes its height to the content (a `ResizeObserver` on `.results-content` follows the stream), capped at the panel height, past which it scrolls
- `formatMarkdown()` wraps every paragraph in `<p>` except block HTML (headings, lists, tables, code...), so one starting with **bold** or *italic* stays its own paragraph
- Gemini: `thinkingLevel` is sent as `generationConfig.thinkingConfig`; a 400 mentioning thinking resends without it
- Quick actions (`advanced_config.assistant.quickActions`): buttons under the input in AI mode. Click or `Alt+1..9` arms one; Enter sends its `prompt` with `{q}` (query) and `{lang}` (`translateTo`). Clicking a button with text already typed sends right away. Labels come from `search.actions.<id>` unless `label` is set. `tools`: `urlContext` (read a link) and `googleSearch` (web search), mapped to each provider's tools; a 400 mentioning tools retries without them
- `assistantConfig` merges `advanced_config.gemini` under `advanced_config.assistant`, so older configs that kept quick actions under `gemini` still work

## Search prefixes

`CONFIG.searchPrefixes` (`userconfig.js`): `!key rest` goes straight to `url` with `%s` replaced, or to `home` (else the URL's origin) when nothing follows. Works in both engines; unknown prefixes fall through to DuckDuckGo (which has its own bangs). `searchPrefixes` is in `Config.FILE_ONLY`, so the file always wins over localStorage, like `tabs`. The line under the input shows where Enter will go.

## Keyboard shortcuts

`handleKeyPress` (bound to `document.onkeydown`): `1-9` tab, `←/→` or `h/l` previous/next, `/` search, `g` AI search, `w` weather popup, `?` cheat sheet (`.shortcuts-overlay`, built by `shortcutsHtml()`; keep it in sync when adding shortcuts, including in-search keys like `!yt …` and `@g …` / `@c …`). Skipped while typing (`isTyping()` walks into shadow roots), with Cmd/Ctrl/Alt held, or while search is open.
