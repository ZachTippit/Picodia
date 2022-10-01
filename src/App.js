import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, Ping } from './Components'
import ReactGA from 'react-ga';
import SolveToStart from './Components/Game/SolveToStart';
import { onGameOver, handleWinStats, handleLoseStats, storageInit } from './lib/utilities'
import { useSelector, useDispatch } from 'react-redux'
import { _startGame, setDidWin } from './features/gameState/gameStateSlice'
import { hasPlayedToday, fetchPuzzle, fetchDailyPuzzle, fetchPuzzleRef } from './features/gameConfig/gameConfigSlice';
import { setPath } from './features/windowHandler/windowHandlerSlice'
import {  } from './features/stats/statSlice'

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)

const App = () => {

  const dispatch = useDispatch();

  const {playedToday, puzzleReference,isDarkMode, whatIsIt, whatIsIt1 } = useSelector(state => state.gameConfig)
  const { isStarted, lives, didWin } = useSelector(state => state.gameState)
  const path = useSelector(state => state.windowHandler.path)

  const [isOpen, setIsOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pingHowTo, setPingHowTo] = useState(false);
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
    localStorage.length === 0 && storageInit();
    // Will clear localStorage
    // localStorage.clear();
    // console.log('Initial localStorage load: ', localStorage)
  }, [])

  // Gets puzzle reference for puzzle fetcher
  useEffect(() => {
    const getPuzzleRef = async () => {
      await dispatch(fetchPuzzleRef())
      await dispatch(fetchDailyPuzzle())
    }

    getPuzzleRef();    
  }, [])

  // PUZZLE REF FETCHER: Uses google sheets index to pick puzzle (this will create an API limit bottleneck in the future). Also used as daily counter
  useEffect(() => {
    const getPuzzle = async () => {
      await dispatch(fetchPuzzle(puzzleReference))
    }

    getPuzzle(); 
   
    if(puzzleReference !== 0){
      if(!isStarted && puzzleReference === localStorage.lastPlayed){
        getPuzzle(); 
        dispatch(hasPlayedToday(true));
      } else {
        getPuzzle(); 
      }    
    }
  }, [puzzleReference])

  const handleGameOver = (win, numLives) => { 
    onGameOver(numLives, win, localStorage.prevGameArray, puzzleReference)
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

  const handleGameOverTime = (totalTime) => {
    localStorage.prevTime = totalTime
    setGameOverTime(totalTime);
  }

  const startGame = () => { 

    setPreGameAnim(true)
    
    setTimeout(() => {
      localStorage.playedPicodia = true;
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
    dispatch(setDidWin(true));
    setGameOver(true);
  }

   

  // LIVES: Checks for running out of lives.
  useEffect(() => { 
    if(lives===0){ 
      dispatch(setDidWin(false)); // REPLACE
      setGameOver(true)
    }
  }, [lives])

  useEffect(() => { 
    if(gameOver){
      handleGameOver(didWin, lives, gameOverTime)
    }  
  }, [gameOver])

  const wrongSolveToStart = () => {
    setPingHowTo(true)
    setTimeout(() => {
      setPingHowTo(false)
    }, 500)
  }

  const copyToClipboard = () => {
    const pad = (val) => {
      let valString = val + '';
      return valString.length < 2 ? "0"+valString : valString;
    }
    const hearts = (playedToday ? (localStorage.prevOutcome ? '❤️'.repeat(localStorage.prevLives) : '🖤') : (didWin ? '❤️'.repeat(lives) : '🖤'))
    const prefaceText = '⏱'
    const gameTime = (playedToday ? localStorage.prevTime : gameOverTime)
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
        return <Stats closeMenu={isSeen} gameOver={gameOver} copyToClipboard={copyToClipboard}/>
      case 'settings':
        return <Settings closeMenu={isSeen} version={puzzleReference}/>
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
        return <Ping note={gameOverNote}/>
      case 'playedToday':
        return <Ping note={`You have already played today. It was ${whatIsIt}!`} />
      default:
        return
    }
  }
 
  return (
    <div id={'cover-screen'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen} pingHowTo={pingHowTo}/>
        { (playedToday && !isOpen) && showPing('playedToday') }
        { (startPing && !playedToday) && showPing('goodLuck')}
        { goAlert && showPing('gameOver') }
        { alert && showPing('copiedToClipboard') }
        { isOpen && showWindow()}
        { isStarted ? 
          <Game 
            gameOver={gameOver} 
            handleWin={handleWin} 
          />
          :
          <SolveToStart 
            handleWin={startGame} 
            preGameAnim={preGameAnim} 
            wrongSolveToStart={wrongSolveToStart} 
          />
        }
        <Footer 
          openMenu={isSeen}
          isStarted={isStarted} 
          startGame={startGame}
          gameOver={gameOver} 
          handleGameOverTime={handleGameOverTime}
          preGameAnim={preGameAnim}
        />
      </div>
    </div>
  );
}

export default App;