import { createContext, useState, ReactNode, useCallback } from "react";

// 1️⃣ Define the shape of your context state
interface GameContextProps {
  state: {
    maxLives: number;
    lives: number;
    hasPlayedToday: boolean;
    elapsedSeconds: number;
  },
  actions: {
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
  const [maxLives, setMaxLives] = useState<number>(3);
  const [lives, setLives] = useState<number>(3);
  const [hasPlayedToday, setHasPlayedToday] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSecondsState] = useState<number>(0);

  const toggleHasPlayedToday = () => setHasPlayedToday(!hasPlayedToday);

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
      maxLives,
      lives,
      hasPlayedToday,
      elapsedSeconds,
    },
    actions: {
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
