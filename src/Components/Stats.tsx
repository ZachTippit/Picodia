import { use, useEffect, useRef, useState } from 'react';
import { Divider, Grid } from '@mui/material';
// @ts-ignore
import { default as Close } from '../assets/close.png';
// @ts-ignore
import { default as CloseDark } from '../assets/close-dark.png';
// @ts-ignore
import { default as Heart } from '../assets/heart.png';
// @ts-ignore
import { default as EmptyHeart } from '../assets/empty-heart.png';
import { GameContext } from '../GameContext';
import { cn } from '../lib/cn';

interface StatsProps {
  copyToClipboard: () => void;
}

const Stats = ({ copyToClipboard }: StatsProps ) => {
  const { 
    state: { gameOver, showStats, darkMode, hasPlayedToday }, 
    actions: { toggleStats } 
  } = use(GameContext);

  const [closing, setClosing] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    if (showStats) {
      setClosing(false);
    }
    return () => {
      if (!showStats && closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [showStats]);

  const closeWindow = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    setClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      toggleStats();
      closeTimeoutRef.current = null;
    }, 300);
  };

  const timeParser = (avgTime) => {
    const minutes = Math.floor(avgTime / 60);
    const seconds = pad(Math.floor(avgTime % 60));
    return `${minutes}:${seconds}`;
  };

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? '0' + valString : valString;
  };

  if(!showStats) return null;

  return (
    <div className={cn("full-screen-cover fade-in-fwd ", closing && 'fade-out-bck')} onAnimationEnd={() => setClosing(false)}>
      <div className="full-screen-container" onClick={closeWindow}>
        <div className={'card fade-in-bottom ' + (darkMode ? 'dark-theme ' : 'light-theme ')}>
          <img
            className="close-btn-stats"
            src={darkMode ? Close : CloseDark}
            alt="Close settings window"
            onClick={toggleStats}
          />
          <h2 className="text-center text-xl">STATISTICS</h2>
          <div id="stat-holder">
            <div id="stat-summary">
              <div className="stat-block">
                <p className="stat-num">{localStorage.totalGames | 0}</p>
                <p className="stat-label">Played</p>
              </div>
              <div className="stat-block">
                <p className="stat-num">
                  {`${((localStorage.wonGames / localStorage.totalGames) * 100).toFixed(1)}%` || '00.0%'}
                </p>
                <p className="stat-label">Win %</p>
              </div>
              <div className="stat-block">
                <p className="stat-num">{localStorage.currentStreak | 0}</p>
                <p className="stat-label">Current Streak</p>
              </div>
              <div className="stat-block">
                <p className="stat-num">{localStorage.maxStreak | 0}</p>
                <p className="stat-label">Max Streak</p>
              </div>
            </div>
            <Grid container justifyContent="center" alignItems="space-between">
              <Grid size={{ xs: 4 }} className="stat-time">
                <p>
                  <b>Lives Left</b>
                </p>
              </Grid>
              <Grid size={{ xs: 4 }} className="stat-time">
                <p>
                  <b>Games Finished</b>
                </p>
              </Grid>
              <Grid size={{ xs: 4 }} className="stat-time">
                <p>
                  <b>Avg Game</b>
                </p>
              </Grid>
              <Grid size={{ xs: 4 }} alignSelf="center" className="life-stat">
                <img src={Heart} alt="Lives" />
                <img src={Heart} alt="Lives" />
                <img src={Heart} alt="Lives" />
              </Grid>
              <Grid size={{ xs: 4 }} className="stat-time">
                <p>{localStorage['_3LifeWins'] | 0}</p>
              </Grid>
              <Grid size={{ xs: 4 }} className="stat-time">
                <p>{timeParser(localStorage['_3LifeAvgTime'])}</p>
              </Grid>
              <Grid size={{xs: 4}} className="life-stat">
                <img src={Heart} alt="Lives" />
                <img src={Heart} alt="Lives" />
              </Grid>
              <Grid size={{xs: 4}} className="stat-time">
                <p>{localStorage['_2LifeWins'] | 0}</p>
              </Grid>
              <Grid size={{xs: 4}} className="stat-time">
                <p>{timeParser(localStorage['_2LifeAvgTime'])}</p>
              </Grid>
              <Grid size={{xs: 4}} className="life-stat">
                <img src={Heart} alt="Lives" />
              </Grid>
              <Grid size={{xs: 4}} className="stat-time">
                <p>{localStorage['_1LifeWins'] | 0}</p>
              </Grid>
              <Grid size={{xs: 4}} className="stat-time">
                <p>{timeParser(localStorage['_1LifeAvgTime'])}</p>
              </Grid>
              <Grid size={{xs: 4}} className="life-stat">
                <img src={EmptyHeart} alt="Lives" />
              </Grid>
              <Grid size={{xs: 4}} className="stat-time">
                <p>{localStorage.lostGames | 0}</p>
              </Grid>
              <Grid size={{xs: 4}} className="stat-time">
                <p>{timeParser(localStorage.lossAvgTime)}</p>
              </Grid>
            </Grid>
            {(gameOver || hasPlayedToday) && (
              <>
                <Divider sx={{ width: '80%', m: 'auto', my: 2 }} />
                <div className="end-game-txt">
                  {/* <p className="text-center"><b>{(didWin ? 'Nice!' : 'Bummer :(')}</b></p>
                <p>{(didWin ? 
                  'You solved the puzzle. Share with your results to see who can beat you!' 
                  : 'This was a tough one! Share with your friends and see how they do.')}</p> */}
                  <Grid container>
                    <Grid size={{ xs: 12 }}>
                      <p className="text-center">
                        <b>Compare with others!</b>
                      </p>
                      <button className="share-btn" onClick={() => copyToClipboard()}>
                        Share results
                      </button>
                      <Divider className="w-1/2 m-auto" />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <p className="text-center text-xs">
                        <b>Check in tomorrow for another game!</b>
                      </p>
                    </Grid>
                  </Grid>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
