import React, { useState } from 'react'
import { Grid } from '@mui/material'


const RowClues = ({gridSize, rowClues}) => {
  return (
    <div style={{marginTop: '5vh'}}>
        <Grid container direction='column' columns={gridSize} style={{width: '90%', margin: 'auto'}}>
            {rowClues.map((rowClue, index) => (
                <Grid item xs={1} id={index} key={index} className='clue-row'>
                    <Grid container columns={5} spacing={3} direction='row' justifyContent='flex-end'>
                        {rowClue.map((clue, index) => (
                            <Grid item xs={1} key={index}>
                                <p style={{margin: '0.5rem', textAlign: 'left', fontSize: '.75rem'}}>{clue}</p>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            ))}
        </Grid>
    </div>
  )
}

export default RowClues;