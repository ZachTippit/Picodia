import React from 'react'

const PreGame = ({startGame}) => {
  return (
      <div>
          test
            <button className={'start-game'} onClick={() => startGame()}>Start Game</button>
      </div>
    
  )
}

export default PreGame