import { useState, useEffect, use } from 'react';
import { Grid } from '@mui/material';
import Clues from './Game/Clues.js';
import Cell from './Game/Cell.js';
import { createGameObject } from '../lib/game.js';
import { GameContext } from '../GameContext';

const answer = [
  [1, 1, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 1],
];

const blank = [
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2, 2, 2],
];

interface GameProps {
  handlePrevGameArray: (prevGameArray: any[]) => void;
}

const Game = ({ handlePrevGameArray }: GameProps) => {
  const { 
    state: { isGameStarted, gameOver, didWin, markupMode, hasPlayedToday },
    actions: { loseLife, winGame, updateGameOver, toggleMarkupMode } 
  } = use(GameContext);

  const [correctSquares, setCorrectSquares] = useState(0);
  const [winNum, setWinNum] = useState(4);
  const [gridSize, setGridSize] = useState(10);
  const [gameGrid, setGameGrid] = useState(createGameObject(answer));
  const [nextAnim, setNextAnim] = useState(0);
  const [answerArray, setAnswerArray] = useState(blank);

  useEffect(() => {
    if (didWin && nextAnim < gameGrid.length) {
      setTimeout(() => {
        setNextAnim(nextAnim + 1);
      }, 50);
    }
  }, [didWin, nextAnim]);

  const handleGuess = (isCorrect, cellNum) => {
    let ansArr = [...answerArray];
    if (isCorrect) {
      setCorrectSquares(correctSquares + 1);
      ansArr[Math.floor(cellNum / gridSize) - 1][(cellNum % gridSize) - 2] = 1;
      setAnswerArray(answerArray);
    } else {
      // setAnswerArray(answerArray[Math.floor(cellNum / gridSize) - 1][(cellNum % gridSize) - 2]);
      ansArr[Math.floor(cellNum / gridSize) - 1][(cellNum % gridSize) - 2] = 0;
      loseLife();
    }
    setAnswerArray(ansArr);
  };

  useEffect(() => {
    if (correctSquares === winNum) {
      winGame()
      updateGameOver(true);
    }
  }, [correctSquares]);

  useEffect(() => {
    let puzzle = answer

    if (!Array.isArray(puzzle)) {
      puzzle = JSON.parse(puzzle);
    }

    if (!hasPlayedToday && typeof puzzle !== 'undefined') {
      if (puzzle.length > 2) {
        setGridSize(10);
        setGameGrid(createGameObject(puzzle));
        setWinNum(puzzle.flat().reduce((curr, next) => curr + next));
      }
    }
  }, [answer]);

  useEffect(() => {
    handlePrevGameArray(answerArray);
  }, [didWin]);

  useEffect(() => {
    if (hasPlayedToday) {
      // console.log(prevGameArray);
      setGameGrid(createGameObject(JSON.parse(localStorage.prevGameArray)));
    }
  }, [hasPlayedToday]);

  return (
    <div className="my-12">
      <div className={(!isGameStarted || gameOver) ? 'disable-select' : ' '}>
        <Grid container columns={gridSize} className={isGameStarted ? ' move-on-start' : ' '}>
          {gameGrid.map((cell, index) => (
            <>
              {index === 0 || index === 1 ? (
                // Blank top-left corner
                <Grid size={{ xs: 1 }} key={`blank@${index}`} />
              ) : (
                // Column Clues (if index is in the first row)
                <>
                  {Math.floor(index / gridSize) === 0 ? (
                    <Clues
                      cell={cell}
                      index={index}
                      rowOrCol="column"
                      key={`clues-col-${index}`}
                    />
                  ) : (
                    // Row Clues (in index is on far left side after the first row)
                    <>
                      {index % gridSize === 0 ? (
                        <Clues
                          cell={cell}
                          index={index}
                          rowOrCol="row"
                          key={`clues-row-${index}`}
                        />
                      ) : (
                        // Space creator for above.
                        <>
                          {index % gridSize === 1 ? (
                            <div key={`empty${index}`} />
                          ) : (
                            // Aaaand the cells
                            <Cell
                              cell={cell}
                              cellNum={index}
                              gridSize={gridSize}
                              handleCell={handleGuess}
                              key={`cell@${index}`}
                              nextAnim={nextAnim}
                              order={index}
                            />
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ))}
        </Grid>
      </div>
      <div className="markup-btn">
        <div className="section-txt">
          <h3>Markup - {markupMode ? 'On' : 'Off'}</h3>
          <p>Toggle to mark up (or right-click on a computer)</p>
        </div>
        <label className=" switch">
          <input type="checkbox" onClick={toggleMarkupMode} defaultChecked={false} />
          <span className="slider round"></span>
        </label>
      </div>
    </div>
  );
};

export default Game;
