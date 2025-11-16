import { createContext, useState, ReactNode, useCallback } from "react";

// 1️⃣ Define the shape of your context state
interface GameContextProps {
  lives: number;
  hasPlayedToday: boolean;
  elapsedSeconds: number;
  loseLife: () => void;
  toggleHasPlayedToday: () => void;
  incrementElapsedSeconds: () => void;
  resetElapsedSeconds: () => void;
}

// 2️⃣ Create the context with a default (undefined to enforce provider use)
const GameContext = createContext<GameContextProps | undefined>(undefined);

// 3️⃣ Define the provider
export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [lives, setLives] = useState<number>(3);
  const [hasPlayedToday, setHasPlayedToday] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSecondsState] = useState<number>(0);

  const toggleHasPlayedToday = () => setHasPlayedToday(!hasPlayedToday);

  const loseLife = () => setLives(lives - 1);

  const incrementElapsedSeconds = useCallback(() => {
    setElapsedSecondsState((prev) => prev + 1);
  }, []);

  const resetElapsedSeconds = useCallback(() => {
    setElapsedSecondsState(0);
  }, []);

  const context = {
    lives,
    hasPlayedToday,
    elapsedSeconds,
    loseLife,
    toggleHasPlayedToday,
    incrementElapsedSeconds,
    resetElapsedSeconds,
  };
  return <GameContext.Provider value={context}>{children}</GameContext.Provider>;
};

export { GameContext };
