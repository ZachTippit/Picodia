import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, ClipboardPing } from './Components'
import { useCookies } from 'react-cookie'
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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [didWin, setDidWin] = useState();
  const [gameOver, setGameOver] = useState(false);
  const [ping, setPing] = useState(false);
  const [copyAlert, setCopyAlert] = useState(false)
  const [cookies, setCookies] = useCookies()

  useEffect(() => {
    if(cookies.playedPicodia === undefined){
      setCookies('totalGames', 0);
      setCookies('wonGames', 0);
      setCookies('lostGames', 0)
      setCookies('currentStreak', 0);
      setCookies('maxStreak', 0);
      setCookies('3LifeWins', 0)
      setCookies('3LifeTimes', [])
      setCookies('2LifeWins', 0)
      setCookies('2LifeTimes', [])
      setCookies('1LifeWins', 0)
      setCookies('1LifeTimes', [])
      setCookies('lossTimes', [])
      setCookies('playedPicodia', true)
      setCookies('playedToday', false)
    }
  }, [])

  const handleGameOver = (win, numLives, timeTaken) => {
    setGameOver(true);
    setDidWin(true);
    setCookies('playedToday', true);
    if(win){
      setCookies('totalGames', cookies.totalGames + 1);
      setCookies('wonGames', cookies.wonGames + 1);
      setCookies('currentStreak', cookies.currentStreak + 1);
      cookies.currentStreak > cookies.maxStreak && setCookies('maxStreak', cookies.maxStreak + 1);

      setCookies(`${numLives}LifeWins`, cookies[`${numLives}LifeWins`])
     // winHandler(numLives, timeTaken);
    } else {
      setCookies('lostGames', cookies.lostGames + 1);
      setCookies('lossTimes', cookies.lossTimes.push(timeTaken));
    }
  }

  const handleGameTimeCookie = (numLives, timeTaken) => { 

  }

  const copyToClipboard = () => {
    const pad = (val) => {
      let valString = val + '';
      return valString.length < 2 ? "0"+valString : valString;
    }
    const hearts = (didWin ? '❤️'.repeat(lives) : '0 Lives')
    const prefaceText = (didWin ? 'Completed in ' : 'Lost at ')
    const copyText = `Picodia #1 -- ${prefaceText} ${pad(minutes)}:${pad(seconds)} -- ${hearts} Remaining`
    navigator.clipboard.writeText(copyText);
    // alert(copyText);
    setCopyAlert(true)
    setTimeout(() => {
      setCopyAlert(false)
    }, 4000)
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
      handleGameOver(false, 0, totalTime)
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
    } else if (cookies.playedToday){
      console.log('You\'ve played today already! Check in tomorrow, champ ;)')
    }
  }, [isStarted])

  const startGame = () => {
    setIsStarted(true);
  }

  const handleWin = () => {
    setGameOver(true);
    setDidWin(true);
  }

  const switchHardMode = () => {
    setHardMode(!hardMode);
  }

  const switchDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  const pingStartBtn = () => {
    if(!isStarted){
      setPing(true)
    }
    setTimeout(() => {
      setPing(false)
    }, 1000);
  }

  const showWindow = () => {
    switch(path){
      case 'about':
        return <About closeMenu={isSeen} isDarkMode={isDarkMode} closing={closing}/>
      case 'stats':
        return <Stats closeMenu={isSeen}isDarkMode={isDarkMode} closing={closing} cookies={cookies}/>
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
        { copyAlert && <ClipboardPing /> }
        { isOpen && showWindow()}
        { gameOver && <Stats isDarkMode={isDarkMode} closeMenu={isSeen} gameOver={gameOver} didWin={didWin} copyToClipboard={copyToClipboard} cookies={cookies}/>}
        <Game isDarkMode={isDarkMode} pingStartBtn={pingStartBtn} isStarted={isStarted} loseLife={loseLife} handleWin={handleWin}/>
        <Footer lives={lives} maxLives={maxLives} isStarted={isStarted} startGame={startGame} minutes={minutes} seconds={seconds} ping={ping}/>
      </div>
    </div>
    
  );
}

export default App;
