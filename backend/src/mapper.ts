import {Region} from "./dynamo-db";

interface SummonerDTO {
    accountId: string,
    profileIconId: number,
    revisionDate: number,
    name: string,
    id: string,
    puuid: string,
    summonerLevel: number
}

export interface SummonerInfoDTO {
    name: string,
    region: Region,
    accountId: string,
    revisionDate: number,
    nameExpirationDate: number,
    id: string,
    puuid: string,
    summonerLevel: number
}

const mapSummoner = (summoner: SummonerDTO, nameExpirationDate: number, region: Region) : SummonerInfoDTO => {
    return ({
        ...summoner,
        region,
        nameExpirationDate: 12345
    })
}