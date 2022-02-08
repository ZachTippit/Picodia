import React from 'react';
import './styles.css';
import {default as Question } from '../assets/question.png'
import {default as Stats } from '../assets/graph.png'
import {default as Settings } from '../assets/setting.png'

const Navbar = ({openMenu}) => {
  return (
    <div id={'nav'}>
      <img src={Question} alt='About icon' id={'nav-about-btn'} onClick={() => openMenu('about')}/>    
      <h1 id={'title'}>PICODIA</h1>
      <div id={'nav-right-btns'}>
        <img src={Stats} alt='Stats icon' id={'nav-stats-btn'} onClick={() => openMenu('stats')}/>
        <img src={Settings} alt='Settings icon' id={'nav-settings-btn'} onClick={() => openMenu('settings')}/>
      </div>
    </div>
  )
};

export default Navbar;
