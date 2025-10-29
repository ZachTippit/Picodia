import { useState, useEffect, use } from 'react';
import { Grid } from '@mui/material';
import { GameContext } from '../../GameContext';

interface StartCellProps {
  cell: number;
  cellNum: number;
  gridSize: number;
  handleCell: (isCorrect: boolean) => void;
  didWin?: boolean;
  nextAnim?: number;
  order: number;
}

const StartCell = ({ cell, cellNum, gridSize, handleCell, didWin, nextAnim, order }: StartCellProps) => {
  const { state: { isGameStarted, darkMode } } = use(GameContext);

  const [guessed, setGuessed] = useState(false);
  const [flagged, setFlagged] = useState(false);
  const [winAnimation, setWinAnimation] = useState(false);

  const handleGuess = () => {
    setGuessed(true);
  };

  const handleFlagged = () => {
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
      cell ? handleCell(true) : handleCell(false);
    }
  }, [guessed, cell]);

  useEffect(() => {
    if (nextAnim === order && didWin) {
      setWinAnimation(true);
    }
  }, [nextAnim]);

  return (
    <Grid
      size={{ xs: 1 }}
      className={
        'cell ' +
        (darkMode ? 'light-' : 'dark-') +
        (guessed ? (cell ? 'right pulsate-fwd ' : ' wrong pulsate-fwd ') : ' ') +
        (flagged ? ' flagged ' : ' ') +
        (winAnimation ? ' win-animation' : '') +
        (isGameStarted && Math.floor(cellNum / gridSize) == 5 ? ' horz-mid-thick ' : ' ') +
        (isGameStarted && cellNum % gridSize == 5 ? ' vert-mid-thick ' : ' ')
      }
      onMouseUp={(e) => handleClick(e)}
      onDragEnter={(e) => handleClick(e)}
      onDragLeave={(e) => handleClick(e)}
      onContextMenu={(e) => {
        e.preventDefault();
        handleFlagged();
      }}
      onTouchStart={() => handleGuess()}
      onTouchMove={() => handleGuess()}
      // {...swipeCheck}
    ></Grid>
  );
};

export default StartCell;
