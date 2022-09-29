import React, {useState, useEffect} from 'react';
import ExampleRow from './ExampleRow';
import {default as Close} from '../assets/close.png'
import {default as CloseDark} from '../assets/close-dark.png'
import LoseExampleRow from './LoseExampleRow';
import ExampleGrid from './ExampleGrid';
import { useSelector } from 'react-redux'
import { selectGameConfig } from '../features/gameConfig/gameConfigSlice';
import { selectClosing } from '../features/windowHandler/windowHandlerSlice';
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";

const About = ({closeMenu}) => {
  const isDarkMode = useSelector(selectGameConfig).isDarkMode

  const [closing, setClosing] = useState(false);
  const [nextAnim, setNextAnim] = useState(0);

  const closeWindow = () => {
    setClosing(true)
    closeMenu('')
  }

  const onToNext = () => {
    setNextAnim(nextAnim + 1);
  }

  // useEffect(() => {
  //   setTimeout(() => {
  //       setNextAnim(0)
  //   }, 2500)
  // }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //       setNextAnim(nextAnim + 1)
  //   }, 11000)
  // }, [nextAnim])

  return (
    <div id={'about'} className={'fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ') + (closing && ' fade-out-bottom')}>
      <img className={'close-btn-about'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeWindow('')}/>
      <div className={'section-header'}>
        <h2 style={{fontSize: '1.25rem'}}>PICODIA RULES</h2>
        <p>Solve the <b>Nonogram</b> with less than 3 mistakes. You win if you complete puzzle correctly by filling in all of the correct cells.</p>
        <p><b>Click/Tap</b> to fill a cell. Mark cells (right-click or toggle on mobile) to help work your way through!</p>
        <p>Share your results to see how you stack up!</p>
        <h2 style={{margin: '0.75rem 0', padding: '1rem 0', fontSize: '1.25rem', textAlign: 'center'}}><b>HOW TO PLAY</b></h2>
      </div>
      <div className={'how-to-play'}>
        <Carousel  
          swipeable emulateTouch  
          autoPlay infiniteLoop interval={10000}
          showStatus={false} showIndicators={false}
          onChange={onToNext}>
          <div>
            <h3>The Basics</h3>
            <ExampleGrid nextStart={nextAnim} order={0} />
            <p style={{marginTop: '0'}}>Each row and column contains the hint for that row or column. The number on the borders are how many consecutive blocks there are.</p>
          </div>
          <div>
            <h3>Reading the Clues</h3>
            <ExampleRow exClue={"5"} exArray={[1,1,1,1,1]} nextStart={nextAnim} order={1} />
            <p style={{marginTop: '2rem'}}>Some clues are obvious and can be figured out from context (ex: 5 blocks long and a space between each number...)</p>
          </div>
          <div>
            <h3>Consecutive Numbers</h3>
            <ExampleRow exClue={"4"} exArray={[1,1,1,1,'']} nextStart={nextAnim} order={2} />
            <ExampleRow exClue={"4"} exArray={['',1,1,1,1]} nextStart={nextAnim} order={2} />
            <p style={{marginTop: '2rem'}}><b>Careful!</b> Even if the numbers are consecutive, you must use the other clues to determine where it goes.</p>
          </div>
          <div>
            <h3>Mind the gaps!</h3>
            <ExampleRow exClue={"2 2"} exArray={[1,1,'',1,1]} nextStart={nextAnim} order={3} />
            <p style={{marginTop: '2rem'}}>Some clues are obvious and can be figured out from context (ex: 5 blocks long and a space between each number...)</p>
          </div>
          <div>
            <h3>Inferring Empty Blocks</h3>
            <ExampleRow exClue={"3 1"} exArray={[1,1,1,'',1]} nextStart={nextAnim} order={4} />
            <ExampleRow exClue={"2 1"} exArray={[1,1,'','',1]} nextStart={nextAnim} order={4} />
            <p style={{marginTop: '2rem'}}>If there is more than one number in the clue, there must be at least one empty block between them (but there could be more).</p>
          </div>
          <div>
            <h3>Careful - Don't Lose!</h3>
            <LoseExampleRow exClue={"2"} exArray={[1,1,0,0,0]} nextStart={nextAnim} order={5} />
            <p style={{marginTop: '2rem'}}><b>You only get one chance a day, so play carefully ;)</b> Don't lose all of your lives!</p>
          </div>
        </Carousel>
      </div>
      <div>
        <p style={{textAlign: 'center'}}><b>A new puzzle will be available each day!</b></p>
      </div>
    </div>
  )
};

export default About;
