import express from 'express'

import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import {fetchSummoner} from "./riot-api";
import {DynamoSummonerList, mapRegion, mapSummoner, mapSummoners} from "./mapper";
import {querySummoners, querySummonersByNameSize, updateSummoner} from "./dynamo-db";
import {addNamesFromFile} from "./generator";

const cors = require('cors')

dotenv.config()
const app = express()
const port = 8080

const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(bodyParser.json())

addNamesFromFile()

app.get('/:region/summoners', (req, res) => {
    const region = mapRegion(req.params.region)
    const timestamp = Number(req.query.timestamp)
    const backwards = req.query.backwards !== undefined && req.query.backwards === 'true'
    const nameLength = req.query.nameLength

    if (timestamp === undefined) {
        res.status(400).json('Invalid timestamp.')
    }

    if (nameLength) {
        querySummonersByNameSize(region, timestamp, backwards, Number(nameLength))
            .then((data: DynamoSummonerList) => mapSummoners(data))
            .then((data) => res.json(data))
            .catch((err) => {
                console.log(err)
                res.status(500).json(err.message)
            })
        return;
    }

    querySummoners(region, timestamp, backwards)
        .then((data: DynamoSummonerList) => mapSummoners(data))
        .then((data) => res.json(data))
        .catch((err) => {
            console.log(err)
            res.status(500).json(err.message)
        })
})

app.get('/:region/summoners/:name', (req, res) => {
    const region = mapRegion(req.params.region)
    if (region === undefined) {
        res.status(400).json('Region is invalid.')
        return
    }

    if (!req.params.name) {
        res.status(400).json('Name cannot be null or blank.')
        return
    }

    fetchSummoner(req.params.name, region)
        .then((summoner) => mapSummoner(summoner, region))
        .then((summoner) => {
            res.json(summoner);
            updateSummoner(summoner);
        })
        .catch((err) => {
            if (err.message && err.message.includes('summoner not found')) {
                console.log(`summoner ${req.params.name} not found.`)
                res.status(200).json({
                    name: req.params.name
                })
            } else {
                res.status(500).json(err.message)
            }
        })
})

app.listen(port, () => {
    console.log('Server started at http://localhost:8080');
})