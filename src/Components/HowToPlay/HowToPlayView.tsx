import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HowToPlayGrid from "./HowToPlayGrid";
import { useSupabaseAuth } from "../../SupabaseProvider";
import { cn } from "@utils/cn";
import { useUI } from "@/providers/UIProvider";
import { rules as baseRules, HowToPlayRule } from "./rules";
import { overlayVariants, textVariants } from "@/animations";

const HowToPlayView = () => {
  const { user } = useSupabaseAuth();
  const { openLogin, closeHowTo } = useUI();
  const isLoggedIn = Boolean(user);

  const rules = useMemo<HowToPlayRule[]>(() => {
    if (isLoggedIn) {
      return baseRules;
    }

    return [
      ...baseRules,
      {
        id: "rule-login",
        text: "Don't forget to log in to save and share results!",
        showLoginButton: true,
      },
    ];
  }, [isLoggedIn]);

  const [activeRule, setActiveRule] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  useEffect(() => {
    setActiveRule((prev) => Math.min(prev, rules.length - 1));
  }, [rules.length]);

  const handlePrevRule = () => {
    if (activeRule === 0) return;
    setDirection(-1);
    setActiveRule((prev) => Math.max(0, prev - 1));
  };

  const handleNextRule = () => {
    if (activeRule === rules.length - 1) return;
    setDirection(1);
    setActiveRule((prev) => Math.min(rules.length - 1, prev + 1));
  };

  const handleClose = () => {
    closeHowTo();
  };

  const activeRuleData = rules[activeRule];

  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center bg-gray-200 px-4 py-6"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <h1 className="mb-4 text-2xl">PICODIA</h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
        {activeRuleData?.showLoginButton ? (
          <button
          type="button"
          className="relative w-32 rounded-full bg-white px-4 py-2 text-gray-800 transition hover:bg-gray-300 border border-gray-800"
          onClick={openLogin}
          >
            Log In
            <span
              aria-hidden="true"
              className="absolute top-0.5 right-0.5 block size-2 rounded-full bg-red-600 animate-pulse"
            />
          </button>
        ) : (
          <HowToPlayGrid activeRule={activeRule} />
        )}
        <div className="relative flex min-h-12 w-full max-w-xs items-center justify-center">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.p
              key={activeRuleData?.id ?? activeRule}
              className="max-w-xs text-sm leading-snug text-gray-700"
              custom={direction}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {activeRuleData?.text}
            </motion.p>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePrevRule}
            disabled={activeRule === 0}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300",
              activeRule === 0 ? "cursor-not-allowed opacity-40" : "hover:bg-gray-200"
            )}
          >
            &larr;
          </button>
          <span className="text-xs uppercase tracking-[0.3em] text-gray-500">
            Hint {activeRule + 1}/{rules.length}
          </span>
          <button
            type="button"
            onClick={handleNextRule}
            disabled={activeRule === rules.length - 1}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300",
              activeRule === rules.length - 1
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-gray-200"
            )}
          >
            &rarr;
          </button>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="mt-6 w-32 rounded-full bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
};

export default HowToPlayView;
