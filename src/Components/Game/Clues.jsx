import React from 'react'
import { Grid } from '@mui/material'
import '../styles.css'


const Clues = ({cell, index, rowOrCol, isStarted}) => {
  return ( 
    <Grid item xs={(rowOrCol==='column' ? 1 : 2)} className={`disable-select clue-${rowOrCol}-container`} key={`${rowOrCol}-clue@${index}`} draggable='false'>
        <Grid container direction={rowOrCol} justifyContent='flex-end' alignItems='center' style={{height: '100%'}} columnSpacing={1} draggable='false'>
            {cell.map((clue, index2) => (
                <Grid item key={`${rowOrCol}-clue-item@${index2}`} className={`clue-${rowOrCol}`} draggable='false'>
                    <p className={(isStarted ? `fade-in-${rowOrCol} shown` : 'hidden')} draggable='false'>{clue}</p>
                </Grid>))}
        </Grid>
    </Grid>  
  )
}

export default Clues;
