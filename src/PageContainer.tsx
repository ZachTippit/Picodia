import { use, useEffect, useState } from 'react';
import { About, Footer, Game, Navbar, Settings, SolveToStart, Stats } from './Components';
import Pings from './Pings';
import { handleLoseStats, handleWinStats, onGameOver, storageInit } from './lib/utilities';
import { GameContext } from './GameContext';
import { ProfileProbe } from './Components/ProfileProbe';
import { useGetPuzzles } from './hooks/useGetPuzzle';
import { cn } from './lib/cn';
import Game2 from './Components/Game2/Game2';

const PageContainer = () => {
  const {
    state: { isGameStarted, didWin, lives, darkMode, hasPlayedToday },
    actions: { loseGame, toggleStats, toggleHasPlayedToday },
  } = use(GameContext);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [prevGameArray, setPrevGameArray] = useState<any>(localStorage.prevGameArray);
  const [prevOutcome, setPrevOutcome] = useState<any>();
  const [alert, setAlert] = useState<boolean>(false);
  const [goAlert, setGOAlert] = useState<boolean>(false);
  const [gameOverNote, setGameOverNote] = useState<string | false>(false);
  const [gameOverTime, setGameOverTime] = useState<number | undefined>();

  const {data} = useGetPuzzles();
  console.log("puzzles data:", data);
  // App initializer
  useEffect(() => {
    //// Google Analytics initializer on window
    // ReactGA.set({ page: window.location.pathname });
    // ReactGA.pageview(window.location.pathname);
    // console.log(initialState)

    localStorage.length === 0 && storageInit();

    // Will clear localStorage
    // localStorage.clear();
    // console.log('Initial localStorage load: ', localStorage)
  }, []);

  // PUZZLE REF FETCHER: Uses google sheets index to pick puzzle (this will create an API limit bottleneck in the future). Also used as daily counter
  useEffect(() => {
    if (data) {
      if (!isGameStarted && hasPlayedToday === localStorage.playedToday) {
        toggleHasPlayedToday();
        setPrevGameArray(JSON.parse(localStorage.prevGameArray));
        setPrevOutcome(localStorage.prevOutcome);
      }
    }
  }, [hasPlayedToday, isGameStarted]);

  const handleGameOver = (win: boolean, numLives: number) => {
    onGameOver(numLives, win, prevGameArray);
    if (win) {
      setGameOverNote(`Nice! It's a fart.`);
      handleWinStats(numLives);
    } else {
      setGameOverNote('Bummer...');
      handleLoseStats(numLives);
    }

    setGOAlert(true);
    setTimeout(() => {
      setGOAlert(false);
    }, 4000);

    setTimeout(() => {
      toggleStats();
    }, 2000);
  };

  const handlePrevGameArray = (answerArray: unknown) => {
    setPrevGameArray(answerArray);
  };

  // LIVES: Checks for running out of lives.
  useEffect(() => {
    if (lives === 0) {
      loseGame(); // REPLACE
      setGameOver(true);
    }
  }, [lives]);

  useEffect(() => {
    if (gameOver) {
      handleGameOver(didWin, lives);
    }
  }, [gameOver, didWin, lives]);

  const copyToClipboard = () => {
    const pad = (val: number) => {
      const valString = `${val}`;
      return valString.length < 2 ? `0${valString}` : valString;
    };
    const hearts = hasPlayedToday
      ? prevOutcome
        ? '❤️'.repeat(Number(localStorage.prevLives))
        : '🖤'
      : didWin
        ? '❤️'.repeat(lives)
        : '🖤';
    const prefaceText = '⏱';
    const gameTime = 0;
    const copyText = `Picodia #fart    ${hearts}    ${prefaceText}${pad(
      parseInt(String(gameTime / 60), 10)
    )}:${pad(Number(gameTime % 60))}`;
    navigator.clipboard.writeText(copyText);
    // alert(copyText);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 4000);
  };

  return (
    <div className={cn("absolute top-0 right-0 left-0 bottom-0", darkMode ? 'dark-theme' : 'light-theme')}>
      <div className={cn("max-w-[450px] m-auto", darkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar />
        <ProfileProbe />
        <Pings
          gameOverNote={gameOverNote}
          playedToday={hasPlayedToday}
          goAlert={goAlert}
          alert={alert}
          whatIsIt={"fart"}
        />
        <About />
        <Stats copyToClipboard={copyToClipboard} />
        <Settings version={"fart"} />
        <Game2 />
        {/* {isGameStarted ? <Game handlePrevGameArray={handlePrevGameArray} /> : <SolveToStart />} */}
        <Footer />
      </div>
    </div>
  );
};

export default PageContainer;
