import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HowToPlayGrid from "./HowToPlayGrid";
import { useSupabaseAuth } from "../../SupabaseProvider";
import { cn } from "@utils/cn";
import { useUI } from "@/providers/UIProvider";
import { rules as baseRules } from "./rules";
import { overlayVariants, textVariants } from "@/animations";
import Button from "../LandingScreen/Button";
import LoginButton from "./LoginButton";

const HowToPlayView = () => {
  const { user } = useSupabaseAuth();
  const { closeHowTo } = useUI();
  const isLoggedIn = Boolean(user && user.is_anonymous === false);

  const rules = useMemo<HowToPlayRule[]>(() => {
    if (isLoggedIn) {
      return baseRules;
    }

    return [
      ...baseRules,
      {
        id: "rule-login",
        description: (
          <p>
            Don't forget to <strong>log in</strong> to save and share results!
          </p>
        ),
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
      <h1 className="mt-6.5 font-display text-3xl font-bold tracking-wider text-gray-900 md:text-4xl">
        PICODIA
      </h1>
      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 text-center">
        <div className="relative flex w-full max-w-xs items-center justify-center h-[220px]">
          <AnimatePresence mode="wait" initial={false}>
            {activeRuleData?.showLoginButton ? (
              <LoginButton />
            ) : (
              <motion.div
                key={activeRuleData?.id ?? activeRule}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <HowToPlayGrid activeRule={activeRule} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="relative flex h-24 w-full max-w-xs items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeRuleData?.id ?? activeRule}
              className="max-w-xs text-sm leading-snug text-gray-700 absolute inset-x-0 mx-auto"
              custom={direction}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {activeRuleData?.description}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handlePrevRule}
            disabled={activeRule === 0}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-gray-700 transition-all duration-300",
              activeRule === 0
                ? "cursor-not-allowed opacity-40"
                : "hover:bg-gray-200 cursor-pointer"
            )}
          >
            &larr;
          </button>
          <span className="text-xs font-display uppercase tracking-[0.3em] text-gray-600">
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
                : "cursor-pointer hover:bg-gray-200"
            )}
          >
            &rarr;
          </button>
        </div>
        <Button onClick={handleClose} className="border border-gray-900 text-gray-900">
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default HowToPlayView;
