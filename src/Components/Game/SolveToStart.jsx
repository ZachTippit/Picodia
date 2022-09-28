import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import Clues from './Clues'
import StartCell from './StartCell.jsx'
import { createGameObject } from '../../lib/game.js';
import { useSelector } from 'react-redux'
import { selectGameConfig } from '../../features/gameConfig/gameConfigSlice';


const answer = [[1,1,1],[1,0,0],[1,0,1]]
const blank = [[2,2,2],[2,2,2],[2,2,2]];

const SolveToStart = ({isStarted, preGameAnim, handleWin, wrongSolveToStart, playedToday}) => {
    const isDarkMode = useSelector(selectGameConfig).isDarkMode

    const [correctSquares, setCorrectSquares] = useState(0)
    const [winNum, setWinNum] = useState(6)
    const [gridSize, setGridSize] = useState(5)
    const [gameGrid, setGameGrid] = useState(createGameObject(answer))
    const [nextAnim, setNextAnim] = useState(0);
    const [answerArray, setAnswerArray] = useState(blank)

    const handleGuess = (isCorrect) => {
        if(isCorrect){
            setCorrectSquares(correctSquares + 1);
        } else {
            wrongSolveToStart();
        }
    }

    useEffect(() => {
        if(correctSquares === winNum){
            handleWin(true);
        }
    }, [correctSquares])

    useEffect(() => {
        // console.log(gameGrid)

    }, [gameGrid])



  return (
    <div id='startPuzz' className={'move-on-start-footer mt ' + (preGameAnim ? ' fade-out-right ' : ' ')}>
        <div id='game-board'>
            <Grid container columns={gridSize} width='75%'>
                {gameGrid.map((cell, index) => (
                    <>
                        { index === 0 || index === 1 ?
                            // Blank top-left corner
                            <Grid item xs={1} key={`blank@${index}`} />
                            :
                            // Column Clues (if index is in the first row)
                            <>
                                { (parseInt(index/gridSize)===0)  ? 
                                <Clues cell={cell} index={index} rowOrCol={'column'} key={`clues-col-${index}`} isStarted={isStarted}/>
                                : 
                            // Row Clues (in index is on far left side after the first row)  
                                <>
                                    { index%gridSize === 0 ? 
                                    <Clues cell={cell} index={index} rowOrCol={'row'} key={`clues-row-${index}`} isStarted={isStarted} />
                                    :
                            // Space creator for above.
                                    <>
                                    {index%gridSize === 1  ? 
                                        <div key={`empty${index}`}>
                                        </div>   
                                    :   
                            // Aaaand the cells
                                        <StartCell 
                                            isDarkMode={isDarkMode} 
                                            cell={cell} 
                                            cellNum={index} 
                                            isStarted={isStarted} 
                                            gridSize={gridSize} 
                                            handleCell={handleGuess} 
                                            key={`cell@${index}`} 
                                            order={index}
                                            wrongSolveToStart={wrongSolveToStart}
                                        />
                                    }
                                    </>     
                                    }
                                </>   
                                }       
                            </>
                        } 
                </>
                ))}
            </Grid>
        </div>
    </div>
  )
}

export default SolveToStart;