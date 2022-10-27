import { configureStore } from '@reduxjs/toolkit'
import { gameConfig, statState, gameState, windowHandler } from './initialState'
import gameConfigReducer from '../_features/gameConfig/gameConfigSlice'
import gameStateReducer from '../_features/gameState/gameStateSlice'
import windowHandlerReducer from '../_features/windowHandler/windowHandlerSlice'

export const initialState = {
    gameConfig,
    gameState,
    windowHandler,
    statState
}

export const store = configureStore({
    reducer: {
        gameConfig: gameConfigReducer,
        gameState: gameStateReducer,
        windowHandler: windowHandlerReducer,
    },
})

export type AppDispatch = typeof store.dispatch;