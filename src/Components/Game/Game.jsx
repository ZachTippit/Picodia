import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toggleMarkup } from '../../features/gameState/gameStateSlice';
import { changeGameState, loseLife, setDidWin } from '../../features/gameState/gameStateSlice.js';
import { Grid } from '@mui/material';
import Clues from './Clues.jsx';
import Cell from './Cell.jsx';
import { createGameObject } from '../../lib/game.js';

const answer = [[1,1,0,0,0,0,0,1], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,1]];
const blank = [[2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2]];

const Game = () => {
    const dispatch = useDispatch();

    const isMobile = useSelector(state => state.windowHandler.isMobile);
    const { dailyPuzzle, gridSize, winNum } = useSelector(state => state.gameConfig)
    const {didWin, stateOfGame, isStarted, lives, markUp} = useSelector(state => state.gameState);

    const [correctCellCount, setCorrectCellCount] = useState(0);
    const [nextAnim, setNextAnim] = useState(0);
    const [answerArray, setAnswerArray] = useState(blank);

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

    const handleGuess = (isCorrect, cellNum) => {
        let ansArr = [...answerArray];
        const rowNum = parseInt(cellNum/gridSize) - 1;
        const colNum = cellNum%gridSize - 2;

        if(isCorrect){
            setCorrectCellCount(correctCellCount + 1);
            ansArr[rowNum][colNum] = 1;
        } else {
            dispatch(loseLife());
            ansArr[rowNum][colNum] = 0;           
        }
        setAnswerArray(ansArr);
    }

    return (
        <div id='game'>
            <div id='game-board' className={(stateOfGame === 'game over') && 'disable-select'}>
                <Grid container columns={gridSize} className={isStarted ? ' move-on-start' : ' '}>
                    {dailyPuzzle.map((cell, index) => (
                        <> { index === 0 || index === 1 ?
                            <Grid item xs={1} key={`blank@${index}`} />     // Blank top-left corner

                        :   <> { (parseInt(index/gridSize)===0)  ?          // Column Clues (if index is in the first row)
                            <Clues cell={cell} index={index} rowOrCol={'column'} key={`clues-col-${index}`} isStarted={isStarted}/>

                        :   <> { index%gridSize === 0 ?                     // Row Clues (in index is on far left side after the first row)
                            <Clues cell={cell} index={index} rowOrCol={'row'} key={`clues-row-${index}`} isStarted={isStarted} />

                        :   <> { index%gridSize === 1  ?                    // Space creator for above.
                            <div key={`empty${index}`}></div>   
                        : 
                            <Cell cell={cell} cellNum={index} isStarted={isStarted} gridSize={gridSize} handleCell={handleGuess} key={`cell@${index}`} nextAnim={nextAnim} order={index} />
                    }</>}</>}</>}</>))} {/* <-- LOL THIS IS AWFUL */}
                </Grid> 
            </div>
            <div className={(isStarted ? ' move-on-start ' : ' ') + ' markup-btn '}>
                <div className={'section-txt'}>
                    <h3>Markup - {markUp ? "On" : "Off"}</h3>
                    <p>Toggle to make notes on puzzle{!isMobile ? ' (or right-click on a computer)' : '.'}</p>
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

    // useEffect(() => { // This doesn't run. Delete? Need to add puzzle error handling in somehow.
    //     let puzzle = gameConfig.dailyPuzzle
    //     if(!Array.isArray(puzzle)){
    //         puzzle = JSON.parse(puzzle)
    //     }

    //     if(!gameConfig.playedToday && typeof puzzle !== 'undefined'){
    //         if(puzzle.length > 2){
    //             setGridSize(10)
    //             setGameGrid(createGameObject(puzzle))
    //             setWinNum(puzzle.flat().reduce((curr, next) => curr + next))
    //         }
    //     }
    // }, [gameConfig.dailyPuzzle])