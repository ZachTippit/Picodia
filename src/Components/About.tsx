import { use, useEffect, useRef, useState } from 'react';
import ExampleRow from './ExampleRow';
import LoseExampleRow from './LoseExampleRow';
import ExampleGrid from './ExampleGrid';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

// @ts-ignore
import { default as Close } from '../assets/close.png';
// @ts-ignore
import { default as CloseDark } from '../assets/close-dark.png';
import { GameContext } from '../GameContext';
import { cn } from '../lib/cn';

const About = () => {
  const { 
    state: { showAbout, darkMode },
    actions: { toggleAbout } 
  } = use(GameContext);

  const [closing, setClosing] = useState(false);
  const [nextAnim, setNextAnim] = useState(0);
  const closeTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    if (showAbout) {
      setClosing(false);
    }
    return () => {
      if (!showAbout && closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [showAbout]);

  const closeWindow = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    setClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      toggleAbout();
      closeTimeoutRef.current = null;
    }, 300);
  };

  const onToNext = () => {
    setNextAnim(nextAnim + 1);
  };

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

  if(!showAbout) {
    return null;
  }

  return (
    <div
      className={
        cn("absolute top-0 z-10 min-h-[96vh] max-w-[450px] m-auto overflow-y-auto",
        "fade-in-bottom ",
        darkMode ? 'dark-theme ' : 'light-theme ',
        closing && ' fade-out-bottom'
      )}
      onAnimationEnd={() => setClosing(false)}
    >
      <img
        className="close-btn-about"
        src={darkMode ? Close : CloseDark}
        alt="Close settings window"
        onClick={closeWindow}
      />
      <div className="section-header">
        <h2 className="text-xl">PICODIA RULES</h2>
        <p>
          Solve the <b>Nonogram</b> with less than 3 mistakes. You win if you complete puzzle
          correctly by filling in all of the correct cells.
        </p>
        <p>
          <b>Click/Tap</b> to fill a cell. Mark cells (right-click or toggle on mobile) to help work
          your way through!
        </p>
        <p>Share your results to see how you stack up!</p>
        <h2 className="mx-3 my-0 px-4 py-0 text-xl text-center">
          <b>HOW TO PLAY</b>
        </h2>
      </div>
      <div className="how-to-play">
        <Carousel
          swipeable
          emulateTouch
          autoPlay
          infiniteLoop
          interval={10000}
          showStatus={false}
          showIndicators={false}
          onChange={onToNext}
        >
          <div>
            <h3>The Basics</h3>
            <ExampleGrid nextStart={nextAnim} order={0} />
            <p className="mt-0">
              Each row and column contains the hint for that row or column. The number on the
              borders are how many consecutive blocks there are.
            </p>
          </div>
          <div>
            <h3>Reading the Clues</h3>
            <ExampleRow exClue="5" exArray={[1, 1, 1, 1, 1]} nextStart={nextAnim} order={1} />
            <p className="mt-8">
              Some clues are obvious and can be figured out from context (ex: 5 blocks long and a
              space between each number...)
            </p>
          </div>
          <div>
            <h3>Consecutive Numbers</h3>
            <ExampleRow exClue="4" exArray={[1, 1, 1, 1, '']} nextStart={nextAnim} order={2} />
            <ExampleRow exClue="4" exArray={['', 1, 1, 1, 1]} nextStart={nextAnim} order={2} />
            <p className="mt-8">
              <b>Careful!</b> Even if the numbers are consecutive, you must use the other clues to
              determine where it goes.
            </p>
          </div>
          <div>
            <h3>Mind the gaps!</h3>
            <ExampleRow exClue="2 2" exArray={[1, 1, '', 1, 1]} nextStart={nextAnim} order={3} />
            <p className="mt-8">
              Some clues are obvious and can be figured out from context (ex: 5 blocks long and a
              space between each number...)
            </p>
          </div>
          <div>
            <h3>Inferring Empty Blocks</h3>
            <ExampleRow exClue="3 1" exArray={[1, 1, 1, '', 1]} nextStart={nextAnim} order={4} />
            <ExampleRow exClue="2 1" exArray={[1, 1, '', '', 1]} nextStart={nextAnim} order={4} />
            <p className="mt-8">
              If there is more than one number in the clue, there must be at least one empty block
              between them (but there could be more).
            </p>
          </div>
          <div>
            <h3>Careful - Don't Lose!</h3>
            <LoseExampleRow exClue="2" exArray={[1, 1, 0, 0, 0]} nextStart={nextAnim} order={5} />
            <p className="mt-8">
              <b>You only get one chance a day, so play carefully ;)</b> Don't lose all of your
              lives!
            </p>
          </div>
        </Carousel>
      </div>
      <div>
        <p className="text-center">
          <b>A new puzzle will be available each day!</b>
        </p>
      </div>
    </div>
  );
};

export default About;
