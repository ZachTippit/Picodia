import { configureStore } from '@reduxjs/toolkit'
import { gameConfig, statsState, gameState, windowHandler } from './initialState'
import gameConfigReducer from '../features/gameConfig/gameConfigSlice'
import gameStateReducer from '../features/gameState/gameStateSlice'
import windowHandlerReducer from '../features/windowHandler/windowHandlerSlice'

export const initialState = {
    gameConfig,
    gameState,
    windowHandler,
    statsState
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
    },
    initialState
})