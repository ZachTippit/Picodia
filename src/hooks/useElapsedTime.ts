import { useState, useEffect } from "react";

export const useElapsedTime = (attempt) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!attempt) return;

    const baseElapsed = attempt.elapsed_seconds ?? 0;
    const startAt = new Date(attempt.started_at).getTime();
    const isDone = attempt.status === "completed";

    const tick = () => {
      if (isDone) {
        setElapsed(baseElapsed);
        return;
      }

      const now = Date.now();
      const delta = Math.floor((now - startAt) / 1000);

      setElapsed(baseElapsed + delta);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [attempt]);

  return elapsed;
};
