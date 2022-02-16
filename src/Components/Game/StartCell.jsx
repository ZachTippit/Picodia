import React, { useState, useEffect } from 'react'
import { useSwipeable } from 'react-swipeable'
import '../styles.css';

import { Grid } from '@mui/material'

const config = {delta: 1}

const StartCell = ({cell, cellNum, gridSize, isDarkMode, isStarted, handleCell, didWin, nextAnim, order, playedToday}) => {
    const [guessed, setGuessed] = useState(playedToday);
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
            cell ? handleCell(true) : handleCell(false)
        }
    }, [guessed, cell])

    useEffect(() => {
      if(nextAnim === order && didWin){
        setWinAnimation(true);
      }

    }, [nextAnim])

    useEffect(() => {
      if(playedToday){
        setGuessed(playedToday);
      }
    }, [playedToday])

  return (
    <Grid item xs={1} 
      className={'cell '
                + (isDarkMode ? 'light-' : 'dark-') 
                + (playedToday ? ((cell === 1 ? 'right pulsate-fwd ' : cell === 0 ? ' wrong pulsate-fwd ' : ' flagged pulsate-fwd ')) : 
                  (guessed ? (cell ? 'right pulsate-fwd ' : ' wrong pulsate-fwd ') : ' '))
                + (flagged ? ' flagged ' : ' ')
                + (winAnimation ? ' win-animation': '')
                + ((isStarted && parseInt(cellNum/gridSize) == 5) ? ' horz-mid-thick ' : ' ' )
                + ((isStarted && cellNum%gridSize == 5) ? ' vert-mid-thick ' : ' ')
              }
      onMouseUp={(e) => handleClick(e)} onDragEnter={(e) => handleClick(e)}
      onDragLeave={(e) => handleClick(e)}
      onContextMenu={(e) => { e.preventDefault(); handleFlagged()}}
      onTouchStart={() => handleGuess()} onTouchMove={() => handleGuess()}
      // {...swipeCheck}
      >
    </Grid>
  )
}

export default StartCell