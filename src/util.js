import axios from "axios";

const GEODECODE_URL = " https://geocode.maps.co/search?";
const OW_CURRENT_URL = "https://api.openweathermap.org/data/2.5/weather?";
const OW_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast?";
const OW_KEY = "a52f6aeb31b10bdd467e82a8bd4560f6";
const WAPI_CURRENT_URL = "http://api.weatherapi.com/v1/current.json?";
const WAPI_FORECAST_URL = "http://api.weatherapi.com/v1/forecast.json?";
const WAPI_KEY = "aed7d618693e4f4aaaf195401232607";

export async function OW_getWeatherResponse(req, mode) {
    const [{ lat, lon }] = await getGeoCoords(req);

    mode === "current" ? OW_CURRENT_URL : OW_FORECAST_URL;
    return await axios.get(`${url}lat=${lat}&lon=${lon}&appid=${OW_KEY}`);

    //return currentFlag ? [weatherResponse.data] : weatherResponse.data.list;
}

export function getFilteredData(weatherData, filterArr) {
    const filteredData = {
        date: new Date(weatherData.dt * 1000).toJSON(),
    };
    for (let filter of filterArr) {
        filteredData[filter] = getMatchingField(weatherData, filter);
    }
    return filteredData;
}

export function getValidFilters(filters) {
    const validFilters = [
        "temp",
        "temp_f",
        "temp_c",
        "condition",
        "feels_like",
        "feels_like_f",
        "feels_like_c",
        "humidity",
        "visibility",
        "wind_speed",
    ];

    if (filters === "all") return validFilters;

    const filterArr = filters.split(",");
    for (const filter of filterArr) {
        if (!validFilters.includes(filter)) throw new Error("Invalid request: Bad filters");
    }

    return filterArr;
}

async function getGeoCoords(req) {
    const city = req.query.city || "";
    const state = req.query.state || "";
    const country = req.query.country || "US";
    const zip = req.query.zip || "";

    if ((!city && !zip) || (city && !state)) throw new Error("Invalid request: Bad location information");

    const geoLocationData = await axios.get(
        `${GEODECODE_URL}city=${city}&state=${state}&country=${country}&postalcode=${zip}`
    );
    return geoLocationData.data;
}

function getMatchingField(weatherData, filter) {
    switch (filter) {
        case "temp" || "temp_f":
            return Math.round((weatherData.main.temp - 273.15) * (9 / 5) + 32);
        case "temp_c":
            return Math.round(weatherData.main.temp - 273.15);
        case "condition":
            return weatherData.weather[0].main;
        case "feels_like" || "feels_like_f":
            return Math.round((weatherData.main.feels_like - 273.15) * (9 / 5) + 32);
        case "feels_like_c":
            return Math, round(weatherData.main.feels_like - 273.15);
        case "humidity":
            return weatherData.main.humidity;
        case "visibility":
            return weatherData.visibility;
        case "wind_speed":
            return weatherData.wind.speed;
        default:
            throw new Error("Filter parsing error");
    }
}
