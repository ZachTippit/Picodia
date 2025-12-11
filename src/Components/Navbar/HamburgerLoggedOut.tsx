import { cn } from "@utils/cn";
import { useUI } from "@/providers/UIProvider";
import MenuButton from "./MenuButton";
import { Bug, LogIn } from "lucide-react";

interface HamburgerLoggedOutProps {
  handleOpenLogin: () => void;
  closeMenu: () => void;
}

const HamburgerLoggedOut = ({ handleOpenLogin, closeMenu }: HamburgerLoggedOutProps) => {
  const { toggleReportBug } = useUI();

  return (
    <div className="flex flex-col gap-3">
      <p className={cn("text-sm text-gray-600")}>Log in to save and share your results!</p>

      <MenuButton onClick={handleOpenLogin} className="relative">
        <LogIn size={14} className="text-gray-800" />
        <span>Log In / Register</span>
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 block size-2 rounded-full bg-red-600 animate-pulse duration-10000"
        />
      </MenuButton>
      <div className="border-t border-gray-300" />
      <MenuButton
        onClick={() => {
          toggleReportBug();
          closeMenu();
        }}
      >
        <Bug size={14} className="text-gray-800" />
        Report a Bug
      </MenuButton>
    </div>
  );
};

export default HamburgerLoggedOut;
