import { useUI } from "@/providers/UIProvider";
import { useSupabaseAuth } from "@/SupabaseProvider";
import { cn } from "@/utils/cn";
import { ChartNoAxesCombined, Joystick, Share } from "lucide-react";
import Button from "../LandingScreen/Button";

const ResultsActions = ({ isGameOver }: { isGameOver: boolean }) => {
  const { openLogin, toggleStats, toggleOtherPuzzles } = useUI();
  const { user } = useSupabaseAuth();

  const isAnonymous = user?.is_anonymous;

  const sharePicodia = () => {
    const shareData = {
      title: "Picodia",
      text: "Check out Picodia! A fun daily nonogram puzzle game.",
      url: "https://picodia.com",
    };

    if (navigator.share) {
      navigator.share(shareData).catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
    }
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden transition-[max-height] duration-500 ease-out",
        isGameOver ? "max-h-28" : "max-h-0"
      )}
      aria-hidden={!isGameOver}
    >
      <div
        className={cn(
          "flex flex-row items-center justify-center gap-12 transition-all duration-500",
          isGameOver ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <button
          type="button"
          onClick={sharePicodia}
          aria-label="How to play"
          className="flex size-16 items-center justify-center rounded-full border text-2xl font-semibold transition border-gray-300 bg-white text-gray-800 hover:border-gray-400 cursor-pointer"
        >
          <Share size={24} />
        </button>
        {isAnonymous ? (
          <Button onClick={openLogin} className="bg-white h-16 border border-gray-300 text-gray-800 hover:border-gray-400">
            Sign In
          </Button>
        ) : (
          <>
            <button
              type="button"
              onClick={toggleStats}
              aria-label="How to play"
              className="flex size-16 items-center justify-center rounded-full border text-2xl font-semibold transition border-gray-300 bg-white text-gray-800 hover:border-gray-400 cursor-pointer"
            >
              <ChartNoAxesCombined size={24} />
            </button>
            <button
              type="button"
              onClick={toggleOtherPuzzles}
              aria-label="How to play"
              className="flex size-16 items-center justify-center rounded-full border text-2xl font-semibold transition border-gray-300 bg-white text-gray-800 hover:border-gray-400 cursor-pointer"
            >
              <Joystick size={24} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResultsActions;
