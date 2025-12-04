import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Footer, Game, Navbar, OtherPuzzles, Stats } from "./Components";
import LandingScreen from "./Components/LandingScreen/LandingScreen";
import HowToPlayView from "./Components/HowToPlay/HowToPlayView";
import LoginOverlay from "./Components/Auth/LoginOverlay";
import { useUI } from "./providers/UIProvider";
import { useDailyPuzzle } from "./hooks/useDailyPuzzle";
import { useClientBootstrap } from "./hooks/useClientBootstrap";
import { useCurrentPuzzleAttempt } from "./hooks/useCurrentPuzzleAttempt";
import { useMergeAnonymousUser } from "./hooks/auth/useMergeAnonymousUser";
import BrandTitle from "./Components/BrandTitle";

const PageContainer = () => {
  const { showLandingScreen, showHowTo } = useUI();

  useClientBootstrap();
  useCurrentPuzzleAttempt();
  useDailyPuzzle();
  useMergeAnonymousUser();

  // console.log("Client bootstrap data:", data);
  // console.log("Current Puzzle Attempt:", currentPuzzleAttempt);

  return (
    <LayoutGroup>
      <div className="absolute top-0 right-0 left-0 bottom-0">
        <BrandTitle />
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
    </LayoutGroup>
  );
};

export default PageContainer;
