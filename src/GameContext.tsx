import { createContext, useState, ReactNode, useCallback } from "react";

// 1️⃣ Define the shape of your context state
interface GameContextProps {
  state: {
    isOpen: boolean;
    isGameStarted: boolean;
    isCountdownActive: boolean;
    gameOver: boolean;
    prevGameArray: any[];
    showAbout: boolean;
    showStats: boolean;
    showSettings: boolean;
    showOtherPuzzles: boolean;
    pingHowTo: boolean;
    startPing: boolean;
    didWin?: boolean;
    maxLives: number;
    lives: number;
    markupMode: boolean;
    hardMode: boolean;
    darkMode: boolean;
    hasPlayedToday: boolean;
    elapsedSeconds: number;
    startMode: 'idle' | 'new' | 'continue' | 'results';
  },
  actions: {
    toggleOpen: () => void;
    startGame: () => void;
    beginCountdown: () => void;
    endCountdown: () => void;
    updateGameOver: (status: boolean) => void;
    updatePrevGameArray: (array: any[]) => void;
    toggleAbout: () => void;
    toggleStats: () => void;
    toggleSettings: () => void;
    toggleOtherPuzzles: () => void;
    setPingHowTo: (value: boolean) => void;
    setStartPing: (value: boolean) => void;
    setMaxLives: (value: number) => void;
    setLives: (value: number) => void;
    loseLife: () => void;
    winGame?: () => void;
    loseGame?: () => void;
    toggleMarkupMode: () => void;
    toggleHardMode: () => void;
    toggleDarkMode: () => void;
    toggleHasPlayedToday: () => void;
    setElapsedSeconds: (value: number) => void;
    incrementElapsedSeconds: () => void;
    resetElapsedSeconds: () => void;
    setStartMode: (mode: 'idle' | 'new' | 'continue' | 'results') => void;
  }
}

// 2️⃣ Create the context with a default (undefined to enforce provider use)
const GameContext = createContext<GameContextProps | undefined>(undefined);

// 3️⃣ Define the provider
export const GameProvider = ({ children }: { children: ReactNode }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [didWin, setDidWin] = useState<boolean>(false);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [pingHowTo, setPingHowTo] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [prevGameArray, setPrevGameArray] = useState<any[]>([]);
  const [startPing, setStartPing] = useState<boolean>(false);
  const [maxLives, setMaxLives] = useState<number>(3);
  const [lives, setLives] = useState<number>(3);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showOtherPuzzles, setShowOtherPuzzles] = useState<boolean>(false);
  const [markupMode, setMarkupMode] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [hardMode, setHardMode] = useState<boolean>(false);
  const [hasPlayedToday, setHasPlayedToday] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSecondsState] = useState<number>(0);
  const [startMode, setStartModeState] = useState<'idle' | 'new' | 'continue' | 'results'>('idle');

  const toggleHasPlayedToday = () => setHasPlayedToday(!hasPlayedToday);

  const toggleAbout = () => {
    setShowAbout(!showAbout);
    setIsOpen(!isOpen);
  }
  const toggleStats = () => {
    setShowStats(!showStats);
    setIsOpen(!isOpen);
  }
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    setIsOpen(!isOpen);
  }
  const toggleOtherPuzzles = () => {
    setShowOtherPuzzles(!showOtherPuzzles);
    setIsOpen(!isOpen);
  }
  const toggleOpen = () => setIsOpen(!isOpen);
  const toggleMarkupMode = () => setMarkupMode(!markupMode);
  const toggleDarkMode = () => setDarkMode(!darkMode);
  const updateGameOver = (status: boolean) => setGameOver(status);
  const updatePrevGameArray = useCallback((array: any[]) => {
    setPrevGameArray(array);
  }, [setPrevGameArray]);

  const beginCountdown = () => {
    setIsCountdownActive(true);
    setIsGameStarted(false);
    setStartPing(false);
  };

  const endCountdown = () => setIsCountdownActive(false);

  const startGame = () => {
    setIsGameStarted(true);
    setIsCountdownActive(false);
  };

  const loseLife = () => setLives(lives - 1);

  const setElapsedSeconds = useCallback((value: number) => {
    setElapsedSecondsState(value);
  }, []);

  const incrementElapsedSeconds = useCallback(() => {
    setElapsedSecondsState((prev) => prev + 1);
  }, []);

  const resetElapsedSeconds = useCallback(() => {
    setElapsedSecondsState(0);
  }, []);

  const setStartMode = useCallback((mode: 'idle' | 'new' | 'continue' | 'results') => {
    setStartModeState(mode);
  }, []);

  const winGame = () => {
    setDidWin(true)
    setGameOver(true);
  }

  const loseGame = () => {
    setDidWin(false)
    setGameOver(true);
  }
  
  const toggleHardMode = () => {
    // State sets async, so we set based on current hard mode value
    if(hardMode) {
      setMaxLives(3);
      setLives(3);
    } else {
      setMaxLives(1);
      setLives(1);
    }
    setHardMode(!hardMode);
  }

  const context = {
    state: {
      isOpen,
      isGameStarted,
      isCountdownActive,
      gameOver,
      prevGameArray,
      showAbout,
      showStats,
      showSettings,
      showOtherPuzzles,
      pingHowTo,
      startPing,
      maxLives,
      lives,
      didWin,
      markupMode,
      hardMode,
      darkMode,
      hasPlayedToday,
      elapsedSeconds,
      startMode,
    },
    actions: {
      toggleOpen,
      startGame,
      beginCountdown,
      endCountdown,
      updateGameOver,
      updatePrevGameArray,
      toggleAbout,
      toggleStats,
      toggleSettings,
      toggleOtherPuzzles,
      setPingHowTo,
      setStartPing,
      setMaxLives,
      setLives,
      loseLife,
      winGame,
      loseGame,
      toggleMarkupMode,
      toggleHardMode,
      toggleDarkMode,
      toggleHasPlayedToday,
      setElapsedSeconds,
      incrementElapsedSeconds,
      resetElapsedSeconds,
      setStartMode,
    }
  }
  return (
    <GameContext.Provider value={context}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext };
