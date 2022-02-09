import React from 'react';
import { Grid } from '@mui/material'
import '../styles.css';

const GameBoard = ({gridSize, gameGrid}) => {
  return (
    <div id='game-board'>
        <Grid container item columns={gridSize} style={{width: '90%', margin: 'auto', marginBottom: '2rem'}}>
            {gameGrid.map(cell => (
                <Grid item xs={1} id={cell} key={cell} align='center' className='cell' onClick={() => {console.log(cell)}} >
                    <p></p>
                </Grid>
            ))}
        </Grid>
    </div>
  )
}

export default GameBoard