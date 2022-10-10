import { useState } from 'react'
import { useSelector } from 'react-redux';

const Ping = ({note, startPing=false, pingType}) => {

    const [close, setClose] = useState(false);
    const gameConfig = useSelector(state => state.gameConfig)
    const gameState = useSelector(state => state.gameState)

    const closePing = () => {
      switch(pingType){
        case 'played':
          break;
        default:
          setTimeout(() => {
            setClose(!close)
          }, 2300)
      } 
    }


  return (
    <div id='clip-ping' className={'clip-anim-in ' + ((gameConfig.playedToday || startPing) ? 'played-ping ' : (gameState.didWin ? 'win-ping ' : 'lose-ping ')) + (close ? ' clip-anim-out ' : ' ') } onAnimationEnd={() => closePing()}>
      <p>{note}</p>
    </div>
  )
}

export default Ping