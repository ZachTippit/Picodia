import React from 'react';
import './styles.css';
import {default as Question } from '../assets/question.png'
import {default as Stats } from '../assets/graph.png'
import {default as Settings } from '../assets/setting.png'
import {default as QuestionDark } from '../assets/question-dark.png'
import {default as StatsDark } from '../assets/graph-dark.png'
import {default as SettingsDark } from '../assets/setting-dark.png'

const Navbar = ({openMenu, isDarkMode}) => {
  return (
    <div id={'nav'}>
      <img src={(isDarkMode ? Question : QuestionDark)} alt='About icon' id={'nav-about-btn'} onClick={() => openMenu('about')}/>    
      <h1 id={'title'}>PICODIA</h1>
      <div id={'nav-right-btns'}>
        <img src={(isDarkMode ? Stats : StatsDark)} alt='Stats icon' id={'nav-stats-btn'} onClick={() => openMenu('stats')}/>
        <img src={(isDarkMode ? Settings : SettingsDark)} alt='Settings icon' id={'nav-settings-btn'} onClick={() => openMenu('settings')}/>
      </div>
    </div>
  )
};

export default Navbar;
