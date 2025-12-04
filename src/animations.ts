const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const panelVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 26 } as const,
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.97,
    transition: { duration: 0.2 },
  },
};

const textVariants = {
  initial: (direction: 1 | -1) => ({
    x: direction > 0 ? 40 : -40,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? -40 : 40,
    opacity: 0,
  }),
};

const landingScreenVariants = {
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } } as const,
  exit: {
    opacity: 0,
    pointerEvents: "none",
    transition: { duration: 0.5, ease: "easeInOut", when: "afterChildren" },
  } as const,
};

const titleVariants = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut", delay: 0.25 } as const,
  },
};

const previewVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 0.625 } as const,
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.96,
    transition: { duration: 0.28, ease: "easeInOut" } as const,
  },
};

const contentSectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut", delay: 1 } as const,
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: { duration: 0.3, ease: "easeInOut", delay: 0.12 } as const,
  },
};

const numberVariants = {
  initial: { opacity: 0, y: 20, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: "easeOut" } as const },
  exit: { opacity: 0, y: -20, scale: 0.8, transition: { duration: 0.2, ease: "easeIn" } as const },
};

const gridVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" } as const,
  },
};

const cellVariants = {
  idle: { scale: 1, opacity: 1 },
  filled: { scale: 0.94, opacity: 1 },
  incorrect: { scale: 0.94, opacity: 0.8 },
};

export {
  overlayVariants,
  panelVariants,
  textVariants,
  landingScreenVariants,
  titleVariants,
  previewVariants,
  contentSectionVariants,
  numberVariants,
  gridVariants,
  cellVariants,
};
