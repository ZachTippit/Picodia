import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { windowHandler } from "../../app/initialState";

export const windowHandlerSlice = createSlice({
    name: 'windowHandler',
    initialState: windowHandler,
    reducers: {
        toggleClosing: (windowHandler, action) => {
            windowHandler.closing = action.payload
        },
        setPath: (windowHandler, action) => {
            windowHandler.path = action.payload
        }
    }
})

export const { toggleClosing, setPath } = windowHandlerSlice.actions;

export const selectClosing = (state) => state.windowHandler.closing;

export default windowHandlerSlice.reducer;