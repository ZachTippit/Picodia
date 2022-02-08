import React from 'react';
import './styles.css'
import { default as Heart } from '../assets/heart.png'

const Footer = ({seconds, minutes}) => {

  const pad = (val) => {
    let valString = val + '';
    return valString.length < 2 ? "0"+valString : valString;
  }

  return (
    <div id={'footer'}>
        <div>
          <p style={{textAlign: 'center', marginBottom: '0'}}>TIME</p>
          <div style={{margin: 'auto', textAlign: 'center'}}>
            <label style={{fontSize: '0.75rem'}}>{pad(minutes)}</label>
            <label style={{fontSize: '0.75rem'}}>:</label>
            <label style={{fontSize: '0.75rem'}}>{pad(seconds)}</label>
          </div>
        </div>
        <div>
          <p style={{textAlign: 'center', marginBottom: '0'}}>LIVES</p>
          <div id={'lives'}>
            <img className={'life'} src={Heart} alt='Lives' />
            <img className={'life'} src={Heart} alt='Lives' />
            <img className={'life'} src={Heart} alt='Lives' />
          </div>
        </div>
        
    </div>
  )
};

export default Footer;
