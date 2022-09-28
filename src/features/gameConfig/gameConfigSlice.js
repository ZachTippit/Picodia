import { createSlice } from '@reduxjs/toolkit'
import {gameConfig} from '../../app/initialState'

// export const fetchGameConfig = createAsyncThunk(
//     'gameConfig/fetchGameConfig',
//     async (gameConfig) => {
//         const response =  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!A${5}:B${5}?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
//         console.log(response)
//     }
// )
export const gameConfigSlice = createSlice({
    name: 'gameConfig',
    initialState: gameConfig,
    reducers: {
        togglesDarkMode: (gameConfig) => {
            gameConfig.isDarkMode = !gameConfig.isDarkMode;
        },
        setLastPlayed: (gameConfig) => {
            gameConfig.lastPlayed = !gameConfig.lastPlayed
        }   
    }
})

export const { togglesDarkMode, togglePlayedToday } = gameConfigSlice.actions;

export const selectGameConfig = (state) => state.gameConfig;

export default gameConfigSlice.reducer;