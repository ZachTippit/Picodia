import { useState, useEffect, use } from 'react';
import { Grid } from '@mui/material';
import Clues from './Clues';
import StartCell from './StartCell';
import { createGameObject } from '../../lib/game.js';
import { GameContext } from '../../GameContext';
import { cn } from '../../lib/cn';

const answer = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 0, 1],
];

const SolveToStart = () => {
  const { state: { preGameAnim }, actions: { setPingHowTo, setPreGameAnim, setStartPing, startGame } } = use(GameContext);
  const [correctSquares, setCorrectSquares] = useState(0);
  const [winNum, setWinNum] = useState(6);
  const [gridSize, setGridSize] = useState(5);
  const [gameGrid, setGameGrid] = useState(createGameObject(answer));

  const handleGuess = (isCorrect) => {
    if (isCorrect) {
      setCorrectSquares(correctSquares + 1);
    } else {
      wrongSolveToStart();
    }
  };

  useEffect(() => {
    if (correctSquares === winNum) {
      handleWin();
    }
  }, [correctSquares]);

  const wrongSolveToStart = () => {
    setPingHowTo(true);
    setTimeout(() => {
      setPingHowTo(false);
    }, 500);
  };

  const handleWin = () => {
    setPreGameAnim(true);
    setTimeout(() => {
      startGame();
      setPreGameAnim(false);
    }, 1200);

    setTimeout(() => {
      setStartPing(true);
    }, 3000);
    setTimeout(() => {
      setStartPing(false);
    }, 8000);
  };

  return (
    <div
      className={cn("overflow-y-hidden min-h-[550px] move-on-start-footer mt ", preGameAnim ? ' fade-out-right ' : ' ')}
    >
      <div>
        <Grid container columns={5} width="75%">
          {gameGrid.map((cell, index) => (
            <>
              {index === 0 || index === 1 ? (
                // Blank top-left corner
                <Grid size={{ xs: 1 }} key={`blank@${index}`} />
              ) : (
                // Column Clues (if index is in the first row)
                <>
                  { Math.floor(index / gridSize) === 0 ? (
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
                            <div key={`empty${index}`}></div>
                          ) : (
                            // Aaaand the cells
                            <StartCell
                              cell={cell}
                              cellNum={index}
                              gridSize={gridSize}
                              handleCell={handleGuess}
                              key={`cell@${index}`}
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
    </div>
  );
};

export default SolveToStart;
