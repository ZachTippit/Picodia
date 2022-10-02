import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import Clues from './Clues'
import StartCell from './StartCell'
import { createGameObject } from '../../lib/game.js';
import { useDispatch, useSelector } from 'react-redux'
import { togglePingHowTo } from '../../features/windowHandler/windowHandlerSlice';
import { changeGameState } from '../../features/gameState/gameStateSlice';


const answer = createGameObject([[1,1,1],[1,0,0],[1,0,1]])

const SolveToStart = () => {
    const dispatch = useDispatch()
    const isDarkMode = useSelector(state => state.gameConfig.isDarkMode)
    const { preGameAnimation } = useSelector(state => state.gameState)

    const [correctCellCount, setCorrectCellCount] = useState(0)

    const handleGuess = (isCorrect) => {
        if(isCorrect){
            setCorrectCellCount(correctCellCount + 1);
        } else {
            wrongSolveToStart();
        }
    }

    const wrongSolveToStart = () => {
        dispatch(togglePingHowTo())
        setTimeout(() => {
          dispatch(togglePingHowTo())
        }, 500)
      }

    useEffect(() => { correctCellCount === 6 && dispatch(changeGameState('playing'))}, [correctCellCount])

    return (
        <div id='startPuzz' className={'move-on-start-footer mt ' + (preGameAnimation ? ' fade-out-right ' : ' ')}>
            <div id='game-board'>
                <Grid container columns={5} width='75%'>
                    {answer.map((cell, index) => (
                    <>  { index === 0 || index === 1 ?          // Blank top-left corner
                        <Grid item xs={1} key={`blank@${index}`} />

                    :   <>  { (parseInt(index/5)===0)  ? // Column Clues (if index is in the first row)
                        <Clues cell={cell} index={index} rowOrCol={'column'} key={`clues-col-${index}`}/>
                        
                    :   <> { index%5 === 0 ?             // Row Clues (in index is on far left side after the first row)  
                        <Clues cell={cell} index={index} rowOrCol={'row'} key={`clues-row-${index}`} />

                    :   <> {index%5 === 1  ?             // Space creator for above.
                        <div key={`empty${index}`}></div>   

                    :   <StartCell                              // Aaaand the cells
                            isDarkMode={isDarkMode} 
                            cell={cell} 
                            cellNum={index} 
                            gridSize={5} 
                            handleCell={handleGuess} 
                            key={`cell@${index}`} 
                            order={index}
                            wrongSolveToStart={wrongSolveToStart}
                        />
                    }</>}</>}</>}</>))}
                </Grid>
            </div>
        </div>
  )
}

export default SolveToStart;