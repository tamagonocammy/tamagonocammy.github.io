# Weather Integration Setup Guide

This startpage includes a **weather widget** powered by [Open-Meteo](https://open-meteo.com), shown in the status bar.

## What You Get

- Current temperature and condition for a configured location
- A popup with feels-like, humidity, wind, sunrise/sunset, the next hours, a 3-day outlook, chance of rain and air quality
- Localized condition strings (es/en/eo)
- Friendly fallback text if the API call fails, with technical details tucked away

## Setup

There's no API key and no signup: Open-Meteo is free for non-commercial use. Just set your location in `userconfig.js`:

```javascript
temperature: {
  location: "Bogota",
  scale: "C", // or "F"
}
```

If your city shares its name with another place, add the ISO country code: `"Bogota, CO"`, `"Paris, FR"`. Without one, the most populated match wins.

## How It Works

1. The location is geocoded once and the coordinates are saved in localStorage (`weatherPlace:v1:<location>`)
2. The forecast and air quality are fetched in parallel and cached for 10 minutes (`weatherCache:v3:<location>`)
3. The widget refreshes every 15 minutes, and when a tab becomes visible with stale data

## Troubleshooting

### Weather for the wrong place

Add the country code to the location, or clear the saved coordinates and reload:

```javascript
Object.keys(localStorage).filter((k) => k.startsWith("weatherPlace")).forEach((k) => localStorage.removeItem(k));
```

### "City not found"

- Check the spelling, or try the city's name in English
- If you added a country code, make sure it's the two-letter ISO code (`CO`, not `COL`)

### No weather shown at all

- Confirm `weather` isn't in `CONFIG.disabled`
- Check the browser console for the underlying error (`weather.api_error`)

## Privacy Notes

- Requests go directly from your browser to Open-Meteo's API, with your location's coordinates
- This startpage does not run a backend service for weather

## Related Docs

- [AI_SETUP.md](AI_SETUP.md)
- [README.md](README.md)
