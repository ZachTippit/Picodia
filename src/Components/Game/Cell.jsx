import React, { useState } from 'react'
import { useEffect } from 'react';
import '../styles.css';

const Cell = ({cell, isDarkMode, cellNum, loseLife}) => {
    const [guessed, setGuessed] = useState(false);
    const [flagged, setFlagged] = useState(false);
    const [correct, setCorrect] = useState(cell);
    const [right, setRight] = useState()

    const handleGuess = () => {
        setGuessed(true)
    }

    const handleFlagged = () => {
      setFlagged(!flagged);
    }

    useEffect(() => {
        if(guessed){
            cell ? setRight(true) : setRight(false)
        }
    }, [guessed])

    useEffect(() => {
      if(!right){
        loseLife();
      }
    }, [right])

  return (
    <div 
      className={'cell '
                + (isDarkMode ? 'light ' : 'dark ') 
                + (flagged ? 'flagged ' : '')
                + (guessed && (right ? 'right' : 'wrong'))
              }
      onClick={() => handleGuess()} 
      onDragEnter={() => handleGuess()} onContextMenu={(e) => { e.preventDefault(); handleFlagged()}}>
        
    </div>
  )
}

export default Cell