import React from 'react'
import { useSelector } from 'react-redux'

import Ping from './Ping'

const PingHandler = () => {

    const { playedToday, whatIsIt } = useSelector(state => state.gameConfig)
    const { didWin } = useSelector(state => state.gameState)
    const { startPing, alert, goAlert, isOpen } = useSelector(state => state.windowHandler)

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
    <div> 
        { (playedToday && !isOpen) && showPing('playedToday') }
        { (startPing && !playedToday) && showPing('goodLuck')}
        { goAlert && showPing('gameOver') }
        { alert && showPing('copiedToClipboard') }   
    </div>
  )
}

export default PingHandler