import { responsiveFontSizes } from '@mui/material'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {gameConfig} from '../../app/initialState'

// export const fetchGameConfig = createAsyncThunk(
//     'gameConfig/fetchGameConfig',
//     async (gameConfig) => {
//         const response =  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!A${5}:B${5}?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
//         console.log(response)
//     }
// )

export const fetchPuzzleRef = createAsyncThunk('gameConfig/fetchPuzzleRef', async () => {
    const puzzleRef = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!A2?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
    return puzzleRef.values[0][0]
})

export const fetchPuzzle = createAsyncThunk('gameConfig/fetchPuzzle', async (puzzleReference) => {
    const puzzle = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!A${puzzleReference}:B${puzzleReference}?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
    return [puzzle.values[0][0],puzzle.values[0][1]]
})


//  This will be the puzzle fetcher for the project -- will revisit once backend is set up
export const fetchDailyPuzzle = createAsyncThunk('gameConfig/fetchDailyPuzzle', async () => {
    const puzzle = await fetch(`https://us-central1-picodia-prod.cloudfunctions.net/getPuzzle`).then(response => response.json())
    // console.log(puzzle)
    // return [puzzle.values[0][0],puzzle.values[0][1]]
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
            .addCase(fetchPuzzleRef.pending, (gameConfig, action) => {
                gameConfig.status = 'loading'
            })
            .addCase(fetchPuzzleRef.fulfilled, (gameConfig, action) => {
                gameConfig.status = 'succeeded'
                gameConfig.puzzleReference = action.payload

            })
            .addCase(fetchPuzzleRef.rejected, (gameConfig, action) => {
                gameConfig.status = 'failed'
                gameConfig.error = action.error.message
            })
            .addCase(fetchPuzzle.pending, (gameConfig, action) => {
                gameConfig.status = 'loading'
            })
            .addCase(fetchPuzzle.fulfilled, (gameConfig, action) => {
                gameConfig.status = 'succeeded'
                gameConfig.whatIsIt = action.payload[0]
                gameConfig.dailyPuzzle = action.payload[1]
            })
            .addCase(fetchPuzzle.rejected, (gameConfig, action) => {
                gameConfig.status = 'failed'
                gameConfig.error = action.error.message
            })
            .addCase(fetchDailyPuzzle.pending, (gameConfig, action) => {
                gameConfig.status = 'loading'
            })
            .addCase(fetchDailyPuzzle.fulfilled, (gameConfig, action) => {
                gameConfig.status = 'succeeded'
                // gameConfig.whatIsIt1 = action.payload[0]
                // gameConfig.dailyPuzzle1 = action.payload[1]
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