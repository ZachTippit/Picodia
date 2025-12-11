import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import MenuButton from './MenuButton';
import ResetPuzzleButton from './ResetPuzzleButton';
import { useSupabase } from '../../SupabaseProvider';
import { cn } from '@utils/cn';
import { useUI } from '@/providers/UIProvider';
import { Bug, ChartNoAxesCombined, Joystick, LogIn, LogOut } from 'lucide-react';

interface HamburgerLoggedInProps {
  closeMenu: () => void;
  onOpenLogin: () => void;
}

const HamburgerLoggedIn = ({ closeMenu, onOpenLogin }: HamburgerLoggedInProps) => {
  const { toggleStats, toggleOtherPuzzles, toggleReportBug } = useUI();

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
      console.error('Failed to sign out', error);
    } finally {
      if (didSignOut) {
        queryClient.removeQueries({ queryKey: ['profile'] });
        queryClient.removeQueries({ queryKey: ['profile-stats'] });
        queryClient.removeQueries({ queryKey: ['active-session'] });
      }
      setSigningOut(false);
      onOpenLogin();
      closeMenu();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <MenuButton
        onClick={handleSignOut}
        disabled={signingOut}
        className={cn(
          "bg-gray-100 text-gray-800",
          signingOut && "opacity-50 cursor-not-allowed"
        )}
      >
        <LogOut size={14} className="text-gray-800" />
        {signingOut ? 'Logging out…' : 'Log Out'}
      </MenuButton>
      <div className="border-t border-gray-300" />
      <div className="flex flex-col gap-1">
        <MenuButton
          onClick={() => {
            toggleStats();
            closeMenu();
          }}
          className="bg-gray-100 text-gray-800"
        >
          <ChartNoAxesCombined size={14} className="text-gray-800" />
          <span>Stats</span>
        </MenuButton>
        <MenuButton
          onClick={() => {
            toggleOtherPuzzles();
            closeMenu();
          }}
          className="bg-gray-100 text-gray-800"
        >
          <Joystick size={14} className="text-gray-800" />
          Other Puzzles
        </MenuButton>
        <MenuButton
          onClick={() => {
            toggleReportBug();
            closeMenu();
          }}
          className="bg-gray-100 text-gray-800"
        >
          <Bug size={14} className="text-gray-800" />
          Report a Bug
        </MenuButton>
      </div>
    </div>
  );
};

export default HamburgerLoggedIn;
