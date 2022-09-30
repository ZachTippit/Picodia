import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectGameConfig } from '../../features/gameConfig/gameConfigSlice';
import { Grid } from '@mui/material'
import { selectGameState } from '../../features/gameState/gameStateSlice';

const config = {delta: 1}

const Cell = ({cell, cellNum, gridSize, handleCell, nextAnim, order}) => {
  const isDarkMode = useSelector(selectGameConfig).isDarkMode

  const gameConfig = useSelector(state => state.gameConfig)
  const gameState = useSelector(selectGameState)

  const [guessed, setGuessed] = useState(gameConfig.playedToday);
  const [flagged, setFlagged] = useState(false);
  const [winAnimation, setWinAnimation] = useState(false);

  const handleGuess = () => {
    if (gameState.markUp){
      setFlagged(!flagged)
    } else {
      setGuessed(true)
    }
  }

  const handleClick = (e) => {
    e.preventDefault();
    if(e.button===0){
      handleGuess();
    } else if(e.button===1) {
      setFlagged(!flagged);
    }
  }

  useEffect(() => {
      guessed && handleCell(cell ? true : false, cellNum)
  }, [guessed, cell])

  useEffect(() => {
    if(nextAnim === order && gameState.didWin){
      setWinAnimation(true);
    }

  }, [nextAnim])

  useEffect(() => {
    if(gameConfig.playedToday && gameState.isStarted){
      setGuessed(gameConfig.playedToday);
    }
  }, [gameConfig.playedToday])

  return (
    <Grid item xs={1} 
      className={'cell '
                + (isDarkMode ? 'light-' : 'dark-') 
                + (gameConfig.playedToday ? ((cell === 1 ? 'right pulsate-fwd ' : cell === 0 ? ' wrong pulsate-fwd ' : ' flagged pulsate-fwd ')) : 
                  (guessed ? (cell ? 'right pulsate-fwd ' : ' wrong pulsate-fwd ') : ' '))
                + (flagged ? ' flagged ' : ' ')
                + (winAnimation ? ' win-animation': '')
                + ((gameState.isStarted && parseInt(cellNum/gridSize) == 5) ? ' horz-mid-thick ' : ' ' )
                + ((gameState.isStarted && cellNum%gridSize == 5) ? ' vert-mid-thick ' : ' ')
              }
      onMouseUp={(e) => handleClick(e)}
      onContextMenu={(e) => { e.preventDefault(); setFlagged(!flagged)}}
      // {...swipeCheck}
      >
    </Grid>
  )
}

export default Cell