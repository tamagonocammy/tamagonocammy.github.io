# AI Search Setup Guide

The status bar search has two modes: **DuckDuckGo** for finding pages, and **AI** for getting an answer. AI mode asks **Claude** first and falls back to **Gemini** when Claude is down, busy, or out of credit.

## Quick Start

1. Create a Claude API key at [platform.claude.com](https://platform.claude.com/) (add a few dollars of credit under Billing first; a Claude Pro/Max subscription does not include API access)
2. Open the browser console (`F12`) and run:
   ```javascript
   localStorage.setItem('CLAUDE_API_KEY', 'your-api-key-here');
   ```
3. Reload the page
4. Press `g` (or `/` then `Tab`), type a question, `Enter`

Optional backup: get a Gemini key at [Google AI Studio](https://aistudio.google.com/apikey) and store it the same way under `GEMINI_API_KEY`.

## What You Get

- Streaming answers with full markdown (headers, lists, code, tables, links, images)
- Quick actions under the input: translate, define, summarize a link, web search, explain simply, code (`Alt+1..9`)
- Sources listed under answers that used the web
- Automatic fallback to the next model/provider, with a note saying who answered
- Localized interface (es/en/eo)

## Where the Key Can Live

Checked in this order:

1. **`localStorage`** (`CLAUDE_API_KEY`, `GEMINI_API_KEY`): recommended. Per browser and per site, so set it on each origin you open the startpage from (github.io, `127.0.0.1:47615`, ...)
2. **`secrets.js`** next to `index.html`: a local, gitignored file defining `window.startpageSecrets = { claude: () => "key" }`. It is missing on github.io and that's fine. Keep the key scrambled in it if you like, but anything that loads the file can read it, so it must stay out of git
3. **`window.CLAUDE_API_KEY` / `window.GEMINI_API_KEY`**: only for a private fork. This repo is public: never put a key in `userconfig.js`

## Cost

Claude's API is pay as you go. With the defaults (Claude Haiku 5.5, `effort: "low"`, web search only on request):

| Question | Approximate cost |
| --- | --- |
| Plain question (translate, define, explain) | ~$0.0005 |
| Link summary (pages are read with web fetch) | ~$0.003 |
| Web search quick action | ~$0.01 (mostly the search fee) |

Set a monthly spend limit in the Console (Limits) and leave auto-recharge off, so a leaked key can never cost more than that limit.

## Configuration

All in `userconfig.js` -> `advanced_config`:

```javascript
assistant: {
  providers: ["claude", "gemini"], // Tried in order
  systemInstruction: "...",        // Today's date is appended automatically
  translateTo: "español",          // Default target for the translate action
  quickActions: [ /* id, icon, color, prompt with {q} and {lang}, optional tools */ ],
},
claude: {
  model: "claude-haiku-5-5",       // "claude-sonnet-5-5" is smarter, ~20x the price
  fallbackModels: [],              // Other Claude models to try before Gemini
  effort: "low",                   // "low" | "medium" | "high"
  maxTokens: 4096,
  webSearch: false,                // true: Claude searches whenever a question needs it
  maxSearches: 1,                  // Searches per question
},
gemini: {
  model: "gemini-3.8-flash",
  fallbackModels: ["gemini-3.5-flash"],
  temperature: 0.7,
  maxOutputTokens: 2048,
  thinkingLevel: "low",
},
```

Quick action `tools`: `urlContext` reads a link (Claude web fetch / Gemini URL context), `googleSearch` searches the web (Claude web search / Gemini Google Search grounding). Claude also reads a link on its own whenever a question contains one.

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `g` | Open search in AI mode |
| `/` | Open search |
| `Tab` | Toggle DuckDuckGo <-> AI (input focused) |
| `Alt+1..9` | Arm a quick action |
| `Enter` | Search / ask |
| `Escape` | Close overlay |

## Troubleshooting

### "No AI API key configured"

- Run `localStorage.getItem('CLAUDE_API_KEY')` in the console on the same site you opened the startpage from
- Reload after setting it, and check for stray spaces or quotes

### Error panel / "Failed to get a response"

- Open "Technical details" in the panel: `invalid x-api-key` means a wrong key; a credit message means the balance ran out (Gemini answers instead if its key is set)
- Check the internet connection and the Console's usage page

### Answers about recent events are out of date

- Use the web search quick action (`Alt+4`), or set `claude.webSearch: true`

## Privacy Notes

- Keys stay in your browser (or your local `secrets.js`)
- Questions go straight from the browser to Anthropic's or Google's API; this startpage has no backend
- Claude calls use the `anthropic-dangerous-direct-browser-access` header, which the API requires for browser requests. It is fine for a personal key on your own machine; never ship a shared key this way

## Related Docs

- [WEATHER_SETUP.md](WEATHER_SETUP.md)
- [README.md](README.md)
