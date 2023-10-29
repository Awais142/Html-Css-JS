// OpenWeatherMap API configuration
const API_KEY = ''; // You'll need to add your API key here
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const cityElement = document.querySelector('.city');
const temperatureElement = document.querySelector('.temperature');
const descriptionElement = document.querySelector('.description');
const humidityElement = document.querySelector('.humidity');
const windElement = document.querySelector('.wind');
const weatherIcon = document.querySelector('.weather-icon i');

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

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Handle search
async function handleSearch() {
    const city = searchInput.value.trim();
    if (!city) return;

    try {
        const weatherData = await getWeatherData(city);
        displayWeatherData(weatherData);
        searchInput.value = '';
    } catch (error) {
        showError('City not found. Please try again.');
    }
}

// Fetch weather data
async function getWeatherData(city) {
    const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error('City not found');
    }
    return await response.json();
}

// Display weather data
function displayWeatherData(data) {
    // Update city name
    cityElement.textContent = `${data.name}, ${data.sys.country}`;

    // Update temperature
    temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;

    // Update description
    descriptionElement.textContent = data.weather[0].description;

    // Update humidity
    humidityElement.textContent = `${data.main.humidity}%`;

    // Update wind speed
    windElement.textContent = `${Math.round(data.wind.speed)} km/h`;

    // Update weather icon
    const weatherMain = data.weather[0].main;
    const iconClass = weatherIcons[weatherMain] || 'fas fa-cloud';
    weatherIcon.className = iconClass;

    // Show the weather display with animation
    weatherDisplay.style.opacity = '1';
}

// Show error message
function showError(message) {
    // Create and show error toast
    const toast = document.createElement('div');
    toast.className = 'error-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
