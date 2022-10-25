import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'

type StartCellProps = {
    cell: number,
    cellNum: number,
    gridSize: number,
    handleCell: any,
    nextAnim: number,
    order: number,
    didWin: boolean
  }
  

const StartCell: React.FunctionComponent<StartCellProps> = ({cell, cellNum, gridSize, handleCell, didWin, nextAnim, order}) => {
    
    const {isDarkMode, isRBBlind} = useSelector((state: any) => state.gameConfig)

    const gameState = useSelector((state: any) => state.gameState)

    const [guessed, setGuessed] = useState<boolean>(false);
    const [flagged, setFlagged] = useState<boolean>(false);
    const [winAnimation, setWinAnimation] = useState<boolean>(false);

    const handleGuess = () => {
        setGuessed(true)
    }

    const handleFlagged = () => {
        setFlagged(!flagged);
    }

    const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
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

    return (
        <Grid item xs={1} 
        className={'cell '
                    +   (isDarkMode ? 'light-' : 'dark-') 
                    +   (guessed ? (cell ? 'right pulsate-fwd ' : (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ')) : ' ')
                    +   (flagged ? (isDarkMode ? ' flagged-dark ' : 'flagged ') : ' ')
                    +   (winAnimation ? ' win-animation': '')
                    +   ((gameState.isStarted && cellNum/gridSize == 5) ? ' horz-mid-thick ' : ' ' )
                    +   ((gameState.isStarted && cellNum%gridSize == 5) ? ' vert-mid-thick ' : ' ')
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