import express from 'express';

const app = express();

const GEODECODE_URL = ' https://geocode.maps.co/search?';
const WEATHER_CURRENT_URL = 'https://api.openweathermap.org/data/2.5/weather?';
const WEATHER_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast?';
const API_KEY = 'a52f6aeb31b10bdd467e82a8bd4560f6';
const DEFAULT_FILTERS = 'temp,condition,feels_like,humidity,visibility,wind_speed'


// example city name call: /current?city=Corvallis&state=OR&filters=temp,condition,feels_like,humidity
// example zip code call: /current?zip=97333&filters=temp,condition,feels_like,humidity
app.get('/:mode', async (req, res) => {
    const mode = req.params.mode;
    try {
        if (mode !== 'current' && mode !== 'forecast') throw new Error('Invalid request: Unknown query');
        const currentFlag = mode === 'current';

        const [{ lat, lon }] = await getGeoCoords(req);


        const url = currentFlag ? WEATHER_CURRENT_URL : WEATHER_FORECAST_URL;
        const weatherResponse = await fetch(`${url}lat=${lat}&lon=${lon}&appid=${API_KEY}`);

        const weatherDataArr = currentFlag ? [await weatherResponse.json()] : (await weatherResponse.json()).list;


        const filterString = req.query.filters || DEFAULT_FILTERS;
        const filterArr = validateFilters(filterString);

        const filteredDataArr = getFilteredData(weatherDataArr, filterArr);


        res.send(currentFlag ? filteredDataArr[0] : filteredDataArr);

    } catch (err) {
        res.status(400).send(err.message);
    }
});


async function getGeoCoords(req) {
    const city = req.query.city || '';
    const state = req.query.state || '';
    const country = req.query.country || 'US';
    const zip = req.query.zip || '';


    if ((!city && !zip) || (city && !state)) throw new Error('Invalid request: Bad location information');

    const geoLocationData = await fetch(`${GEODECODE_URL}city=${city}&state=${state}&country=${country}&postalcode=${zip}`);
    return await geoLocationData.json();
}

function getFilteredData(weatherDataArr, filterArr) {
    const filteredDataArr = weatherDataArr.map((weatherData) => {
        const filteredData = {
            date: new Date(weatherData.dt * 1000).toJSON()
        };
        for (let filter of filterArr) {
            filteredData[filter] = getField(weatherData, filter);
        }
        return filteredData;
    });

    return filteredDataArr;
}


function getField(weatherData, filter) {
    switch (filter) {
        case 'temp' || 'temp_f':
            return Math.round((weatherData.main.temp - 273.15) * (9 / 5) + 32);
        case 'temp_c':
            return Math.round(weatherData.main.temp - 273.15);
        case 'condition':
            return weatherData.weather[0].main;
        case 'feels_like' || 'feels_like_f':
            return Math.round((weatherData.main.feels_like - 273.15) * (9 / 5) + 32);
        case 'feels_like_c':
            return Math, round(weatherData.main.feels_like - 273.15);
        case 'humidity':
            return weatherData.main.humidity;
        case 'visibility':
            return weatherData.visibility;
        case 'wind_speed':
            return weatherData.wind.speed;
        default: throw new Error('Filter parsing error');
    }
}

function validateFilters(filters) {
    const filterArr = filters.split(',');
    const validFilters = ['temp', 'temp_f', 'temp_c', 'condition', 'feels_like', 'feels_like_f', 'feels_like_c', 'humidity', 'visibility', 'wind_speed'];
    for (const filter of filterArr) {
        if (!validFilters.includes(filter)) throw new Error('Invalid request: Bad filters');
    }

    return filterArr;
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is listening on port 3000');
});