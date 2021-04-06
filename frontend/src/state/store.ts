import { configureStore } from "@reduxjs/toolkit";
import namesReducer from './namesSlice'

export default configureStore({
    reducer: {
        names: namesReducer
    }
});