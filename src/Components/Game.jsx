import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'


import Clues from './Game/Clues.jsx'
import Cell from './Game/Cell.jsx'
import './styles.css';
import { createGameObject } from '../lib/game.js';

const answer = [[1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0],
[1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0]];
const gridSize = answer.length + 2;
const gameGrid = createGameObject(answer);

const Game = ({isStarted, loseLife, isDarkMode, startGame, handleWin}) => {

    const [correctSquares, setCorrectSquares] = useState(0)
    const [winNum, setWinNum] = useState(answer.flat().reduce((curr, next) => curr + next))

    const handleGuess = (isCorrect) => {
        if(isCorrect){
            setCorrectSquares(correctSquares + 1);
        } else {
            loseLife();
        }
    }

    useEffect(() => {
        console.log(correctSquares, winNum);
        if(correctSquares === winNum){
            handleWin(true);
        }
    }, [correctSquares])

  return (
    <div id='game'>
        <div id='game-board' onClick={() => startGame()}>
            <Grid container columns={gridSize} style={{width: '90%', margin: 'auto', marginBottom: '2rem'}}>
                {gameGrid.map((cell, index) => (
                    <>
                        { index === 0 || index === 1 ?
                            // Blank top-left corner
                            <Grid item xs={1} key={`blank@${index}`} />
                            :
                            // Column Clues (if index is in the first row)
                            <>
                                { (parseInt(index/gridSize)===0)  ? 
                                <Clues cell={cell} index={index} rowOrCol={'column'} key={index} isStarted={isStarted}/>
                                : 
                            // Row Clues (in index is on far left side after the first row)  
                                <>
                                    { index%gridSize === 0 ? 
                                    <Clues cell={cell} index={index} rowOrCol={'row'} key={index} isStarted={isStarted} />
                                    :
                            // Space creator for above.
                                    <>
                                    {index%gridSize === 1  ? 
                                        null   
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