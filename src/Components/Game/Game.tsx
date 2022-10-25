import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { changeGameState, loseLife, setDidWin, setCurrentGameArray } from '../../features/gameState/gameStateSlice';
import { Grid } from '@mui/material';
import Clues from './Clues';
import Cell from './Cell';

const Game = () => {
    const dispatch = useDispatch();

    const { dailyPuzzle, gridSize, winNum } = useSelector((state: any) => state.gameConfig)
    const { didWin, stateOfGame, isStarted, lives, currentGameArray } = useSelector((state: any) => state.gameState);

    const [correctCellCount, setCorrectCellCount] = useState(0);
    const [nextAnim, setNextAnim] = useState(0);
    const [answerArray, setAnswerArray] = useState(typeof JSON.parse(currentGameArray) !== 'undefined' ? JSON.parse(currentGameArray) : JSON.parse(localStorage.blankArray));

    useEffect(() => {
        if((didWin) && (nextAnim < dailyPuzzle.length)){
            setTimeout(() => { setNextAnim(nextAnim + 1) }, 50)
        }
    }, [didWin, nextAnim])

    useEffect(() => {
        if(correctCellCount === winNum){
            dispatch(setDidWin(true))
            dispatch(changeGameState('game over'))
        } else if (lives === 0){
            dispatch(setDidWin(false))
            dispatch(changeGameState('game over'))
        }
    }, [correctCellCount, lives])

    const handleGuess = (isCorrect: boolean, cellNum: number) => {
        let ansArr = [...answerArray];
        const rowNum = cellNum/gridSize - 1;
        const colNum = cellNum%gridSize - 2;

        if(isCorrect){
            setCorrectCellCount(correctCellCount + 1);
            ansArr[rowNum][colNum] = 1;
        } else {
            dispatch(loseLife());
            ansArr[rowNum][colNum] = 0;           
        }
        setAnswerArray(ansArr);
        dispatch(setCurrentGameArray(JSON.stringify(ansArr)));
    }

    return (
        <div id='game'>
            <div id='game-board' className={(stateOfGame === 'game over') ? 'disable-select' : ' '}>
                <Grid container columns={gridSize} className={isStarted ? ' move-on-start' : ' '}>
                    {dailyPuzzle.map((cell: number, index: number) => (
                        <> { index === 0 || index === 1 ?
                            <Grid item xs={1} key={`blank@${index}`} />     // Blank top-left corner

                        :   <> { Math.floor(index/gridSize)===0  ?          // Column Clues (if index is in the first row)
                            <Clues cell={cell} index={index} rowOrCol={'column'} key={`clues-col-${index}`} />

                        :   <> { index%gridSize === 0 ?                     // Row Clues (in index is on far left side after the first row)
                            <Clues cell={cell} index={index} rowOrCol={'row'} key={`clues-row-${index}`} />

                        :   <> { index%gridSize === 1  ?                    // Space creator for above.
                            <div key={`empty${index}`}></div>   
                        : 
                            <Cell cell={cell} cellNum={index} gridSize={gridSize} handleCell={handleGuess} key={`cell@${index}`} nextAnim={nextAnim} order={index} />
                    }</>}</>}</>}</>))} {/* <-- LOL THIS IS AWFUL */}
                </Grid> 
            </div>
        </div>
    )
}

export default Game;

// const answer = [[1,1,0,0,0,0,0,1], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,1]];
// const blank = [[2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2]];