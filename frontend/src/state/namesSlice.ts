import { createSlice } from '@reduxjs/toolkit'
import {parseResponse} from "../utils/api";
import Summoner from "../components/Summoner";

export const namesSlice = createSlice({
    name: 'names',
    initialState: {
        nameInput: '',
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

export const { setName, setPage, setSummoner, summonerLoading, summonerErrored, setSummoners, summonersLoading, summonersErrored, setNameLength, setLimit} = namesSlice.actions;

export const getNameInput = (state: any) => state.names.nameInput;
export const getSummoner = (state: any) => state.names.summoner;
export const getSummoners = (state: any) => state.names.summoners;
export const getSummonerApiValues = (state:any) => state.names.apiSummoner;
export const getPagination = (state: any) => state.names.pagination;
export const getSummonersHaveLoaded = (state: any) => state.names.apiSummoners.loaded;
export const getSummonersLoading = (state: any) => state.names.apiSummoners.loading;
export const getSummonersError = (state: any) => state.names.apiSummoners.error;
export const getNameLength = (state: any) => state.names.nameLength;
export const getLimit = (state: any) => state.names.limit;

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

    dispatch(summonerLoading())
    fetch(`http://localhost:8080/na/summoners/${name}`)
        .then(parseResponse)
        .then((summoner) => dispatch(setSummoner(summoner)))
        .catch((err) => dispatch(summonerErrored(err)))
}

export const fetchSummoners = (timestamp: number, backwards: boolean) => (dispatch: any, getState: any) => {
    dispatch(summonersLoading())

    const nameLength = getState().names.nameLength;

    const url = new URL('http://localhost:8080/na/summoners')
    url.searchParams.append('timestamp', String(timestamp))
    url.searchParams.append('backwards', String(backwards))
    if (nameLength && nameLength !== 'Any') {
        url.searchParams.append('nameLength', String(nameLength))
    }

    console.log(url.toString())

    fetch(url.toString())
        .then(parseResponse)
        .then((response) => {
            dispatch(setSummoners(response.summoners))
            dispatch(setPage({ forwards: response.forwards, backwards: response.backwards}))
        })
        .catch((err) => dispatch(summonersErrored(err)))
}

export default namesSlice.reducer;