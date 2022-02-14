import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import '../styles.css';

import { Grid } from '@mui/material'

const config = {delta: 1}

const Cell = ({cell, cellNum, isDarkMode, handleCell, didWin, nextAnim, order}) => {
    const [guessed, setGuessed] = useState(false);
    const [flagged, setFlagged] = useState(false);
    const [winAnimation, setWinAnimation] = useState(false);

    const swipeCheck = useSwipeable({
      onSwiping: (eventData => {handleGuess(); console.log(eventData);}),
      config
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
            cell ? handleCell(true, cellNum) : handleCell(false, cellNum)
        }
    }, [guessed, cell])

    useEffect(() => {
      if(nextAnim === order && didWin){
        setWinAnimation(true);
      }

    }, [nextAnim])

  return (
    <Grid item xs={1} 
      className={'cell '
                + (isDarkMode ? 'light-' : 'dark-') 
                + (guessed && (cell ? 'right pulsate-fwd ' : ' wrong pulsate-fwd '))
                + (flagged ? 'flagged ' : '')
                + (winAnimation ? ' win-animation': '')
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