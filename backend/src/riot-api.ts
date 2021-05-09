import fetch, {Response} from "node-fetch";
import {Region} from "./dynamo-db";

export interface SummonerDTO {
    accountId: string;
    profileIconId: number;
    revisionDate: number;
    name: string;
    id: string;
    puuid: string;
    summonerLevel: number;
}

const parseResponse = (res: Response): Promise<SummonerDTO> => {
    return res.json().then((response) => {
        if (response.status && response.status.message) {
            throw new Error(response.status.message);
        } else {
            return response;
        }
    });
};

const getServer = (region: Region) => {
    switch (
        region.toString().toLowerCase() // Why can't I check by the actual region? Odd workaround required.
        ) {
        case "br":
            return "br1";
        case "eune":
            return "eun1";
        case "euw":
            return "euw1";
        case "lan":
            return "la1";
        case "las":
            return "la2";
        case "na":
            return "na1";
        case "oce":
            return "oc1";
        case "ru":
            return "ru";
        case "tr":
            return "tr1";
        case "jp":
            return "jp1";
        case "kr":
            return "kr";
    }
};

export const fetchSummoner = (name: string, region: Region, token?: string): Promise<SummonerDTO> => {
    const url = new URL(`https://${getServer(region)}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`);
    return fetch(url, {
        headers: {
            "X-Riot-Token": token ? token : process.env.RIOT_API_TOKEN,
        },
    }).then((res) => parseResponse(res));
};
