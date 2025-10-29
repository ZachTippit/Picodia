import { use, useEffect, useRef, useState } from 'react';
import './slider.css';
// @ts-ignore
import { default as Close } from '../assets/close.png';
// @ts-ignore
import { default as CloseDark } from '../assets/close-dark.png';
import { GameContext } from '../GameContext';
import { cn } from '../lib/cn';

interface SettingsProps {
  version: string;
}

const Settings = ({ version }: SettingsProps ) => {
  const { 
    state: { showSettings, darkMode, hardMode },
    actions: { toggleSettings, toggleHardMode, toggleDarkMode, toggleOpen } 
  } = use(GameContext);

  const [closing, setClosing] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);

  useEffect(() => {
    if (showSettings) {
      setClosing(false);
    }
    return () => {
      if (!showSettings && closeTimeoutRef.current) {
        window.clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [showSettings]);

  const closeWindow = () => {
    if (closeTimeoutRef.current) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    setClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      toggleSettings();
      toggleOpen();
      closeTimeoutRef.current = null;
    }, 300);
  };

  if (!showSettings) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute top-0 left-0 right-0 bottom-0 z-10 min-h-[90vh] px-8 py-0 overflow-y-hidden max-w-[450px] m-auto fade-in-bottom ",
        darkMode ? 'dark-theme ' : 'light-theme ',
        closing && 'fade-out-bottom'
      )}
      onAnimationEnd={() => setClosing(false)}
    >
      <img
        className="close-btn"
        src={darkMode ? Close : CloseDark}
        alt="Close settings window"
        onClick={closeWindow}
      />
      <h2 className="text-center text-xl">SETTINGS</h2>
      <div className="w-full">
        <div className="setting ">
          <div className="section-txt">
            <h3>HARD MODE</h3>
            <p>Lowers lives to 1! Don't make a mistake :)</p>
          </div>
          <label className=" switch">
            <input
              type="checkbox"
              defaultChecked={hardMode}
              onClick={toggleHardMode}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting ">
          <div className="section-txt">
            <h3>DARK THEME</h3>
            <p>Toggle to turn dark mode on and off.</p>
          </div>
          <label className=" switch">
            <input
              type="checkbox"
              onClick={toggleDarkMode}
              defaultChecked={darkMode}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="setting ">
          <div className="section-txt">
            <h3>FEEDBACK</h3>
            <p>Please reach out with any questions, comments praise or concerns!</p>
          </div>
          <div id="feedback-txt">
            <a href="mailto:zachary.tippit@gmail.com">
              <span className="feedback-link">Email</span>
            </a>
            <a href="https://www.zachtippit.com" target="_blank" rel="noreferrer">
              <span className="feedback-link">Portfolio</span>
            </a>
          </div>
        </div>
      </div>
      <div id="setting-footer">
        <div>
          <p>©2022 by Zach Tippit</p>
        </div>
        <div>
          <p>
            <a href="https://www.zachtippit.com">More projects at zachtippit.com</a>
          </p>
        </div>
        <div>
          <p>Picodia #{version}</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
