import { motion } from 'framer-motion';

const loadingVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' } as const,
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.25, ease: 'easeIn' } as const,
  },
};

const Loading = () => {
  return (
    <motion.div
      className="flex w-full flex-1 items-center justify-center text-center max-h-64"
      variants={loadingVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="flex flex-col items-center gap-3 text-gray-600">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600" />
        <p className="text-sm font-medium">Loading today&apos;s puzzle…</p>
      </div>
    </motion.div>
  );
};

export default Loading;
