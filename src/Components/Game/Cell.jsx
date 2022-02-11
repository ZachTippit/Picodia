import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import '../styles.css';

import { Grid } from '@mui/material'

const Cell = ({cell, isDarkMode, handleCell}) => {
    const [guessed, setGuessed] = useState(false);
    const [flagged, setFlagged] = useState(false);

    const swipeCheck = useSwipeable({
      onSwiping: (eventData => {handleGuess(); console.log(eventData);})
    })
 
    const handleGuess = () => {
        setGuessed(true)
    }

    const handleFlagged = () => {
      setFlagged(!flagged);
    }

    const handleClick = (e) => {
      e.preventDefault();
      if(e.button===0){
        handleGuess();
      } else if(e.button===1) {
        handleFlagged();
      }
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
                + (guessed && (cell ? 'right pulsate-fwd' : 'wrong pulsate-fwd'))
              }
      onMouseUp={(e) => handleClick(e)} onDragEnter={(e) => handleClick(e)}
      onDragLeave={(e) => handleClick(e)}
      onContextMenu={(e) => { e.preventDefault(); handleFlagged()}}
      onTouchStart={() => handleGuess()} onTouchMove={() => handleGuess()}
      {...swipeCheck}
      >
    </Grid>
  )
}

export default Cell