import { use, useEffect, useMemo, useState } from 'react';
import { About, Footer, Game, Navbar, Settings, Stats } from './Components';
import Pings from './Pings';
import { handleLoseStats, handleWinStats, onGameOver } from './lib/utilities';
import { GameContext } from './GameContext';
import { ProfileProbe } from './Components/ProfileProbe';
import { useGetPuzzles } from './hooks/useGetPuzzle';
import { cn } from './lib/cn';
import LandingScreen from './Components/LandingScreen/LandingScreen';
import HowToPlayView from './Components/LandingScreen/HowToPlayView';
import LoginOverlay from './Components/LandingScreen/LoginOverlay';
import { useSupabaseAuth } from './SupabaseProvider';
import { useCompletePuzzle } from './hooks/useProfile';

const PageContainer = () => {
  const {
    state: { isGameStarted, didWin, lives, darkMode, hasPlayedToday, startMode, elapsedSeconds },
    actions: { loseGame, toggleHasPlayedToday },
  } = use(GameContext);

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [prevGameArray, setPrevGameArray] = useState<any>(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    const stored = localStorage.getItem('prevGameArray');
    if (!stored) {
      return [];
    }
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  });
  const [alert, setAlert] = useState<boolean>(false);
  const [goAlert, setGOAlert] = useState<boolean>(false);
  const [gameOverNote, setGameOverNote] = useState<string | false>(false);
  const [showLandingScreen, setShowLandingScreen] = useState(true);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [shouldSyncLocalResult, setShouldSyncLocalResult] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('pendingResultSync') === 'true';
  });

  const { user } = useSupabaseAuth();
  const completePuzzle = useCompletePuzzle();

  const { data } = useGetPuzzles();
  console.log("puzzles data:", data);

  useEffect(() => {
    if (data) {
      if (!isGameStarted && hasPlayedToday === localStorage.playedToday) {
        toggleHasPlayedToday();
        const storedPrevArray = localStorage.getItem('prevGameArray');
        if (storedPrevArray) {
          try {
            setPrevGameArray(JSON.parse(storedPrevArray));
          } catch {
            setPrevGameArray([]);
          }
        }
      }
    }
  }, [hasPlayedToday, isGameStarted]);

  const handleGameOver = (win: boolean, numLives: number) => {
    onGameOver(numLives, win, prevGameArray);
    const elapsed = Number.isFinite(elapsedSeconds) ? elapsedSeconds : 0;
    localStorage.setItem('prevTime', String(elapsed));

    if (win) {
      setGameOverNote(`Nice! It's a fart.`);
      handleWinStats(numLives);
    } else {
      setGameOverNote('Bummer...');
      handleLoseStats(numLives);
    }

    const storedProgress = localStorage.getItem('prevGameArray');
    if (storedProgress) {
      try {
        setPrevGameArray(JSON.parse(storedProgress));
      } catch {
        setPrevGameArray([]);
      }
    }

    if (!user) {
      localStorage.setItem('pendingResultSync', 'true');
      setShouldSyncLocalResult(true);
    } else {
      localStorage.removeItem('pendingResultSync');
      setShouldSyncLocalResult(false);
    }

    setGOAlert(true);
    setTimeout(() => {
      setGOAlert(false);
    }, 4000);
  };

  // LIVES: Checks for running out of lives.
  useEffect(() => {
    if (lives === 0) {
      loseGame(); // REPLACE
      setGameOver(true);
    }
  }, [lives]);

  useEffect(() => {
    if (gameOver && startMode !== 'results') {
      handleGameOver(didWin, lives);
    }
  }, [gameOver, didWin, lives, startMode]);

  const handleLandingDismiss = () => {
    setShowLandingScreen(false);
  };

  const openHowTo = () => {
    setShowHowTo(true);
  };

  const closeHowTo = () => {
    setShowHowTo(false);
  };

  const openLogin = () => {
    setShowLogin(true);
  };

  const closeLogin = () => {
    setShowLogin(false);
  };

  const openLoginForResults = () => {
    localStorage.setItem('pendingResultSync', 'true');
    setShouldSyncLocalResult(true);
    setShowLogin(true);
  };

  const activePuzzleId = useMemo(() => data?.[0]?.id ?? null, [data]);

  useEffect(() => {
    if (user && localStorage.getItem('pendingResultSync') === 'true') {
      setShouldSyncLocalResult(true);
    }
  }, [user]);

  useEffect(() => {
    if (!shouldSyncLocalResult || !user || !activePuzzleId || completePuzzle.isPending) {
      return;
    }

    const rawOutcome = localStorage.getItem('prevOutcome');
    const rawLives = localStorage.getItem('prevLives');
    const rawElapsed = localStorage.getItem('prevTime');

    if (!rawOutcome) {
      setShouldSyncLocalResult(false);
      localStorage.removeItem('pendingResultSync');
      return;
    }

    let progress: unknown = prevGameArray ?? null;
    const rawProgress = localStorage.getItem('prevGameArray');
    if (rawProgress) {
      try {
        progress = JSON.parse(rawProgress);
      } catch (error) {
        console.error('Unable to parse previous game progress for saving results.', error);
      }
    }

    const outcome = rawOutcome === 'true' || rawOutcome === true ? 'win' : 'loss';
    const parsedLives = Number.parseInt(rawLives ?? '', 10);
    const livesRemaining = Number.isFinite(parsedLives) ? parsedLives : null;
    const parsedElapsed = Number.parseInt(rawElapsed ?? '', 10);
    const elapsed = Number.isFinite(parsedElapsed) ? parsedElapsed : null;

    completePuzzle.mutate(
      {
        puzzleId: activePuzzleId,
        outcome,
        progress,
        livesRemaining: livesRemaining ?? 0,
        elapsedSeconds: elapsed ?? 0,
      },
      {
        onSuccess: () => {
          setShouldSyncLocalResult(false);
          localStorage.removeItem('pendingResultSync');
        },
        onError: (error) => {
          console.error('Failed to sync local results', error);
          setShouldSyncLocalResult(false);
        },
      }
    );
  }, [activePuzzleId, completePuzzle, prevGameArray, shouldSyncLocalResult, user]);
  
  return (
    <div className={cn("absolute top-0 right-0 left-0 bottom-0", darkMode ? 'dark-theme' : 'light-theme')}>
      {showLandingScreen && (
        <LandingScreen onPlay={handleLandingDismiss} onShowHowTo={openHowTo} onOpenLogin={openLogin} />
      )}
      {showHowTo && <HowToPlayView onClose={closeHowTo} onOpenLogin={openLogin} isLoggedIn={Boolean(user)} />}
      <LoginOverlay isOpen={showLogin} onClose={closeLogin} />
      <div className={cn("max-w-[450px] m-auto", darkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar onShowHowTo={openHowTo} onOpenLogin={openLogin} />
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
        <Footer onOpenLogin={openLogin} onOpenLoginForResults={openLoginForResults} />
      </div>
    </div>
  );
};

export default PageContainer;
