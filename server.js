import express from "express";

import { current, forecast } from "./src/handlers.js";

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

app.get("/forecast", async (req, res) => {
    try {
        res.send(await forecast(req));
    } catch (err) {
        res.status(400).send(err.message);
    }
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
