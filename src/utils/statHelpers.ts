const formatTime = (seconds: number | null | undefined) => {
  if (!seconds || Number.isNaN(seconds)) {
    return "--";
  }

  const wholeSeconds = Math.max(0, Math.round(seconds));
  const mins = Math.floor(wholeSeconds / 60);
  const secs = wholeSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export { formatTime };