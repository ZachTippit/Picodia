import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'


import Clues from './Game/Clues.jsx'
import Cell from './Game/Cell.jsx'
import './styles.css';
import { createGameObject, maxRowClueLength, maxColClueLength } from '../lib/game.js';

// const answer = [[1,1,0,1,1,0,1,1], [1,0,1,0,0,1,0,1], [1,1,0,1,1,0,1,1], [0,0,0,0,0,0,0,0], 
//                 [0,1,0,0,0,0,1,0], [0,0,1,1,1,1,0,0], [1,0,0,0,0,0,0,1], [1,1,0,1,1,0,1,1]]

const answer = [[1,1,0,0,0,0,1,1], [1,0,1,0,0,1,0,1], [0,1,1,1,1,1,1,0], [0,1,1,1,1,1,1,0], 
[0,1,1,1,1,1,1,0], [1,0,1,1,1,1,0,1], [1,0,0,1,1,0,0,1], [1,1,1,0,0,1,1,1]]
// const answer = [[1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0],
// [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0]];


const Game = ({isStarted, loseLife, puzzle, isDarkMode, pingStartBtn, handleWin}) => {

    const [correctSquares, setCorrectSquares] = useState(0)
    const [winNum, setWinNum] = useState(5000)
    const [gridSize, setGridSize] = useState(10)
    const [gameGrid, setGameGrid] = useState(createGameObject(answer))
    // const [maxClueRowLength, setMaxClueRowLength] = useState(maxRowClueLength(answer))
    // const [maxClueColLength, setMaxClueColLength] = useState(maxColClueLength(answer))
    const [isPuzzleSet, setIsPuzzleSet] = useState(false)

    const handleGuess = (isCorrect) => {
        if(isCorrect){
            setCorrectSquares(correctSquares + 1);
        } else {
            loseLife();
        }
    }

    useEffect(() => {
        if(correctSquares === winNum){
            handleWin(true);
        }
    }, [correctSquares])

    useEffect(() => {
        if(puzzle.length > 2){
            // console.log(JSON.parse(puzzle))
            setGridSize(JSON.parse(puzzle).length + 2)
            setGameGrid(createGameObject(JSON.parse(puzzle)))
            setWinNum(JSON.parse(puzzle).flat().reduce((curr, next) => curr + next))
            // setMaxClueRowLength(maxRowClueLength(JSON.parse(puzzle)))
            // setMaxClueColLength(maxColClueLength(JSON.parse(puzzle)))
            setIsPuzzleSet(true)
        }
    }, [puzzle])

  return (
    <div id='game' onClick={() => pingStartBtn()}>
        <div id='game-board' className={!isStarted ? 'disable-select' : undefined}>
            <Grid container columns={gridSize} className={isStarted ? ' move-on-start' : undefined}>
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
                                        <Cell isDarkMode={isDarkMode} cell={cell} cellNum={index} handleCell={handleGuess} key={`cell@${index}`}/>
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

export default Game;