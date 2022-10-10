import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import ReactGA from 'react-ga';
import { Footer, Game, HowToPlay, Navbar, PingHandler, Settings, SolveToStart, Stats, VersionNotes } from './Components'
import { onGameOver, handleWinStats, handleLoseStats, storageInit, checkDate, compareStorageKeys, daysSinceLaunch } from './lib/utilities'
import { _startGame, togglePreGameAnimation, setCurrentGameArray } from './features/gameState/gameStateSlice'
import { fetchDailyPuzzle, hasPlayedToday, puzzleIs, setPuzzleRef } from './features/gameConfig/gameConfigSlice';
import { toggleGameOverAlert, toggleOpen, toggleStartPing, setPath } from './features/windowHandler/windowHandlerSlice'

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID)

const App = () => {

  const dispatch = useDispatch();

  const { puzzleReference, isDarkMode, whatIsIt } = useSelector(state => state.gameConfig)
  const { isStarted, lives, didWin, currentGameArray, stateOfGame } = useSelector(state => state.gameState)
  const { isOpen, path } = useSelector(state => state.windowHandler)

  // App initializer
  useEffect(() => {
    ReactGA.set({ page: window.location.pathname });     // Google Analytics initializer on window
    ReactGA.pageview(window.location.pathname);
      
    localStorage.clear();                                         // Clears localStorage
    localStorage.length === 0 && storageInit(localStorage);          // Checks storage length, if empty, create storage object.
    !compareStorageKeys(localStorage) && storageInit(localStorage)   // Compares current localStorage to init values. If properties are not the same, update keys. (This is to assist in version control).

    // console.log('localStorage on Load: ', localStorage)

    const getDailyPuzzle = async () => {                  // Gets puzzle reference for puzzle fetcher
      await dispatch(fetchDailyPuzzle())
      dispatch(setPuzzleRef(daysSinceLaunch()))
    }

    if(checkDate()){ // Checks if played today
      // Set values if played today already
      // Set gameState.currentArray = localStorage.currentArray
      // 
      // 
      dispatch(puzzleIs(localStorage.whatIsIt))
      dispatch(hasPlayedToday(true));
      
      if(JSON.parse(localStorage.prevGameArray) !== currentGameArray){
        dispatch(setCurrentGameArray(JSON.parse(localStorage.prevGameArray)))
      }
    } else {
      dispatch(hasPlayedToday(false));                        // Resets played today on new day. 
      dispatch(setCurrentGameArray(localStorage.blankArray))  // Array is set up and ready to play.                                             //  Fetch puzzle if not played today.
      localStorage.whatIsIt = whatIsIt                                    
    }  
    getDailyPuzzle();
  }, [])

  const handleGameOver = (win, numLives) => { 
    onGameOver(numLives, win, currentGameArray, puzzleReference, whatIsIt)
    win ? handleWinStats(numLives) : handleLoseStats(numLives);
  }
  
  const gameOverAlerts = () => {
    dispatch(toggleGameOverAlert());
    setTimeout(() => {
      dispatch(toggleGameOverAlert())
    }, 4000)

    setTimeout(() => {
      isSeen('stats') 
    }, 2000)
  }

  const startGame = () => { 
    dispatch(togglePreGameAnimation())
    setTimeout(() => {
      localStorage.playedPicodia = true;
      dispatch(_startGame())
      dispatch(togglePreGameAnimation())
    }, 1200)
    
    setTimeout(() => {
      dispatch(toggleStartPing())
    }, 3000)

    setTimeout(() => {
      dispatch(toggleStartPing())
    }, 8000)
  
  }

  const isSeen = (path) => {
    if(path === 'version-notes'){
      setTimeout(() => {
        dispatch(setPath(path))
      }, 500)
    } else {
      setTimeout(() => {
        dispatch(toggleOpen())
        dispatch(setPath(path))
      }, 200);  
    }
  }

  const showWindow = (path) => {
    switch(path){
      case 'how-to-play':
        return <HowToPlay closeMenu={isSeen}/>
      case 'stats':
        return <Stats closeMenu={isSeen} />
      case 'settings':
        return <Settings closeMenu={isSeen} version={puzzleReference}/>
      case 'version-notes':
        return <VersionNotes closeMenu={isSeen}/>
      default:
        return;
    }
  }

  useEffect(() => {
    switch(stateOfGame){
      case 'starting':
        return;
      case 'playing':
        startGame();
        return;
      case 'game over':
        handleGameOver(didWin, lives, localStorage.prevTime);
        gameOverAlerts();
        return;
      default:
        return;
    }
  }, [stateOfGame])
 
  return (
    <div id={'cover-screen'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
      <div id={'app'} className={(isDarkMode ? 'dark-theme' : 'light-theme')}>
        <Navbar openMenu={isSeen}/>
        { isOpen && showWindow(path)}
        { !isStarted ? <SolveToStart /> : <Game /> }
        <Footer openMenu={isSeen} />
      </div>
    </div>
  );
}

export default App;