import React, { useState, useEffect } from 'react';
import './slider.css';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { useDispatch, useSelector } from 'react-redux';
import { togglesDarkMode, selectGameConfig } from '../features/gameConfig/gameConfigSlice';
import { selectGameState, toggleHardMode } from '../features/gameState/gameStateSlice';

const Settings = ({closeMenu, version}) => {
  const dispatch = useDispatch();
  const darkMode = useSelector(selectGameConfig).isDarkMode
  const gameState = useSelector(selectGameState);

  const [closing, setClosing] = useState(false);

  const closeWindow = () => {
    setClosing(true)
    closeMenu('')
  }

  return (
    <div id={'settings'} className={'fade-in-bottom ' + (darkMode ? 'dark-theme ' : 'light-theme ') + (closing && 'fade-out-bottom')} style={{maxWidth: '450px', margin: 'auto'}}>
      <img className={'close-btn'} src={(darkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeWindow()}/>
      <h2 style={{textAlign: 'center', fontSize: '1.25rem'}}>SETTINGS</h2>
      <div style={{width: '100%'}}>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>HARD MODE</h3>
            <p>Lowers lives to 1! Don't make a mistake :)</p>
          </div>
          <label className=" switch">
            <input type="checkbox" defaultChecked={gameState.hardMode} onClick={() => dispatch(toggleHardMode(false))}/>
            <span className="slider round"></span>
          </label>
        </div>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>DARK THEME</h3>
            <p>Toggle to turn dark mode on and off.</p>
          </div>
          <label className=" switch">
            <input type="checkbox" onClick={() => dispatch(togglesDarkMode())} defaultChecked={darkMode}/>
            <span className="slider round"></span>
          </label>
        </div>
        {/* <div className={'setting'}>
          <div className={'section-txt'}>
            <h5>ACCESSIBILITY MODE</h5>
            <p>Removes click and drag functionality from both touch and mouse usage.</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div> */}
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>FEEDBACK</h3>
            <p>Please reach out with any questions, comments praise or concerns!</p>
          </div>
          <div id={'feedback-txt'}>
            <a href='mailto:zachary.tippit@gmail.com'><span className={'feedback-link'}>Email</span></a>
            <a href='https://www.zachtippit.com' target='_blank' rel="noreferrer"><span className={'feedback-link'}>Portfolio</span></a>
          </div>
        </div>
      </div>
      <div id={'setting-footer'}>
        <div>
          <p>©2022 by Zach Tippit</p>
        </div>
        <div>
          <p><a href='https://www.zachtippit.com'>More projects at zachtippit.com</a></p>
        </div>     
        <div>
          <p>Picodia #{version}</p>
        </div>     
      </div>     
    </div> 
  )
};

export default Settings;