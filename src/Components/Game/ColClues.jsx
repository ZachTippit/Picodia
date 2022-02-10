import React, { useState } from 'react'
import { Grid } from '@mui/material'
import '../styles.css'


const ColClues = ({cell, index}) => {
  return ( 
    <Grid item xs={1} className={'disable-select'} key={`col-clue@${index}`}>
        <Grid container direction='column' justifyContent='flex-end' style={{height: '100%'}}>
            {cell.map((clue, index2) => (
                <Grid item id={index2} key={`col-clue-item@${index2}`} className='clue-col'>
                    <p className='col-clues-txt'>{clue}</p>
                </Grid>))}
        </Grid>
    </Grid>  
  )
}

export default ColClues;
