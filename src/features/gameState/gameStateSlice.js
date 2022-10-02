import { createSlice } from '@reduxjs/toolkit'
import { gameState } from '../../app/initialState'

export const gameStateSlice = createSlice({
    name: 'gameState',
    initialState: gameState,
    reducers: {
        _startGame: (gameState) => {
            gameState.isStarted = true
        },
        loseLife: (gameState) => {
            gameState.lives -= 1
        },
        setDidWin: (gameState, action) => {
            gameState.didWin = action.payload
        },
        toggleHardMode: (gameState, action) => {
            gameState.hardMode = !gameState.hardMode

            if(gameState.hardMode){
                gameState.lives = 1
                gameState.maxLives = 1
            } else if (!gameState.hardMode && !action.payload){
                gameState.lives = 3
                gameState.maxLives = 3
            } else if (!gameState.hardMode && action.payload){
                return
            }
        },
        toggleMarkup: (gameState) => {
            gameState.markUp = !gameState.markUp
        },
        changeGameState: (gameState, action) => {
            gameState.stateOfGame = action.payload
        },
        togglePreGameAnimation: (gameState) => {
            gameState.preGameAnimation = !gameState.preGameAnimation
        }
    }
})

export const { _startGame, loseLife, setDidWin, toggleHardMode, toggleMarkup, togglePreGameAnimation, changeGameState } = gameStateSlice.actions;

export const selectGameState = (state) => state.gameState;

export default gameStateSlice.reducer;