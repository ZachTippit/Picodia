import { createContext, useState, useMemo, use } from "react";
import posthog from "posthog-js";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [showLandingScreen, setShowLandingScreen] = useState<boolean>(true);
  const [showHowTo, setShowHowTo] = useState<boolean>(false);
  const [ showStats, setShowStats ] = useState<boolean>(false);
  const [ showOtherPuzzles, setShowOtherPuzzles ] = useState<boolean>(false);
  const [ showCountdown, setShowCountdown ] = useState<boolean>(false);

  const closeLandingScreen = () => {
    setShowLandingScreen(false);
  };

  const openHowTo = () => {
    posthog.capture("open_how_to", { property: "opened"});
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

  const toggleStats = () => {
    setShowStats(!showStats);
    console.log('Toggling stats:', !showStats);
  }

  const toggleOtherPuzzles = () => {
    setShowOtherPuzzles(!showOtherPuzzles);
  };

  const value = useMemo(
    () => ({
      showLandingScreen,
      closeLandingScreen,
      showHowTo,
      openHowTo,
      closeHowTo,
      showLogin,
      openLogin,
      closeLogin,
      showStats,
      toggleStats,
      showOtherPuzzles,
      toggleOtherPuzzles,
      showCountdown,
      setShowCountdown,
    }),
    [showLandingScreen, showHowTo, showLogin, showStats, showOtherPuzzles, showCountdown]
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => use(UIContext);
