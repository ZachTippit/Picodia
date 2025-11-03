import { use, useEffect, useRef, useState } from 'react';
import { GameContext } from '../GameContext';
import { cn } from '../lib/cn';
import { useSupabase, useSupabaseAuth } from '../SupabaseProvider';

interface NavbarProps {
  onShowHowTo?: () => void;
  onOpenLogin: () => void;
}

const Navbar = ({ onShowHowTo, onOpenLogin }: NavbarProps) => {
  const {
    state: { pingHowTo, darkMode },
    actions: { toggleStats },
  } = use(GameContext);
  const supabase = useSupabase();
  const { user } = useSupabaseAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!menuContainerRef.current) return;
      if (!menuContainerRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((previous) => !previous);
  };

  const handleOpenLogin = () => {
    onOpenLogin();
    closeMenu();
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Failed to sign out', error);
    } finally {
      setSigningOut(false);
      onOpenLogin();
      closeMenu();
    }
  };

  return (
    <div className="flex mt-4 px-4 py-2 w-full border border-t-0 border-x-0 border-b-gray-300 justify-between overflow-y-none">
      <button
        type="button"
        onClick={() => onShowHowTo?.()}
        aria-label="How to play"
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full border text-2xl font-semibold transition',
          pingHowTo && 'wobble-ver-right',
          darkMode
            ? 'border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-500'
            : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
        )}
      >
        ?
      </button>
      <h1 className="tracking-widest">PICODIA</h1>
      <div className="relative flex items-center" ref={menuContainerRef}>
        <button
          type="button"
          onClick={handleToggleMenu}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full border transition',
            darkMode
              ? 'border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-500'
              : 'border-gray-300 bg-white text-gray-800 hover:border-gray-400'
          )}
        >
          <span className="flex flex-col items-center justify-center gap-1">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
          {!user && (
            <span
              aria-hidden="true"
              className="absolute top-0 right-0 block size-2 rounded-full bg-red-600"
            />
          )}
        </button>
        {isMenuOpen && (
          <div
            className={cn(
              'absolute right-0 top-12 z-50 w-56 rounded-lg border p-4 shadow-lg transition',
              darkMode ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-800'
            )}
          >
            {user ? (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition',
                    darkMode
                      ? 'bg-gray-800 text-gray-100 hover:bg-gray-700 disabled:opacity-60'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200 disabled:opacity-60'
                  )}
                >
                  {signingOut ? 'Logging out…' : 'Log Out'}
                </button>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      toggleStats();
                      closeMenu();
                    }}
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-left text-sm font-medium transition',
                      darkMode
                        ? 'bg-gray-800 text-gray-100 hover:bg-gray-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    )}
                  >
                    Stats
                  </button>
                  <button
                    type="button"
                    disabled
                    className={cn(
                      'w-full rounded-md px-3 py-2 text-left text-sm font-medium opacity-60',
                      darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    Other Puzzles
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <p className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                  Log in to save and share your results!
                </p>
                <button
                  type="button"
                  onClick={handleOpenLogin}
                  className={cn(
                    'relative w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition',
                    darkMode ? 'bg-gray-800 text-gray-100 hover:bg-gray-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  )}
                >
                  Log In / Register
                  <span
                    aria-hidden="true"
                    className="absolute -top-0.5 -right-0.5 block size-2 rounded-full bg-red-600 animate-pulse duration-10000"
                  />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
