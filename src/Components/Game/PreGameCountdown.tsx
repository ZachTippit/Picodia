import { useEffect, useState } from 'react';
import { useStartPuzzle } from '@hooks/useStartPuzzle';
import { AnimatePresence, motion } from 'framer-motion';
import { numberVariants, overlayVariants } from '@/animations';
import { useUI } from '@/providers/UIProvider';

const COUNTDOWN_STEP_DURATION = 1000;
const GO_DISPLAY_DURATION = 1200;
const COUNTDOWN_STEPS = ['3', '2', '1', 'GO!'] as const;

interface PreGameCountdownProps {
  setPuzzleVisible: (visible: boolean) => void;
}

const PreGameCountdown = ({ setPuzzleVisible }: PreGameCountdownProps) => {
  const { setShowCountdown } = useUI();
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(0);
  const { mutate: startPuzzle } = useStartPuzzle();
  const countdownValue = activeStepIndex !== null ? COUNTDOWN_STEPS[activeStepIndex] : null;
  
  useEffect(() => {
    setPuzzleVisible(false);
  }, [setPuzzleVisible]);

  useEffect(() => {
  if (countdownValue === 'GO!') {
    startPuzzle();   // <-- triggers DB update + invalidation
  }
}, [countdownValue]);

  useEffect(() => {
    if (activeStepIndex === null) {
      return;
    }

    const isFinalStep = activeStepIndex === COUNTDOWN_STEPS.length - 1;
    const timeout = window.setTimeout(() => {
      if (isFinalStep) {
        setActiveStepIndex(null);
        setPuzzleVisible(true);
        setShowCountdown(false);
      } else {
        setActiveStepIndex((prev) => (prev !== null ? prev + 1 : prev));
      }
    }, isFinalStep ? GO_DISPLAY_DURATION : COUNTDOWN_STEP_DURATION);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeStepIndex, setPuzzleVisible]);

  return (
    <AnimatePresence>
      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center text-gray-900 bg-white"
        variants={overlayVariants}
        initial="visible"
        exit="exit"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={countdownValue}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="text-6xl font-bold tracking-widest countdown-number"
          >
            {countdownValue}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreGameCountdown;
