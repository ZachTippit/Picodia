import { useState, useEffect } from "react";
import { useCurrentPuzzleAttempt } from "./useCurrentPuzzleAttempt";

export const useElapsedTime = () => {
  const { data: attempt } = useCurrentPuzzleAttempt();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // No attempt? Nothing to track.
    if (!attempt) {
      setElapsed(0);
      return;
    }

    const startAtMs = new Date(attempt.started_at).getTime();
    const baseElapsed = attempt.elapsed_seconds ?? 0;

    // If it's already completed, just lock in the final time
    if (attempt.status === "completed") {
      setElapsed(baseElapsed);
      return;
    }

    const tick = () => {
      const now = Date.now();
      const delta = Math.floor((now - startAtMs) / 1000);
      setElapsed(baseElapsed + delta);
    };

    // Do an immediate tick so UI updates without waiting 1s
    tick();

    const id = window.setInterval(tick, 1000);

    // Cleanup whenever attempt changes or component unmounts
    return () => {
      clearInterval(id);
    };
  }, [
    attempt?.id,
    attempt?.started_at,
    attempt?.status,
    attempt?.elapsed_seconds,
  ]);

  return elapsed;
};
