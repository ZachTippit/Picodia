import React from 'react';
import { useSelector } from 'react-redux'
import Ping from './Ping'

const PingHandler = () => {

    const { playedToday, whatIsIt } = useSelector((state: any) => state.gameConfig)
    const { didWin } = useSelector((state: any) => state.gameState)
    const { startPing, alert, goAlert, isOpen } = useSelector((state: any) => state.windowHandler)

    const showPing = (type: string) => {
        switch(type){
          case 'goodLuck':
            return <Ping note='Good luck!' startPing={true} pingType={''}/>
          case 'copiedToClipboard':
            return <Ping note='Copied to clipboard!' startPing={false} pingType={''}/>
          case 'gameOver':
            return <Ping note={didWin ? `Nice! It's ${localStorage.whatIsIt}.` : 'Bummer...'} startPing={false} pingType={''}/>
          case 'playedToday':
            return <Ping note={`You have already played today. It was ${whatIsIt}!`} pingType='played' startPing={false}/>
          default:
            return
        }
      }

  return (
    <div id='clip-container'> 
        { (playedToday && !isOpen) && showPing('playedToday') }
        { (startPing && !playedToday) && showPing('goodLuck')}
        { goAlert && showPing('gameOver') }
        { alert && showPing('copiedToClipboard') }   
    </div>
  )
}

export default PingHandler