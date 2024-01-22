const express = require('express');
const https = require('https');
const path = require('path');


const router = express.Router();

let cityName = 'Astana';
router.use(express.static('public'));
router.use(express.json());

router.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath);
});


router.post('/weather', async (req, res) => {
    cityName = req.body.city;

    const APIkey = "7445e570dcfb27be27f536a55fe702f4";
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIkey}&units=metric`;
    
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIkey}&units=metric`;
    const hourlyForecastUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=51.1801&lon=71.446&exclude=current,minutely,daily,alerts&appid=${APIkey}&units=metric`;
    
//
    try {
        // Fetch current weather data
        const currentWeatherResponse = await fetch(currentWeatherUrl);
        const currentWeatherData = await currentWeatherResponse.json();

        // Fetch 5-day forecast data
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();


        let lat = currentWeatherData.coord.lat;
        let lon = currentWeatherData.coord.lon;
        console.log(lat, lon);
        const airPollutionUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${APIkey}`;
        const airPollutionResponse = await fetch(airPollutionUrl);
        const airPollutionData = await airPollutionResponse.json();


        const timezoneUrl = `http://api.timezonedb.com/v2.1/get-time-zone?key=KJD9DK60HXSW&format=json&by=position&lat=${lat}&lng=${lon}`
        const timezoneResponse = await fetch(timezoneUrl);
        const timezoneData = await timezoneResponse.json();


        const responseData = {
            currentWeather: currentWeatherData,
            forecast: forecastData,
            airPollution: airPollutionData,
            timezone: timezoneData,

        };

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

