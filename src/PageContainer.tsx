import { useState } from 'react';
import { Footer, Game, Navbar, OtherPuzzles, Stats } from './Components';
import LandingScreen from './Components/LandingScreen/LandingScreen';
import HowToPlayView from './Components/LandingScreen/HowToPlayView';
import LoginOverlay from './Components/LandingScreen/LoginOverlay';
import { cn } from '@utils/cn';

const PageContainer = () => {

  const [showLandingScreen, setShowLandingScreen] = useState(true);
  const [showHowTo, setShowHowTo] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

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
  
  return (
    <div className={cn("absolute top-0 right-0 left-0 bottom-0")}>
      {showLandingScreen && (
        <LandingScreen onPlay={handleLandingDismiss} onShowHowTo={openHowTo} onOpenLogin={openLogin} />
      )}
      {showHowTo && <HowToPlayView onClose={closeHowTo} onOpenLogin={openLogin} />}
      <LoginOverlay isOpen={showLogin} onClose={closeLogin} />
      <div className={cn("max-w-[450px] m-auto")}>
        <Navbar onShowHowTo={openHowTo} onOpenLogin={openLogin} />
        <Stats />
        <OtherPuzzles />
        <Game />
        <Footer onOpenLogin={openLogin} />
      </div>
    </div>
  );
};

export default PageContainer;
