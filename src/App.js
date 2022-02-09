import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats } from './Components'
import './Components/styles.css';

const App = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState();
  const [isStarted, setIsStarted] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [lives, setLives] = useState(3);
  const [stats, setStats] = useState({
    gamesPlayed: 3,
    winPercent: 0.5,
    currentStreak: 3,
    bestStreak: 3
  })

  const [isDarkMode, setIsDarkMode] = useState(false);

  const isSeen = (path) => {
    setIsOpen(!isOpen);
    setPath(path)
   
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(totalTime => totalTime + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    setSeconds(totalTime%60)
  }, [totalTime])

  useEffect(() => {
    setMinutes(parseInt(totalTime/60))
  }, [seconds])

  useEffect(() => {
    setIsDarkMode(isDarkMode);
  }, [isDarkMode])
  
  const startGame = () => {
    setIsStarted(true);
    setTotalTime(0);
  }

  const switchDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  const showWindow = () => {
    switch(path){
      case 'about':
        return <About closeMenu={isSeen} isDarkMode={isDarkMode}/>
      case 'stats':
        return <Stats closeMenu={isSeen} playerStats={stats} isDarkMode={isDarkMode}/>
      case 'settings':
        return <Settings closeMenu={isSeen} switchDarkMode={switchDarkMode} isDarkMode={isDarkMode}/>
      default:
        return;
    }
  }

  return (
    <div id={'cover-screen'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen} isDarkMode={isDarkMode}/>
        { isOpen && showWindow()}
        <Game isDarkMode={isDarkMode} />
        <Footer seconds={seconds} minutes={minutes} lives={lives} isStarted={isStarted} startGame={startGame}/>
      </div>
    </div>
    
  );
}

export default App;
