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
    }, 2500)
}, [])

  useEffect(() => {
    setTimeout(() => {
        setNextAnim(nextAnim + 1)
    }, 6000)
  }, [nextAnim])

  return (
    <div id={'about'} className={'fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ') + (closing && 'fade-out-bottom')}>
      <img className={'close-btn-about'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeMenu('')}/>
      <div className={'section-header'}>
        <h3 className={'section-title'}>PICODIA RULES</h3>
        <p>Solve the <b>Nonogram</b> with less than 3 mistakes. You win if you complete puzzle correctly by filling in all of the correct cells.</p>
        <p><b>Click/Tap</b> to fill a cell. <b>Right Click</b> (coming soon to mobile) to annotate.</p>
        <p>Share your results to see how you stack up!</p>
      </div>
      <div className={'how-to-play'}>
        <h4 style={{margin: '0.75rem 0'}}><b>HOW TO PLAY</b></h4>
        <p style={{marginTop: '0'}}>Each row and column contains the hint for that row or column. The number is how many consecutive blocks there are.</p>
        <ExampleRow exClue={"5"} exArray={[1,1,1,1,1]} nextStart={nextAnim} order={0} onToNext={onToNext} isDarkMode={isDarkMode}/>
        <p>Some clues are obvious and can be figured out from context (ex: 5 blocks long and a space between each number...)</p>
        <ExampleRow exClue={"2 2"} exArray={[1,1,'',1,1]} nextStart={nextAnim} order={1} onToNext={onToNext} isDarkMode={isDarkMode}/>
        <p><b>Careful!</b> Even if the numbers are consecutive, you must use the other clues to determine where it goes.</p>
        <ExampleRow exClue={"4"} exArray={[1,1,1,1,'']} nextStart={nextAnim} order={2} onToNext={onToNext} isDarkMode={isDarkMode}/>
        {/* <p style={{width: '100%', textAlign: 'center'}}>or?</p> */}
        <ExampleRow exClue={"4"} exArray={['',1,1,1,1]} nextStart={nextAnim} order={2} onToNext={onToNext} isDarkMode={isDarkMode}/>
        <p>If there is more than one number in the clue, there must be at least one empty block between them (but there could be more).</p>
        <ExampleRow exClue={"2 " + " " + " 1"} exArray={[1,1,'',1,'']} nextStart={nextAnim} order={3} onToNext={onToNext} isDarkMode={isDarkMode}/>
        <ExampleRow exClue={"2 " + " " + " 1"} exArray={[1,1,'','',1]} nextStart={nextAnim} order={3} onToNext={onToNext} isDarkMode={isDarkMode}/>
        <p><b>You only get one chance a day, so play carefully ;)</b> Don't lose all of your lives!</p>
        <LoseExampleRow exClue={"2"} exArray={[1,1,0,0,0]} nextStart={nextAnim} order={4} onToNext={onToNext} isDarkMode={isDarkMode}/>
      </div>
      <div>
        <p style={{textAlign: 'center'}}><b>A new puzzle will be available each day!</b></p>
      </div>
    </div>
  )
};

export default About;
