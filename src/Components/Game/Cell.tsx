import { useState, useEffect, use } from 'react';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { GameContext } from '../../GameContext';

interface CellProps {
  cell: number;
  cellNum: number;
  gridSize: number;
  handleCell: (isCorrect: boolean, cellNum: number) => void;
  nextAnim: number;
  order: number;
}

const Cell = ({ cell, cellNum, gridSize, handleCell, nextAnim, order }: CellProps ) => {
  const { state: { markupMode, isGameStarted, didWin, hasPlayedToday, darkMode } } = use(GameContext);

  const [guessed, setGuessed] = useState(hasPlayedToday);
  const [flagged, setFlagged] = useState(false);
  const [winAnimation, setWinAnimation] = useState(false);

  const handleGuess = () => {
    if (markupMode) {
      setFlagged(!flagged);
    } else {
      setGuessed(true);
    }
  };

  const handleFlagged = () => {
    console.log('test');
    setFlagged(!flagged);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (e.button === 0) {
      handleGuess();
    } else if (e.button === 1) {
      handleFlagged();
    }
  };

  useEffect(() => {
    if (guessed) {
      cell ? handleCell(true, cellNum) : handleCell(false, cellNum);
    }
  }, [guessed, cell]);

  useEffect(() => {
    if (nextAnim === order && didWin) {
      setWinAnimation(true);
    }
  }, [nextAnim]);

  useEffect(() => {
    if (hasPlayedToday && isGameStarted) {
      setGuessed(hasPlayedToday);
    }
  }, [hasPlayedToday]);

  return (
    <Grid
      size={{ xs: 1 }}
      className={
        'cell ' +
        (darkMode ? 'light-' : 'dark-') +
        (hasPlayedToday
          ? cell === 1
            ? 'right pulsate-fwd '
            : cell === 0
              ? ' wrong pulsate-fwd '
              : ' flagged pulsate-fwd '
          : guessed
            ? cell
              ? 'right pulsate-fwd '
              : ' wrong pulsate-fwd '
            : ' ') +
        (flagged ? ' flagged ' : ' ') +
        (winAnimation ? ' win-animation' : '') +
        (isGameStarted && Math.floor(cellNum / gridSize) == 5 ? ' horz-mid-thick ' : ' ') +
        (isGameStarted && cellNum % gridSize == 5 ? ' vert-mid-thick ' : ' ')
      }
      onMouseUp={(e) => handleClick(e)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleFlagged();
      }}
      // {...swipeCheck}
    ></Grid>
  );
};

export default Cell;
