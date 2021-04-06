import {Region, SummonerEntity} from "./dynamo-db";
import {SummonerDTO} from "./riot-api";

interface DynamoItem {
    r: string,
    aid: string,
    rd: number,
    l: number,
    ad: string,
    n: string
}

interface DynamoLastEvaluatedKey {
    ad: number,
    r: string,
    n: string
}

export interface DynamoSummonerList {
    Items: DynamoItem[],
    Count: number,
    ScannedCount: number,
    LastEvaluatedKey: DynamoLastEvaluatedKey
}

const calcAvailabilityDate = (revisionDate: number, summonerLevel: number) : number => {
    const date = new Date(revisionDate)
    if (summonerLevel <= 6) return new Date(date.setMonth(date.getMonth() + 6)).valueOf();
    if (summonerLevel >= 30) return new Date(date.setMonth(date.getMonth() + 30)).valueOf();
    return new Date(date.setMonth(date.getMonth() + summonerLevel)).valueOf();
}

export const mapSummoners = (dynamoResponse: DynamoSummonerList) => {
    return ({
        summoners: (dynamoResponse.Items.map(i => ({
            region: i.r,
            accountId: i.aid,
            revisionDate: i.rd,
            level: i.l,
            availabilityDate: i.ad,
            name: i.n.split('-')[1]
        }))),
        lastEvaluatedKey: dynamoResponse.LastEvaluatedKey && ({
            availabilityDate: dynamoResponse.LastEvaluatedKey.ad,
            region: dynamoResponse.LastEvaluatedKey.r,
            name: dynamoResponse.LastEvaluatedKey.n
        })
    })
}

export const mapRegion = (region: string) : Region => {
    if (region === undefined || region === null || region === '') return undefined;
    switch(region.toUpperCase()) {
        case 'NA': return Region.NA
        case 'BR': return Region.BR
        case 'EUNE': return Region.EUNE
        case 'EUW': return Region.EUW
        case 'JP': return Region.JP
        case 'KR': return Region.KR
        case 'LAN': return Region.LAN
        case 'LAS': return Region.LAS
        case 'OCE': return Region.OCE
        case 'TR': return Region.TR
        case 'RU': return Region.RU
        default: return undefined
    }
}

export const mapSummoner = (summoner: SummonerDTO, region: Region) : SummonerEntity => {
    return ({
        ...summoner,
        region,
        level: summoner.summonerLevel,
        availabilityDate: calcAvailabilityDate(summoner.revisionDate, summoner.summonerLevel)
    })
}