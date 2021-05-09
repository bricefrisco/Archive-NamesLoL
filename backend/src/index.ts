import express from "express";

import dotenv from "dotenv";
import bodyParser from "body-parser";
import { fetchSummoner } from "./riot-api";
import {
  DynamoSummonerList,
  mapRegion,
  mapSummoner,
  mapSummoners,
} from "./mapper";
import {
  querySummoners,
  querySummonersByNameSize,
  updateSummoner,
} from "./dynamo-db";

import {scheduleRefreshes} from "./data-refresher";

const rateLimit = require('express-rate-limit')
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 8080; // Use port specified in environment variables, otherwise default to 8080
const auth = require('./auth-for-beta')

const corsOptions = {
  origin: "http://localhost:3000", // Allow requests from localhost origin
  optionsSuccessStatus: 200,
};

const limiter = rateLimit({
  windowMs: 1300,
  max: 1 // Limit each IP to 1 request per 1300 milliseconds.
})


app.use(cors(corsOptions)); // Apply cors settings
app.use(bodyParser.json()); // Unmarshal request bodies to JSON formatting.
app.use('/riot/', limiter)

app.post('/beta-auth', (req, res) => {
  if (!req.body.key || req.body.key !== process.env.BETA_CLIENT_KEY) {
    res.status(401).json('Invalid key.')
  } else {
    res.status(200).json('Authorization successful.')
  }
})

app.get("/:region/summoners", auth, (req, res) => {
  const region = mapRegion(req.params.region);
  const timestamp = Number(req.query.timestamp);
  const backwards =
    req.query.backwards !== undefined && req.query.backwards === "true";
  const nameLength = req.query.nameLength;

  if (timestamp === undefined) {
    res.status(400).json("Invalid timestamp.");
  }

  if (nameLength) {
    querySummonersByNameSize(region, timestamp, backwards, Number(nameLength))
      .then((data: DynamoSummonerList) => mapSummoners(data))
      .then((data) => res.json(data))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err.message);
      });
    return;
  }

  querySummoners(region, timestamp, backwards)
    .then((data: DynamoSummonerList) => mapSummoners(data))
    .then((data) => res.json(data))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err.message);
    });
});

app.get("/riot/:region/summoners/:name", auth, (req, res) => {
  const region = mapRegion(req.params.region);
  if (region === undefined) {
    res.status(400).json("Region is invalid.");
    return;
  }

  if (!req.params.name) {
    res.status(400).json("Name cannot be null or blank.");
    return;
  }

  fetchSummoner(req.params.name, region)
    .then((summoner) => mapSummoner(summoner, region))
    .then((summoner) => {
      res.json(summoner);

      if (!req.query.hideSearch) {
        updateSummoner(summoner);
      } else {
        console.log(region + '#' + req.params.name + '\t' + 'Search hidden')
      }
    })
    .catch((err) => {
      if (err.message && err.message.includes("summoner not found")) {
        console.log(`summoner ${req.params.name} not found.`);
        res.status(200).json({
          name: req.params.name,
        });
      } else {
        console.log(err)
        res.status(500).json(err.message);
      }
    });
});

app.listen(port, () => {
  console.log("Server started at http://localhost:" + port);
});

scheduleRefreshes();
