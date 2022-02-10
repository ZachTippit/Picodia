import React, { useState } from 'react'
import { Grid } from '@mui/material'
import '../styles.css'


const Clues = ({cell, index, rowOrCol, isStarted}) => {
  return ( 
    <Grid item xs={(rowOrCol==='column' ? 1 : 2)} className={`disable-select clue-${rowOrCol}-container`} key={`${rowOrCol}-clue@${index}`}>
        <Grid container direction={rowOrCol} justifyContent='flex-end' alignItems='center' style={{height: '100%'}} columnSpacing={1}>
            {cell.map((clue, index2) => (
                <Grid item key={`${rowOrCol}-clue-item@${index2}`} className={`clue-${rowOrCol}`}>
                    <p hidden={(!isStarted)}>{clue}</p>
                </Grid>))}
        </Grid>
    </Grid>  
  )
}

export default Clues;
