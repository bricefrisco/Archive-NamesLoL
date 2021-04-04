import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import {fetchSummoner} from "./riot-api";
import {deleteSummoner, Region, updateSummoner} from "./dynamo-db";

dotenv.config()
const app = express()
const port = 8080

app.use(bodyParser.json())

app.get('/summoners/:region/:name', (req, res) => {
    fetchSummoner(req.params.name)
        .then((response) => res.json(response))
        .catch((err) => res.status(500).json(err.message))
})

app.post('/summoners', (req, res) => {
    updateSummoner(req.body.name, Region.NA, req.body.bar)
        .then(() => res.json('Successfully added/updated summoner.'))
        .catch((err) => res.status(500).json(err.message))
})

app.delete('/summoners', (req, res) => {
    deleteSummoner(req.body.name, Region.NA)
        .then(() => res.json('Successfully deleted summoner.'))
        .catch((err) => res.status(500).json(err.message))
})

app.listen(port, () => {
    console.log('Server started at http://localhost:8080');
})