import { configureStore } from '@reduxjs/toolkit'
import { gameConfig, statState, gameState, windowHandler } from './initialState'
import gameConfigReducer from '../features/gameConfig/gameConfigSlice'
import gameStateReducer from '../features/gameState/gameStateSlice'
import windowHandlerReducer from '../features/windowHandler/windowHandlerSlice'
import statReducer from '../features/stats/statSlice'

export const initialState = {
    gameConfig,
    gameState,
    windowHandler,
    statState
}

const setDarkMode = (isDarkMode) => {
    return {
        type: 'config/setDarkMode',
        payload: isDarkMode
    }
}

export const store = configureStore({
    reducer: {
        gameConfig: gameConfigReducer,
        gameState: gameStateReducer,
        windowHandler: windowHandlerReducer,
        stats: statReducer,
    },
    initialState
})