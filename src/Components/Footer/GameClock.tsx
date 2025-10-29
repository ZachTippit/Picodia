import { use, useEffect, useState } from 'react'
import { GameContext } from '../../GameContext';

const GameClock = () => {
    const { state: { isGameStarted, hasPlayedToday, gameOver } } = use(GameContext);
    
    const [totalTime, setTotalTime] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    
    const pad = (val) => {
        let valString = val + '';
        return valString.length < 2 ? '0' + valString : valString;
    };

    useEffect(() => {
        if (!gameOver) {
        setSeconds(totalTime % 60);
        }
    }, [totalTime]);
    
    useEffect(() => {
        if (!gameOver) {
            setMinutes(Math.floor(totalTime / 60));
        }
    }, [seconds]);

    useEffect(() => {
        if (gameOver) {
            handleGameOverTime();
        }
    }, [gameOver]);

    useEffect(() => {
        if (isGameStarted && !gameOver) {
            setTotalTime(0);
        }
    }, [isGameStarted]);

    useEffect(() => {
        if (!gameOver) {
            const interval = setInterval(() => {
                setTotalTime((totalTime) => totalTime + 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [gameOver]);

    const handleGameOverTime = () => {
        localStorage.prevTime = totalTime;
    };

    return (
        <div className="fade-in-fwd move-on-start-footer ">
            <p className="text-center mb-2 font-bold">TIME</p>
            <div className="m-auto text-center">
                <label className="text-sm">
                    {pad(hasPlayedToday ? Math.floor(localStorage.prevTime / 60) : minutes)}
                </label>
                <label className="text-sm">:</label>
                <label className="text-sm">
                    {pad(hasPlayedToday ? localStorage.prevTime % 60 : seconds)}
                </label>
            </div>
        </div>
  )
}

export default GameClock