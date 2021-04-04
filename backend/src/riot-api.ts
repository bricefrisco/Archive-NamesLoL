import fetch from 'node-fetch'

export const fetchSummoner = (name: string) => {
    return fetch(`${process.env.NA_URI}/${name}`, {
        headers: {
            'X-Riot-Token': process.env.RIOT_API_TOKEN
        }
    }).then(res => res.json());
}