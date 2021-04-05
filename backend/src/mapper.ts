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