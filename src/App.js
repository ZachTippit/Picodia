import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, Ping } from './Components'
import ReactGA from 'react-ga';
import SolveToStart from './Components/Game/SolveToStart';
import { onGameOver, handleWinStats, handleLoseStats } from './lib/utilities'
import { useSelector, useDispatch } from 'react-redux'
import { _startGame } from './features/gameState/gameStateSlice'
import { setPath } from './features/windowHandler/windowHandlerSlice'

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)

const App = () => {
  const dispatch = useDispatch();
  const gameConfig = useSelector(state => state.gameConfig)
  const gameState = useSelector(state => state.gameState)
  const path = useSelector(state => state.windowHandler.path)
  const [puzzleReference, setPuzzleRef] = useState(0);
  const [whatIsIt, setWhatIsIt] = useState();
  const [dailyPuzzle, setDailyPuzzle] = useState([]);
  const [playedToday, setPlayedToday] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hardMode, setHardMode] = useState(false);
  const [didWin, setDidWin] = useState();
  const [gameOver, setGameOver] = useState(false);
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
    // console.log(initialState)
    // console.log(gameConfig)
    // Will clear localStorage
    // localStorage.clear();
    // console.log('Initial localStorage load: ', localStorage)
  }, [])

  const handleGameOver = (win, numLives) => { 
    onGameOver(numLives, win, prevGameArray, puzzleReference)
    if(win){  
      setGameOverNote(`Nice! It's ${whatIsIt}.`)
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
      dispatch(_startGame())
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
      if(!gameState.isStarted && puzzleReference === localStorage.playedToday){
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

  // LIVES: Checks for running out of lives.
  useEffect(() => { if(gameState.lives===0){ setDidWin(false); setGameOver(true)}}, [gameState.lives])

  useEffect(() => { 
    if(gameOver){
      handleGameOver(didWin, gameState.lives, gameOverTime)
    }  
  }, [gameOver])

  const wrongSolveToStart = () => {
    setPingHowTo(true)
    setTimeout(() => {
      setPingHowTo(false)
    }, 500)
  }

  const switchHardMode = () => {
    setHardMode(!hardMode);
  }

  const copyToClipboard = () => {
    const pad = (val) => {
      let valString = val + '';
      return valString.length < 2 ? "0"+valString : valString;
    }
    const hearts = (playedToday ? (prevOutcome ? '❤️'.repeat(prevLives) : '🖤') : (didWin ? '❤️'.repeat(gameState.lives) : '🖤'))
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
    setTimeout(() => {
      setIsOpen(!isOpen);
      dispatch(setPath(path))
    }, 500);    
  }

  const showWindow = () => {
    switch(path){
      case 'about':
        return <About closeMenu={isSeen}/>
      case 'stats':
        return <Stats closeMenu={isSeen} gameOver={gameOver} didWin={didWin} cookies={localStorage} copyToClipboard={copyToClipboard} playedToday={playedToday}/>
      case 'settings':
        return <Settings closeMenu={isSeen} hardMode={hardMode} switchHardMode={switchHardMode} version={puzzleReference}/>
      default:
        return;
    }
  }

  const showPing = (type) => {
    switch(type){
      case 'goodLuck':
        return <Ping note='Good luck!' startPing={true}/>
      case 'copiedToClipboard':
        return <Ping note='Copied to clipboard!'/>
      case 'gameOver':
        return <Ping note={gameOverNote} didWin={didWin}/>
      case 'playedToday':
        return <Ping note={`You have already played today. It was ${whatIsIt}!`} playedToday={true} />
      default:
        return
    }
  }

  return (
    <div id={'cover-screen'} className={(gameConfig.isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(gameConfig.isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen} pingHowTo={pingHowTo}/>
        { (playedToday && !isOpen) && showPing('playedToday') }
        { (startPing && !playedToday) && showPing('goodLuck')}
        { goAlert && showPing('gameOver') }
        { alert && showPing('copiedToClipboard') }
        { isOpen && showWindow()}
        { gameState.isStarted ? 
          <Game puzzle={dailyPuzzle} isStarted={gameState.isStarted} gameOver={gameOver} handleWin={handleWin} didWin={didWin} handlePrevGameArray={handlePrevGameArray} prevGameArray={prevGameArray} playedToday={playedToday}/>
         :
          <SolveToStart isStarted={gameState.isStarted} handleWin={startGame} preGameAnim={preGameAnim} wrongSolveToStart={wrongSolveToStart} playedToday={playedToday} />
        }
        <Footer isStarted={gameState.isStarted} startGame={startGame}
                gameOver={gameOver} handleGameOverTime={handleGameOverTime} playedToday={playedToday} 
                prevTime={localStorage.prevTime} prevLives={localStorage.prevLives} preGameAnim={preGameAnim}
                whatIsIt={whatIsIt}/>
      </div>
    </div>
  );
}

export default App;