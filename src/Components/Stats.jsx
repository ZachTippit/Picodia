import React, { useState, useEffect } from 'react';
import { Divider, Grid } from '@mui/material';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { default as Heart } from '../assets/heart.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'


const Stats = ({closeMenu, cookies, isDarkMode, closing, gameOver, didWin, copyToClipboard}) => {

  useEffect(() => {
    console.log(cookies);
  }, [cookies])

  const averageOfArray = (timeArray) => {
    const avgTime = timeArray.reduce((curr, next) => curr + next) / timeArray.length;
    const minutes = pad(parseInt(avgTime/60));
    const seconds = pad(avgTime%60);
    return minutes, seconds;
  }

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? "0"+valString : valString;
  }

  return (
    <div className={'full-screen-cover fade-in-fwd ' + (closing && 'fade-out-bck')}>
      <div className={'full-screen-container'}>
        <div className={'card fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ')}>
          <img className={'close-btn-stats'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeMenu()}/>
          <h3 style={{textAlign: 'center'}}>STATISTICS</h3>
          <div id={'stat-holder'}>
            <div id={'stat-summary'}>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{cookies.totalGames}</p>
                <p className={'stat-label'}>Played</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{(isNaN(cookies.wonGames/cookies.totalGames * 100) ? 0 : cookies.wonGames/cookies.totalGames * 100)}</p>
                <p className={'stat-label'}>Win %</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{cookies.currentStreak}</p>
                <p className={'stat-label'}>Current Streak</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{cookies.maxStreak}</p>
                <p className={'stat-label'}>Max Streak</p>
              </div>
            </div> 
            <h5 style={{textAlign: 'center'}}>Game Distribution</h5>
            <div>
              <div className={'stat-time'}>
                <p>Lives Left</p>
                <p>...............</p>
                <p>Time Elapsed</p>
              </div>
              <div className={'stat-time'}>
                <div>
                  <img className={'life-stat'} src={Heart} alt='Lives' />
                  <img className={'life-stat'} src={Heart} alt='Lives' />
                  <img className={'life-stat'} src={Heart} alt='Lives' />
                </div>
                <p>5:51</p>
              </div>
              <div className={'stat-time'}>
                <div>
                  <img className={'life-stat'} src={Heart} alt='Lives' />
                  <img className={'life-stat'} src={Heart} alt='Lives' />
                </div>
                <p>4:21</p>
              </div>
              <div className={'stat-time'}>
                <div>
                  <img className={'life-stat'} src={Heart} alt='Lives' />
                </div>
                <p>5:14</p>
              </div> 
              <div className={'stat-time'}>
                <div>
                  <img className={'life-stat'} src={EmptyHeart} alt='Lives' />
                </div>
                <p>5:51</p>
              </div>
            </div>
          </div>
          {gameOver &&
              <>
              <Divider sx={{width: '80%', m: 'auto', my: 2}}/>
              <div className='end-game-txt'>
                <p style={{textAlign: 'center'}}><b>{(didWin ? 'Nice!' : 'Bummer :(')}</b></p>
                <p>{(didWin ? 
                  'You solved the puzzle. Share with your results to see who can beat you!' 
                  : 'This was a tough one! Share with your friends and see how they do.')}</p>
                <Grid container direction='row'>
                  <Grid item xs>
                    <p><b>Next Game</b></p>
                    <p>TICK TOCK</p>
                  </Grid>
                  <Divider orientation="vertical" flexItem/>
                  <Grid item xs>
                    <button className='share-btn' onClick={() => copyToClipboard()}>Share results</button>
                  </Grid>
                </Grid>  
              </div>             
            </>
          }
        </div>
      </div>
    </div>
  )
};

export default Stats;