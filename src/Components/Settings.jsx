import { useState } from 'react';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { useDispatch, useSelector } from 'react-redux';
import { togglesDarkMode, togglesRBColorBlindMode } from '../features/gameConfig/gameConfigSlice';
import { toggleHardMode } from '../features/gameState/gameStateSlice';
import Toggle from './Toggle';

const Settings = ({closeMenu, version}) => {
  const dispatch = useDispatch();
  const { isDarkMode, isRBBlind, puzzleReference } = useSelector(state => state.gameConfig)
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
          <Toggle clickHandler='hard mode' defVal={hardMode} />
        </div>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>DARK THEME</h3>
            <p>Toggle to turn dark mode on and off.</p>
          </div>
          <Toggle clickHandler='dark mode' defVal={isDarkMode} />
        </div>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>ACCESSIBILITY MODE</h3>
            <p>Changes color palate for red-black color blind.</p>
          </div>
          <Toggle clickHandler='color blind mode' defVal={isRBBlind} />
        </div>
        <div className={'setting '}>
          <div className={'section-txt'}>
            <h3>VERSION NOTES</h3>
            <p>Interested in the development history? Check it out!</p>
          </div>
          <div id={'feedback-txt'} className='version-link' onClick={() => openVersionNotes()}>
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