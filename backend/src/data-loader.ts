import {fetchSummoner, SummonerDTO} from "./riot-api";
import {mapSummoner} from "./mapper";
import {deleteSummoner, querySummoner, Region, updateSummoner} from "./dynamo-db";
import {formatName, formatStatus} from "./utils";

const throttledQueue = require("throttled-queue");
const fs = require("fs");

const THROTTLE: number = 1300;

// const names = fs
//     .readFileSync("./names/summoners.txt")
//     .toString()
//     .split("\n")
//     .filter((name: string) => name.length === 5);

const queues: Map<Region, any> = new Map<Region, any>();

Object.keys(Region).forEach((region: Region) => {
    queues.set(region, throttledQueue(1, THROTTLE));
});

export const updateOrDeleteSummoner = (name: string, region: Region, token: string) => {
    fetchSummoner(name, region, token)
        .then((summoner) => mapSummoner(summoner, region))
        .then((summoner) => {
            if (summoner.name.toUpperCase() !== name.toUpperCase()) {
                deleteSummoner(name, region).then(() => {
                    console.log(formatName(name, region) + formatStatus(`Removed - name mismatch. Previous: '${name.toUpperCase()}', current: '${summoner.name.toUpperCase()}'`))
                }).catch((err) => {
                    console.log('Error occurred while deleting summoner - ' + err);
                })
            }
            return summoner;
        })
        .then(updateSummoner)
        .catch((err) => {
            if (err.message.includes('summoner not found')) {
                console.log(formatName(name, region) + formatStatus('Not found'))
            } else {
                console.log('Error occurred - ' + err.message);
            }
        });
}

export const fetchAndUpdateSummoner = (name: string, region: Region, token: string) => {
    fetchSummoner(name, region, token)
        .then((summoner) => mapSummoner(summoner, region))
        .then(updateSummoner)
        .catch((err) => {
            if (err.message.includes("summoner not found")) {
                console.log(formatName(name, region) + formatStatus("Not found"));
            } else {
                console.log("Error occurred - " + err.message);
            }
        });
};

const summonerAlreadyExists = (name: string, region: Region, idx?: number, total?: number) => {
    if (region.toUpperCase() === "NA") { // Only log this for NA region.
        const progress = ("[" + idx + "/" + total + "]").padEnd(24);
        console.log(progress + region.toUpperCase() + "#" + name.toUpperCase());
    }

    return querySummoner(region, name)
        .then((res: any) => {
            return res.Items && res.Items.length > 0;
        })
        .catch((err) =>
            console.log("Error occurred while querying DynamoDB:", err.toString())
        );
};

export const addSummonerIfNotExists = (name: string, region: Region, token: string, idx?: number, total?: number) => {
    summonerAlreadyExists(name, region, idx, total).then((alreadyExists) => {
        if (!alreadyExists) fetchAndUpdateSummoner(name, region, token);
        else console.log(formatName(name, region) + formatStatus("Already exists"));
    });
};

// export const addNamesFromFile = () => {
//     const total = names.length;
//     names.forEach((name: string, idx: number) => {
//         Object.keys(Region).forEach((region: Region) => {
//             queues.get(region)(() => addSummonerIfNotExists(name, region, process.env.RIOT_API_TOKEN, idx, total));
//         });
//     });
// };
