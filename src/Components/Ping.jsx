import { useState } from 'react'
import { useSelector } from 'react-redux';

const Ping = ({note, startPing=false}) => {
    const [close, setClose] = useState(false);
    const gameConfig = useSelector(state => state.gameConfig)
    const gameState = useSelector(state => state.gameState)


  return (
    <div id='clip-ping' className={'clip-anim-in ' + ((gameConfig.playedToday || startPing) ? 'played-ping ' : (gameState.didWin ? 'win-ping ' : 'lose-ping ') + (close && 'clip-anim-out ')) } onAnimationEnd={() => setTimeout(() => setClose(!close), 2000)}>{note}</div>
  )
}

export default Ping