import React, { useState } from 'react'
import { Grid, Typography } from '@mui/material'
import '../styles.css'


const RowClues = ({cell, index}) => {
  return (
    <Grid item xs={2} className={'disable-select'} key={`row-clue@${index}`}>
        <Grid container direction='row' columnSpacing={1} justifyContent='flex-end' alignItems='center' wrap="nowrap" sx={{pr: 2}} style={{height: '100%', marginRight: '0.5rem'}}>
            {cell.map((clue, index3) => (
                <Grid item key={`row-clue-item@${index3}`} className='clue-row'>
                    <Typography className='row-clues-txt disable-select'>{clue}</Typography>
                </Grid>
            ))}
        </Grid>
    </Grid>
  )
}

export default RowClues;