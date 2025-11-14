import { overlayVariants } from "@/animations";
import { useUI } from "@/providers/UIProvider";
import { motion } from "framer-motion";

const Underlay = () => {
    const { toggleStats } = useUI();

  return (
    <motion.div
      className="absolute inset-0 bg-neutral-950/30"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      aria-hidden="true"
      onClick={toggleStats}
    />
  );
};

export default Underlay;
