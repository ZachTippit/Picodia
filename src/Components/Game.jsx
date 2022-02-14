import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'


import Clues from './Game/Clues.jsx'
import Cell from './Game/Cell.jsx'
import './styles.css';
import { createGameObject } from '../lib/game.js';


const answer = [[1,0,0,0,0,0,0,1], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,1]];
// const answer = [[1,1,0,0,0,0,1,1], [1,0,1,0,0,1,0,1], [0,1,1,1,1,1,1,0], [0,1,1,1,1,1,1,0], 
// [0,1,1,1,1,1,1,0], [1,0,1,1,1,1,0,1], [1,0,0,1,1,0,0,1], [1,1,1,0,0,1,1,1]]

const blank = [[2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2]]

const Game = ({isStarted, loseLife, puzzle, gameOver, isDarkMode, pingStartBtn, handleWin, didWin, handlePrevGameArray, prevGameArray, playedToday}) => {

    const [correctSquares, setCorrectSquares] = useState(0)
    const [winNum, setWinNum] = useState(4)
    const [gridSize, setGridSize] = useState(10)
    const [gameGrid, setGameGrid] = useState(createGameObject(answer))
    const [isPuzzleSet, setIsPuzzleSet] = useState(false)
    const [nextAnim, setNextAnim] = useState(0);
    const [answerArray, setAnswerArray] = useState(blank)

    useEffect(() => {
        if((didWin) && (nextAnim < gameGrid.length)){
            setTimeout(() => {
                setNextAnim(nextAnim + 1)
            }, 50)
        }
    }, [didWin, nextAnim])

    const handleGuess = (isCorrect, cellNum) => {
        let ansArr = [...answerArray];
        if(isCorrect){
            setCorrectSquares(correctSquares + 1);
            ansArr[parseInt(cellNum/gridSize) - 1][cellNum%gridSize - 2] = 1;
            setAnswerArray(answerArray)
        } else {
            setAnswerArray(answerArray[parseInt(cellNum/gridSize) - 1][cellNum%gridSize - 2])
            ansArr[parseInt(cellNum/gridSize) - 1][cellNum%gridSize - 2] = 0;
            loseLife();
        }
        setAnswerArray(ansArr);
    }

    useEffect(() => {
        if(correctSquares === winNum){
            handleWin(true);
        }
    }, [correctSquares])

    useEffect(() => {
        if(!playedToday){
            console.log(puzzle)
            if(puzzle.length > 2){
                // console.log(puzzle)
                setGridSize(JSON.parse(puzzle).length + 2)
                setGameGrid(createGameObject(JSON.parse(puzzle)))
                setWinNum(JSON.parse(puzzle).flat().reduce((curr, next) => curr + next))
                setIsPuzzleSet(true)
            }
        }
    }, [puzzle])

    useEffect(() => {
        handlePrevGameArray(answerArray);
    }, [didWin])

    useEffect(() => {
        if(playedToday){
            console.log(prevGameArray);
            setGameGrid(createGameObject(prevGameArray))
        }
    }, [playedToday])

    useEffect(() => {
            console.log(gameGrid);
    }, [gameGrid])

  return (
    <div id='game' onClick={() => pingStartBtn()}>
        <div id='game-board' className={(!isStarted | gameOver ) ? 'disable-select' : undefined}>
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
                                        <Cell isDarkMode={isDarkMode} cell={cell} cellNum={index} handleCell={handleGuess} key={`cell@${index}`} nextAnim={nextAnim} didWin={didWin} order={index} playedToday={playedToday}/>
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