import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import {fetchSummoner} from "./riot-api";
import {mapRegion, mapSummoner} from "./mapper";
import {updateSummoner} from "./dynamo-db";

dotenv.config()
const app = express()
const port = 8080

app.use(bodyParser.json())

app.get('/summoners/:region/:name', (req, res) => {
    const region = mapRegion(req.params.region)
    if (region === undefined) {
        res.status(400).json('Region is invalid.')
        return
    }

    fetchSummoner(req.params.name)
        .then((summoner) => mapSummoner(summoner, region))
        .then((summoner) => {
            res.json(summoner);
            updateSummoner(summoner);
        })
        .catch((err) => res.status(500).json(err.message))
})

app.listen(port, () => {
    console.log('Server started at http://localhost:8080');
})