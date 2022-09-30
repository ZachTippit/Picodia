import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats, Ping } from './Components'
import ReactGA from 'react-ga';
import SolveToStart from './Components/Game/SolveToStart';
import { onGameOver, handleWinStats, handleLoseStats, storageInit } from './lib/utilities'
import { useSelector, useDispatch } from 'react-redux'
import { _startGame, setDidWin } from './features/gameState/gameStateSlice'
import { hasPlayedToday, fetchPuzzle, fetchPuzzleRef } from './features/gameConfig/gameConfigSlice';
import { setPath } from './features/windowHandler/windowHandlerSlice'
import {  } from './features/stats/statSlice'

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)

const App = () => {

  const dispatch = useDispatch();

  const gameConfig = useSelector(state => state.gameConfig)
  const gameState = useSelector(state => state.gameState)
  const path = useSelector(state => state.windowHandler.path)

  const [isOpen, setIsOpen] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [pingHowTo, setPingHowTo] = useState(false);
  const [prevGameArray, setPrevGameArray] = useState(localStorage.prevGameArray);
  const [prevOutcome, setPrevOutcome] = useState()
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
    }

    getPuzzleRef();    
  }, [])

  // PUZZLE REF FETCHER: Uses google sheets index to pick puzzle (this will create an API limit bottleneck in the future). Also used as daily counter
  useEffect(() => {
    const getPuzzle = async () => {
      await dispatch(fetchPuzzle(gameConfig.puzzleReference))
    }

    getPuzzle(); 
   
    if(gameConfig.puzzleReference !== 0){
      if(!gameState.isStarted && gameConfig.playedToday === localStorage.playedToday){
        getPuzzle(); 
        dispatch(hasPlayedToday(true));
        setPrevGameArray(JSON.parse(localStorage.prevGameArray))
        setPrevOutcome(localStorage.prevOutcome)
      } else {
        getPuzzle(); 
      }    
    }
  }, [gameConfig.puzzleReference])

  const handleGameOver = (win, numLives) => { 
    onGameOver(numLives, win, prevGameArray, gameConfig.puzzleReference)
    if(win){  
      setGameOverNote(`Nice! It's ${gameConfig.whatIsIt}.`)
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

  const handlePrevGameArray = (answerArray) => {
    setPrevGameArray(answerArray);
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
    if(gameState.lives===0){ 
      dispatch(setDidWin(false)); // REPLACE
      setGameOver(true)
    }
  }, [gameState.lives])

  useEffect(() => { 
    if(gameOver){
      handleGameOver(gameState.didWin, gameState.lives, gameOverTime)
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
    const hearts = (gameConfig.playedToday ? (prevOutcome ? '❤️'.repeat(localStorage.prevLives) : '🖤') : (gameState.didWin ? '❤️'.repeat(gameState.lives) : '🖤'))
    const prefaceText = '⏱'
    const gameTime = (gameConfig.playedToday ? localStorage.prevTime : gameOverTime)
    const copyText = `Picodia #${gameConfig.puzzleReference}    ${hearts}    ${prefaceText}${pad(parseInt(gameTime/60))}:${pad(gameTime%60)}`
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
        return <Stats closeMenu={isSeen} gameOver={gameOver} cookies={localStorage} copyToClipboard={copyToClipboard}/>
      case 'settings':
        return <Settings closeMenu={isSeen} version={gameConfig.puzzleReference}/>
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
        return <Ping note={`You have already played today. It was ${gameConfig.whatIsIt}!`} />
      default:
        return
    }
  }
 
  return (
    <div id={'cover-screen'} className={(gameConfig.isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(gameConfig.isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen} pingHowTo={pingHowTo}/>
        { (gameConfig.playedToday && !isOpen) && showPing('playedToday') }
        { (startPing && !gameConfig.playedToday) && showPing('goodLuck')}
        { goAlert && showPing('gameOver') }
        { alert && showPing('copiedToClipboard') }
        { isOpen && showWindow()}
        { gameState.isStarted ? 
          <Game 
            puzzle={gameConfig.dailyPuzzle} 
            isStarted={gameState.isStarted} 
            gameOver={gameOver} 
            handleWin={handleWin} 
            handlePrevGameArray={handlePrevGameArray} 
            prevGameArray={prevGameArray}
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
          isStarted={gameState.isStarted} 
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