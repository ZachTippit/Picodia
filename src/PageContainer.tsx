import { useState } from 'react';
import { Footer, Game, Navbar, OtherPuzzles, Stats } from './Components';
import LandingScreen from './Components/LandingScreen/LandingScreen';
import HowToPlayView from './Components/LandingScreen/HowToPlayView';
import LoginOverlay from './Components/LandingScreen/LoginOverlay';
import { useUI } from './providers/UIProvider';

const PageContainer = () => {

  const { showLandingScreen, showHowTo } = useUI();
  
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0">
      {showLandingScreen && (
        <LandingScreen />
      )}
      {showHowTo && <HowToPlayView />}
      <LoginOverlay />
      <div className="max-w-[450px] m-auto">
        <Navbar />
        <Stats />
        <OtherPuzzles />
        <Game />
        <Footer />
      </div>
    </div>
  );
};

export default PageContainer;
