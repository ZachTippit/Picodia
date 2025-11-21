import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';
import Loading from './Loading';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { useUI } from '@/providers/UIProvider';
import WelcomeBackText from './WelcomeBackText';
import PlayButton from './PlayButton';

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' } as const,
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.25, ease: 'easeIn' } as const },
};

const LandingContent = () => {
  const { openLogin, openHowTo } = useUI();
  const { user, loading: userLoading } = useSupabaseAuth();

  const isUserAnonymous = user?.is_anonymous ?? true;

  const isContentLoading = userLoading;

  return (
    <AnimatePresence mode="wait">
      {isContentLoading ? (
        <Loading key="loading" />
      ) : (
        <motion.div
          key="content"
          className="flex w-full flex-col items-center gap-3 text-center"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex flex-col gap-1">
            <WelcomeBackText />
            <p className="text-sm text-gray-700">Solve the Nonogram</p>
            <p className="text-sm text-gray-700">Click play to start your day with a new puzzle!</p>
          </div>
          <PlayButton />
          {isUserAnonymous && (
            <Button onClick={openLogin} className="bg-blue-600 hover:bg-blue-700">
              Log In
            </Button>
          )}
          <Button onClick={openHowTo} className="bg-gray-600 hover:bg-gray-700">
            How to Play
          </Button>

          {/* <QuickStats /> */}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingContent;
