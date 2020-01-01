require('dotenv').config();

const express = require('express');
const axios = require('axios');

const PORT = process.env.PORT;
const PODCAST_ID = process.env.PODCAST_ID;
const API_TOKEN = process.env.API_TOKEN;
const FRONT_END_ENDPOINT = process.env.FRONT_END_ENDPOINT;

const app = express();

app.get('/', (req, res) => {
    res.redirect("/episodes");
});

app.get('/episodes', async(req, res) => {
    const response = await axios.get(`https://buzzsprout.com/api/${PODCAST_ID}/episodes.json`, { headers: { 'Authorization': `Token token=${API_TOKEN}` } });
    res.set('Access-Control-Allow-Origin', FRONT_END_ENDPOINT);
    res.json(response.data);
})

app.listen(PORT, console.log(`API listening on port ${PORT}!`));