require('dotenv').config();

const express = require('express');
const axios = require('axios');
const fs = require('fs');

const PORT = process.env.PORT;
const PODCAST_ID = process.env.PODCAST_ID;
const API_TOKEN = process.env.API_TOKEN;
const FRONT_END_ENDPOINT = process.env.FRONT_END_ENDPOINT;

const app = express();

app.get('/', (req, res) => {
    res.redirect("/episodes");
});

let etag = "";
app.get('/episodes', async (req, res) => {
    const cachePath = './episodes.cache.json';
    try {
        const response = await axios.get(`https://buzzsprout.com/api/${PODCAST_ID}/episodes.json`, {
            headers: {
                'Authorization': `Token token=${API_TOKEN}`,
                'If-None-Match': etag
            }
        });
        etag = response.headers.etag;
        res.set('Access-Control-Allow-Origin', FRONT_END_ENDPOINT);
        res.json(response.data);
        if (response.status === 200) {
            fs.writeFile(cachePath, JSON.stringify(response.data), () => {
                console.log(`Saved request '/episodes' to file '${cachePath}'`);
            });
        }
    } catch (error) {
        if(error.response.status === 304){
            fs.readFile(cachePath, 'utf8', (error, data) => {
                console.log(`Sending cached data from file ${cachePath}`);
                res.json(JSON.parse(data));
                if (error) {
                    console.log(error);
                }
            });
        }
    }
});

app.listen(PORT, console.log(`API listening on port ${PORT}!`));