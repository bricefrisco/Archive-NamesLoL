import { createSlice } from '@reduxjs/toolkit'
import {parseResponse} from "../utils/api";
import Summoner from "../components/Summoner";

export enum Region {
    NA = 'na',
    BR = 'br',
    EUNE = 'eune',
    EUW = 'euw',
    JP = 'jp',
    KR = 'kr',
    LAN = 'lan',
    LAS = 'las',
    OCE = 'oce',
    TR = 'tr',
    RU = 'ru'
}

export const namesSlice = createSlice({
    name: 'names',
    initialState: {
        nameInput: '',
        region: Region.NA,
        nameLength: undefined,
        summoner: undefined,
        summoners: undefined,
        apiSummoner: {
            loading: false,
            error: false,
            errorMessage: undefined
        },
        apiSummoners: {
            loaded: false,
            loading: false,
            error: false,
            errorMessage: undefined
        },
        pagination: {
            backwards: undefined,
            forwards: undefined
        },
        limit: false
    },
    reducers: {
        setName: (state, action) => {
            state.nameInput = action.payload;
        },
        setNameLength: (state, action) => {
            state.nameLength = action.payload;
        },
        setRegion: (state, action) => {
            state.region = action.payload;
        },
        setPage: (state, action) => {
            state.pagination.backwards = action.payload.backwards;
            state.pagination.forwards = action.payload.forwards;
        },
        setSummoner: (state, action) => {
            state.apiSummoner.loading = false;
            state.apiSummoner.error = false;
            state.apiSummoner.errorMessage = undefined;
            state.summoner = action.payload;
        },
        summonerLoading: (state) => {
            state.apiSummoner.loading = true;
            state.apiSummoner.error = false;
            state.apiSummoner.errorMessage = undefined;
            state.summoner = undefined;
        },
        summonerErrored: (state, action) => {
            state.apiSummoner.loading = false;
            state.apiSummoner.error = true;
            state.apiSummoner.errorMessage = action.payload;
            state.summoner = undefined;
        },
        setSummoners: (state, action) => {
            state.summoners = action.payload;
            state.apiSummoners.loaded = true;
            state.apiSummoners.loading = false;
            state.apiSummoners.error = false;
            state.apiSummoners.errorMessage = undefined;
        },
        summonersLoading: (state) => {
            state.apiSummoners.loaded = false;
            state.apiSummoners.loading = true;
            state.apiSummoners.error = false;
            state.apiSummoners.errorMessage = undefined;
            state.summoners = undefined;
        },
        summonersErrored: (state, action) => {
            state.apiSummoners.loaded = false;
            state.apiSummoners.loading = false;
            state.apiSummoners.error = true;
            state.apiSummoners.errorMessage = action.payload;
            state.summoners = undefined;
        },
        setLimit: (state, action) => {
            state.limit = action.payload;
        }
    }
})

export const { setName, setRegion, setPage, setSummoner, summonerLoading, summonerErrored, setSummoners, summonersLoading, summonersErrored, setNameLength, setLimit} = namesSlice.actions;

export const getNameInput = (state: any) => state.names.nameInput;
export const getSummoner = (state: any) => state.names.summoner;
export const getSummoners = (state: any) => state.names.summoners;
export const getSummonerApiValues = (state:any) => state.names.apiSummoner;
export const getPagination = (state: any) => state.names.pagination;
export const getSummonersHaveLoaded = (state: any) => state.names.apiSummoners.loaded;
export const getSummonerLoading = (state: any) => state.names.apiSummoner.loading;
export const getSummonersLoading = (state: any) => state.names.apiSummoners.loading;
export const getSummonersError = (state: any) => state.names.apiSummoners.error;
export const getNameLength = (state: any) => state.names.nameLength;
export const getLimit = (state: any) => state.names.limit;
export const getRegion = (state: any) => state.names.region;

export const updateSummoner = (summoner: Summoner) => (dispatch: any, getState: any) => {
    const summoners = getState().names.summoners;

    const updatedSummoners = summoners.map((s: Summoner) => {
        if (s.name.toLowerCase() !== summoner.name.toLowerCase()) return s;
        return {...summoner, name: s.name.toLowerCase()}
    })

    dispatch(setSummoners(updatedSummoners))
}

export const fetchSummoner = () => (dispatch: any, getState: any) => {
    const name = getState().names.nameInput;
    const region = getState().names.region;

    console.log('region: ' + region)

    dispatch(summonerLoading())
    fetch(`http://localhost:8080/${region}/summoners/${name}`)
        .then(parseResponse)
        .then((summoner) => dispatch(setSummoner(summoner)))
        .catch((err) => dispatch(summonerErrored(err.toString())))
}

export const fetchSummoners = (timestamp: number, backwards: boolean) => (dispatch: any, getState: any) => {
    dispatch(summonersLoading())

    const nameLength = getState().names.nameLength;
    const region = getState().names.region;

    const url = new URL(`http://localhost:8080/${region}/summoners`)
    url.searchParams.append('timestamp', String(timestamp))
    url.searchParams.append('backwards', String(backwards))
    if (nameLength && nameLength !== 'Any') {
        url.searchParams.append('nameLength', String(nameLength))
    }

    fetch(url.toString())
        .then(parseResponse)
        .then((response) => {
            dispatch(setSummoners(response.summoners))
            dispatch(setPage({ forwards: response.forwards, backwards: response.backwards}))
        })
        .catch((err) => dispatch(summonersErrored(err.toString())))
}

export default namesSlice.reducer;