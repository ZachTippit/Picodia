import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, GameOver } from './Components'
import './Components/styles.css';

const App = () => {

  const [totalTime, setTotalTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState();
  const [closing, setClosing] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [maxLives, setMaxLives] = useState(3);
  const [lives, setLives] = useState(maxLives);
  const [stats, setStats] = useState({
    gamesPlayed: 3,
    winPercent: 0.5,
    currentStreak: 3,
    bestStreak: 3
  })
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [didWin, setDidWin] = useState();
  const [gameOver, setGameOver] = useState(false);

  const copyToClipboard = (minutes, seconds, lives) => {
    const pad = (val) => {
      let valString = val + '';
      return valString.length < 2 ? "0"+valString : valString;
    }
    const copyText = `Picodia #1 -- ${pad(minutes)}:${pad(seconds)} -- ${lives} Lives Remaining`
    navigator.clipboard.writeText(copyText);
    alert("Copied the text: " + copyText);
  }

  const isSeen = (path) => {
    if(isOpen){
      setClosing(true)
    }
    setTimeout(() => {
      setClosing(false);
      setIsOpen(!isOpen);
      setPath(path)
    }, 300);    
  }

  const loseLife = () => {
    setLives(lives - 1);
    if(lives === 0) {
      setGameOver(true);
    }
  }

  useEffect(() => {
    if(hardMode){
      if(isStarted){
        setLives(1);
        setMaxLives(1);
      } else {
        setLives(1);
        setMaxLives(1);
      }
    }
  }, [hardMode])

  useEffect(() => {
    setIsDarkMode(isDarkMode);
  }, [isDarkMode])

  useEffect(() => {
    if(lives===0) { 
      setGameOver(true); 
      setDidWin(false); 
    }
  }, [lives])
  
  useEffect(() => {
    if(!gameOver){
      const interval = setInterval(() => {
        setTotalTime(totalTime => totalTime + 1)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [])

  useEffect(() => {
    if(!gameOver){
      setSeconds(totalTime%60)
    }
  }, [totalTime])

  useEffect(() => {
    if(!gameOver){
      setMinutes(parseInt(totalTime/60))
    }
  }, [seconds])

  useEffect(() => {
    if(isStarted && !gameOver){
      setTotalTime(0)
    }
  }, [isStarted])

  const startGame = () => {
    setIsStarted(true);
  }

  const switchHardMode = () => {
    setHardMode(!hardMode);
  }

  const switchDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  const showWindow = () => {
    switch(path){
      case 'about':
        return <About closeMenu={isSeen} isDarkMode={isDarkMode} closing={closing}/>
      case 'stats':
        return <Stats closeMenu={isSeen} playerStats={stats} isDarkMode={isDarkMode} closing={closing}/>
      case 'settings':
        return <Settings closeMenu={isSeen} hardMode={hardMode} switchHardMode={switchHardMode} switchDarkMode={switchDarkMode} isDarkMode={isDarkMode} closing={closing}/>
      default:
        return;
    }
  }

  return (
    <div id={'cover-screen'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen} isDarkMode={isDarkMode}/>
        { isOpen && showWindow()}
        { gameOver && <Stats isDarkMode={isDarkMode} closeMenu={isSeen} playerStats={stats} gameOver={gameOver} didWin={didWin} copyToClipboard={copyToClipboard} minutes={minutes} seconds={seconds} lives={lives}/>}
        <Game isDarkMode={isDarkMode} startGame={startGame} isStarted={isStarted} loseLife={loseLife}/>
        <Footer lives={lives} maxLives={maxLives} isStarted={isStarted} startGame={startGame} minutes={minutes} seconds={seconds}/>
      </div>
    </div>
    
  );
}

export default App;
