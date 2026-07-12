# Weather Integration Setup Guide

This startpage includes a **weather widget** powered by OpenWeatherMap, shown in the status bar.

## What You Get

- Current temperature, condition, and description for a configured location
- Localized condition strings (es/en/eo)
- Friendly fallback text if the API call fails, with technical details tucked away

## 1) Zero-Config Default

The repo ships with a shared, public, rate-limited OpenWeatherMap free-tier key in `userconfig.js` (`advanced_config.weather.apiKey`). It works out of the box — no setup required to see weather on first run.

Because it's shared across every fork of this repo, it's more likely to hit its rate limit (60 calls/minute across all users). Get your own key if you want reliable results.

## 2) Get Your Own API Key (Recommended)

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account and generate an API key
3. Copy it

## 3) Configure the API Key

### Option A (Recommended): Browser localStorage

Run in browser console (`F12`):

```javascript
localStorage.setItem('OWM_API_KEY', 'your-api-key-here');
```

Reload the page. This persists across browser restarts and takes priority over `userconfig.js`, so your key never ends up in a commit.

### Option B: `userconfig.js`

If this repo/config is private, you can set:

```javascript
window.OWM_API_KEY = "your-api-key-here";
```

in `userconfig.js`, or edit `advanced_config.weather.apiKey` directly. Don't push either of those to a public repo.

## 4) Set Your Location

In `userconfig.js`:

```javascript
temperature: {
  location: "Bogota",
  scale: "celsius", // or "fahrenheit"
}
```

## Key Resolution Order

`WeatherForecastClient` checks, in order:

1. `localStorage.getItem('OWM_API_KEY')`
2. `window.OWM_API_KEY`
3. `advanced_config.weather.apiKey`
4. the shared demo key committed in `userconfig.js`

## Troubleshooting

### Friendly fallback / "Weather API returned an error"

- Confirm your location string resolves on [OpenWeatherMap](https://openweathermap.org/) directly
- Check browser console for the underlying error (`weather.api_error`)
- Verify key validity — new keys can take a few minutes to activate
- If using the shared demo key, you may be rate-limited; set your own key instead

### No weather shown at all

- Confirm the `weather-forecast` component isn't in `CONFIG.disabled`
- Check `advanced_config.weather.language` is a supported code (`es`, `en`, `eo`, etc. per OpenWeatherMap's language list)

## Advanced Configuration

In `userconfig.js` -> `advanced_config.weather`:

```javascript
weather: {
  apiKey: "your-api-key-here", // fallback only; prefer localStorage
  language: "eo",
}
```

## Privacy Notes

- API key is stored in your browser (or committed to `userconfig.js` if you choose Option B)
- Requests are sent directly to OpenWeatherMap's API
- This startpage does not run a backend service for weather — like Gemini, any key used here is inherently visible in the browser's network requests

## Related Docs

- [GEMINI_SETUP.md](GEMINI_SETUP.md)
- [README.md](README.md)
