import {fetchSummoner} from "./riot-api";
import {mapSummoner} from "./mapper";
import {Region, updateSummoner} from "./dynamo-db";

const throttledQueue = require('throttled-queue')
const fs = require('fs')

const letters = /^[A-Za-z]+$/;

const names = fs.readFileSync('./names/english-words.txt').toString().split('\n')
    .filter((name: string) => name.length === 5)
    .filter((name: string) => name.match(letters))

console.log('names length:', names.length)

const naQueue = throttledQueue(1, 1300)
const euwQueue = throttledQueue(1, 1300)
const krQueue = throttledQueue(1, 1300)
const euneQueue = throttledQueue(1, 1300)
const brQueue = throttledQueue(1, 1300)
const lanQueue = throttledQueue(1, 1300)
const lasQueue = throttledQueue(1, 1300)
const trQueue = throttledQueue(1, 1300)

const fetchAndUpdateSummoner = (name: string, region: Region) => {
    fetchSummoner(name, region)
        .then((summoner) => mapSummoner(summoner, region))
        .then(updateSummoner)
        .catch((err) => {
            if (err.message.includes('summoner not found')) {
                console.log(`Summoner not found: ${region.toUpperCase()}#${name.toUpperCase()}`)
            } else {
                console.log('Error occurred - ' + err.message)
            }
        })
}

export const addNamesFromFile = () => {
    names.forEach((name: string) => {
        naQueue(() => fetchAndUpdateSummoner(name, Region.NA))
        euwQueue(() => fetchAndUpdateSummoner(name, Region.EUW))
        krQueue(() => fetchAndUpdateSummoner(name, Region.KR))
        euneQueue(() => fetchAndUpdateSummoner(name, Region.EUNE))
        brQueue(() => fetchAndUpdateSummoner(name, Region.BR))
        lanQueue(() => fetchAndUpdateSummoner(name, Region.LAN))
        lasQueue(() => fetchAndUpdateSummoner(name, Region.LAS))
        trQueue(() => fetchAndUpdateSummoner(name, Region.TR))
    })
}

