import { AnimatePresence, LayoutGroup } from "framer-motion";
import { Footer, Game, Navbar, OtherPuzzles, Stats } from "./Components";
import LandingScreen from "./Components/LandingScreen/LandingScreen";
import HowToPlayView from "./Components/HowToPlay/HowToPlayView";
import LoginOverlay from "./Components/Auth/LoginOverlay";
import ReportBugModal from "./Components/ReportBugModal";
import { useUI } from "./providers/UIProvider";
import { useDailyPuzzle } from "./hooks/useDailyPuzzle";
import { useCurrentPuzzleAttempt } from "./hooks/useCurrentPuzzleAttempt";
import { useMergeAnonymousUser } from "./hooks/auth/useMergeAnonymousUser";
import { useClientBootstrap } from "./hooks/useClientBootstrap";

const PageContainer = () => {
  const { showLandingScreen, showHowTo } = useUI();

  useClientBootstrap();
  useCurrentPuzzleAttempt();
  useDailyPuzzle();
  useMergeAnonymousUser();

  return (
    <LayoutGroup>
      <div className="absolute top-0 right-0 left-0 bottom-0">
        <AnimatePresence>{showLandingScreen && <LandingScreen />}</AnimatePresence>
        <AnimatePresence>{showHowTo && <HowToPlayView />}</AnimatePresence>
        <LoginOverlay />
        <Stats />
        <OtherPuzzles />
        <ReportBugModal />
        {!showLandingScreen && (
          <div className="m-auto flex flex-col h-full">
            <Navbar />
            <Game />
            <Footer />
          </div>
        )}
      </div>
    </LayoutGroup>
  );
};

export default PageContainer;
