import { AnimatePresence } from "framer-motion";
import { Footer, Game, Navbar, OtherPuzzles, Stats } from "./Components";
import LandingScreen from "./Components/LandingScreen/LandingScreen";
import HowToPlayView from "./Components/HowToPlay/HowToPlayView";
import LoginOverlay from "./Components/Auth/LoginOverlay";
import { useUI } from "./providers/UIProvider";
import { useDailyPuzzle } from "./hooks/useDailyPuzzle";
import { useClientBootstrap } from "./hooks/useClientBootstrap";
import { useCurrentPuzzleAttempt } from "./hooks/useCurrentPuzzleAttempt";

const PageContainer = () => {
  const { showLandingScreen, showHowTo } = useUI();

  const { data: clientBootstrap } = useClientBootstrap();
  const { data: puzzleAttempt } = useCurrentPuzzleAttempt();
  const { data: dailyPuzzle } = useDailyPuzzle();

  console.log("Client Bootstrap:", clientBootstrap);
  console.log("Current Puzzle Attempt:", puzzleAttempt);
  
  return (
    <div className="absolute top-0 right-0 left-0 bottom-0">
      <AnimatePresence>{showLandingScreen && <LandingScreen />}</AnimatePresence>
      <AnimatePresence>{showHowTo && <HowToPlayView />}</AnimatePresence>
      <LoginOverlay />
      {!showLandingScreen && (
        <div className="max-w-[450px] m-auto">
          <Navbar />
          <Stats />
          <OtherPuzzles />
          <Game />
          <Footer />
        </div>
      )}
    </div>
  );
};

export default PageContainer;
