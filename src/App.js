import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, Ping } from './Components'
import ReactGA from 'react-ga';
import SolveToStart from './Components/Game/SolveToStart';
import {storageInit, onGameOver, handleWinStats, handleLoseStats, gameArrayChunker} from './lib/utilities'

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)

const App = () => {
  const [puzzleReference, setPuzzleRef] = useState(0);
  const [whatIsIt, setWhatIsIt] = useState();
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
  const [pingHowTo, setPingHowTo] = useState(false);
  const [prevGameArray, setPrevGameArray] = useState(JSON.parse(localStorage.prevGameArray));
  const [prevLives, setPrevLives] = useState()
  const [prevOutcome, setPrevOutcome] = useState()
  const [prevTime, setPrevTime] = useState()
  const [preGameAnim, setPreGameAnim] = useState(false)
  const [startPing, setStartPing] = useState(false);
  const [alert, setAlert] = useState(false)
  const [goAlert, setGOAlert] = useState(false)
  const [gameOverNote, setGameOverNote] = useState(false);
  const [gameOverTime, setGameOverTime] = useState()

  // App initializer
  useEffect(() => {
    //// Google Analytics initializer on window
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
   
    // Will clear localStorage
    // localStorage.clear();
    
    console.log('Initial localStorage load: ', localStorage)
  }, [])

  const handleGameOver = (win, numLives) => { 
    onGameOver(numLives, win, prevGameArray, puzzleReference)
    if(win){  
      setGameOverNote(`Nice! It\'s ${whatIsIt}.`)
      handleWinStats(numLives);
    } else {
      setGameOverNote('Bummer...')
      handleLoseStats(numLives)
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
    localStorage.prevTime = totalTime
    setGameOverTime(totalTime);
  }

  const handlePrevGameArray = (answerArray) => {
    setPrevGameArray(answerArray);
  }

  const startGame = () => { 
    setPreGameAnim(true)
    setTimeout(() => {
      setIsStarted(true);
      setPreGameAnim(false)
    }, 1200)
    
    setTimeout(() => {
      setStartPing(true)
    }, 3000)
    setTimeout(() => {
      setStartPing(false)
    }, 8000)
  
  }

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
      const puzzleResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!A${puzzleReference}:B${puzzleReference}?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
      setDailyPuzzle(puzzleResponse.values[0][1]);
      setWhatIsIt(puzzleResponse.values[0][0])
    }

    const getPuzzleWhat = async () => {
      const puzzWhat = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.REACT_APP_SPREADSHEET_ID}/values/Sheet1!A${puzzleReference}?key=${process.env.REACT_APP_SHEETS_API_KEY}`).then((response) => response.json())
      setWhatIsIt(puzzWhat.values[0][0])
    }

    if(puzzleReference !== 0){
      if(!isStarted && puzzleReference == localStorage.playedToday){
        getPuzzleWhat();
        setPlayedToday(true);
        setPrevGameArray(JSON.parse(localStorage.prevGameArray))
        setPrevLives(localStorage.prevLives)
        setPrevTime(localStorage.prevTime)
        setPrevOutcome(localStorage.prevOutcome)
      } else {
        getPuzzle();
      }    
    }
    // getPuzzle();
  }, [puzzleReference])

  useEffect(() => {console.log(prevGameArray)}, [prevGameArray])

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

  const loseLife = () => {
    setLives(lives - 1);
  }

  const wrongSolveToStart = () => {
    setPingHowTo(true)
    setTimeout(() => {
      setPingHowTo(false)
    }, 500)
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
    const hearts = (playedToday ? (prevOutcome ? '❤️'.repeat(prevLives) : '🖤') : (didWin ? '❤️'.repeat(lives) : '🖤'))
    console.log(hearts);
    const prefaceText = '⏱'
    const gameTime = (playedToday ? prevTime : gameOverTime)
    const copyText = `Picodia #${puzzleReference}    ${hearts}    ${prefaceText}${pad(parseInt(gameTime/60))}:${pad(gameTime%60)}`
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
        return <Stats closeMenu={isSeen} isDarkMode={isDarkMode} closing={closing} gameOver={gameOver} didWin={didWin} cookies={localStorage} copyToClipboard={copyToClipboard} playedToday={playedToday}/>
      case 'settings':
        return <Settings closeMenu={isSeen} hardMode={hardMode} switchHardMode={switchHardMode} switchDarkMode={switchDarkMode} isDarkMode={isDarkMode} closing={closing} version={puzzleReference}/>
      default:
        return;
    }
  }

  return (
    <div id={'cover-screen'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen} isDarkMode={isDarkMode} pingHowTo={pingHowTo}/>
        { (playedToday && !isOpen) && <Ping note={`You have already played today. It was ${whatIsIt}!`} playedToday={true} /> }
        { (startPing && !playedToday) && <Ping note='Good luck!' isCopy={false} startPing={true}/>}
        { goAlert && <Ping note={gameOverNote} didWin={didWin} isCopy={false}/> }
        { alert && <Ping note={'Copied to clipboard!'} isCopy={true}/> }
        { isOpen && showWindow()}
        { isStarted ? 
          <Game isDarkMode={isDarkMode} puzzle={dailyPuzzle} pingStartBtn={pingStartBtn} isStarted={isStarted} loseLife={loseLife} gameOver={gameOver} handleWin={handleWin} didWin={didWin} handlePrevGameArray={handlePrevGameArray} prevGameArray={prevGameArray} playedToday={playedToday}/>
         :
          <SolveToStart isDarkMode={isDarkMode} isStarted={isStarted} handleWin={startGame} preGameAnim={preGameAnim} wrongSolveToStart={wrongSolveToStart} playedToday={playedToday} />
        }
        <Footer lives={lives} maxLives={maxLives} isStarted={isStarted} startGame={startGame} ping={ping} 
                gameOver={gameOver} handleGameOverTime={handleGameOverTime} playedToday={playedToday} 
                prevTime={localStorage.prevTime} prevLives={localStorage.prevLives} preGameAnim={preGameAnim}
                whatIsIt={whatIsIt}/>
      </div>
    </div>
  );
}

export default App;