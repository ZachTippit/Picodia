import { useState, useEffect } from "react";
import { useCurrentPuzzleAttempt } from "./useCurrentPuzzleAttempt";

export const useElapsedTime = () => {
  const { data: attempt } = useCurrentPuzzleAttempt();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!attempt) return;

    const startAt = new Date(attempt.started_at).getTime();
    const isDone = attempt.status === "completed";

    const tick = () => {
      if (isDone) {
        return;
      }

      const now = Date.now();
      const delta = Math.floor((now - startAt) / 1000);

      setElapsed(delta);
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [attempt]);

  return elapsed;
};
