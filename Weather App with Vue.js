<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue.js Weather App</title>
    
    <!-- Vue.js -->
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Feather Icons -->
    <script src="https://unpkg.com/feather-icons"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: #1e293b; /* slate-800 */
        }
        
        /* Custom styles for the background gradient and transitions */
        .app-container {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); /* slate-900 to slate-800 */
            min-height: 100vh;
        }

        /* Animation for the weather card fade-in */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
    </style>
</head>
<body>

<div id="app" class="app-container flex justify-center items-center p-4 antialiased">
    
    <main class="w-full max-w-md mx-auto">
        <h1 class="text-4xl font-bold text-center text-white mb-6">Weather Vue</h1>
        
        <!-- Search Form -->
        <form @submit.prevent="searchWeather" class="flex mb-8 shadow-lg">
            <input type="text" v-model="searchQuery" placeholder="Enter a city name..." class="w-full px-4 py-3 text-white bg-slate-700 border-2 border-transparent rounded-l-lg focus:outline-none focus:border-cyan-500 transition-colors">
            <button type="submit" class="px-5 py-3 bg-cyan-500 text-white font-semibold rounded-r-lg hover:bg-cyan-600 transition-colors">
                <i data-feather="search" class="w-6 h-6"></i>
            </button>
        </form>

        <!-- Loading Spinner -->
        <div v-if="loading" class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            <p class="text-white mt-4">Fetching weather data...</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="bg-red-500/20 text-red-300 p-4 rounded-lg text-center fade-in">
            <h3 class="font-semibold">Error</h3>
            <p>{{ error }}</p>
        </div>

        <!-- Weather Display Card -->
        <div v-if="weather.current_condition" class="bg-slate-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-white border border-slate-700 fade-in">
            
            <!-- Location and Time -->
            <div class="text-center mb-6">
                <h2 class="text-3xl font-bold">{{ weather.nearest_area[0].areaName[0].value }}</h2>
                <p class="text-slate-400">{{ weather.nearest_area[0].country[0].value }}</p>
            </div>
            
            <!-- Main Temperature and Icon -->
            <div class="flex flex-col items-center justify-center mb-8">
                <i :data-feather="getWeatherIcon(weather.current_condition[0].weatherCode)" class="w-24 h-24 text-cyan-400 mb-4"></i>
                <p class="text-7xl font-bold">{{ weather.current_condition[0].temp_C }}°C</p>
                <p class="text-xl text-slate-300">{{ weather.current_condition[0].weatherDesc[0].value }}</p>
            </div>

            <!-- Additional Details -->
            <div class="grid grid-cols-3 gap-4 text-center">
                <div>
                    <p class="text-slate-400 text-sm">Feels Like</p>
                    <p class="font-semibold text-lg">{{ weather.current_condition[0].FeelsLikeC }}°</p>
                </div>
                <div>
                    <p class="text-slate-400 text-sm">Wind</p>
                    <p class="font-semibold text-lg">{{ weather.current_condition[0].windspeedKmph }} km/h</p>
                </div>
                <div>
                    <p class="text-slate-400 text-sm">Humidity</p>
                    <p class="font-semibold text-lg">{{ weather.current_condition[0].humidity }}%</p>
                </div>
            </div>
        </div>

        <!-- Initial State Message -->
        <div v-if="!weather.current_condition && !loading && !error" class="text-center text-slate-400 p-8 fade-in">
            <p>Search for a city to get the latest weather forecast.</p>
        </div>

    </main>
</div>

<script>
    const { createApp } = Vue;

    createApp({
        data() {
            return {
                searchQuery: '',
                weather: {},
                loading: true,
                error: null,
            };
        },
        methods: {
            /**
             * Fetches weather data for the given city from the wttr.in API.
             * This function includes robust error handling for network issues and API responses.
             * @param {string} city - The name of the city to search for.
             */
            async fetchWeather(city) {
                this.loading = true;
                this.error = null;
                this.weather = {};

                try {
                    const response = await fetch(`https://wttr.in/${city}?format=j1`);

                    // Check for non-successful HTTP status codes (like 404 Not Found)
                    if (!response.ok) {
                        throw new Error(`'${city}' not found. Please check the spelling or try another location.`);
                    }

                    // Check if the response is actually JSON before trying to parse it
                    const contentType = response.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) {
                        throw new Error("Received an unexpected response from the weather service.");
                    }
                    
                    const data = await response.json();

                    // A final check to ensure the expected data structure is present
                    if (!data.current_condition) {
                        throw new Error("Weather data for this location is incomplete. Please try another city.");
                    }

                    this.weather = data;

                } catch (err) {
                    // Provide a more user-friendly message for the generic "Failed to fetch" network error
                    if (err.message.includes('Failed to fetch')) {
                         this.error = "Could not connect to the weather service. Please check your internet connection.";
                    } else {
                         this.error = err.message;
                    }
                } finally {
                    this.loading = false;
                    this.$nextTick(() => {
                        feather.replace(); // Re-render icons after data is loaded
                    });
                }
            },
            /**
             * Initiates a weather search based on the user's query.
             */
            searchWeather() {
                if (this.searchQuery.trim()) {
                    this.fetchWeather(this.searchQuery);
                }
            },
            /**
             * Maps weather codes from the API to Feather icon names.
             * @param {string} code - The weather code from the API response.
             * @returns {string} The name of the Feather icon to display.
             */
            getWeatherIcon(code) {
                const weatherCode = parseInt(code);
                switch (true) {
                    case [113].includes(weatherCode): return 'sun'; // Sunny/Clear
                    case [116].includes(weatherCode): return 'cloud-sun'; // Partly cloudy
                    case [119, 122].includes(weatherCode): return 'cloud'; // Cloudy/Overcast
                    case [143, 248, 260].includes(weatherCode): return 'wind'; // Mist/Fog
                    case [176, 293, 296, 302, 308, 353, 356, 359].includes(weatherCode): return 'cloud-rain'; // Rain
                    case [179, 182, 185, 227, 230, 323, 326, 329, 332, 335, 338, 368, 371].includes(weatherCode): return 'cloud-snow'; // Snow
                    case [200, 386, 389, 392, 395].includes(weatherCode): return 'cloud-lightning'; // Thundery outbreaks
                    default: return 'sun'; // Default icon
                }
            }
        },
        /**
         * When the app is mounted, it fetches the weather for a default city.
         */
        mounted() {
            this.fetchWeather('Guntur');
        },
        /**
         * After every update, it ensures the Feather icons are rendered correctly.
         */
        updated() {
            feather.replace();
        }
    }).mount('#app');
</script>

</body>
</html>
