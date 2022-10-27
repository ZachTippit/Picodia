import { createSlice } from "@reduxjs/toolkit";
import { windowHandler } from "../../_app/initialState";

export const windowHandlerSlice = createSlice({
    name: 'windowHandler',
    initialState: windowHandler,
    reducers: {
        toggleClosing: (windowHandler, action) => {
            windowHandler.closing = action.payload
        },
        toggleOpen: (windowHandler) => {
            windowHandler.isOpen = !windowHandler.isOpen
        },
        togglePing: (windowHandler) => {
            windowHandler.ping = !windowHandler.ping
        },
        togglePingHowTo: (windowHandler) => {
            windowHandler.pingHowTo = !windowHandler.pingHowTo
        },
        toggleStartPing: (windowHandler) => {
            windowHandler.startPing = !windowHandler.startPing
        },
        toggleAlert: (windowHandler) => {
            windowHandler.alert = !windowHandler.alert
        },
        toggleGameOverAlert: (windowHandler) => {
            windowHandler.goAlert = !windowHandler.goAlert
        },
        setPath: (windowHandler, action) => {
            windowHandler.path = action.payload
        }
    }
})

export const { toggleClosing, toggleOpen, togglePing, togglePingHowTo, toggleStartPing, toggleAlert, toggleGameOverAlert, setPath } = windowHandlerSlice.actions;

export default windowHandlerSlice.reducer;