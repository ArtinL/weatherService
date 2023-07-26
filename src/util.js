import axios from "axios";

const GEODECODE_URL = " https://geocode.maps.co/search?";
const WAPI_URL = "http://api.weatherapi.com/v1/forecast.json?";
const WAPI_KEY = "aed7d618693e4f4aaaf195401232607";

export function getValidFilters(filters) {
    const validFilters = ["temp", "condition", "feels_like", "humidity", "visibility", "wind_speed", "uv"];

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

export async function getWeatherResponse(req) {
    const [{ lat, lon }] = await getGeoCoords(req);
    const days = req.query.days && req.query.days > 0 && req.query.days <= 3 ? req.query.days : 3;
    const response = await axios.get(`${WAPI_URL}&key=${WAPI_KEY}&q=${lat},${lon}&days=${days}&aqi=yes`);
    return response.data;
}

export function getFilteredData(weatherData, filterArr, mode) {
    const filteredData = {
        //date: new Date((mode === "current" ? weatherData.last_updated_epoch : weatherData.time_epoch) * 1000).toJSON(),
        time: mode === "current" ? weatherData.last_updated : weatherData.time,
    };
    for (let filter of filterArr) {
        filteredData[filter] = getMatchingField(weatherData, filter);
    }
    return filteredData;
}

function getMatchingField(weatherData, filter) {
    switch (filter) {
        case "temp":
            return weatherData.temp_f;
        case "condition":
            return { text: weatherData.condition.text, icon: weatherData.condition.icon };
        case "feels_like":
            return weatherData.feels_like_f;
        case "humidity":
            return weatherData.humidity;
        case "visibility":
            return weatherData.vis_miles;
        case "wind_speed":
            return weatherData.wind_mph;
        case "uv":
            return weatherData.uv;
        default:
            throw new Error("Filter parsing error");
    }
}
