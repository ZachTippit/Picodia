import { useState, useEffect, use } from 'react';
import { Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { GameContext } from '../GameContext';

interface ExampleRowProps {
  exClue: string;
  exArray: any[];
  nextStart: number;
  onToNext?: () => void;
  order: number;
}

const ExampleRow = ({ exClue, exArray, nextStart, onToNext, order }: ExampleRowProps ) => {
  const { state: { darkMode } } = use(GameContext);
  const [nextAnim, setNextAnim] = useState<number>(0);

  useEffect(() => {
    if (nextStart === order) {
      setTimeout(() => {
        setNextAnim(0);
      }, 1000);
    }
  }, [nextStart, order]);

  useEffect(() => {
    if (nextAnim === exArray.length) {
      setTimeout(() => {
        onToNext();
      }, 500);
    }
  }, [nextAnim]);

  return (
    <Grid container columns={13} width="70%" marginLeft="2rem" className="ex-grid">
      <Grid size={{ xs: 3 }} alignSelf="center">
        <p className="m-0 text-right pr-2">{exClue}</p>
      </Grid>
      {exArray.map((cell, index) => (
        <Grid
          size={{ xs: 1 }}
          className={
            'ex-cell ' +
            (darkMode ? 'light-' : 'dark-') +
            (nextAnim >= index
              ? cell === 1
                ? 'right pulsate-fwd '
                : cell === 0
                  ? ' wrong pulsate-fwd '
                  : ' pulsate-fwd '
              : ' ')
          }
          onAnimationEnd={() => {
            setNextAnim(nextAnim + 1);
          }}
        />
      ))}
    </Grid>
  );
};

export default ExampleRow;
