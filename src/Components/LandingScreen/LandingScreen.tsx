import { motion } from "framer-motion";
import LandingContent from "./LandingContent";
import { landingScreenVariants } from "@/animations";

const LandingScreen = () => {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center bg-gray-200"
      variants={landingScreenVariants}
      initial="visible"
      exit="exit"
    >
      <div className="relative flex h-full w-full max-w-[560px] flex-col items-center justify-center px-6 py-12">
        <LandingContent />
      </div>
    </motion.div>
  );
};

export default LandingScreen;
