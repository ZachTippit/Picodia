import { createContext, useState, ReactNode, useCallback } from "react";

// 1️⃣ Define the shape of your context state
interface GameContextProps {
  state: {
    isOpen: boolean;
    isGameStarted: boolean;
    isCountdownActive: boolean;
    prevGameArray: any[];
    showAbout: boolean;
    showStats: boolean;
    showSettings: boolean;
    showOtherPuzzles: boolean;
    pingHowTo: boolean;
    startPing: boolean;
    maxLives: number;
    lives: number;
    hasPlayedToday: boolean;
    elapsedSeconds: number;
  },
  actions: {
    toggleOpen: () => void;
    startGame: () => void;
    beginCountdown: () => void;
    endCountdown: () => void;
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
    toggleHasPlayedToday: () => void;
    setElapsedSeconds: (value: number) => void;
    incrementElapsedSeconds: () => void;
    resetElapsedSeconds: () => void;
  }
}

// 2️⃣ Create the context with a default (undefined to enforce provider use)
const GameContext = createContext<GameContextProps | undefined>(undefined);

// 3️⃣ Define the provider
export const GameProvider = ({ children }: { children: ReactNode }) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isCountdownActive, setIsCountdownActive] = useState<boolean>(false);
  const [pingHowTo, setPingHowTo] = useState<boolean>(false);
  const [prevGameArray, setPrevGameArray] = useState<any[]>([]);
  const [startPing, setStartPing] = useState<boolean>(false);
  const [maxLives, setMaxLives] = useState<number>(3);
  const [lives, setLives] = useState<number>(3);
  const [showAbout, setShowAbout] = useState<boolean>(false);
  const [showStats, setShowStats] = useState<boolean>(false);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showOtherPuzzles, setShowOtherPuzzles] = useState<boolean>(false);
  const [hasPlayedToday, setHasPlayedToday] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSecondsState] = useState<number>(0);

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

  const context = {
    state: {
      isOpen,
      isGameStarted,
      isCountdownActive,
      prevGameArray,
      showAbout,
      showStats,
      showSettings,
      showOtherPuzzles,
      pingHowTo,
      startPing,
      maxLives,
      lives,
      hasPlayedToday,
      elapsedSeconds,
    },
    actions: {
      toggleOpen,
      startGame,
      beginCountdown,
      endCountdown,
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
      toggleHasPlayedToday,
      setElapsedSeconds,
      incrementElapsedSeconds,
      resetElapsedSeconds,
    }
  }
  return (
    <GameContext.Provider value={context}>
      {children}
    </GameContext.Provider>
  );
};

export { GameContext };
