import {Region, SummonerEntity} from "./dynamo-db";
import {SummonerDTO} from "./riot-api";

const calcAvailabilityDate = (revisionDate: number, summonerLevel: number) : number => {
    const date = new Date(revisionDate)
    if (summonerLevel <= 6) return new Date(date.setMonth(date.getMonth() + 6)).valueOf();
    if (summonerLevel >= 30) return new Date(date.setMonth(date.getMonth() + 30)).valueOf();
    return new Date(date.setMonth(date.getMonth() + summonerLevel)).valueOf();
}

export const mapRegion = (region: string) : Region => {
    if (region === undefined || region === null || region === '') return undefined;
    switch(region.toUpperCase()) {
        case 'NA':
            return Region.NA
        default:
            return undefined
    }
}

export const mapSummoner = (summoner: SummonerDTO, region: Region) : SummonerEntity => {
    return ({
        ...summoner,
        region,
        availabilityDate: calcAvailabilityDate(summoner.revisionDate, summoner.summonerLevel)
    })
}