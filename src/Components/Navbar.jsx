import React from 'react';
import {default as Question } from '../assets/question.png'
import {default as Stats } from '../assets/graph.png'
import {default as Settings } from '../assets/setting.png'
import {default as QuestionDark } from '../assets/question-dark.png'
import {default as StatsDark } from '../assets/graph-dark.png'
import {default as SettingsDark } from '../assets/setting-dark.png'
import { useSelector } from 'react-redux';

const Navbar = ({openMenu}) => {
  const isDarkMode = useSelector(state => state.gameConfig.isDarkMode)
  const pingHowTo = useSelector(state => state.windowHandler.pingHowTo)

  return (
    <div id={'nav'}>
      <img src={(isDarkMode ? Question : QuestionDark)} alt='About icon' id={'nav-about-btn'} className={(pingHowTo ? 'wobble-ver-right ' : ' ')} onClick={() => openMenu('how-to-play')}/>    
      <h1 id={'title'}>PICODIA</h1>
      <div id={'nav-right-btns'}>
        <img src={(isDarkMode ? Stats : StatsDark)} alt='Stats icon' id={'nav-stats-btn'} onClick={() => openMenu('stats')}/>
        <img src={(isDarkMode ? Settings : SettingsDark)} alt='Settings icon' id={'nav-settings-btn'} onClick={() => openMenu('settings')}/>
      </div>
    </div>
  )
};

export default Navbar;
