import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import Clues from './Game/Clues.jsx'
import Cell from './Game/Cell.jsx'
import { createGameObject } from '../lib/game.js';
import { useDispatch, useSelector } from 'react-redux'
import { toggleMarkup } from '../features/gameState/gameStateSlice'
import { loseLife, selectGameState } from '../features/gameState/gameStateSlice.js';


const answer = [[1,1,0,0,0,0,0,1], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,1]];

const blank = [[2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2]]

const Game = ({isStarted, gameOver, handleWin, handlePrevGameArray}) => {
    const dispatch = useDispatch()

    const gameConfig = useSelector(state => state.gameConfig)
    const gameState = useSelector(state => state.gameState)

    const [correctSquares, setCorrectSquares] = useState(0)
    const [winNum, setWinNum] = useState(4)
    const [gridSize, setGridSize] = useState(10)
    const [gameGrid, setGameGrid] = useState(createGameObject(answer))
    const [nextAnim, setNextAnim] = useState(0);
    const [answerArray, setAnswerArray] = useState(blank)

    useEffect(() => {
        if((gameState.didWin) && (nextAnim < gameGrid.length)){
            setTimeout(() => {
                setNextAnim(nextAnim + 1)
            }, 50)
        }
    }, [gameState.didWin, nextAnim])

    const handleGuess = (isCorrect, cellNum) => {
        let ansArr = [...answerArray];
        if(isCorrect){
            setCorrectSquares(correctSquares + 1);
            ansArr[parseInt(cellNum/gridSize) - 1][cellNum%gridSize - 2] = 1;
            setAnswerArray(answerArray)
        } else {
            setAnswerArray(answerArray[parseInt(cellNum/gridSize) - 1][cellNum%gridSize - 2])
            ansArr[parseInt(cellNum/gridSize) - 1][cellNum%gridSize - 2] = 0;
            dispatch(loseLife());
        }
        setAnswerArray(ansArr);
    }

    useEffect(() => {
        if(correctSquares === winNum){
            handleWin(true);
        }
    }, [correctSquares])

    useEffect(() => {
        
        let puzzle = gameConfig.dailyPuzzle
        console.log(puzzle)
        if(!Array.isArray(puzzle)){
            puzzle = JSON.parse(puzzle)
        }

        if(!gameConfig.playedToday && typeof puzzle !== 'undefined'){
            if(puzzle.length > 2){
                setGridSize(10)
                setGameGrid(createGameObject(puzzle))
                setWinNum(puzzle.flat().reduce((curr, next) => curr + next))
            }
        }
    }, [gameConfig.dailyPuzzle])

    useEffect(() => {
        handlePrevGameArray(answerArray);
    }, [gameState.didWin])

    useEffect(() => {
        if(gameConfig.playedToday){
            // console.log(prevGameArray);
            setGameGrid(createGameObject(JSON.parse(localStorage.prevGameArray)))
        }
    }, [gameConfig.playedToday])

    return (
        <div id='game'>
            <div id='game-board' className={(!isStarted | gameOver ) ? 'disable-select' : ' '}>
                <Grid container columns={gridSize} className={isStarted ? ' move-on-start' : ' '}>
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
                                            <Cell cell={cell} cellNum={index} isStarted={isStarted} gridSize={gridSize} handleCell={handleGuess} key={`cell@${index}`} nextAnim={nextAnim} order={index} />
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
            <div className={(isStarted ? ' move-on-start ' : ' ') + ' markup-btn '}>
                <div className={'section-txt'}>
                    <h3>Markup - {gameState.markUp ? "On" : "Off"}</h3>
                    <p>Toggle to mark up (or right-click on a computer)</p>
                </div>
            <label className=" switch">
                <input type="checkbox" onClick={() => dispatch(toggleMarkup())} defaultChecked={false}/>
                <span className="slider round"></span>
            </label>
            </div>  
        </div>
    )
}

export default Game;