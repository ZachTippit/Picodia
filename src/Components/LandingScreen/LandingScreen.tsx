import { motion } from "framer-motion";
import PreviewGrid from "./PreviewGrid";
import LandingContent from "./LandingContent";
import {
  contentSectionVariants,
  landingScreenVariants,
  previewVariants,
  titleVariants,
} from "@/animations";

const LandingScreen = () => {
  return (
    <motion.div
      className="absolute inset-0 z-20 flex flex-col items-center bg-gray-200"
      variants={landingScreenVariants}
      initial="visible"
      exit="exit"
    >
      <div className="relative flex h-full w-full max-w-sm flex-col items-center px-4 py-6 gap-y-12">
        <motion.h1
          className="mb-4 text-2xl"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          PICODIA
        </motion.h1>
        <motion.div
          className="w-full"
          variants={previewVariants}
          initial="hidden"
          animate="visible"
        >
          <PreviewGrid />
        </motion.div>
        <motion.div
          className="flex w-full flex-1"
          variants={contentSectionVariants}
          initial="hidden"
          animate="visible"
        >
          <LandingContent />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingScreen;
