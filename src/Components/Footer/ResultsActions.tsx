import { useCurrentPuzzleAttempt } from "@/hooks/useCurrentPuzzleAttempt";
import { useUI } from "@/providers/UIProvider";
import { useSupabaseAuth } from "@/SupabaseProvider";
import { GameStatus } from "@/types/enums";
import { cn } from "@/utils/cn";

const ResultsActions = () => {
  const { toggleStats } = useUI();
  const { user } = useSupabaseAuth();
  const isLoggedIn = Boolean(user);

  const { data: currentPuzzleAttempt } = useCurrentPuzzleAttempt();

  const { openLogin } = useUI();

  const isGameOver = currentPuzzleAttempt?.status === GameStatus.Completed;

  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center justify-center transition-all duration-500",
        isGameOver
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <p>Come back tomorrow for another game</p>
      <div className="flex flex-row items-center justify-center gap-3 mt-2">
        <button
          type="button"
          onClick={toggleStats}
          className="rounded-full bg-blue-700 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-600"
        >
          See More Results
        </button>
        {!isLoggedIn && (
          <button
            type="button"
            onClick={openLogin}
            className="rounded-full bg-gray-600 px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-700"
          >
            Log in to save results
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsActions;
