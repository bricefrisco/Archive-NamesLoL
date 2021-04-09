import fetch, {Response} from 'node-fetch'
import {Region} from "./dynamo-db";

export interface SummonerDTO {
    accountId: string,
    profileIconId: number,
    revisionDate: number,
    name: string,
    id: string,
    puuid: string,
    summonerLevel: number
}

const parseResponse = (res: Response) : Promise<SummonerDTO> => {
    return res.json()
        .then((response) => {
            if (response.status && response.status.message) {
                throw new Error(response.status.message)
            } else {
                return response;
            }
        })
}

const getServer = (region: Region) => {
    switch(region) {
        case Region.BR:
            return 'br1'
        case Region.EUNE:
            return 'eun1'
        case Region.EUW:
            return 'euw1'
        case Region.LAN:
            return 'la1'
        case Region.LAS:
            return 'la2'
        case Region.NA:
            return 'na1'
        case Region.OCE:
            return 'oc1'
        case Region.RU:
            return 'ru'
        case Region.TR:
            return 'tr1'
        case Region.JP:
            return 'jp1'
        case Region.KR:
            return 'kr'
    }
}


export const fetchSummoner = (name: string, region: Region) : Promise<SummonerDTO> => {
    const url = new URL(`https://${getServer(region)}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`)
    return fetch(url, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_TOKEN
        }
    }).then((res) => parseResponse(res));
}