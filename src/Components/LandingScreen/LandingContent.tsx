import { AnimatePresence, motion } from "framer-motion";
import Button from "./Button";
import Loading from "./Loading";
import PreviewGrid from "./PreviewGrid";
import { useSupabaseAuth } from "../../SupabaseProvider";
import { useUI } from "@/providers/UIProvider";
import PlayButton from "./PlayButton";
import { useDailyPuzzle } from "@/hooks/useDailyPuzzle";
import { format } from "date-fns";
import StreakDisplay from "./StreakDisplay";

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" } as const,
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25, ease: "easeIn" } as const },
};

const buttonGroupVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", delay: 0.3 } as const,
  },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" } as const },
};

const infoGroupVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", delay: 0.6 } as const,
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.2, ease: "easeIn" } as const },
};

const LandingContent = () => {
  const { openLogin, openHowTo } = useUI();
  const { user, loading: userLoading } = useSupabaseAuth();
  const { data: dailyPuzzle } = useDailyPuzzle();
  console.log("User: ", user);

  const isUserAnonymous = user?.is_anonymous;
  const isContentLoading = userLoading;
  const puzzleNumber = dailyPuzzle?.day ?? dailyPuzzle?.id;

  const todaysDate = format(new Date(), "MMMM d, yyyy");

  return (
    <AnimatePresence mode="wait">
      {isContentLoading ? (
        <Loading key="loading" />
      ) : (
        <motion.div
          key="content"
          className="flex w-full max-w-[560px] flex-col items-center gap-4 text-center"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.h1
            className="font-display text-3xl font-bold tracking-wider text-gray-900 md:text-4xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            PICODIA
          </motion.h1>

          <PreviewGrid />

          <p className="font-display text-xl tracking-wide mb-4">Reveal the hidden picture with fewer than 3 mistakes.</p>

          <motion.div className="flex w-full flex-col items-center gap-3" variants={buttonGroupVariants}>
            <PlayButton />
            {isUserAnonymous && (
              <Button onClick={openLogin} className="border border-gray-900 text-gray-900">
                Log In
              </Button>
            )}
            <Button onClick={openHowTo} className="border border-gray-900 text-gray-900">
              How to Play
            </Button>
          </motion.div>

          <StreakDisplay />

          <motion.div
            className="flex flex-col items-center gap-0.5 text-xs text-gray-900 mt-8"
            variants={infoGroupVariants}
          >
            <span className="font-semibold">{todaysDate}</span>
            <span>No. {puzzleNumber ?? "—"}</span>
            <span>Created by Zach Tippit</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingContent;
