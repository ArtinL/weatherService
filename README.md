# Weather Data Microservice

This microservice allows you to request weather data for both current conditions and an hourly forecast for up to 3 days, and allows you to apply a set of filters to include only the parts of the data you need.

The microservice is hosted on the internet, so it requires no interaction on your part aside from just using it!

## How to Call

To call the service in a testing environment, you can use Postman, CURL, or your web browser, since the endpoints are GET requests. The base URL for accessing the service is https://artin-weatherservice.azurewebsites.net,
and you can specify the type of data you need using aditional parameters. 

To use it within your program, you can call the service with the URL using your chosen language's API fetch method.

For frontend JavaScript, such a call might look like this:

```js
const response = await fetch("https://artin-weatherservice.azurewebsites.net"/* + additional parameters */);

let weatherData;
if (response.ok)
  weatherData = await response.json();
```

## Using the service 

The service includes 7 points of weather data: `time`, specifying when the weather data was collected, `temp` in °F, weather `condition` (e.g. Sunny, Partly Cloudy, etc.) along with a link to a visual icon, `humidity` in %, `visibility` in miles, `wind_speed` in miles per hour, and `UV` in UVI units.

### Endpoints

There are two primary endpoints, `/current` and `/forecast`, and location and filters can be specified using query parameters. 

- For ease of use, both endpoints accept identical parameters, with the addition of the *optional* `days` parameter in `/forecast` where you can specify the number of days you'd like (3 by default).


`/current` returns the most recently updated weather data from the location. 

Example response:
```json
{
  "time": "2023-07-31 18:00",
  "temp": 84,
  "condition": {
    "text": "Sunny",
    "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
  },
  "humidity": 33,
  "visibility": 9,
  "wind_speed": 8.1,
  "uv": 7
}
```

`/forecast` returns an array of days. Each day has some general information about the day, as well as an array of JSON objects for each hour in the day. The format of the data in the `hours` is identical to the object from `/current`

Example response: 

```json
[
  {
    "day": {
      "date": "2023-07-30",
      "max_temp": 85.3,
      "min_temp": 53.1,
      "condition": {
        "text": "Sunny",
        "icon": "//cdn.weatherapi.com/weather/64x64/day/113.png"
      }
    },
    "hour": [
      {
        "time": "2023-07-30 00:00",
        "..."
      },
      {"..."},
      "..."
    ]
  },
  {
    "day": {
      "date": "2023-07-31",
      "..."
      "hour": ["..."]
    }
  },
  "..."
]
```
### Location

To specify the location, you must provide a ZIP code, OR City Name + State/Country code. 

For example:
`?zip=97331` OR `?city=corvallis&state=OR` will return data for Corvallis, Oregon
- Note that a city name on its own is not sufficient and must be accompanied by either a state or country code. If a state code (such as OR) is provided, the program will assume the country code is 'US' by default. If no state code is provided, such as in the case where the location is outside of the US, a country code must be provided.


### Filters

Finally, the filters! You can specify filters using the optional `filters` query within the call. Simply provide the fields you want as a comma separated list, and the JSON will reflect your selections. 
- Note: For `/forecast`, the filters will only affect the data within the `hours` array, and will leave the day information unchanged.

Example response for
`/current?city=corvallis&state=OR&filters=temp,humidity,wind_speed`:
```json
{
  "time": "2023-07-31 18:15",
  "temp": 81,
  "humidity": 37,
  "wind_speed": 16.1
}
```



