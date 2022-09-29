import { createSlice } from '@reduxjs/toolkit'
import { statState } from '../../app/initialState'

export const statSlice = createSlice({
    name: 'stats',
    initialState: statState,
    reducers: {
        
    }
})

export const {  } = statSlice.actions;

export const selectStats = (state) => state.gameState;

export default statSlice.reducer;