import React from 'react';
import './styles.css';
import {default as Close} from '../assets/close.png'

const About = ({closeMenu}) => {
  return (
    <div id={'about'}>
      <img className={'close-btn-about'} src={Close} alt='Close settings window' onClick={() => closeMenu()}/>
      <div className={'section-header'}>
        <h3 className={'section-title'}>HOW TO PLAY</h3>
        <p>Try to solve the number puzzle with less than 3 mistakes.</p>
        <p>Each row and column lists the hints for that row or column. Click and drag with a mouse (on desktop) or touch (on mobile).</p>
      </div>
      <div className={'how-to-play'}>
        <h5><b>Examples</b></h5>
        <p>5 | OOOOO</p>
        <p>This one works.</p>
        <p>2 2 | OOXOO</p>
        <p>This one also works.</p>
        <p>4 | OOXOO</p>
        <p>This one is wrong! It should be 4 in a row.</p>
        <p>3 1 | OOOOX</p>
        <p>This one is also wrong! There must be a space in between clues (3 space 1)</p>
        <p> 1 | XXXOX</p>
        <p>This one <i>could</i> be right depending on the clues around it. You'll have to figure it out :)</p>
      </div>
      <div>
        <p><b>A new Picodia will be available each day!</b></p>
      </div>
    </div>
  )
};

export default About;
