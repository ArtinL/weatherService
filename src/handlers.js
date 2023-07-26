import { OW_getWeatherResponse, getFilteredData, getValidFilters } from "./util";

// example city name call: /current?city=Corvallis&state=OR&filters=temp,condition,feels_like,humidity
// example zip code call: /current?zip=97333&filters=temp,condition,feels_like,humidity
export async function current(req) {
    const filterString = req.query.filters || "all";
    const filterArr = getValidFilters(filterString);

    const weatherResponse = await OW_getWeatherResponse(req, "current");

    return getFilteredData(weatherResponse.data, filterArr);
}

export async function forecast_3h(req) {
    const filterString = req.query.filters || "all";
    const filterArr = getValidFilters(filterString);

    const weatherResponse = await OW_getWeatherResponse(req, "forecast_3h");

    const filteredData = [];
    for (const weatherData of weatherResponse.data.list) {
        filteredData.push(getFilteredData(weatherData, filterArr));
    }

    return filteredData;
}
