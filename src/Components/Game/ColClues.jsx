import React, { useState } from 'react'
import { Grid } from '@mui/material'


const ColClues = ({gridSize, colClues}) => {
  return (
    <div>
        <Grid container direction='row' columns={gridSize} style={{width: '90%', margin: 'auto'}}>
            {colClues.map((colClue, index) => (
                <Grid item xs={1} id={index} key={index} className='clue-col'>
                    {colClue.map((clue, index) => (
                        <p className='col-clues-txt' key={index}>{clue}</p>
                    ))}
                </Grid>
            ))}
        </Grid>
    </div>
  )
}

export default ColClues;
