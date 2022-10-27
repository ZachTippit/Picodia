import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'
import useLongPress from '../../lib/useLongPress'

type CellProps = {
  cell: number,
  cellNum: number,
  gridSize: number,
  handleCell: any,
  nextAnim: number,
  order: number
}

const Cell: React.FunctionComponent<CellProps> = ({cell, cellNum, gridSize, handleCell, nextAnim, order}) => {

  const {isDarkMode, isRBBlind, playedToday} = useSelector((state: any) => state.gameConfig)
  const { isStarted, didWin, markUp } = useSelector((state: any) => state.gameState)

  const [guessed, setGuessed] = useState<boolean | any>(playedToday);
  const [flagged, setFlagged] = useState<boolean | any>(false);
  const [winAnimation, setWinAnimation] = useState<boolean>(false);

  const onLongPress = () => {
    setFlagged(!flagged)
  }

const onCellSelect = () => {
    setGuessed(true)
}

const defaultOptions = {
  shouldPreventDefault: true,
  delay: 500,
};
const longPressEvent = useLongPress(onLongPress, onCellSelect, defaultOptions);

  const handleGuess = () => {
    
    if(markUp){
      console.log(markUp)
      setFlagged(!flagged)
    } else {
      console.log('MarkUp: ', markUp)
      setGuessed(true)
    }
  }

  const handleClick = (e: any) => {
    e.preventDefault();
    console.log(e.button)
    if(e.button===0){
      handleGuess();
    } else if(e.button===1) {
      console.log('flagging')
      setFlagged(!flagged);
    }
  }

  useEffect(() => {
    if(guessed){
      handleCell(cell ? true : false, cellNum)
    }
  }, [guessed, cell])

  useEffect (() => {
    console.log(flagged, guessed)
  }, [flagged])

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
                + (flagged ? (isDarkMode ? ' flagged-dark ' : ' flagged ') : ' ')
                + (winAnimation ? ' win-animation': '')
                + ((isStarted && Math.floor(cellNum/gridSize) === 5) ? ' horz-mid-thick ' : ' ' )
                + ((isStarted && cellNum%gridSize === 5) ? ' vert-mid-thick ' : ' ')
                + ((isRBBlind && cell === 0 && guessed) ? ' color-blind-wrong ': ' ')
              }
      // {...longPressEvent}
      onPointerUp={(e: { preventDefault: () => void }) => handleClick(e)}
      onContextMenu={(e: { preventDefault: () => void }) => { e.preventDefault(); setFlagged(!flagged)}}

      // {...swipeCheck}
      >
    </Grid>
  )
}

export default Cell