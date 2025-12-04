import { motion } from "framer-motion";
import PreviewGrid from "./PreviewGrid";
import LandingContent from "./LandingContent";
import {
  contentSectionVariants,
  landingScreenVariants,
  previewVariants,
} from "@/animations";

const LandingScreen = () => {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center bg-gray-200"
      variants={landingScreenVariants}
      initial="visible"
      exit="exit"
    >
      <div className="relative flex h-full w-full max-w-[520px] flex-col items-center justify-center gap-y-12 px-6 py-12 md:max-w-[560px]">
        <motion.div
          className="z-50 flex w-full justify-center"
          variants={previewVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <PreviewGrid />
        </motion.div>
        <motion.div
          className="relative z-10 flex w-full items-center justify-center"
          variants={contentSectionVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <LandingContent />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingScreen;
