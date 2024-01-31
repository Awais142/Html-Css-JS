// OpenWeatherMap API configuration
const API_KEY = "d72cd891e465bae08c93fa435305316f";
const WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
const AIR_QUALITY_URL = "https://api.openweathermap.org/data/2.5/air_pollution";

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const cityElement = document.querySelector('.city');
const dateElement = document.querySelector('.date');
const temperatureElement = document.querySelector('.temperature');
const descriptionElement = document.querySelector('.description');
const feelsLikeElement = document.querySelector('.feels-like');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');
const pressureElement = document.querySelector('.pressure');
const weatherIcon = document.querySelector('.weather-icon i');
const hourlyForecastContainer = document.getElementById('hourly-forecast');
const sunriseElement = document.querySelector('.sunrise-time');
const sunsetElement = document.querySelector('.sunset-time');
const aqiElement = document.querySelector('.aqi-number');
const aqiTextElement = document.querySelector('.aqi-text');
const unitButtons = document.querySelectorAll('.unit-btn');

// Weather icon mapping
const weatherIcons = {
    'Clear': 'fas fa-sun',
    'Clouds': 'fas fa-cloud',
    'Rain': 'fas fa-cloud-rain',
    'Drizzle': 'fas fa-cloud-rain',
    'Thunderstorm': 'fas fa-bolt',
    'Snow': 'fas fa-snowflake',
    'Mist': 'fas fa-smog',
    'Smoke': 'fas fa-smog',
    'Haze': 'fas fa-smog',
    'Dust': 'fas fa-smog',
    'Fog': 'fas fa-smog',
    'Sand': 'fas fa-smog',
    'Ash': 'fas fa-smog',
    'Squall': 'fas fa-wind',
    'Tornado': 'fas fa-wind'
};

// AQI descriptions
const aqiDescriptions = {
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor'
};

let currentUnit = 'celsius';

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

unitButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!button.classList.contains('active')) {
            unitButtons.forEach(btn => btn.classList.toggle('active'));
            currentUnit = button.dataset.unit;
            updateTemperatureDisplay();
        }
    });
});

// Handle search
async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) return;

    showLoading();

    try {
        const weatherData = await getWeatherData(city);
        const forecastData = await getForecastData(city);
        const airQualityData = await getAirQualityData(weatherData.coord.lat, weatherData.coord.lon);
        
        displayWeatherData(weatherData);
        displayHourlyForecast(forecastData);
        displayAirQuality(airQualityData);
        
        searchInput.value = '';
    } catch (error) {
        showError('City not found. Please try again.');
    } finally {
        hideLoading();
    }
}

// Fetch weather data
async function getWeatherData(city) {
    const response = await fetch(`${WEATHER_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('City not found');
    return await response.json();
}

// Fetch forecast data
async function getForecastData(city) {
    const response = await fetch(`${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) throw new Error('Forecast data not available');
    return await response.json();
}

// Fetch air quality data
async function getAirQualityData(lat, lon) {
    const response = await fetch(`${AIR_QUALITY_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Air quality data not available');
    return await response.json();
}

// Display weather data
function displayWeatherData(data) {
    // Update city name and date
    cityElement.textContent = `${data.name}, ${data.sys.country}`;
    dateElement.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Store temperatures for unit conversion
    weatherDisplay.dataset.tempC = Math.round(data.main.temp);
    weatherDisplay.dataset.feelsLikeC = Math.round(data.main.feels_like);

    // Update temperature displays
    updateTemperatureDisplay();

    // Update other weather details
    descriptionElement.textContent = data.weather[0].description;
    humidityElement.textContent = `${data.main.humidity}%`;
    windElement.textContent = `${Math.round(data.wind.speed)} km/h`;
    pressureElement.textContent = `${data.main.pressure} hPa`;

    // Update sun times
    sunriseElement.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
    sunsetElement.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // Update weather icon with animation
    const weatherMain = data.weather[0].main;
    const iconClass = weatherIcons[weatherMain] || 'fas fa-cloud';
    weatherIcon.className = iconClass + ' weather-icon-animation';
    setTimeout(() => {
        weatherIcon.classList.remove('weather-icon-animation');
    }, 1000);

    weatherDisplay.style.opacity = '1';
}

// Display hourly forecast
function displayHourlyForecast(data) {
    hourlyForecastContainer.innerHTML = '';
    
    // Display next 24 hours (8 3-hour intervals)
    data.list.slice(0, 8).forEach(item => {
        const temp = currentUnit === 'celsius' ? 
            Math.round(item.main.temp) : 
            Math.round((item.main.temp * 9/5) + 32);
        
        const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const iconClass = weatherIcons[item.weather[0].main] || 'fas fa-cloud';
        
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <div class="time">${time}</div>
            <i class="${iconClass}"></i>
            <div class="forecast-temp">${temp}°${currentUnit === 'celsius' ? 'C' : 'F'}</div>
        `;
        
        hourlyForecastContainer.appendChild(forecastItem);
    });
}

// Display air quality
function displayAirQuality(data) {
    const aqi = data.list[0].main.aqi;
    aqiElement.textContent = aqi;
    aqiTextElement.textContent = aqiDescriptions[aqi];
}

// Update temperature display based on selected unit
function updateTemperatureDisplay() {
    const tempC = parseInt(weatherDisplay.dataset.tempC);
    const feelsLikeC = parseInt(weatherDisplay.dataset.feelsLikeC);
    
    if (currentUnit === 'celsius') {
        temperatureElement.textContent = `${tempC}°C`;
        feelsLikeElement.textContent = `${feelsLikeC}°C`;
    } else {
        const tempF = Math.round((tempC * 9/5) + 32);
        const feelsLikeF = Math.round((feelsLikeC * 9/5) + 32);
        temperatureElement.textContent = `${tempF}°F`;
        feelsLikeElement.textContent = `${feelsLikeF}°F`;
    }
}

// Show loading state
function showLoading() {
    weatherDisplay.style.opacity = '0.5';
    searchBtn.disabled = true;
    searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
}

// Hide loading state
function hideLoading() {
    weatherDisplay.style.opacity = '1';
    searchBtn.disabled = false;
    searchBtn.textContent = 'Search';
}

// Show error message
function showError(message) {
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize with a default city
window.addEventListener('load', () => {
    searchInput.value = 'London';
    handleSearch();
});
