import React, { useState } from 'react';
import './slider.css';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { useDispatch, useSelector } from 'react-redux';
import { togglesDarkMode } from '../features/gameConfig/gameConfigSlice';
import { toggleHardMode } from '../features/gameState/gameStateSlice';

const Settings = ({closeMenu, version}) => {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector(state => state.gameConfig)
  const { hardMode } = useSelector(state => state.gameState)

  const [closing, setClosing] = useState(false);

  const closeWindow = () => {
    setClosing(true)
    closeMenu('')
  }

  const openVersionNotes = () => {
    setClosing(true)
    closeMenu('version-notes')
  }

  return (
    <div id={'settings'} className={'fade-in-bottom ' + (isDarkMode ? ' dark-theme ' : 'light-theme ') + (closing && ' fade-out-bottom')} style={{maxWidth: '450px', margin: 'auto'}}>
      <img className={'close-btn'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeWindow()}/>
      <h2 style={{textAlign: 'center', fontSize: '1.25rem'}}>SETTINGS</h2>
      <div style={{width: '100%'}}>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>HARD MODE</h3>
            <p>Lowers lives to 1! Don't make a mistake :)</p>
          </div>
          <label className=" switch">
            <div class="button b2" id="button-11">
              <input type="checkbox" class="checkbox" onClick={() =>dispatch(toggleHardMode())} defaultChecked={hardMode}/>
              <div class="knobs"><span></span></div> 
              <div class="layer"></div>
            </div>
          </label>
        </div>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>DARK THEME</h3>
            <p>Toggle to turn dark mode on and off.</p>
          </div>
          <label className=" switch">
            <div class="button b2" id="button-11">
              <input type="checkbox" class="checkbox" onClick={() => dispatch(togglesDarkMode())} defaultChecked={isDarkMode}/>
              <div class="knobs"><span></span></div>
              <div class="layer"></div>
            </div>
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
            <h3>VERSION NOTES</h3>
            <p>Interested in the development history? Check it out!</p>
          </div>
          <div id={'feedback-txt'} onClick={() => openVersionNotes()}>
            <p><span className={'feedback-link'}><u>Dev Log</u></span></p>
          </div>
        </div>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>REPORT BUGS</h3>
            <p>Notice something awry? Love the game? Let me know!</p>
          </div>
          <div id={'feedback-txt'}>
            <a href='https://forms.gle/NyVch6Lskic5woJ17' target='_blank' rel="noreferrer"><span className={'feedback-link'}>Report Bugs</span></a>
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
      </div>     
    </div> 
  )
};

export default Settings;