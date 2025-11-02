// @ts-ignore
import { default as Question } from '../assets/question.png';
// @ts-ignore
import { default as Stats } from '../assets/graph.png';
// @ts-ignore
import { default as Settings } from '../assets/setting.png';
// @ts-ignore
import { default as QuestionDark } from '../assets/question-dark.png';
// @ts-ignore
import { default as StatsDark } from '../assets/graph-dark.png';
// @ts-ignore
import { default as SettingsDark } from '../assets/setting-dark.png';
import { use } from 'react';
import { GameContext } from '../GameContext';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';
import { cn } from '../lib/cn';

interface NavbarProps {
  onShowHowTo?: () => void;
}

const Navbar = ({ onShowHowTo }: NavbarProps) => {
  const { actions: { toggleStats, toggleSettings}, state: { pingHowTo, darkMode } } = use(GameContext);
  return (
    <div className="flex mt-4 px-4 py-2 w-full border border-t-0 border-x-0 border-b-gray-300 justify-between overflow-y-none">
      <img
        src={darkMode ? Question : QuestionDark}
        alt="About icon"
        className={cn("w-8", pingHowTo && 'wobble-ver-right')}
        onClick={() => onShowHowTo?.()}
      />
      <h1 className="tracking-widest">PICODIA</h1>
      <div className="flex items-center gap-x-4 md:gap-x-12">
        <img
          src={darkMode ? Stats : StatsDark}
          alt="Stats icon"
          onClick={toggleStats}
          className="w-8"
        />
        <img
          src={darkMode ? Settings : SettingsDark}
          alt="Settings icon"
          onClick={toggleSettings}
          className="w-8"
        />
        <SignedOut>
          <div className="nav-auth-controls">
            <SignInButton mode="modal">
              <button type="button" className="nav-auth-btn">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button type="button" className="nav-auth-btn">
                Sign up
              </button>
            </SignUpButton>
          </div>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </div>
  );
};

export default Navbar;
