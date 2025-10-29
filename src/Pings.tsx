import React, { use } from 'react'
import { GameContext } from './GameContext';
import { Ping } from './Components';

interface PingsProps {
    playedToday: boolean;
    goAlert: boolean;
    alert: boolean;
    gameOverNote?: string | false;
    whatIsIt?: string;
}

const Pings = ({ playedToday, goAlert, alert, gameOverNote, whatIsIt }: PingsProps) => {
  const { state: { showAbout, showStats, showSettings, startPing } } = use(GameContext);
  const isModalOpen = showAbout || showStats || showSettings;
  return (
    <>
      {playedToday && !isModalOpen && <Ping note="Good luck!" />}
      {startPing && !playedToday && <Ping note="Good luck!" />}
      {goAlert && <Ping note={gameOverNote || undefined} />}
      {alert && <Ping note={`You have already played today. It was ${whatIsIt}!`} />}
    </>
  )
}

export default Pings