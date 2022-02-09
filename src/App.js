import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, GameOver } from './Components'
import './Components/styles.css';

const App = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState();
  const [isStarted, setIsStarted] = useState(false);
  
  const [lives, setLives] = useState(3);
  const [stats, setStats] = useState({
    gamesPlayed: 3,
    winPercent: 0.5,
    currentStreak: 3,
    bestStreak: 3
  })

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const isSeen = (path) => {
    setIsOpen(!isOpen);
    setPath(path)
  }

  const loseLife = () => {
    setLives(lives - 1);
    if(lives === 0) {
      setGameOver(true);
    }
  }

  useEffect(() => {
    setIsDarkMode(isDarkMode);
  }, [isDarkMode])
  
  const startGame = () => {
    setIsStarted(true);
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
        { gameOver && <GameOver isDarkMode={isDarkMode} closeMenu={isSeen}/>}
        <Game isDarkMode={isDarkMode} loseLife={loseLife}/>
        <Footer lives={lives} isStarted={isStarted} startGame={startGame}/>
      </div>
    </div>
    
  );
}

export default App;
