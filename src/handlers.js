import { getWeatherResponse, getFilteredData, getValidFilters } from "./util.js";

export async function current(req) {
    const filterString = req.query.filters || "all";
    const filterArr = getValidFilters(filterString);

    const currentData = (await getWeatherResponse(req)).current;

    const filteredData = getFilteredData(currentData, filterArr, "current");
    return filteredData;
}

export async function forecast(req) {
    const filterString = req.query.filters || "all";
    const filterArr = getValidFilters(filterString);
    const forecastData = (await getWeatherResponse(req)).forecast.forecastday;

    const filteredForecastData = [];
    for (let forecastDay of forecastData) {
        const filteredDay = {
            day: {
                date: forecastDay.date,
                max_temp: forecastDay.day.maxtemp_f,
                min_temp: forecastDay.day.mintemp_f,
                condition: {
                    text: forecastDay.day.condition.text,
                    icon: forecastDay.day.condition.icon,
                },
            },
            hour: forecastDay.hour.map((hour) => getFilteredData(hour, filterArr, "forecast")),
        };

        filteredForecastData.push(filteredDay);
    }

    return filteredForecastData;
}
