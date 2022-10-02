import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { gameConfig } from '../../app/initialState'
import { createGameObject } from '../../lib/game'

//  This will be the puzzle fetcher for the project -- will revisit once backend is set up
export const fetchDailyPuzzle = createAsyncThunk('gameConfig/fetchDailyPuzzle', async () => {
    const puzzleResponse = await fetch(`https://us-central1-picodia-prod.cloudfunctions.net/getPuzzle`).then(response => response.json())
    const puzzle = JSON.parse(puzzleResponse.puzzle)
    const puzzleName = puzzleResponse.name
    let parsedPuzzle = [];
    const arrSquare = Math.sqrt(puzzle.length);
    let subArray = [];
    puzzle.map((cell, index) => {
        if ((index % arrSquare) === 0 && index !== 0) {
            parsedPuzzle.push(subArray);
            subArray = [];
        }
        subArray.push(cell)
    });
    parsedPuzzle.push(subArray)
    const puzzleBoard = createGameObject(parsedPuzzle)
    const winNum = puzzle.reduce((curr, next) => curr + next)
    return [puzzleName, puzzleBoard, winNum];
})

export const gameConfigSlice = createSlice({
    name: 'gameConfig',
    initialState: gameConfig,
    reducers: {
        togglesDarkMode: (gameConfig) => {
            gameConfig.isDarkMode = !gameConfig.isDarkMode;
        },
        setLastPlayed: (gameConfig) => {
            gameConfig.lastPlayed = !gameConfig.lastPlayed
        },
        hasPlayedToday: (gameConfig, action) => {
            gameConfig.playedToday = action.payload
        },
        setPuzzleRef: (state, action) => {
            state.gameConfig.puzzleReference = action.payload
        },
        puzzleIs: (gameConfig, action) => {
            gameConfig.whatIsIt = action.payload
        }   
    },
    extraReducers(builder) {
        builder
            .addCase(fetchDailyPuzzle.pending, (gameConfig, action) => {
                gameConfig.status = 'loading'
            })
            .addCase(fetchDailyPuzzle.fulfilled, (gameConfig, action) => {
                gameConfig.status = 'succeeded'
                gameConfig.whatIsIt = action.payload[0]
                gameConfig.dailyPuzzle = action.payload[1]
                gameConfig.winNum = action.payload[2]
            })
            .addCase(fetchDailyPuzzle.rejected, (gameConfig, action) => {
                gameConfig.status = 'failed'
                gameConfig.error = action.error.message
            })
    }
})

export const { togglesDarkMode, hasPlayedToday, setPuzzleRef, puzzleIs } = gameConfigSlice.actions;

export const selectGameConfig = (state) => state.gameConfig;

export default gameConfigSlice.reducer;