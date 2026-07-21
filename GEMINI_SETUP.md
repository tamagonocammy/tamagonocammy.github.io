# Gemini AI Integration Setup Guide

This startpage includes **DuckDuckGo + Gemini dual search** in the status bar overlay.

## Quick Start (60 Seconds)

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open browser console (`F12`) and run:
   ```javascript
   localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');
   ```
3. Reload the page
4. Open search with `/`, press `Tab` to switch to Gemini mode, `Enter` to submit

The rest of this guide covers configuration options and troubleshooting in more detail.

## What You Get

- Dual search mode: DuckDuckGo or Gemini
- Large modal for Gemini answers
- Markdown rendering (headers, lists, code, tables, links, images)
- Localized messages (es/en/eo)
- Keyboard shortcuts for fast access

## 1) Get a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Copy it

## 2) Configure the API Key

### Option A (Recommended): Browser localStorage

Run in browser console (`F12`):

```javascript
localStorage.setItem('GEMINI_API_KEY', 'your-api-key-here');
```

Reload the page.

### Option B: `userconfig.js`

If this repo/config is private, you can set:

```javascript
window.GEMINI_API_KEY = "your-api-key-here";
```

## 3) Use It

1. Open search with `/` (or click the search button)
2. Press `Tab` in the input to switch DuckDuckGo <-> Gemini
3. Press `Enter` to search
4. Press `Esc` to close

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `/` | Open search overlay |
| `Tab` | Toggle DuckDuckGo <-> Gemini (input focused) |
| `Enter` | Execute search |
| `Escape` | Close overlay/modal |

## Troubleshooting

### "API key not configured"

- Confirm `localStorage.getItem('GEMINI_API_KEY')` returns your key
- Reload after setting it
- Avoid extra spaces/quotes

### "Failed to get response" or friendly error panel

- Verify internet connection
- Verify key validity and quota
- Regenerate key in Google AI Studio if needed

### No Gemini results

- Make sure you switched to Gemini mode (`Tab`)
- Check browser console for API errors

## Advanced Configuration

In `userconfig.js` -> `advanced_config.gemini`:

```javascript
gemini: {
  model: "gemini-3-flash-preview",
  temperature: 0.7,
  maxOutputTokens: 2048,
}
```

## Privacy Notes

- API key is stored in your browser (or local file if you set `window.GEMINI_API_KEY`)
- Queries are sent directly to Google's Gemini API
- This startpage does not run a backend service for Gemini

## Related Docs

- [WEATHER_SETUP.md](WEATHER_SETUP.md)
- [README.md](README.md)
