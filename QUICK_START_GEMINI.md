# Gemini Quick Start

## Setup in 60 Seconds

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open browser console (`F12`)
3. Run:

```javascript
localStorage.setItem('GEMINI_API_KEY', 'YOUR-API-KEY-HERE');
```

4. Reload the page
5. Open search with `/`

## Use Gemini Mode

1. Open search overlay
2. Press `Tab` to switch Google <-> Gemini
3. Type query
4. Press `Enter`

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `/` | Open search |
| `Tab` | Toggle Google <-> Gemini |
| `Enter` | Execute search |
| `Esc` | Close overlay |

## Troubleshooting

### "API key not configured"

Set key again and reload:

```javascript
localStorage.setItem('GEMINI_API_KEY', 'YOUR-API-KEY-HERE');
```

### No Gemini results

- Ensure Gemini mode is active (sparkles icon)
- Check browser console for request errors

### Invalid key / quota errors

- Regenerate key in Google AI Studio
- Verify there are no extra spaces

Need more details? See [GEMINI_SETUP.md](GEMINI_SETUP.md).
