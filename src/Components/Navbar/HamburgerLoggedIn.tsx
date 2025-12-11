import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import MenuButton from "./MenuButton";
import MenuLink from "./MenuLink";
import { useSupabase } from "../../SupabaseProvider";
import { cn } from "@utils/cn";
import { useUI } from "@/providers/UIProvider";
import { Bug, ChartNoAxesCombined, Info, Joystick, LogOut, UserRound } from "lucide-react";

interface HamburgerLoggedInProps {
  closeMenu: () => void;
  onOpenLogin: () => void;
}

const HamburgerLoggedIn = ({ closeMenu, onOpenLogin }: HamburgerLoggedInProps) => {
  const { toggleStats, toggleOtherPuzzles, toggleReportBug, toggleProfile } = useUI();

  const supabase = useSupabase();
  const queryClient = useQueryClient();

  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    let didSignOut = false;
    try {
      await supabase.auth.signOut();
      didSignOut = true;
    } catch (error) {
      console.error("Failed to sign out", error);
    } finally {
      if (didSignOut) {
        queryClient.removeQueries({ queryKey: ["profile"] });
        queryClient.removeQueries({ queryKey: ["profileStats"] });
        queryClient.removeQueries({ queryKey: ["profile-stats"] });
        queryClient.removeQueries({ queryKey: ["active-session"] });
        queryClient.removeQueries({ queryKey: ["recent-activity"] });
      }
      setSigningOut(false);
      onOpenLogin();
      closeMenu();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-y-1.5">
        <MenuLink to="/about" onClick={closeMenu}>
          <Info size={14} className="text-gray-800" />
          About Picodia
        </MenuLink>
        <MenuButton
          onClick={() => {
            toggleReportBug();
            closeMenu();
          }}
        >
          <Bug size={14} className="text-gray-800" />
          Report a Bug
        </MenuButton>
        <MenuButton
          onClick={() => {
            toggleProfile();
            closeMenu();
          }}
        >
          <UserRound size={14} className="text-gray-800" />
          Profile
        </MenuButton>
        <MenuButton
          onClick={() => {
            toggleStats();
            closeMenu();
          }}
        >
          <ChartNoAxesCombined size={14} className="text-gray-800" />
          <span>Stats</span>
        </MenuButton>
        <MenuButton
          onClick={() => {
            toggleOtherPuzzles();
            closeMenu();
          }}
        >
          <Joystick size={14} className="text-gray-800" />
          Other Puzzles
        </MenuButton>
      </div>
      <div className="border-t border-gray-300" />
      <MenuButton
        onClick={handleSignOut}
        disabled={signingOut}
        className={cn(signingOut && "opacity-50 cursor-not-allowed")}
      >
        <LogOut size={14} className="text-gray-800" />
        {signingOut ? "Logging out…" : "Log Out"}
      </MenuButton>
    </div>
  );
};

export default HamburgerLoggedIn;
