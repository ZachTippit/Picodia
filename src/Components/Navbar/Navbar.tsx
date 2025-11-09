import { useUI } from "@/providers/UIProvider";
import Hamburger from "./Hamburger";
import { cn } from "@utils/cn";

const Navbar = () => {
  const { openLogin, openHowTo } = useUI();

  return (
    <div className="flex mt-4 px-4 py-2 w-full border border-t-0 border-x-0 border-b-gray-300 justify-between overflow-y-none">
      <button
        type="button"
        onClick={openHowTo}
        aria-label="How to play"
        className="flex h-10 w-10 items-center justify-center rounded-full border text-2xl font-semibold transition border-gray-300 bg-white text-gray-800 hover:border-gray-400"
      >
        ?
      </button>
      <h1 className="tracking-widest">PICODIA</h1>
      <Hamburger onOpenLogin={openLogin} />
    </div>
  );
};

export default Navbar;
