import { createSlice } from '@reduxjs/toolkit'
import {parseResponse} from "../utils/api";

export const namesSlice = createSlice({
    name: 'names',
    initialState: {
        nameInput: '',
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
        }
    },
    reducers: {
        setName: (state, action) => {
            state.nameInput = action.payload;
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
            state.apiSummoners.loaded = false;
            state.apiSummoners.loading = false;
            state.apiSummoners.error = false;
            state.apiSummoners.errorMessage = undefined;
            state.summoners = action.payload;
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
        }
    }
})

export const { setName, setPage, setSummoner, summonerLoading, summonerErrored, setSummoners, summonersLoading, summonersErrored} = namesSlice.actions;

export const getNameInput = (state: any) => state.names.nameInput;
export const getSummoner = (state: any) => state.names.summoner;
export const getSummoners = (state: any) => state.names.summoners;
export const getSummonerApiValues = (state:any) => state.names.apiSummoner;
export const getSummonersApiValues = (state: any) => state.names.apiSummoners;

export const fetchSummoner = () => (dispatch: any, getState: any) => {
    const name = getState().names.nameInput;

    dispatch(summonerLoading())
    fetch(`http://localhost:8080/na/summoners/${name}`)
        .then(parseResponse)
        .then((summoner) => dispatch(setSummoner(summoner)))
        .catch((err) => dispatch(summonerErrored(err)))
}

export const fetchSummoners =  (timestamp: number, backwards: boolean) => (dispatch: any, getState: any) => {
    dispatch(summonersLoading())

    fetch(`http://localhost:8080/na/summoners?timestamp=${timestamp}&backwards=${backwards}`)
        .then(parseResponse)
        .then((response) => {
            dispatch(setSummoners(response.summoners))
            dispatch(setPage({ forwards: response.forwards, backwards: response.backwards}))
        })
        .catch((err) => dispatch(summonersErrored(err)))
}

export default namesSlice.reducer;