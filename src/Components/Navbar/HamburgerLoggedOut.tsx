import { cn } from '@utils/cn';

interface HamburgerLoggedOutProps {
  handleOpenLogin: () => void;
}

const HamburgerLoggedOut = ({ handleOpenLogin }: HamburgerLoggedOutProps) => {
  return (
    <div className="flex flex-col gap-3">
      <p className={cn('text-sm text-gray-600')}>Log in to save and share your results!</p>
      <button
        type="button"
        onClick={handleOpenLogin}
        className={cn(
          'relative w-full rounded-md px-3 py-2 text-left text-sm font-semibold transition bg-gray-100 text-gray-800 hover:bg-gray-200'
        )}
      >
        Log In / Register
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 block size-2 rounded-full bg-red-600 animate-pulse duration-10000"
        />
      </button>
    </div>
  );
};

export default HamburgerLoggedOut;
