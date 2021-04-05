import fetch, {Response} from 'node-fetch'

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

export const fetchSummoner = (name: string) : Promise<SummonerDTO> => {
    return fetch(`${process.env.SUMMONER_URI}/${name}`, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_TOKEN
        }
    }).then((res) => parseResponse(res));
}