import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toggleMarkup } from '../../features/gameState/gameStateSlice';
import { changeGameState, loseLife, setDidWin, setCurrentGameArray } from '../../features/gameState/gameStateSlice.js';
import { Grid } from '@mui/material';
import Clues from './Clues.jsx';
import Cell from './Cell.jsx';

const answer = [[1,1,0,0,0,0,0,1], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [0,0,0,0,0,0,0,0], [1,0,0,0,0,0,0,1]];
const blank = [[2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2]];

const Game = () => {
    const dispatch = useDispatch();

    const isMobile = useSelector(state => state.windowHandler.isMobile);
    const { dailyPuzzle, gridSize, winNum, playedToday } = useSelector(state => state.gameConfig)
    const {didWin, stateOfGame, isStarted, lives, markUp, currentGameArray} = useSelector(state => state.gameState);

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
        dispatch(setCurrentGameArray(JSON.stringify(ansArr)));
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
            { !playedToday && 
            <div className={(isStarted ? ' move-on-start ' : ' ') + ' markup-btn '}>
                <div className={'section-txt'}>
                    <h3>Markup - {markUp ? "On" : "Off"}</h3>
                    <p>Toggle to make notes on puzzle{!isMobile ? ' (or right-click on a computer)' : '.'}</p>
                </div>
            
                <label className=" switch">
                    <div class="button b2" id="button-11">
                        <input type="checkbox" class="checkbox" onClick={() => dispatch(toggleMarkup())} defaultChecked={false}/>
                        <div class="knobs"><span></span></div>
                        <div class="layer"></div>
                    </div>
                </label>
            </div>  
            } 
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