import React from 'react';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { default as Heart } from '../assets/heart.png'
import './styles.css'

const GameOver = ({closeMenu, isDarkMode}) => {
  return (
    <div id={'stats-cover'}>
      <div id={'stats-card-container'}>
        <div id={'stats-card'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
          <img className={'close-btn-stats'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeMenu()}/>
          <h3 style={{textAlign: 'center'}}>Game Over!</h3>
          <p>You ran out of lives! There is always next time though.</p>
          <p>This was a tough one, though. Share with your friends and see if they can do better!</p>
          <button>Share</button>
          </div>
        </div>
    </div>
  )
};

export default GameOver;