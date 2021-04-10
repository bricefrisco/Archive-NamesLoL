import { createSlice } from "@reduxjs/toolkit";
import { parseResponse } from "../utils/api";

export const summonerSlice = createSlice({
  name: "summoner",
  initialState: {
    summoner: undefined,
    loading: false,
    error: false,
    errorMessage: undefined,
  },
  reducers: {
    loading: (state) => {
      state.loading = true;
      state.error = false;
      state.errorMessage = undefined;
      state.summoner = undefined;
    },
    loaded: (state, action) => {
      state.loading = false;
      state.error = false;
      state.errorMessage = undefined;
      state.summoner = action.payload;
    },
    errored: (state, action) => {
      state.loading = false;
      state.error = true;
      state.errorMessage = action.payload;
      state.summoner = undefined;
    },
  },
});

export const { loading, loaded, errored } = summonerSlice.actions;

export const getLoading = (state: any) => state.summoner.loading;
export const getError = (state: any) => state.summoner.error;
export const getErrorMessage = (state: any) => state.summoner.errorMessage;
export const getSummoner = (state: any) => state.summoner.summoner;

export const fetchSummoner = () => (dispatch: any, getState: any) => {
  const name = getState().settings.nameInput;
  const region = getState().settings.region;

  dispatch(loading());

  const url = new URL(
    process.env.REACT_APP_BACKEND_URI + "/" + region + "/summoners/" + name
  );
  fetch(url.toString())
    .then(parseResponse)
    .then((summoner) => dispatch(loaded(summoner)))
    .catch((err) => dispatch(errored(err.toString())));
};

export default summonerSlice.reducer;
