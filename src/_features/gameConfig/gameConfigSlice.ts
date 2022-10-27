import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { gameConfig } from '../../_app/initialState'
import { createGameObject } from '../../lib/game'

interface GameConfig {
    dailyPuzzle: any[];
    puzzleReference: string;
    whatIsIt: string;
    lastPlayed: number;
    isDarkMode: boolean;
    playedToday: boolean;
    whatIsIt1: string;
    dailyPuzzle1: any[];
    gridSize: number;
    winNum: number;
    today: string;
    isRBBlind: boolean;
    status: any;
    error: any | undefined;
}

//  This will be the puzzle fetcher for the project -- will revisit once backend is set up
export const fetchDailyPuzzle = createAsyncThunk('gameConfig/fetchDailyPuzzle', async () => {
    const puzzleResponse = await fetch(`https://us-central1-picodia-prod.cloudfunctions.net/getPuzzle`).then(response => response.json())
    const puzzle = JSON.parse(puzzleResponse.puzzle)
    const puzzleName = puzzleResponse.name
    let parsedPuzzle = [];
    const arrSquare = Math.sqrt(puzzle.length);
    let subArray: number[] = [];
    puzzle.map((cell: number, index: number) => {
        if ((index % arrSquare) === 0 && index !== 0) {
            parsedPuzzle.push(subArray);
            subArray = [];
        }
        return subArray.push(cell)
    });
    parsedPuzzle.push(subArray)
    const puzzleBoard = createGameObject(parsedPuzzle)
    const winNum = puzzle.reduce((curr: number, next: number) => curr + next)
    return [puzzleName, puzzleBoard, winNum];
})

export const gameConfigSlice = createSlice({
    name: 'gameConfig',
    initialState: gameConfig,
    reducers: {
        togglesDarkMode: (gameConfig: GameConfig) => {
            gameConfig.isDarkMode = !gameConfig.isDarkMode;
        },
        togglesRBColorBlindMode: (gameConfig: GameConfig) => {
            gameConfig.isRBBlind = !gameConfig.isRBBlind;
        },
        // setLastPlayed: (gameConfig: GameConfig) => {
        //     gameConfig.: GameConfig = !gameConfig.lastPlayed
        // },
        hasPlayedToday: (gameConfig: GameConfig, action) => {
            gameConfig.playedToday = action.payload
        },
        setPuzzleRef: (gameConfig: GameConfig, action) => {
            gameConfig.puzzleReference = action.payload
        },
        puzzleIs: (gameConfig: GameConfig, action) => {
            gameConfig.whatIsIt = action.payload
        },
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
            .addCase(fetchDailyPuzzle.rejected, (gameConfig: GameConfig, action) => {
                gameConfig.status = 'failed'
                gameConfig.error = action.error.message
            })
    }
})

export const { togglesDarkMode, togglesRBColorBlindMode, hasPlayedToday, setPuzzleRef, puzzleIs } = gameConfigSlice.actions;

export default gameConfigSlice.reducer;