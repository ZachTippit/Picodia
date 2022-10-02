import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'

import { default as Heart } from '../assets/heart.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'


const Footer = ({openMenu}) => {

  const { playedToday } = useSelector( state => state.gameConfig )
  const {isStarted, lives, maxLives, preGameAnimation, stateOfGame } = useSelector( state => state.gameState );
  const isMobile = useSelector(state => state.windowHandler.isMobile)
  
  const [totalTime, setTotalTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? "0"+valString : valString;
  }

  useEffect(() => {
    if(stateOfGame !== 'game over'){
      const interval = setInterval(() => {
        setTotalTime(totalTime => totalTime + 1)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [])

  useEffect(() => stateOfGame !== 'game over' && setSeconds(totalTime%60), [totalTime])

  useEffect(() => stateOfGame !== 'game over' && setMinutes(parseInt(totalTime/60)), [seconds])

  useEffect(() => {(isStarted && (stateOfGame !== 'game over')) && setTotalTime(0)}, [isStarted])

  useEffect(() => {
    if(stateOfGame === 'game over'){
      localStorage.prevTime = totalTime
    }
  }, [stateOfGame])

  return (
    <div id={'footer'}>
        {(!isStarted) ? 
          <div className={(preGameAnimation ? 'fade-out-right ' : ' ')}>
            {localStorage.playedPicodia=='false' ? 
              <div onClick={() => openMenu('about')}>
                <p className={'solve-to-start-txt '}><b>{isMobile ? 'Tap ' : 'Click here '} to learn how to play!</b></p>
              </div>  
              :
              <p className={'solve-to-start-txt '}><b>Solve the puzzle to start</b></p>
            }
            
          </div>
        :
          <>
            <div className='move-on-start-footer'>
              <p style={{textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold'}}>LIVES</p>
              <div id={'maxLives'}>
                {[...Array(maxLives)].map((life, index) => (
                  <>{
                    playedToday ?
                      <>{
                        index >= localStorage.prevLives ?
                          <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={`no-heart${index}`}/> :
                          <img className={'life'} src={Heart} alt='Lives' key={`heart${index}`}/> 
                      }</>
                      :
                      <>{
                        index >= lives ?
                        <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={`no-heart${index}`}/> :
                        <img className={'life'} src={Heart} alt='Lives' key={`heart${index}`}/> 
                      }</>
                  }</> 
                ))}
              </div>
            </div>
            <div className='fade-in-fwd move-on-start-footer '>
              <p style={{textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold'}}>TIME</p>
              <div style={{margin: 'auto', textAlign: 'center'}}>
                <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? parseInt(localStorage.prevTime/60) : minutes)}</label>
                <label style={{fontSize: '0.75rem'}}>:</label>
                <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? localStorage.prevTime%60 : seconds)}</label>
              </div>
            </div>
          </>
        }
    </div>
  )
};

export default Footer;
