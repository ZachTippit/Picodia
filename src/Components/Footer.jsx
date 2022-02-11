import React, { useState, useEffect } from 'react';
import './styles.css'
import { default as Heart } from '../assets/heart.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'

const Footer = ({lives, maxLives, isStarted, startGame, minutes, seconds, ping}) => {

  const [pingStart, setPingStart] = useState(true);

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? "0"+valString : valString;
  }

  useEffect(() => {
    setPingStart(ping)
  }, [ping])

  return (
    <div id={'footer'}>
      {!isStarted ? 
        <div>
          <button className={'start-button ' + (pingStart && 'pulsate-fwd')} onClick={() => startGame()} onAnimationEnd={() => {setPingStart(false)}}>Start Game</button>
        </div>
      :
        <>
          <div className='fade-in-fwd'>
            <p style={{textAlign: 'center', marginBottom: '0'}}>TIME</p>
            <div style={{margin: 'auto', textAlign: 'center'}}>
              <label style={{fontSize: '0.75rem'}}>{pad(minutes)}</label>
              <label style={{fontSize: '0.75rem'}}>:</label>
              <label style={{fontSize: '0.75rem'}}>{pad(seconds)}</label>
            </div>
          </div>
          <div>
            <p style={{textAlign: 'center', marginBottom: '0'}}>LIVES</p>
            <div id={'maxLives'}>
              {[...Array(maxLives)].map((life, index) => (
                <>
                  {
                      index >= lives ?
                        <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={life}/> :
                        <img className={'life'} src={Heart} alt='Lives' key={life}/> 
                  }
                  
                </>
                
                
              ))}
            </div>
          </div>
        </>
      }
    </div>
  )
};

export default Footer;
