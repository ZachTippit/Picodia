import React, { useState } from 'react'
import { useEffect } from 'react';
import '../styles.css';

const Cell = ({cell, isDarkMode, cellNum}) => {
    const [toggleClick, setIsClicked] = useState(false);
    const [correct, setCorrect] = useState(cell);
    const [right, setRight] = useState()

    const setClicked = () => {
        console.log(cell, cellNum)
        setIsClicked(!toggleClick)
    }

    useEffect(() => {
        if(toggleClick){
            cell ? setRight(true) : setRight(false)
        }
    }, [toggleClick])

  return (
    <div className={'cell ' + (isDarkMode ? 'light ' : 'dark ') + (toggleClick && (right ? 'right' : 'wrong'))} onClick={() => setClicked()}>
        
    </div>
  )
}

export default Cell