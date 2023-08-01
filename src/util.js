import axios from "axios";
import _ from "lodash";

const GEODECODE_URL = " https://geocode.maps.co/search?";
const WAPI_URL = "http://api.weatherapi.com/v1/forecast.json?";
const WAPI_KEY = "aed7d618693e4f4aaaf195401232607";

export function getValidFilters(filters) {
    const validFilters = ["temp", "condition", "feels_like", "humidity", "visibility", "wind_speed", "uv"];

    if (filters === "all") return validFilters;

    const filterArr = filters.split(",");

    //const x = validFilters.every((filter) => filterArr.includes(filter));

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

    if ((!city && !zip) || (city && ((country == "US" && !state) || (country != "US" && state))))
        throw new Error("Invalid request: Bad location information");

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
    const fields = {
        time: mode === "current" ? weatherData.last_updated : weatherData.time,
        temp: weatherData.temp_f,
        condition: {
            text: weatherData.condition.text,
            icon: weatherData.condition.icon,
        },
        feels_like: weatherData.feels_like_f,
        humidity: weatherData.humidity,
        visibility: weatherData.vis_miles,
        wind_speed: weatherData.wind_mph,
        uv: weatherData.uv,
    };

    const selectedFields = _.pick(fields, filterArr);

    return selectedFields;
}
