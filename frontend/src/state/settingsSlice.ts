import {createSlice} from "@reduxjs/toolkit";
import {close} from './summonerSlice'
import {parseResponse} from "../utils/api";

export enum Region {
    NA = "na",
    BR = "br",
    EUNE = "eune",
    EUW = "euw",
    KR = "kr",
    LAN = "lan",
    LAS = "las",
    TR = "tr",
}

export const settingsSlice = createSlice({
    name: "settings",
    initialState: {
        nameInput: "",
        region: Region.NA.toUpperCase(),
        nameLength: undefined,
        limit: false,
        hideSearch: false,
        beta: {
            key: undefined,
            loading: false,
            loaded: false,
            error: false,
            errorMessage: undefined
        }
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
        setLimit: (state, action) => {
            state.limit = action.payload;
        },
        setHideSearch: (state, action) => {
            state.hideSearch = action.payload;
        },
        errored: (state: any, action) => {
            state.beta.loading = false;
            state.beta.loaded = false;
            state.beta.error = true;
            state.beta.errorMessage = action.payload;
            state.beta.key = undefined;
        },
        loading: (state: any) => {
          state.beta.loading = true;
          state.beta.loaded = false;
          state.beta.error = false;
          state.beta.errorMessage = undefined;
          state.beta.key = undefined;
        },
        loaded: (state: any, action) => {
            state.beta.loading = false;
            state.beta.loaded = true;
            state.beta.error = false;
            state.beta.errorMessage = undefined;
            state.beta.key = action.payload;
        }
    },
});

export const {
    setName,
    setNameLength,
    setRegion,
    setLimit,
    setHideSearch,
    errored, loading, loaded
} = settingsSlice.actions;

export const getNameInput = (state: any) => state.settings.nameInput;
export const getRegion = (state: any) => state.settings.region;
export const getNameLength = (state: any) => state.settings.nameLength;
export const getLimit = (state: any) => state.settings.limit;
export const getHideSearch = (state: any) => state.settings.hideSearch;
export const getBetaKey = (state: any) => state.settings.beta.key;
export const getLoading = (state: any) => state.settings.beta.loading;
export const getLoaded = (state: any) => state.settings.beta.loaded;
export const getError = (state: any) => state.settings.beta.error;
export const getErrorMessage = (state: any) => state.settings.beta.errorMessage;

export const toggleLimit = () => (dispatch: any) => {
    dispatch(setLimit(true))
    setTimeout(() => {
        dispatch(setLimit(false))
    }, 1300)
}

export const changeRegion = (region: any) => (dispatch: any) => {
    dispatch(setRegion(region))
    dispatch(close())
}

export const authenticateBeta = (key: string) => (dispatch: any) => {
    dispatch(loading())

    fetch(`${process.env.REACT_APP_BACKEND_URI}/beta-auth`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({key})
    })
        .then(parseResponse)
        .then((res) => dispatch(loaded(key)))
        .catch((err) => dispatch(errored(err.toString())));
}

export default settingsSlice.reducer;
