import { useState, useEffect, use } from 'react';
import { Grid } from '@mui/material';
// @ts-ignore
import { default as EmptyHeart } from '../assets/empty-heart.png';
// @ts-ignore
import { default as Heart } from '../assets/heart.png';
import { GameContext } from '../GameContext';

interface LoseExampleRow {
  exClue: string;
  exArray: any[];
  nextStart: number;
  order: number;
}

const LoseExampleRow = ({ exClue, exArray, nextStart, order }: LoseExampleRow ) => {
  const { state: { darkMode } } = use(GameContext);

  const [nextAnim, setNextAnim] = useState(-1);
  const [fakeGameOver, setFakeGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (nextStart === order) {
      setTimeout(() => {
        setNextAnim(0);
      }, 1000);
    }
  }, [nextStart]);

  useEffect(() => {
    if (nextAnim === 3) {
      setFakeGameOver(true);
    }
  }, [nextAnim]);

  return (
    <Grid container direction="row" className="mx-4 my-0">
      <Grid container columns={13} width="60%">
        <Grid size={{ xs: 3 }} alignSelf="center">
          <p className="m-0 text-right pr-2">{exClue}</p>
        </Grid>
        {exArray.map((cell, index) => (
          <Grid
            size={{ xs: 2 }}
            className={
              'ex-cell ' +
              (darkMode ? 'light-' : 'dark-') +
              (nextAnim >= index
                ? cell === 1
                  ? 'right pulsate-fwd'
                  : cell === 0
                    ? ' wrong pulsate-fwd'
                    : ' flagged pulsate-fwd'
                : ' ')
            }
            onAnimationEnd={() => {
              setNextAnim(nextAnim + 1);
            }}
          />
        ))}
      </Grid>
      <Grid container width="35%" marginLeft="5%">
        {[...Array(3)]
          .map((life, index) =>
            index + 2 >= nextAnim ? (
              <Grid>
                <img className="life " src={Heart} alt="Lives" key={index} />
              </Grid>
            ) : (
              <Grid>
                <img className="life vibrate-1" src={EmptyHeart} alt="Lives" key={index} />
              </Grid>
            )
          )
          .reverse()}
      </Grid>
    </Grid>
  );
};

export default LoseExampleRow;
