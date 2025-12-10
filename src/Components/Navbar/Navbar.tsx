import { useUI } from "@/providers/UIProvider";
import Hamburger from "./Hamburger";

const Navbar = () => {
  const { openLogin, openHowTo } = useUI();

  return (
    <div className="flex pb-4 pt-4 w-full border border-t-0 border-x-0 border-b-gray-300 justify-between overflow-y-none bg-gray-200">
      <div className="px-4 max-w-[450px] w-full flex items-center justify-between mx-auto">
        <button
          type="button"
          onClick={openHowTo}
          aria-label="How to play"
          className="flex h-10 w-10 items-center justify-center rounded-full border text-2xl font-semibold transition border-gray-300 bg-white text-gray-800 hover:border-gray-400 cursor-pointer"
        >
          ?
        </button>
        <h1 className="font-display text-3xl font-bold tracking-wider text-gray-900 md:text-4xl">
          PICODIA
        </h1>
        <Hamburger onOpenLogin={openLogin} />
      </div>
    </div>
  );
};

export default Navbar;
