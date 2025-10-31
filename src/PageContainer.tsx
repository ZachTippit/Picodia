import { use, useEffect, useState } from 'react';
import { About, Footer, Game, Navbar, Settings, Stats } from './Components';
import Pings from './Pings';
import { handleLoseStats, handleWinStats, onGameOver, storageInit } from './lib/utilities';
import { GameContext } from './GameContext';
import { ProfileProbe } from './Components/ProfileProbe';
import { useGetPuzzles } from './hooks/useGetPuzzle';
import { cn } from './lib/cn';
import { useUser } from '@clerk/clerk-react';
import MobileNav from './Components/MobileNav';
import LandingScreen from './Components/LandingScreen';

const PageContainer = () => {
  const user = useUser();
  console.log("user in PageContainer:", user);
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
  const [showLandingScreen, setShowLandingScreen] = useState(true);

  const {data} = useGetPuzzles();
  console.log("puzzles data:", data);

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

  const handleLandingDismiss = () => {
    setShowLandingScreen(false);
  };
  
  return (
    <div className={cn("absolute top-0 right-0 left-0 bottom-0", darkMode ? 'dark-theme' : 'light-theme')}>
      {showLandingScreen && <LandingScreen onPlay={handleLandingDismiss} />}
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
        <Stats />
        <Settings version={"fart"} />
        <Game />
        <Footer />
      </div>
    </div>
  );
};

export default PageContainer;
