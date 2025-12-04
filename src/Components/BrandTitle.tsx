import { motion } from "framer-motion";
import { useUI } from "@/providers/UIProvider";
import { cn } from "@utils/cn";

const BrandTitle = () => {
  const { showLandingScreen } = useUI();

  return (
    <motion.h1
      initial={{ opacity: 0, top: "20%", scale: 1 }}
      animate={{
        opacity: 1,
        top: showLandingScreen ? "15%" : 28,
        scale: showLandingScreen ? 1 : 0.85,
      }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 150,
        duration: showLandingScreen ? 0.75 : 0.5,
        delay: showLandingScreen ? 0.12 : 0,
      }}
      className={cn(
        "pointer-events-none fixed left-1/2 z-40 -translate-x-1/2 origin-center font-semibold tracking-[0.35em] text-gray-900",
        showLandingScreen ? "text-3xl md:text-4xl" : "text-lg md:text-xl"
      )}
    >
      PICODIA
    </motion.h1>
  );
};

export default BrandTitle;
