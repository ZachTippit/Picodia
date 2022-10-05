import { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'

const StartCell = ({cell, cellNum, gridSize, handleCell, didWin, nextAnim, order}) => {
    
    const isDarkMode = useSelector(state => state.gameConfig.isDarkMode)

    const gameState = useSelector(state => state.gameState)

    const [guessed, setGuessed] = useState(false);
    const [flagged, setFlagged] = useState(false);
    const [winAnimation, setWinAnimation] = useState(false);

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

    return (
        <Grid item xs={1} 
        className={'cell '
                    +   (isDarkMode ? 'light-' : 'dark-') 
                    +   (guessed ? (cell ? 'right pulsate-fwd ' : ' wrong pulsate-fwd ') : ' ')
                    +   (flagged ? (isDarkMode ? ' flagged-dark ' : 'flagged ') : ' ')
                    +   (winAnimation ? ' win-animation': '')
                    +   ((gameState.isStarted && parseInt(cellNum/gridSize) == 5) ? ' horz-mid-thick ' : ' ' )
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