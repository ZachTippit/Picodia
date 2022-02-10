import React, { useState, useEffect } from 'react'
import '../styles.css';

import { Grid } from '@mui/material'

const Cell = ({cell, isDarkMode, loseLife}) => {
    const [guessed, setGuessed] = useState(false);
    const [flagged, setFlagged] = useState(false);
    const [right, setRight] = useState()

    const handleGuess = () => {
        setGuessed(true)
    }

    const handleFlagged = () => {
      setFlagged(!flagged);
    }

    useEffect(() => {
        if(guessed){
            cell ? setRight(true) : setRight(false)
        }
    }, [guessed, cell])

    useEffect(() => {
      if(!right){
        loseLife();
      }
    }, [right])

  return (
    <Grid item xs={1} 
      className={'cell '
                + (isDarkMode ? 'light ' : 'dark ') 
                + (flagged ? 'flagged ' : '')
                + (guessed && (right ? 'right' : 'wrong'))
              }
      onClick={() => handleGuess()} 
      onDragEnter={() => handleGuess()} onContextMenu={(e) => { e.preventDefault(); handleFlagged()}}>
    </Grid>
  )
}

export default Cell