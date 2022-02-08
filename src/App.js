import React, {useEffect, useState} from 'react';
import { About, Footer, Game, Navbar, Settings, Stats } from './Components'
import './App.css';

const App = () => {

  const [isOpen, setIsOpen] = useState(false);
  const [path, setPath] = useState();
  const [timer, setTimer] = useState(0);
  const [isStarted, setIsStarted] = useState(true);
  const [totalTime, setTotalTime] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [lives, setLives] = useState(3);
  const [stats, setStats] = useState({
    gamesPlayed: 3,
    winPercent: 0.5,
    currentStreak: 3,
    bestStreak: 3
  })

  const isSeen = (path) => {
    setIsOpen(!isOpen);
    setPath(path)
   
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalTime(totalTime => totalTime + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    setSeconds(totalTime%60)
  }, [totalTime])

  useEffect(() => {
    setMinutes(parseInt(totalTime/60))
  }, [seconds])

  const showWindow = () => {
    switch(path){
      case 'about':
        return <About closeMenu={isSeen} />
      case 'stats':
        return <Stats closeMenu={isSeen} playerStats={stats}/>
      case 'settings':
        return <Settings closeMenu={isSeen} />
      default:
        return;
    }
  }

  return (
    <div id={'app'}>
      <Navbar openMenu={isSeen}/>
      { isOpen && showWindow()}
      <Game />
      <Footer seconds={seconds} minutes={minutes} lives={lives}/>
    </div>
  );
}

export default App;
