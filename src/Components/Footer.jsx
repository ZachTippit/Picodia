import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { toggleMarkup } from '../features/gameState/gameStateSlice';
import PingHandler from './PingHandler';
import { default as Heart } from '../assets/heart.png'
import { default as HeartCB} from '../assets/heart-cb.png'
import { default as EmptyHeart } from '../assets/empty-heart.png'


const Footer = ({openMenu}) => {
  const dispatch = useDispatch();

  const { isRBBlind, playedToday } = useSelector( state => state.gameConfig )
  const {isStarted, lives, maxLives, preGameAnimation, stateOfGame, markUp } = useSelector( state => state.gameState );
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
    <div id='footer-container'>
      <PingHandler />
      <div id='footer'>
        {!isStarted ? 
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
            <div className='fade-in-fwd move-on-start-footer footer-stat'>
              <p>MARKUP</p>
              <div>
                <label className="switch">
                      <div class="button b2" id="button-11">
                          <input type="checkbox" class="checkbox" onClick={() => dispatch(toggleMarkup())} defaultChecked={markUp}/>
                          <div class={isRBBlind ? 'cb knobs' : 'knobs'}><span></span></div>
                          <div class={isRBBlind ? 'cb-layer layer' : 'layer'}></div>
                      </div>
                  </label>
              </div>
            </div>
            <div className='fade-in-fwd move-on-start-footer footer-stat'>
              <p>LIVES</p>
              <div>
                {[...Array(maxLives)].map((life, index) => (
                  <>{
                    playedToday ?
                      <>{
                        index >= localStorage.prevLives ?
                          <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={`no-heart${index}`}/> :
                          <img className={'life'} src={isRBBlind ? HeartCB : Heart} alt='Lives' key={`heart${index}`}/> 
                      }</>
                      :
                      <>{
                        index >= lives ?
                        <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={`no-heart${index}`}/> :
                        <img className={'life'} src={isRBBlind ? HeartCB : Heart} alt='Lives' key={`heart${index}`}/> 
                      }</>
                  }</> 
                ))}
              </div>
            </div>
            <div className='fade-in-fwd move-on-start-footer footer-stat'>
              <p>TIME</p>
              <div>
                <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? parseInt(localStorage.prevTime/60) : minutes)}</label>
                <label style={{fontSize: '0.75rem'}}>:</label>
                <label style={{fontSize: '0.75rem'}}>{pad(playedToday ? localStorage.prevTime%60 : seconds)}</label>
              </div>
            </div>
          </>
        }
      </div>
    </div>
  )
};

export default Footer;
