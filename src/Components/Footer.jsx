import React, { useState, useEffect } from 'react';
import { default as Heart } from '../assets/heart.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'
import { useSelector } from 'react-redux'
import { selectGameState } from '../features/gameState/gameStateSlice'
import { selectGameConfig } from '../features/gameConfig/gameConfigSlice';

const Footer = ({openMenu, gameOver, preGameAnim}) => {

  const gameConfig = useSelector(selectGameConfig)
  const gameState = useSelector(selectGameState);
  const isMobile = useSelector(state => state.windowHandler.isMobile)
  
  const [totalTime, setTotalTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? "0"+valString : valString;
  }

  useEffect(() => {
    if(!gameOver){
      const interval = setInterval(() => {
        setTotalTime(totalTime => totalTime + 1)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [])

  useEffect(() => !gameOver && setSeconds(totalTime%60), [totalTime])

  useEffect(() => !gameOver && setMinutes(parseInt(totalTime/60)), [seconds])

  useEffect(() => {(gameState.isStarted && !gameOver) && setTotalTime(0)}, [gameState.isStarted])

  useEffect(() => {
    if(gameOver){
      localStorage.prevTime = totalTime
    }
  }, [gameOver])

  return (
    <div id={'footer'}>
        {(!gameState.isStarted) ? 
          <div className={(preGameAnim ? 'fade-out-right ' : ' ')}>
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
                {[...Array(gameState.maxLives)].map((life, index) => (
                  <>{
                    gameConfig.playedToday ?
                      <>{
                        index >= localStorage.prevLives ?
                          <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={`no-heart${index}`}/> :
                          <img className={'life'} src={Heart} alt='Lives' key={`heart${index}`}/> 
                      }</>
                      :
                      <>{
                        index >= gameState.lives ?
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
                <label style={{fontSize: '0.75rem'}}>{pad(gameConfig.playedToday ? parseInt(localStorage.prevTime/60) : minutes)}</label>
                <label style={{fontSize: '0.75rem'}}>:</label>
                <label style={{fontSize: '0.75rem'}}>{pad(gameConfig.playedToday ? localStorage.prevTime%60 : seconds)}</label>
              </div>
            </div>
          </>
        }
    </div>
  )
};

export default Footer;
