import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import '../styles.css';

import Cell from './Cell.jsx'

const GameBoard = ({gridSize, gameGrid, isDarkMode}) => {

  return (
    <div id='game-board'>
        <Grid container item columns={gridSize} style={{width: '90%', margin: 'auto', marginBottom: '2rem'}}>
            {gameGrid.map((cell, index) => (
                <Grid item xs={1} key={index} align='center'>
                    <Cell isDarkMode={isDarkMode} cell={cell} cellNum={index}/>
                </Grid>
            ))}
        </Grid>
    </div>
  )
}

export default GameBoard