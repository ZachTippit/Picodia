import React, { useState, useEffect } from 'react';
import { Divider, Grid } from '@mui/material';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { default as Heart } from '../assets/heart.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'


const Stats = ({closeMenu, cookies, isDarkMode, closing, gameOver, playedToday, copyToClipboard}) => {

  // useEffect(() => {
  //   console.log(cookies);
  // }, [cookies])

  const timeParser = (avgTime) => {
    const minutes = parseInt(avgTime/60);
    const seconds = pad(parseInt(avgTime%60));
    return `${minutes}:${seconds}`;
  }

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? "0"+valString : valString;
  }

  return (
    <div className={'full-screen-cover fade-in-fwd ' + (closing && 'fade-out-bck')}>
      <div className={'full-screen-container'} onClick={() => closeMenu()}>
        <div className={'card fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ')}>
          <img className={'close-btn-stats'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeMenu()}/>
          <h2 style={{textAlign: 'center', fontSize: '1.25rem'}}>STATISTICS</h2>
          <div id={'stat-holder'}>
            <div id={'stat-summary'}>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{cookies.totalGames | 0}</p>
                <p className={'stat-label'}>Played</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{(isNaN(cookies.wonGames/cookies.totalGames * 100) ? 0 : `${(cookies.wonGames/cookies.totalGames * 100).toFixed(1)}%`) | '00.0%'}</p>
                <p className={'stat-label'}>Win %</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{cookies.currentStreak | 0}</p>
                <p className={'stat-label'}>Current Streak</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{cookies.maxStreak | 0}</p>
                <p className={'stat-label'}>Max Streak</p>
              </div>
            </div> 
            <Grid container justifyContent='center' alignItems='space-between'>
              <Grid item xs={4} className={'stat-time'}><p><b>Lives Left</b></p></Grid>
              <Grid item xs={4} className={'stat-time'}><p><b>Games Finished</b></p></Grid>
              <Grid item xs={4} className={'stat-time'}><p><b>Avg Game</b></p></Grid>
              <Grid item xs={4} alignSelf='center' className={'life-stat'}>
                <img src={Heart} alt='Lives' />
                <img src={Heart} alt='Lives' />
                <img src={Heart} alt='Lives' />
              </Grid>
              <Grid item xs={4} className={'stat-time'}><p>{cookies['3LifeWins'] | 0}</p></Grid>
              {/* <Grid item xs={4} className={'stat-time'}><p>{timeParser(cookies['3LifeAvgTime'])}</p></Grid> */}
              <Grid item xs={4} className={'stat-time'}><p>Coming soon :)</p></Grid>
              <Grid item xs={4} className={'life-stat'}>
                <img src={Heart} alt='Lives' />
                <img src={Heart} alt='Lives' />
              </Grid>
              <Grid item xs={4} className={'stat-time'}><p>{cookies['2LifeWins'] | 0}</p></Grid>
              {/* <Grid item xs={4} className={'stat-time'}><p>{timeParser(cookies['2LifeAvgTime'])}</p></Grid> */}
              <Grid item xs={4} className={'stat-time'}><p>...</p></Grid>
              <Grid item xs={4} className={'life-stat'}>
                <img src={Heart} alt='Lives' />
              </Grid>
              <Grid item xs={4} className={'stat-time'}><p>{cookies['1LifeWins'] | 0}</p></Grid>
              {/* <Grid item xs={4} className={'stat-time'}><p>{timeParser(cookies['1LifeAvgTime'])}</p></Grid> */}
              <Grid item xs={4} className={'stat-time'}><p>...</p></Grid>
              <Grid item xs={4} className={'life-stat'}>
                <img src={EmptyHeart} alt='Lives' />
              </Grid>
              <Grid item xs={4} className={'stat-time'}><p>{cookies.lostGames | 0}</p></Grid>
              {/* <Grid item xs={4} className={'stat-time'}><p>{timeParser(cookies.avgLossTime)}</p></Grid> */}
              <Grid item xs={4} className={'stat-time'}><p>...</p></Grid>
            </Grid>
          {(gameOver || playedToday) &&
              <>
              <Divider sx={{width: '80%', m: 'auto', my: 2}}/>
              <div className='end-game-txt'>
                {/* <p style={{textAlign: 'center'}}><b>{(didWin ? 'Nice!' : 'Bummer :(')}</b></p>
                <p>{(didWin ? 
                  'You solved the puzzle. Share with your results to see who can beat you!' 
                  : 'This was a tough one! Share with your friends and see how they do.')}</p> */}
                <Grid container>
                  <Grid item xs={12}>
                    <p style={{textAlign: 'center'}}><b>Compare with others!</b></p>
                    <button className='share-btn' onClick={() => copyToClipboard()}>Share results</button>
                    <Divider width='50%' style={{margin: 'auto'}}/>
                  </Grid>
                  <Grid item xs={12}>
                    <p style={{fontSize: '0.75rem', textAlign: 'center'}}><b>Check in tomorrow for another game!</b></p>
                  </Grid>  
                </Grid>  
              </div>             
            </>
          }
      </div>
    </div>
  </div>
  </div>
  )
};

export default Stats;