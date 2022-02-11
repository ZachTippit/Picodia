import React, {useState, useEffect} from 'react';
import ExampleRow from './ExampleRow';
import './styles.css';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import { Grid } from '@mui/material';
import LoseExampleRow from './LoseExampleRow';

const About = ({closeMenu, isDarkMode, closing}) => {

  const [nextAnim, setNextAnim] = useState(0);

  const onToNext = () => {
    setNextAnim(nextAnim + 1);
  }

  useEffect(() => {
    setTimeout(() => {
        setNextAnim(0)
    }, 1000)
}, [])

  useEffect(() => {
    setTimeout(() => {
        setNextAnim(nextAnim + 1)
    }, 2000)
  }, [nextAnim])

  return (
    <div id={'about'} className={'fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ') + (closing && 'fade-out-bottom')}>
      <img className={'close-btn-about'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeMenu('')}/>
      <div className={'section-header'}>
        <h3 className={'section-title'}>WELCOME TO PICODIA</h3>
        <p>Solve the <b>Nonogram</b> with less than 3 mistakes.</p>
        <p><b>Click/Tap</b> to fill a cell. <b>Right Click</b> (change inputs on mobile) to annotate.</p>
        <p>Share your results to see how you stack up!</p>
      </div>
      <div className={'how-to-play'}>
        <h5><b>HOW TO PLAY</b></h5>
        <p>Each row and column contains the hint for that row or column. The number is how many consecutive blocks there are.</p>
        <ExampleRow exClue={"5"} exArray={[1,1,1,1,1]} nextStart={nextAnim} order={0} onToNext={onToNext}/>
        <p>If there is more than one number, there must be an empty block between them.</p>
        <ExampleRow exClue={"2 " + " " + " 2"} exArray={[1,1,'',1,1]} nextStart={nextAnim} order={1} onToNext={onToNext}/>
        <p>Careful! Even if the numbers are consecutive, you must use the other clues to determine where it goes.</p>
        <ExampleRow exClue={"4"} exArray={[1,1,1,1,'']} nextStart={nextAnim} order={2} onToNext={onToNext}/>
        <ExampleRow exClue={"4"} exArray={['',1,1,1,1]} nextStart={nextAnim} order={2} onToNext={onToNext}/>
        <p>You only get once chance a day, so play carefully ;) Don't lose all of your lives!</p>
        <LoseExampleRow exClue={"1"} exArray={[0,0,0,'','']} nextStart={nextAnim} order={3} onToNext={onToNext}/>
      </div>
      <div>
        <p style={{textAlign: 'center'}}><b>A new puzzle will be available each day!</b></p>
      </div>
    </div>
  )
};

export default About;
