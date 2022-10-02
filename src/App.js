import React, {useEffect, useState} from 'react';
import { HowToPlay, Footer, Game, Navbar, Settings, Stats, Ping } from './Components'
import ReactGA from 'react-ga';
import SolveToStart from './Components/Game/SolveToStart';
import { onGameOver, handleWinStats, handleLoseStats, storageInit } from './lib/utilities'
import { useSelector, useDispatch } from 'react-redux'
import { _startGame, setDidWin } from './features/gameState/gameStateSlice'
import { hasPlayedToday, fetchPuzzle, fetchDailyPuzzle, fetchPuzzleRef } from './features/gameConfig/gameConfigSlice';
import { togglePingHowTo, toggleOpen, setPath } from './features/windowHandler/windowHandlerSlice'
import PingHandler from './Components/PingHandler';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)

const App = () => {
  
  const stateOfGame = 'starting' | 'playing' | 'game over';

  const [gameOver, setGameOver] = useState(false);
  const [preGameAnim, setPreGameAnim] = useState(false)
  const [startPing, setStartPing] = useState(false);
  const [alert, setAlert] = useState(false)
  const [goAlert, setGOAlert] = useState(false)

  const dispatch = useDispatch();
  const {playedToday, puzzleReference,isDarkMode, whatIsIt } = useSelector(state => state.gameConfig)
  const { isStarted, lives, didWin } = useSelector(state => state.gameState)
  const isOpen = useSelector(state => state.windowHandler.isOpen)
  const path = useSelector(state => state.windowHandler.path)

  // App initializer
  useEffect(() => {
    ReactGA.set({ page: window.location.pathname });     // Google Analytics initializer on window
    ReactGA.pageview(window.location.pathname);
      
    // localStorage.clear();                             // Clears localStorage

    localStorage.length === 0 && storageInit();
    // console.log('localStorage on Load: ', localStorage)

    const getPuzzleRef = async () => {                  // Gets puzzle reference for puzzle fetcher
      await dispatch(fetchPuzzleRef()) 
      await dispatch(fetchDailyPuzzle())
    }

    getPuzzleRef();    
  }, [])

  // PUZZLE REF FETCHER: Uses google sheets index to pick puzzle (this will create an API limit bottleneck in the future). Also used as daily coonGameOvergameunter
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
    win ? handleWinStats(numLives) : handleLoseStats(numLives);
  }
  
  const gameOverAlerts = () => {
    setGOAlert(true);
    setTimeout(() => {
      setGOAlert(false)
    }, 4000)

    setTimeout(() => {
      isSeen('stats') 
    }, 2000)
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
      handleGameOver(didWin, lives, localStorage.prevTime)
      gameOverAlerts();
    }  
  }, [gameOver])

  const wrongSolveToStart = () => {
    dispatch(togglePingHowTo())
    setTimeout(() => {
      dispatch(togglePingHowTo())
    }, 500)
  }

  const copyToClipboard = () => {
    const pad = (val) => {
      let valString = val + '';
      return valString.length < 2 ? "0"+valString : valString;
    }
    const hearts = localStorage.prevOutcome ? '❤️'.repeat(localStorage.prevLives) : '🖤'
    const prefaceText = '⏱'
    const gameTime = localStorage.prevTime
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
      dispatch(toggleOpen())
      dispatch(setPath(path))
    }, 500);    
  }

  const showWindow = (path) => {
    switch(path){
      case 'how-to-play':
        return <HowToPlay closeMenu={isSeen}/>
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
        return <Ping note={didWin ? `Nice! It's ${whatIsIt}.` : 'Bummer...'}/>
      case 'playedToday':
        return <Ping note={`You have already played today. It was ${whatIsIt}!`} />
      default:
        return
    }
  }
 
  return (
    <div id={'cover-screen'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen}/>
        { (playedToday && !isOpen) && showPing('playedToday') }
        { (startPing && !playedToday) && showPing('goodLuck')}
        { goAlert && showPing('gameOver') }
        { alert && showPing('copiedToClipboard') }
        { isOpen && showWindow(path)}
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
          preGameAnim={preGameAnim}
        />
        <PingHandler />
      </div>
    </div>
  );
}

export default App;