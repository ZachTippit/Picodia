import React, { useState, useEffect } from 'react';
import './styles.css'
import { default as Heart } from '../assets/heart.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'

const Footer = ({lives, maxLives, isStarted, playedToday, startGame, ping, gameOver, handleGameOverTime, prevTime, prevLives}) => {

  const [pingStart, setPingStart] = useState(true);
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

  useEffect(() => {(isStarted && !gameOver) && setTotalTime(0)}, [isStarted])

  useEffect(() => gameOver && handleGameOverTime(totalTime, minutes, seconds), [gameOver])

  useEffect(() => { setPingStart(ping) }, [ping])

  useEffect(() => {
    console.log(playedToday, prevTime, prevLives);
  }, [])


//  && !playedToday -- checks against if played today

  return (
    <div id={'footer'}>
      {(!isStarted && !playedToday) ? 
        <div>
          <button className={'start-button ' + (pingStart && 'pulsate-fwd')} onClick={() => startGame()} onAnimationEnd={() => {setPingStart(false)}}>Start Game</button>
        </div>
      :
        <>
          <div className='fade-in-fwd'>
            <p style={{textAlign: 'center', marginBottom: '0'}}>TIME</p>
            <div style={{margin: 'auto', textAlign: 'center'}}>
              <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? parseInt(prevTime/60) : minutes)}</label>
              <label style={{fontSize: '0.75rem'}}>:</label>
              <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? prevTime%60 : seconds)}</label>
            </div>
          </div>
          <div>
            <p style={{textAlign: 'center', marginBottom: '0'}}>LIVES</p>
            <div id={'maxLives'}>
              {[...Array(maxLives)].map((life, index) => (
                <>{
                  playedToday ?
                    <>{
                      index >= prevLives ?
                        <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={life} key={`no-heart${index}`}/> :
                        <img className={'life'} src={Heart} alt='Lives' key={life} key={`heart${index}`}/> 
                    }</>
                    :
                    <>{
                      index >= lives ?
                      <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={life} key={`no-heart${index}`}/> :
                      <img className={'life'} src={Heart} alt='Lives' key={life} key={`heart${index}`}/> 
                    }</>
                }</> 
              ))}
            </div>
          </div>
        </>
      }
    </div>
  )
};

export default Footer;
