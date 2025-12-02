import { useState } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import HamburgerButton from './HamburgerButton';
import HamburgerLoggedIn from './HamburgerLoggedIn';
import HamburgerLoggedOut from './HamburgerLoggedOut';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { cn } from '@utils/cn';

const MENU = 'menu';

interface HamburgerProps {
  onOpenLogin: () => void;
}

const Hamburger = ({ onOpenLogin }: HamburgerProps) => {
  const { user } = useSupabaseAuth();
  
  const [menuValue, setMenuValue] = useState<string>('');

  const isMenuOpen = menuValue === MENU;
  const closeMenu = () => setMenuValue('');

  const handleOpenLogin = () => {
    onOpenLogin();
    closeMenu();
  };

  return (
    <NavigationMenu.Root
      value={menuValue}
      onValueChange={setMenuValue}
      className="relative flex items-center"
    >
      <NavigationMenu.List>
        <NavigationMenu.Item value={MENU}>
          <HamburgerButton
            onClick={() => setMenuValue(isMenuOpen ? '' : MENU)}
            isMenuOpen={isMenuOpen}
          />
          <NavigationMenu.Content
            className={cn(
              'absolute right-0 top-12 z-50 w-56 rounded-lg border border-gray-200 bg-white p-4 text-gray-800 shadow-lg transition data-[state=closed]:pointer-events-none data-[state=closed]:opacity-0 data-[state=open]:opacity-100'
            )}
          >
            {!user?.is_anonymous ? (
              <HamburgerLoggedIn closeMenu={closeMenu} onOpenLogin={onOpenLogin} />
            ) : (
              <HamburgerLoggedOut handleOpenLogin={handleOpenLogin} />
            )}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
};

export default Hamburger;
