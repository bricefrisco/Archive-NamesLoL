import express from 'express'
import {fetchSummoner} from "./riot-api";
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const port = 8080

app.get('/summoner/:name', (req, res) => {
    fetchSummoner(req.params.name)
        .then((response) => res.send(response))
        .catch((err) => res.send(err.toString()))
})

app.listen(port, () => {
    console.log('Server started at http://localhost:8080');
})