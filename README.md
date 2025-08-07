Vue.js Weather App
A modern, responsive weather application built with Vue.js 3, Tailwind CSS, and the wttr.in weather API.

Features
Current Weather Display: Fetches and displays real-time weather data for any city.

Search Functionality: Users can search for weather by entering a city name.

Responsive Design: The interface is built with Tailwind CSS, ensuring a seamless experience on both desktop and mobile devices.

Dynamic Icons: Weather conditions are represented by dynamic icons using the Feather Icons library.

Loading & Error Handling: The app provides user feedback with a loading spinner and displays clear, user-friendly error messages for network issues or invalid city searches.

Graceful Defaults: On startup, the app automatically fetches the weather for Guntur as a default city.

Technologies Used
Vue.js 3: The core JavaScript framework for building the user interface.

Tailwind CSS: A utility-first CSS framework for styling the application.

wttr.in: A console-oriented weather forecast service that provides weather data in JSON format.

Feather Icons: A collection of simply beautiful open-source icons for the dynamic weather representation.

Setup and Usage
To run this project locally, simply open the Vue.js Weather App.js file in any modern web browser. All dependencies are loaded via CDN, so no local installation or build process is required.

File Structure
|-- Vue.js Weather App.js
The entire application, including the HTML structure, CSS styling, and Vue.js logic, is contained within a single file.

How to Use
Open the Vue.js Weather App.js file in your web browser.

Use the search bar at the top of the page to enter the name of a city.

Click the search button or press enter to view the weather forecast for that location.

Code Overview
The application is a single HTML file with embedded JavaScript and CSS.

HTML: Defines the structure of the application, including the search form, loading state, error message, and the weather display card.

CSS: Custom styles are included for the background gradient, font, and a fade-in animation for a smoother user experience. It also uses the Tailwind CSS CDN for the main styling.

JavaScript (Vue 3):

The data object manages the searchQuery, weather data, loading state, and error messages.

The fetchWeather method is an async function that handles the API call to wttr.in, including comprehensive error handling for network failures or invalid responses.

The searchWeather method is triggered by the form submission to initiate the weather data fetch.

The getWeatherIcon method maps the weather codes from the API to appropriate Feather Icons.

The mounted hook automatically fetches weather for 'Guntur' when the page loads.

The updated hook ensures that Feather Icons are correctly rendered after the DOM is updated.

API Details
The application uses the https://wttr.in/ API with the ?format=j1 parameter to receive a JSON response. The API is queried with the user's city name to retrieve the relevant weather data.
