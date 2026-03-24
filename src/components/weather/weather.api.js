class WeatherForecastClient {
  constructor(location) {
    this.appId = advanced_config?.weather?.apiKey || "50a34e070dd5c09a99554b57ab7ea7e2";
    const language = advanced_config?.weather?.language || "eo";
    this.url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(location)}&units=metric&lang=${language}&appid=${
      this.appId
    }`;
  }

  async getWeather() {
    return await fetch(this.url)
      .then((res) => res.json())
      .then((json) => JSON.stringify(json))
      .then((json) => JSON.parse(json))
      .then((data) => {
        const temperature = Math.round(data.main.temp);
        const condition = data.weather[0].main.toLowerCase();
        const description = data.weather[0].description;

        return {
          temperature,
          condition,
          description,
        };
      })
      .catch((err) => {
        console.warn(window.i18n?.t("weather.api_error") || "Weather API returned an error:", err);
        return {
          error: true,
          message: err?.message || String(err),
        };
      });
  }
}
