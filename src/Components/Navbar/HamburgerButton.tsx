import { forwardRef } from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { useSupabaseAuth } from '../../SupabaseProvider';
import { cn } from '@utils/cn';

interface HamburgerButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  isMenuOpen: boolean;
}

const HamburgerButton = forwardRef<HTMLButtonElement, HamburgerButtonProps>(
  ({ isMenuOpen, className, onClick }) => {
    const { user } = useSupabaseAuth();
    return (
      <NavigationMenu.Trigger
        onPointerMove={(e) => e.preventDefault()}
        onPointerLeave={(e) => e.preventDefault()}
        asChild
      >
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={onClick}
          className={cn(
            'relative flex h-10 w-10 items-center justify-center rounded-full border transition border-gray-300 bg-white text-gray-800 hover:border-gray-400',
            className
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
      </NavigationMenu.Trigger>
    );
  }
);

HamburgerButton.displayName = 'HamburgerButton';

export default HamburgerButton;
