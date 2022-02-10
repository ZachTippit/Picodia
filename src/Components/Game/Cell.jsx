import React, { useState, useEffect } from 'react'
import '../styles.css';

import { Grid } from '@mui/material'

const Cell = ({cell, isDarkMode, handleCell}) => {
    const [guessed, setGuessed] = useState(false);
    const [flagged, setFlagged] = useState(false);

    const handleGuess = () => {
        setGuessed(true)
    }

    const handleFlagged = () => {
      setFlagged(!flagged);
    }

    useEffect(() => {
        if(guessed){
            cell ? handleCell(true) : handleCell(false)
        }
    }, [guessed, cell])

  return (
    <Grid item xs={1} 
      className={'cell '
                + (isDarkMode ? 'light ' : 'dark ') 
                + (flagged ? 'flagged ' : '')
                + (guessed && (cell ? 'right' : 'wrong'))
              }
      onMouseUp={() => handleGuess()} onDragLeave={() => handleGuess()}
      onDragEnter={() => handleGuess()} onContextMenu={(e) => { e.preventDefault(); handleFlagged()}}
      onTouchStart={() => handleGuess()} onTouchMove={() => handleGuess()}>
    </Grid>
  )
}

export default Cell