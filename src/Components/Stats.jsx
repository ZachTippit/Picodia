import React from 'react';
import { Divider, Grid } from '@mui/material';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { default as Heart } from '../assets/heart.png'

const Stats = ({closeMenu, playerStats, isDarkMode, closing, gameOver, didWin, copyToClipboard, minutes, seconds, lives}) => {
  return (
    <div className={'full-screen-cover fade-in-fwd ' + (closing && 'fade-out-bck')}>
      <div className={'full-screen-container'}>
        <div className={'card fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ')}>
          <img className={'close-btn-stats'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeMenu()}/>
          <h3 style={{textAlign: 'center'}}>STATISTICS</h3>
          <div id={'stat-holder'}>
            <div id={'stat-summary'}>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{playerStats.gamesPlayed}</p>
                <p className={'stat-label'}>Played</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{playerStats.winPercent}</p>
                <p className={'stat-label'}>Win %</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{playerStats.currentStreak}</p>
                <p className={'stat-label'}>Current Streak</p>
              </div>
              <div className={'stat-block'}>
                <p className={'stat-num'}>{playerStats.bestStreak}</p>
                <p className={'stat-label'}>Max Streak</p>
              </div>
            </div> 
            <h5 style={{textAlign: 'center'}}>Average Times</h5>
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
                    <button className='share-btn' onClick={() => copyToClipboard(minutes, seconds, lives)}>Share results</button>
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