import {querySummonersBetweenDate, Region} from "./dynamo-db";
import {updateOrDeleteSummoner} from "./data-loader";
import {DynamoItem, DynamoSummonerList} from "./mapper";

const throttledQueue = require("throttled-queue");
const queues: Map<Region, any> = new Map<Region, any>();
const DAY = 24 * 60 * 60 * 1000;
const CRON = require('node-cron');

Object.keys(Region).forEach((region: Region) => {
    queues.set(region, throttledQueue(1, 1200));
});

export const refreshSummoners = (startDate: number, endDate: number) => {
    Object.keys(Region).forEach((region: Region) => {
        querySummonersBetweenDate(region, startDate, endDate)
            .then((summoners: DynamoSummonerList) => {
                summoners.Items.forEach((summoner: DynamoItem) => {
                    queues.get(region)(() => updateOrDeleteSummoner(summoner.n.split('#')[1], region, process.env.RIOT_API_TOKEN));
                })
            })
    })
}

export const refreshSummonersPastThreeDays = () => {
    const now = new Date().valueOf()
    const threeDaysAgo = new Date(now - 3 * DAY)
    refreshSummoners(threeDaysAgo.valueOf(), now)
}

export const refreshSummonersToday = () => {
    const now = new Date().valueOf()
    const tomorrow = new Date(now + DAY)
    const yesterday = new Date(now - DAY)
    refreshSummoners(yesterday.valueOf(), tomorrow.valueOf())
}

export const refreshSummonersNextThreeDays = () => {
    const now = new Date().valueOf()
    const threeDaysFromNow = new Date(now + 3 * DAY)
    refreshSummoners(now, threeDaysFromNow.valueOf())
}

export const scheduleRefreshes = () => {
    console.log('Scheduling automatic refreshes...')

    CRON.schedule('0 0 0,8,16 * * *', () => {
        console.log('Refreshing summoners for past three days...')
        refreshSummonersPastThreeDays();
    })

    CRON.schedule('0 0 4,12,20 * * *', () => {
        console.log('Refreshing summoners today...')
        refreshSummonersToday();
    })

    CRON.schedule('0 0 2 * * *', () => {
        console.log('Refreshing summoners for next three days...')
        refreshSummonersNextThreeDays();
    })
}
