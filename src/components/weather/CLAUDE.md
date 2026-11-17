# Weather notes

## Weather API

`weather.component.js` + `weather.api.js`. [Open-Meteo](https://open-meteo.com): free, no API key.

- Configure location in `userconfig.js` `temperature.location`: `"City"` or `"City, CC"` (ISO country code) to pick between same-named places. Without a country, the most populated match wins
- The location is geocoded once (`geocoding-api.open-meteo.com`) and the coordinates kept in localStorage (`weatherPlace:v1:<location>`); clear that key if a city resolves to the wrong place
- Then `/v1/forecast` (current + hourly + daily, `timezone=auto`, unix times) and `air-quality-api` (European AQI, folded into the 1-5 scale in bands of 20) run in parallel. Hourly row = next 5 slots, every 3 hours; 3-day outlook icon comes from the midday hour, not the daily code (which reports the day's worst weather); rain chance = max over the next 3 hours. A failed air call only hides that row
- WMO weather codes map to the component's condition names in `WeatherForecastClient.CONDITIONS`; condition text comes from `weather.conditions.*` translations
- Caches the result in localStorage (`weatherCache:v3:<location>`; bump the version when the cached shape changes) for 10 minutes, so new tabs render instantly; the component refreshes every 15 minutes and when a tab becomes visible with stale data
- A failed refresh keeps showing the last good data; HTTP 404/429 map to translated messages (`weather.errors.*`)
- Icons are Tabler only (inline and popup), with night variants; use only glyphs present in `src/css/tabler-icons.min.css` (e.g. `ti-cloud-drizzle` and `ti-cloud-moon` are missing)
