import {fetchSummoner} from "./riot-api";
import {mapSummoner} from "./mapper";
import {Region, updateSummoner} from "./dynamo-db";

const throttledQueue = require('throttled-queue')
const fs = require('fs')

const names = fs.readFileSync('./names/usernames2.txt').toString().split('\n')
    .filter((name: string) => name.length > 2);
const queue = throttledQueue(1, 1300)

export const addNamesFromFile = () => {
    names.forEach((name: string) => {
        queue(() => {
                fetchSummoner(name)
                    .then((summoner) => mapSummoner(summoner, Region.NA))
                    .then(updateSummoner)
                    .catch(console.log)
            }
        )
    })
}

