import React from 'react';
import {default as Close} from '../assets/close.png'
import { default as Heart } from '../assets/heart.png'

const Stats = ({closeMenu, playerStats}) => {
  return (
    <div id={'stats-cover'}>
      <div id={'stats-card-container'}>
        <div id={'stats-card'}>
          <img className={'close-btn-stats'} src={Close} alt='Close settings window' onClick={() => closeMenu()}/>
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
        </div>
      </div>
    </div>
  )
};

export default Stats;