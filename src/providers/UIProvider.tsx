import { createContext, useState, useMemo, use } from "react";

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showLandingScreen, setShowLandingScreen] = useState(true);
  const [showHowTo, setShowHowTo] = useState(false);

  const closeLandingScreen = () => {
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
    }),
    [showLandingScreen, showHowTo, showLogin]
  );
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => use(UIContext);
