import React from 'react';
import './styles.css';
import './slider.css';
import {default as Close} from '../assets/close.png'

const Settings = ({closeMenu}) => {
  return (
    <div id={'settings'}>
      <div style={{maxWidth: '450px', margin: 'auto'}}>
        <img className={'close-btn'} src={Close} alt='Close settings window' onClick={() => closeMenu()}/>
        <h3 style={{textAlign: 'center'}}>SETTINGS</h3>
        <div style={{width: '100%'}}>
          <div className={'setting'}>
            <div className={'section-txt'}>
              <h5>HARD MODE</h5>
              <p>This is the text the will affect the setting</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className={'setting'}>
            <div className={'section-txt'}>
              <h5>DARK THEME</h5>
              <p>This is the text the will affect the setting</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className={'setting'}>
            <div className={'section-txt'}>
              <h5>COLOR BLIND MODE</h5>
              <p>This is the text the will affect the setting</p>
            </div>
            <label className="switch">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
          </div>
          <div className={'setting'}>
            <div className={'section-txt'}>
              <h5>FEEDBACK</h5>
              <p>This is the text the will affect the setting</p>
            </div>
            <div id={'feedback-txt'}>
              <a href='mailto:zachary.tippit@gmail.com'><span className={'feedback-link'}>Email</span></a>
              <a href='https://www.zachtippit.com' target='_blank'><span className={'feedback-link'}>Portfolio</span></a>
            </div>
          </div>
        </div>
        <div id={'setting-footer'}>
          <div>
            <p>©2022 by Zach Tippit</p>
          </div>
          <div>
            <p><a href='www.zachtippit.com'>More projects at zachtippit.com</a></p>
          </div>          
        </div>     
      </div> 
    </div>
  )
};

export default Settings;