import React, { useState, useEffect } from 'react';
import './styles.css'
import { default as Heart } from '../assets/heart.png'

const Footer = ({lives, isStarted, startGame}) => {

  const [totalTime, setTotalTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(totalTime => totalTime + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    setSeconds(totalTime%60)
  }, [totalTime])

  useEffect(() => {
    setMinutes(parseInt(totalTime/60))
  }, [seconds])

  useEffect(() => {
    if(isStarted){
      setTotalTime(0)
    }
  }, [isStarted])

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? "0"+valString : valString;
  }

  return (
    <div id={'footer'}>
      {!isStarted ? 
        <div>
          <button className='start-button' onClick={() => startGame()}>Start Game</button>
        </div>
      :
        <>
          <div>
            <p style={{textAlign: 'center', marginBottom: '0'}}>TIME</p>
            <div style={{margin: 'auto', textAlign: 'center'}}>
              <label style={{fontSize: '0.75rem'}}>{pad(minutes)}</label>
              <label style={{fontSize: '0.75rem'}}>:</label>
              <label style={{fontSize: '0.75rem'}}>{pad(seconds)}</label>
            </div>
          </div>
          <div>
            <p style={{textAlign: 'center', marginBottom: '0'}}>LIVES</p>
            <div id={'lives'}>
              {[...Array(lives)].map(life => (
                <>
                  <img className={'life'} src={Heart} alt='Lives' key={life}/>
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
