# Weather notes

## Weather API

`weather.component.js` + `weather.api.js`. Free OpenWeatherMap tier (60 calls/minute).

- Configure location in `userconfig.js` `temperature.location`
- Language in `advanced_config.weather.language`
- API key resolution order: `localStorage.getItem('OWM_API_KEY')` → `window.OWM_API_KEY` → `advanced_config.weather.apiKey` → shared demo key committed in `userconfig.js`
- Prefer `localStorage.setItem('OWM_API_KEY', 'key')` for a personal key so it never lands in a commit (same pattern as the Gemini key)
- Fetches `/weather` (current) and `/forecast?cnt=5` (next five 3-hour slots) in parallel; a failed forecast only hides the hourly row
- Caches the result in localStorage (`weatherCache:<location>:<lang>`) for 10 minutes, so new tabs render instantly; the component refreshes every 15 minutes and when a tab becomes visible with stale data
- A failed refresh keeps showing the last good data; HTTP 401/404/429 map to translated messages (`weather.errors.*`)
- Icons are Tabler only (inline and popup), with night variants; use only glyphs present in `src/css/tabler-icons.min.css` (e.g. `ti-cloud-drizzle` and `ti-cloud-moon` are missing)
