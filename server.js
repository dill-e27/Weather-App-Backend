// Import the Express framework
const express = require('express');

const cors = require('cors');

// Import node-fetch dynamically (for compatibility with CommonJS)
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Load environment variables from a .env file into process.env
require('dotenv').config();

// Create an instance of an Express app
const app = express();

// Set the port to the value in .env or default to 3000
const PORT = process.env.PORT || 3000;

// Store your OpenWeatherMap API key from the .env file
const apiKey = process.env.API_KEY;

app.use(cors());

// Serve all static files (HTML, CSS, JS, etc.) from the "public" directory
app.use(express.static('public'));

// Define a GET endpoint for fetching weather data
app.get('/weather', async (req, res) => {
    // Get the city name from the query string (e.g., /weather?city=London)
    const city = req.query.city;

    try {
        // Construct API URLs for current weather and 5-day forecast
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

        // Fetch both current and forecast data in parallel
        const [currentRes, forecastRes] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        // Convert the responses to JSON
        const current = await currentRes.json();
        const forecast = await forecastRes.json();

        // Send both datasets back to the frontend as JSON
        res.json({ current, forecast });

    } catch (err) {
        // If anything goes wrong (e.g. bad city name or network issue), send an error
        res.status(500).json({ error: 'Server error fetching weather' });
    }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});