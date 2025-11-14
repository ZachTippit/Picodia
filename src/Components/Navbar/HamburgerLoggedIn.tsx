import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import MenuButton from './MenuButton';
import ResetPuzzleButton from './ResetPuzzleButton';
import { useSupabase } from '../../SupabaseProvider';
import { cn } from '@utils/cn';
import { useUI } from '@/providers/UIProvider';

interface HamburgerLoggedInProps {
  closeMenu: () => void;
  onOpenLogin: () => void;
}

const HamburgerLoggedIn = ({ closeMenu, onOpenLogin }: HamburgerLoggedInProps) => {
  const { toggleStats, toggleOtherPuzzles } = useUI();

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
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className={cn(
          'w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-60'
        )}
      >
        {signingOut ? 'Logging out…' : 'Log Out'}
      </button>
      <div className="flex flex-col gap-1">
        <MenuButton
          onClick={() => {
            toggleStats();
            closeMenu();
          }}
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Stats
        </MenuButton>
        <MenuButton
          onClick={() => {
            toggleOtherPuzzles();
            closeMenu();
          }}
          className="bg-gray-100 text-gray-800 hover:bg-gray-200"
        >
          Other Puzzles
        </MenuButton>
        <ResetPuzzleButton />
      </div>
    </div>
  );
};

export default HamburgerLoggedIn;
