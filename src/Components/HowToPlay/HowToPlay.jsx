import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import ExampleGrid from './ExampleGrid';
import ExampleRow from './ExampleRow';
import LoseExampleRow from './LoseExampleRow';

import {default as Close} from '../../assets/close.png'
import {default as CloseDark} from '../../assets/close-dark.png'

const HowToPlay = ({closeMenu}) => {
  const isDarkMode = useSelector(state => state.gameConfig.isDarkMode)
  const isMobile = useSelector(state => state.windowHandler.isMobile)

  const [closing, setClosing] = useState(false);
  const [nextAnim, setNextAnim] = useState(0);

  const closeWindow = () => {
    setClosing(true)
    closeMenu('')
  }

  const onToNext = () => {
    setNextAnim(nextAnim + 1);
  }

  return (
    <div id={'about'} className={'fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ') + (closing && ' fade-out-bottom')}>
      <img className={'close-btn-about'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeWindow('')}/>
      <div className={'section-header'}>
        <h2 style={{fontSize: '1.25rem'}}>PICODIA RULES</h2>
        <p>Solve the <b>Nonogram</b> with less than 3 mistakes. You win if you complete puzzle correctly by filling in all of the correct cells.</p>
        <p><b>{isMobile ? 'Tap' : 'Click'}</b> to fill a cell. Mark up cells {!isMobile && '(you can also right-click or toggle on mobile)'} to help work your way through!</p>
        <p>Share your results to see how you stack up!</p>
        <h2 style={{margin: '0.75rem 0', padding: '1rem 0', fontSize: '1.25rem', textAlign: 'center'}}><b>HOW TO PLAY</b></h2>
      </div>
      <div className={'how-to-play'}>
        <Carousel  
          swipeable emulateTouch  
          autoPlay infiniteLoop interval={10000}
          showStatus={false} showIndicators={false} showThumbs={false}
          onChange={onToNext}
        >
          <div className='tutorial-tile'>
            <h3>The Basics</h3>
            <ExampleGrid nextStart={nextAnim} order={0} />
            <p className='about-desc'>Each row and column contains the hint for that row or column. The number on the borders are how many consecutive blocks there are.</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Reading the Clues</h3>
            <ExampleRow exClue={"5"} exArray={[1,1,1,1,1]} nextStart={nextAnim} order={1} />
            <p>Some clues are obvious and can be figured out from context (ex: 5 blocks long and a space between each number...)</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Consecutive Numbers</h3>
            <ExampleRow exClue={"4"} exArray={[1,1,1,1,'']} nextStart={nextAnim} order={2} />
            <ExampleRow exClue={"4"} exArray={['',1,1,1,1]} nextStart={nextAnim} order={2} />
            <p ><b>Careful!</b> Even if the numbers are consecutive, you must use the other clues to determine where it goes.</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Mind the gaps!</h3>
            <ExampleRow exClue={"2 2"} exArray={[1,1,'',1,1]} nextStart={nextAnim} order={3} />
            <p>Some clues are obvious and can be figured out from context (ex: "2 2" in a 5 block long row with a required space between each clue...)</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Inferring Empty Blocks</h3>
            <ExampleRow exClue={"2 1"} exArray={[1,1,'',1,'']} nextStart={nextAnim} order={4} />
            <ExampleRow exClue={"2 1"} exArray={[1,1,'','',1]} nextStart={nextAnim} order={4} />
            <ExampleRow exClue={"2 1"} exArray={['',1,1,'',1]} nextStart={nextAnim} order={4} />
            <p>If there is more than one number in the clue, there must be at least one empty block between them (but there could be more).</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Don't Forget to Mark Up!</h3>
            <ExampleRow exClue={"2 1"} exArray={[1,1,2,1,2]} nextStart={nextAnim} order={4} />
            <ExampleRow exClue={"2 1"} exArray={[1,1,2,2,1]} nextStart={nextAnim} order={4} />
            <ExampleRow exClue={"2 1"} exArray={[2,1,1,2,1]} nextStart={nextAnim} order={4} />
            <p>As you fill in cells, don't forget to mark the cells around them to help you solve the rest of the puzzle.</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Careful - Don't Lose!</h3>
            <LoseExampleRow exClue={"2"} exArray={[1,1,0,0,0]} nextStart={nextAnim} order={5} />
            <p><b>You only get one chance a day, so play carefully ;)</b> Don't lose all of your lives!</p>
          </div>
        </Carousel>
      </div>
      <div>
        <p style={{textAlign: 'center'}}><b>A new puzzle will be available each day!</b></p>
      </div>
    </div>
  )
};

export default HowToPlay;
