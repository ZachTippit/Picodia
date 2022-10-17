import { useState } from 'react';
import { useSelector } from 'react-redux'
import { Carousel } from 'react-responsive-carousel'
import "react-responsive-carousel/lib/styles/carousel.min.css";

import ExampleGrid from './ExampleGrid';
import ExampleRow from './ExampleRow';
import LoseExampleRow from './LoseExampleRow';

import {default as Close} from '../../assets/close.png'
import {default as CloseDark} from '../../assets/close-dark.png'
import { useEffect } from 'react';

const HowToPlay = ({closeMenu}) => {
  const isDarkMode = useSelector(state => state.gameConfig.isDarkMode)
  const isRBBlind = useSelector(state => state.gameConfig.isRBBlind)
  const isMobile = useSelector(state => state.windowHandler.isMobile)

  const [closing, setClosing] = useState(false);
  const [activeTutorial, setActiveTutorial] = useState(1)
  const [checked, setChecked] = useState(false)

  const closeWindow = () => {
    setClosing(true)
    closeMenu('')
  }

  const displayStatus = (curr, total) => {
    setActiveTutorial(curr)
  }

  useEffect(() => {
    if(activeTutorial===6){
      setTimeout(() => {
        setChecked(true)
      }, 2000)
    } else {
      setChecked(false)
    }
  }, [activeTutorial])

  return (
    <div id={'about'} className={'fade-in-bottom ' + (isDarkMode ? 'dark-theme ' : 'light-theme ') + (closing && ' fade-out-bottom')}>
      <img className={'close-btn-about'} src={(isDarkMode ? Close : CloseDark)} alt='Close settings window' onClick={() => closeWindow('')}/>
      <div className={'section-header'}>
        <h2 style={{fontSize: '1.25rem'}}>PICODIA RULES</h2>
        <p>Solve the <b>Nonogram</b> with less than 4 mistakes. You win if you complete puzzle correctly by filling in all of the correct cells.</p>
        <p><b>{isMobile ? 'Tap' : 'Click'}</b> to fill a cell. <b>Mark up</b> cells {!isMobile && '(you can also right-click or toggle on mobile)'} to help work your way through!</p>
        <p>Share your results to see how you stack up!</p>
        <h2 style={{margin: '0.25rem 0', padding: '1rem 0', fontSize: '1.25rem', textAlign: 'center'}}><b>HOW TO PLAY</b></h2>
      </div>
      <div className={'how-to-play'}>
        <Carousel  
          swipeable emulateTouch  
          autoPlay infiniteLoop interval={7500}
          showStatus={true} showIndicators={false} showArrows={true}
          swipeScrollTolerance={10}
          statusFormatter={(current, total) => displayStatus(current, total)}
        >
          <div className='tutorial-tile'>
            <h3>The Basics</h3>
            <ExampleGrid order={1} activeCard={activeTutorial}/>
            <p className='about-desc'>Each row and column contains the hint for that row or column. The number on the borders are how many consecutive blocks there are.</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Reading the Clues</h3>
            <ExampleRow exClue={"5"} exArray={[1,1,1,1,1]} order={2} activeCard={activeTutorial} />
            <p>Some clues are obvious and can be figured out from context (ex: 5 blocks long and a space between each number...)</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Consecutive Numbers</h3>
            <ExampleRow exClue={"4"} exArray={[1,1,1,1,'']} order={3} activeCard={activeTutorial} />
            <ExampleRow exClue={"4"} exArray={['',1,1,1,1]} order={3} activeCard={activeTutorial} />
            <p ><b>Careful!</b> Even if the numbers are consecutive, you must use the other clues to determine where it goes.</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Mind the gaps!</h3>
            <ExampleRow exClue={"2 2"} exArray={[1,1,'',1,1]} order={4} activeCard={activeTutorial} />
            <p>Some clues are obvious and can be figured out from context (ex: "2 2" in a 5 block long row with a required space between each clue...)</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Inferring Empty Blocks</h3>
            <ExampleRow exClue={"2 1"} exArray={[1,1,'',1,'']} order={5} activeCard={activeTutorial} />
            <ExampleRow exClue={"2 1"} exArray={[1,1,'','',1]} order={5} activeCard={activeTutorial} />
            <ExampleRow exClue={"2 1"} exArray={['',1,1,'',1]} order={5} activeCard={activeTutorial} />
            <p>If there is more than one number in the clue, there must be at least one empty block between them (but there could be more).</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Don't Forget to Mark Up!</h3>
            <ExampleRow exClue={"2 1"} exArray={[1,1,2,1,2]} order={6} activeCard={activeTutorial} checked={checked} />
            <ExampleRow exClue={"2 1"} exArray={[1,1,2,2,1]} order={6} activeCard={activeTutorial} checked={checked} />
            <label className=" tutorial-switch">
              <div class="button b2" id="button-11">
                  <input type="checkbox" class="checkbox" defaultChecked={false} checked={checked} activeCard={activeTutorial}/>
                  <div class={isRBBlind ? 'knobs cb ' : 'knobs'}><span></span></div>
                  <div class={isRBBlind ? 'layer cb-layer' : 'layer'}></div>
              </div>
            </label>
            <p>As you fill in cells, don't forget to mark the cells around them to help you solve the rest of the puzzle.</p>
          </div>
          <div className='tutorial-tile'>
            <h3>Careful - Don't Lose!</h3>
            <LoseExampleRow exClue={"2"} exArray={[1,1,0,0,0]} order={7} activeCard={activeTutorial}/>
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
