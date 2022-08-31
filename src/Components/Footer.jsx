import React, { useState, useEffect } from 'react';
import { default as Heart } from '../assets/heart.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'

const Footer = ({lives, maxLives, isStarted, playedToday, whatIsIt, ping, gameOver, handleGameOverTime, prevTime, prevLives, preGameAnim}) => {

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

  // useEffect(() => {
  //   console.log(playedToday, prevTime, prevLives);
  // }, [])


//  && !playedToday -- checks against if played today

  return (
    <div id={'footer'}>
        {(!isStarted) ? 
          <div className={(preGameAnim ? 'fade-out-right ' : ' ')}>
            <p className={'solve-to-start-txt '}><b>Solve the puzzle to start</b></p>
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
            <div className='fade-in-fwd move-on-start-footer '>
              <p style={{textAlign: 'center', marginBottom: '0.5rem', fontWeight: 'bold'}}>TIME</p>
              <div style={{margin: 'auto', textAlign: 'center'}}>
                <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? parseInt(prevTime/60) : minutes)}</label>
                <label style={{fontSize: '0.75rem'}}>:</label>
                <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? prevTime%60 : seconds)}</label>
              </div>
            </div>
          </>
        }
    </div>
  )
};

export default Footer;
