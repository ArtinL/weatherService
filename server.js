import express from "express";

import { getValidFilters } from "./src/util.js";
import { current, forecast_3h } from "./src/handlers.js";

const app = express();

app.get("/favicon.ico", (req, res) => res.status(204).end());

// example city name call: /current?city=Corvallis&state=OR&filters=temp,condition,feels_like,humidity
// example zip code call: /current?zip=97333&filters=temp,condition,feels_like,humidity
app.get("/current", async (req, res) => {
    try {
        res.send(await current(req));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

app.get("/forecast_3h", async (req, res) => {
    try {
        res.send(await forecast_3h(req));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

// async function getWeatherResponse(req) {
//     const [{ lat, lon }] = await getGeoCoords(req);

//     const url = req.params.mode === "current" ? WEATHER_CURRENT_URL : WEATHER_FORECAST_URL;
//     return await axios.get(`${url}lat=${lat}&lon=${lon}&appid=${API_KEY}`);

//     //return currentFlag ? [weatherResponse.data] : weatherResponse.data.list;
// }

// async function getGeoCoords(req) {
//     const city = req.query.city || "";
//     const state = req.query.state || "";
//     const country = req.query.country || "US";
//     const zip = req.query.zip || "";

//     if ((!city && !zip) || (city && !state)) throw new Error("Invalid request: Bad location information");

//     const geoLocationData = await axios.get(
//         `${GEODECODE_URL}city=${city}&state=${state}&country=${country}&postalcode=${zip}`
//     );
//     return geoLocationData.data;
// }

// function getFilteredData(weatherData, filterArr) {
//     const filteredData = {
//         date: new Date(weatherData.dt * 1000).toJSON(),
//     };
//     for (let filter of filterArr) {
//         filteredData[filter] = getMatchingField(weatherData, filter);
//     }
//     return filteredData;
// }

// function getMatchingField(weatherData, filter) {
//     switch (filter) {
//         case "temp" || "temp_f":
//             return Math.round((weatherData.main.temp - 273.15) * (9 / 5) + 32);
//         case "temp_c":
//             return Math.round(weatherData.main.temp - 273.15);
//         case "condition":
//             return weatherData.weather[0].main;
//         case "feels_like" || "feels_like_f":
//             return Math.round((weatherData.main.feels_like - 273.15) * (9 / 5) + 32);
//         case "feels_like_c":
//             return Math, round(weatherData.main.feels_like - 273.15);
//         case "humidity":
//             return weatherData.main.humidity;
//         case "visibility":
//             return weatherData.visibility;
//         case "wind_speed":
//             return weatherData.wind.speed;
//         default:
//             throw new Error("Filter parsing error");
//     }
// }

// function getValidFilters(filters) {
//     const filterArr = filters.split(",");
//     const validFilters = [
//         "temp",
//         "temp_f",
//         "temp_c",
//         "condition",
//         "feels_like",
//         "feels_like_f",
//         "feels_like_c",
//         "humidity",
//         "visibility",
//         "wind_speed",
//     ];
//     for (const filter of filterArr) {
//         if (!validFilters.includes(filter)) throw new Error("Invalid request: Bad filters");
//     }

//     return filterArr;
// }

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
