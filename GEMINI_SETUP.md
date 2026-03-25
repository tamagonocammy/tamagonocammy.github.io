# Gemini AI Integration Setup Guide

This startpage includes **Google + Gemini dual search** in the status bar overlay.

## What You Get

- Dual search mode: Google or Gemini
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
2. Press `Tab` in the input to switch Google <-> Gemini
3. Press `Enter` to search
4. Press `Esc` to close

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `/` | Open search overlay |
| `Tab` | Toggle Google <-> Gemini (input focused) |
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

- [QUICK_START_GEMINI.md](QUICK_START_GEMINI.md)
- [README.md](README.md)
