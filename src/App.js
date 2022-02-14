import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, Ping } from './Components'
import { useCookies } from 'react-cookie'
import ReactGA from 'react-ga';
import './Components/styles.css';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)



const App = () => {

  const [puzzleReference, setPuzzleRef] = useState(0);
  const [dailyPuzzle, setDailyPuzzle] = useState([]);
  const [playedToday, setPlayedToday] = useState(false);
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
  const [prevGameArray, setPrevGameArray] = useState([]);
  const [prevLives, setPrevLives] = useState()
  const [prevOutcome, setPrevOutcome] = useState()
  const [prevTime, setPrevTime] = useState()
  
  const [alert, setAlert] = useState(false)
  const [goAlert, setGOAlert] = useState(false)
  const [gameOverNote, setGameOverNote] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies()
  const [gameOverTime, setGameOverTime] = useState()

  const cookieRemover = () => {
    removeCookie('totalGames');       // Total games played
    removeCookie('wonGames');         // Games won
    removeCookie('lostGames')         // Games lost
    removeCookie('currentStreak');    // Current win streak
    removeCookie('maxStreak');        // Longest win streak
    removeCookie('playedPicodia')     // Played Picodia before?  
    removeCookie('playedToday')       // Played Picodia today?
    removeCookie('undefinedLifeAvgTime')                 // Weird cookie thang
    removeCookie('0LifeWins', 0);
    removeCookie('0LifeAvgTime', 0);
    removeCookie('avgLossTime', 0);
    removeCookie('1LifeWins', 0);
    removeCookie('1LifeAvgTime', 0);
    removeCookie('2LifeWins', 0);
    removeCookie('2LifeAvgTime', 0);
    removeCookie('3LifeWins', 0);
    removeCookie('3LifeAvgTime', 0);
    removeCookie('prevGameLives', 0);
    removeCookie('prevGameArray', 0);
    removeCookie('prevGameOutcome', 0);
    removeCookie('prevGameTime', 0);
    removeCookie('prevLives', 0);
    removeCookie('prevOutcome', 0);
    removeCookie('prevTime', 0);
  }

  const cookieInit = () => {
    setCookie('totalGames', 0);       // Total games played
    setCookie('wonGames', 0);         // Games won
    setCookie('lostGames', 0)         // Games lost
    setCookie('currentStreak', 0);    // Current win streak
    setCookie('maxStreak', 0);        // Longest win streak
    setCookie('playedPicodia', true)  // Played Picodia before?  
    setCookie('playedToday', 0)       // Played Picodia today? -- saves as daily number to check against
    setCookie('lostGames', 0)         
    setCookie('avgLossTime', 0);
    setCookie('0LifeWins', 0);
    setCookie('1LifeWins', 0);
    setCookie('1LifeAvgTime', 0);
    setCookie('2LifeWins', 0);
    setCookie('2LifeAvgTime', 0);
    setCookie('3LifeWins', 0);
    setCookie('3LifeAvgTime', 0);
    setCookie('prevTime', 0)
    setCookie('prevLives', 0)
    setCookie('prevOutcome', false)
    setCookie('prevGameArray', [])
  }

  // App initializer
  useEffect(() => {

    //// Google Analytics initializer on window
    ReactGA.pageview(window.location.pathname);
    // console.log(cookies);
    //// Cookie handlers
    // cookieRemover();
    cookies.playedPicodia === undefined && cookieInit();
    // console.log('Initial cookie load: ', cookies)
  }, [])

  const handleGameOver = (win, numLives) => {
      // SAVES CURRENT DAY'S GAME
    setCookie('prevLives', numLives)
    setCookie('prevOutcome', win)
    setCookie('prevGameArray', prevGameArray)
        // You've played today
    setCookie('playedToday', puzzleReference);
        // ++ Total games played
    setCookie('totalGames', parseInt(cookies.totalGames) + 1);
        // Refreshes avg time per life (and loss)
    if(win){  
      let lifeWins = parseInt(cookies[`${numLives}LifeWins`])
      let avgTimes = parseInt(cookies[`${numLives}LifeAvgTime`])
      setGameOverNote('Nice work!')
      // ON WIN
        // ++ won games
      setCookie('wonGames', parseInt(cookies.wonGames) + 1);
        // ++ current streak
      setCookie('currentStreak', parseInt(cookies.currentStreak) + 1);
        // ++ max streak, if possible
      cookies.currentStreak + 1 > cookies.maxStreak && setCookie('maxStreak', parseInt(cookies.maxStreak) + 1);
        // ++ games per life
        console.log((lifeWins*avgTimes + cookies.prevTime)/(lifeWins + 1))
      setCookie(`${[numLives]}LifeWins`, parseInt(cookies[`${numLives}LifeWins`]) + 1);
      setCookie(`${numLives}LifeAvgTime`, ((lifeWins*avgTimes + cookies.prevTime)/(lifeWins + 1)))
    } else {
      let losses = parseInt(cookies.lostGames)
      let avgLossTime = parseInt(cookies.avgLossTime)
      setGameOverNote('Bummer...')
      setCookie(`${numLives}LifeAvgTime`, (( losses * avgLossTime + cookies.prevTime )/(losses + 1)))
          // Resets current streak
      setCookie('lostGames', parseInt(cookies.lostGames) + 1);
      setCookie('currentStreak', 0);      
    }
    setGOAlert(true);
    setTimeout(() => {
      setGOAlert(false)
    }, 4000)

    setTimeout(() => {
      isSeen('stats') 
    }, 2000)
  }

  const handleGameOverTime = (totalTime, minutes, seconds) => {
    setCookie('prevTime', totalTime)
    setGameOverTime(totalTime);
  }

  const handlePrevGameArray = (answerArray) => {
    setPrevGameArray(answerArray);
  }

  const startGame = () => { setIsStarted(true); }

  const handleWin = () => {
    setDidWin(true);
    setGameOver(true);
  }

   // Gets puzzle reference for puzzle fetcher
   useEffect(() => {
    const getPuzzleRef = async () => {
      const puzzleRef = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!A2?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
      setPuzzleRef(puzzleRef.values[0][0])
    }
    getPuzzleRef();
  }, [])

  // PUZZLE REF FETCHER: Uses google sheets index to pick puzzle (this will create an API limit bottleneck in the future). Also used as daily counter
  useEffect(() => {
    const getPuzzle = async () => {
      const puzzleResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!B${puzzleReference}?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
      setDailyPuzzle(puzzleResponse.values[0][0]);
    }

    if(puzzleReference !== 0){
      if(!isStarted && puzzleReference == cookies.playedToday){
        console.log(cookies.prevGameArray)
        setPlayedToday(true);
        setPrevGameArray(cookies.prevGameArray)
        setPrevLives(cookies.prevLives)
        setPrevTime(cookies.prevTime)
        setPrevOutcome(cookies.prevOutcome)
      } else {
        getPuzzle();
      }    
    }

    // getPuzzle();
  }, [puzzleReference])

  // HARD MODE: Turns on hard mode (reduces to 1 life), can't turn off mid-game.
  useEffect(() => {
    if(hardMode){
      setLives(1);
      setMaxLives(1);
    } else if(isStarted){
      return;
    } else {
      setLives(3);
      setMaxLives(3);
    }  
  }, [hardMode])

  // DARK MODE: Toggles dark mode.
  useEffect(() => { setIsDarkMode(isDarkMode); }, [isDarkMode])

  // LIVES: Checks for running out of lives.
  useEffect(() => { if(lives===0){ setDidWin(false); setGameOver(true)}}, [lives])

  useEffect(() => { 
    if(gameOver){
      handleGameOver(didWin, lives, gameOverTime)
    }  
  }, [gameOver])

  useEffect(() => {  
    if(cookies.playedToday == puzzleReference){
     // setPlayedToday(true);
    }
  }, [cookies])

  const loseLife = () => {
    setLives(lives - 1);
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
    const hearts = (playedToday ? (prevOutcome ? '❤️'.repeat(prevLives) : '0 Lives') : (didWin ? '❤️'.repeat(lives) : '0 Lives'))
    const prefaceText = (playedToday ? (prevOutcome ? 'Completed in' : 'Lost at') : (didWin ? 'Completed in' : 'Lost at'))
    const gameTime = (playedToday ? prevTime : gameOverTime)
    const copyText = `Picodia #${puzzleReference} -- ${prefaceText} ${pad(parseInt(gameTime/60))}:${pad(gameTime%60)} -- ${hearts} remaining. Can you beat that? Play at picodia.app!`
    navigator.clipboard.writeText(copyText);
    // alert(copyText);
    setAlert(true)
    setTimeout(() => {
      setAlert(false)
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
        return <Stats closeMenu={isSeen} isDarkMode={isDarkMode} closing={closing} gameOver={gameOver} didWin={didWin} cookies={cookies} copyToClipboard={copyToClipboard} playedToday={playedToday}/>
      case 'settings':
        return <Settings closeMenu={isSeen} hardMode={hardMode} switchHardMode={switchHardMode} switchDarkMode={switchDarkMode} isDarkMode={isDarkMode} closing={closing} version={puzzleReference}/>
      default:
        return;
    }
  }

  return (
    <div id={'cover-screen'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen} isDarkMode={isDarkMode}/>
        { playedToday && <Ping note={'You have already played today! Check back tomorrow'} playedToday={true} /> }
        { goAlert && <Ping note={gameOverNote} didWin={didWin} isCopy={false}/> }
        { alert && <Ping note={'Copied to clipboard!'} isCopy={true}/> }
        { isOpen && showWindow()}
        <Game isDarkMode={isDarkMode} puzzle={dailyPuzzle} pingStartBtn={pingStartBtn} isStarted={isStarted} loseLife={loseLife} gameOver={gameOver} handleWin={handleWin} didWin={didWin} handlePrevGameArray={handlePrevGameArray} prevGameArray={prevGameArray} playedToday={playedToday}/>
        <Footer lives={lives} maxLives={maxLives} isStarted={isStarted} startGame={startGame} ping={ping} 
                gameOver={gameOver} handleGameOverTime={handleGameOverTime} playedToday={playedToday} prevTime={cookies.prevTime} prevLives={cookies.prevLives} />
      </div>
    </div>
  );
}

export default App;
