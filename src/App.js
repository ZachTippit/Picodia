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
  const [cookies, setCookie, removeCookie] = useCookies()


  const cookieRemover = () => {
    // removeCookie('totalGames');       // Total games played
    // removeCookie('wonGames');         // Games won
    // removeCookie('lostGames')         // Games lost
    // removeCookie('currentStreak');    // Current win streak
    // removeCookie('maxStreak');        // Longest win streak
    // // removeCookie('lifeWins')          // Wins in each life (or loss, [0])
    // // removeCookie('avgTimes')          // Avg times in each life
    // removeCookie('playedPicodia')     // Played Picodia before?  
    // removeCookie('playedToday')       // Played Picodia today?
    removeCookie('0LifeAvgTime')                 // Weird cookie thang
  }

  const cookieInit = () => {
    setCookie('totalGames', 0);      // Total games played
    setCookie('wonGames', 0);        // Games won
    setCookie('lostGames', 0)        // Games lost
    setCookie('currentStreak', 0);   // Current win streak
    setCookie('maxStreak', 0);       // Longest win streak
    // setCookie('lifeWins', [0,0,0,0]) // Wins in each life (or loss, [0])
    // setCookie('avgTimes', [0,0,0,0]) // Avg times in each life
    setCookie('playedPicodia', true) // Played Picodia before?  
    setCookie('playedToday', false)  // Played Picodia today?
    setCookie('lostGames', 0)
    setCookie('avgLossTime', 0);
    setCookie('1LifeWins', 0);
    setCookie('1LifeAvgTime', 0);
    setCookie('2LifeWins', 0);
    setCookie('2LifeAvgTime', 0);
    setCookie('3LifeWins', 0);
    setCookie('3LifeAvgTime', 0);
  }

  useEffect(() => console.log('Cookies changed: ', cookies), [cookies])

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

  useEffect(() => { setIsDarkMode(isDarkMode); }, [isDarkMode])

  useEffect(() => { lives===0 && handleGameOver(false, 0, totalTime)}, [lives])

  useEffect(() => !gameOver && setSeconds(totalTime%60), [totalTime])

  useEffect(() => !gameOver && setMinutes(parseInt(totalTime/60)), [seconds])

  useEffect(() => {(isStarted && !gameOver) && setTotalTime(0)}, [isStarted])

  useEffect(() => {
    // Removes all cookies created by initializer
    cookieRemover();
    

    // Initializes Cookies for the first time
    if(cookies.playedPicodia === undefined){
      cookieInit();
    } else if(cookies.playedToday === true){
                /////// Future plan! Included user's guessed array for the day
                console.log('You\'ve played today but at least we read cookies!')
    }
    // console.log(cookies)

    if(!gameOver){
      const interval = setInterval(() => {
        setTotalTime(totalTime => totalTime + 1)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [])


  const handleGameOver = (win, numLives, timeTaken) => {
    console.log('dooties')
      // Pops up game over window
      // SETS COOKIES FOR:
        // You've played today
    setCookie('playedToday', true);
        // ++ Total games played
    setCookie('totalGames', parseInt(cookies.totalGames) + 1);
    //     // Refreshes avg time per life (and loss)
    setCookie(`${numLives}LifeAvgTime`, ((parseInt(cookies[`${numLives}LifeWins`]) * parseInt(cookies[`${numLives}LifeAvgTime`]) + timeTaken )/(parseInt(cookies[`${numLives}LifeWins`]) + 1)))
    if(win){  
      // ON WIN
        // ++ won games
      setCookie('wonGames', parseInt(cookies.wonGames) + 1);
        // ++ current streak
      setCookie('currentStreak', parseInt(cookies.currentStreak) + 1);
        // ++ max streak, if possible
      cookies.currentStreak > cookies.maxStreak && setCookie('maxStreak', parseInt(cookies.maxStreak) + 1);
        // ++ games per life
      setCookie(`${[numLives]}LifeWins`, parseInt(cookies[`${numLives}LifeWins`]) + 1);
    } else {
          // Resets current streak
      setCookie('lostGames', parseInt(cookies.lostGames) + 1);
      setCookie('currentStreak', 0);      
    }
    setGameOver(true);
    // Sets win status for game logic
    setDidWin(win);
  }

  const handleGameTimeCookies = (winsInCategory, avgTimeInCategory, timeTaken) => { 
    return (winsInCategory * avgTimeInCategory + timeTaken)/(winsInCategory + 1);
  }

  const startGame = () => { setIsStarted(true); }

  const handleWin = () => {
    console.log('Win! ', lives, ' lives left. Total time taken: ', totalTime)
    handleGameOver(true, lives, totalTime)
  }

  const loseLife = () => {
    setLives(lives - 1);
    if(lives === 0) {
      console.log('uh oh!')
      
    }
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
