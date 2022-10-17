import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import useLongPress from '../../lib/useLongPress'

const Cell = ({cell, cellNum, gridSize, handleCell, nextAnim, order}) => {

  const {isDarkMode, isRBBlind, playedToday} = useSelector(state => state.gameConfig)
  const { isStarted, didWin, markUp } = useSelector(state => state.gameState)

  const [guessed, setGuessed] = useState(playedToday);
  const [flagged, setFlagged] = useState(false);
  const [winAnimation, setWinAnimation] = useState(false);

  const onLongPress = () => {
    setFlagged(!flagged)
  }

const onClick = () => {
    setGuessed(true)
}

const defaultOptions = {
  shouldPreventDefault: true,
  delay: 500,
};
const longPressEvent = useLongPress(onLongPress, onClick, defaultOptions);

  const handleGuess = () => {
    if (markUp){
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
    if(nextAnim === order && didWin){
      setWinAnimation(true);
    }

  }, [nextAnim])

  useEffect(() => {
    if(playedToday && isStarted){
      setGuessed(playedToday);
    }
  }, [playedToday])

  return (
    <Grid item xs={1} 
      className={'cell '
                + (isDarkMode ? 'light-' : 'dark-') 
                + (playedToday ? ((cell === 1 ? 'right pulsate-fwd ' : cell === 0 ? (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ') : ' flagged pulsate-fwd ')) : 
                  (guessed ? (cell ? 'right pulsate-fwd ' : (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ')) : ' '))
                + (flagged ? (isDarkMode ? ' flagged-dark ' : 'flagged ') : ' ')
                + (winAnimation ? ' win-animation': '')
                + ((isStarted && parseInt(cellNum/gridSize) === 5) ? ' horz-mid-thick ' : ' ' )
                + ((isStarted && cellNum%gridSize === 5) ? ' vert-mid-thick ' : ' ')
                + ((isRBBlind && cell === 0 && guessed) ? ' color-blind-wrong ': ' ')
              }
      {...longPressEvent}
      onMouseUp={(e) => handleClick(e)}
      onContextMenu={(e) => { e.preventDefault(); setFlagged(!flagged)}}

      // {...swipeCheck}
      >
    </Grid>
  )
}

export default Cell