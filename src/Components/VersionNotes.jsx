import { useState } from 'react';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { useSelector } from 'react-redux';
import { versionNotes } from '../lib/versionNotes';

const VersionNotes = ({closeMenu}) => {
  const darkMode = useSelector(state => state.gameConfig.isDarkMode)

  const [closing, setClosing] = useState(false);

  const closeWindow = () => {
    setClosing(true)
    closeMenu('')
  }

  return (
    <div id={'version-notes-container'} className={'fade-in-bottom ' + (darkMode ? 'dark-theme ' : 'light-theme ') + (closing && 'fade-out-bottom')} style={{maxWidth: '450px', margin: 'auto'}}>
      <img className={'close-btn'} src={(darkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeWindow()}/>
      <h2 style={{textAlign: 'center', fontSize: '1.25rem'}}>VERSION NOTES</h2>
      <div id={'version-notes'}>
        { versionNotes.map(vNote => (
          <div className={'version-note '}>
            <div className={'version-txt'}>
              <h3>v{vNote.versionNum} - <i>{vNote.date}</i></h3>
              <p>{vNote.introText}</p>
              <ul>{ vNote.updateList.map(note => (<li>{note}</li>))}</ul>
              <p>{vNote.outroText}</p>
            </div>
          </div>
        ))}
      </div>
    </div> 
  )
};

export default VersionNotes;