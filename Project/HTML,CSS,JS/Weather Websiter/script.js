const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");
const resultDiv = document.getElementById("result");

let controller = null;

async function fetchWeather() {
    const city = cityInput.value.trim();
    if (!city) return;

    const apiKey = "OPEN_WEATHER_API_KEY";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    resultDiv.innerHTML = `<div class="status-msg">Fetching weather...</div>`;


    if (controller) controller.abort();
    controller = new AbortController();
    const signal = controller.signal;

    try {
        const response = await fetch(url, { signal });
        const data = await response.json();

        if (data.cod === 200) {
            const humidity = data.main.humidity;
            const wind = data.wind.speed;
            const feelsLike = Math.round(data.main.feels_like);

            resultDiv.innerHTML = `
                <div class="weather-card">
                    <div class="city-name">${data.name}, ${data.sys.country}</div>
                    <div class="temp">${Math.round(data.main.temp)}°C</div>
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
                    <div class="desc">${data.weather[0].description}</div>
                    <hr class="divider">
                    <div class="weather-meta">
                        <div class="meta-item">
                            <span>Feels like</span>
                            <span class="meta-value">${feelsLike}°C</span>
                        </div>
                        <div class="meta-item">
                            <span>Humidity</span>
                            <span class="meta-value">${humidity}%</span>
                        </div>
                        <div class="meta-item">
                            <span>Wind</span>
                            <span class="meta-value">${wind} m/s</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<div class="status-msg error">City not found. Try again.</div>`;
        }
    } catch (error) {
         if (error.name === "AbortError") return;
        resultDiv.innerHTML = `<div class="status-msg error">Failed to fetch. Check your connection.</div>`;
    }
}

searchBtn.addEventListener("click", fetchWeather);

cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchWeather();
});
