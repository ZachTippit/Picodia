import React, {useEffect, useState} from 'react';
import { Grid } from '@mui/material'
import './styles.css';

import GameHeader from './Game/GameHeader.jsx'
import GameBoard from './Game/GameBoard.jsx'
import PreGame from './Game/PreGame.jsx'

import {  createGameObject } from '../lib/game.js'

// const answer = [[1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1,1,0], [1,1,1,1,1,1,1,1,0,0], [1,1,1,1,1,1,1,0,0,0], [1,1,1,1,1,1,0,0,0,0],
//                 [0,0,0,0,1,1,1,1,1,1], [1,1,1,1,1,0,1,1,1,0], [1,1,1,1,1,1,1,1,0,0], [1,1,1,0,1,1,1,0,0,0], [0,1,1,1,1,1,0,0,0,0]];

const answer = [[1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0],
[1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0], [1,0,1,0,1,0,1,0]];

const Game = ({isDarkMode, startGame, isStarted, loseLife}) => {
  
  return (
    <div id='game'>
      <GameHeader />
      {!isStarted ? 
        <PreGame startGame={startGame}/>
        :
        <GameBoard gridSize={answer.length + 2} gameGrid={createGameObject(answer)} isDarkMode={isDarkMode} loseLife={loseLife}/>
      }
      
      
    </div>
  )
};

export default Game;
