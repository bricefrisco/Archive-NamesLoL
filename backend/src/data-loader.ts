import {fetchSummoner} from "./riot-api";
import {mapSummoner} from "./mapper";
import {Region, updateSummoner} from "./dynamo-db";

const throttledQueue = require('throttled-queue')
const fs = require('fs')

const letters = /^[A-Za-z]+$/;

const names = fs.readFileSync('./names/english-names.txt').toString().split('\n')
    // .filter((name: string) => name.length === 5)
    .filter((name: string) => name.match(letters))
    .sort((x: string, y: string) => {
        if (x < y) return -1;
        if (y > x) return 1;
        return 0;
    })

console.log('names length:', names.length)

const naQueue = throttledQueue(1, 433)
const euwQueue = throttledQueue(1, 433)
const krQueue = throttledQueue(1, 433)
const euneQueue = throttledQueue(1, 433)
const brQueue = throttledQueue(1, 433)
const lanQueue = throttledQueue(1, 433)
const lasQueue = throttledQueue(1, 433)
const trQueue = throttledQueue(1, 433)

const fetchAndUpdateSummoner = (name: string, region: Region, token: string, idx?: number, total?: number) => {
    fetchSummoner(name, region, token)
        .then((summoner) => mapSummoner(summoner, region))
        .then(updateSummoner)
        .then(() => {
            if (idx) {
                console.log(`[${idx}/${total}] - ${region.toUpperCase()}#${name.toUpperCase()}`)
            }
        })
        .catch((err) => {
            if (err.message.includes('summoner not found')) {
                console.log(`Summoner not found: ${region.toUpperCase()}#${name.toUpperCase()}`)
            } else {
                console.log('Error occurred - ' + err.message)
            }
        })
}

export const addNamesFromFile = () => {
    const total = names.length;
    names.forEach((name: string, idx: number) => {
        if (idx < 902) return;

        let token: string;
        if (idx % 3 === 0) token = process.env.RIOT_API_TOKEN;
        if (idx % 3 === 1) token = process.env.RIOT_API_TOKEN_2;
        if (idx % 3 === 2) token = process.env.RIOT_API_TOKEN_3;

        naQueue(() => fetchAndUpdateSummoner(name, Region.NA, token, idx, total))
        euwQueue(() => fetchAndUpdateSummoner(name, Region.EUW, token))
        krQueue(() => fetchAndUpdateSummoner(name, Region.KR, token))
        euneQueue(() => fetchAndUpdateSummoner(name, Region.EUNE, token))
        brQueue(() => fetchAndUpdateSummoner(name, Region.BR, token))
        lanQueue(() => fetchAndUpdateSummoner(name, Region.LAN, token))
        lasQueue(() => fetchAndUpdateSummoner(name, Region.LAS, token))
        trQueue(() => fetchAndUpdateSummoner(name, Region.TR, token))
    })
}

