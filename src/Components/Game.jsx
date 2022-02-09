import React, {useEffect, useState} from 'react';
import { Grid } from '@mui/material'
import './styles.css';

import GameHeader from './Game/GameHeader.jsx'
import GameBoard from './Game/GameBoard.jsx'
import ColClues from './Game/ColClues.jsx'
import RowClues from './Game/RowClues.jsx'

import { rowClues, colClues, createGameObject } from '../lib/game.js'

const gridSize = 10;
// const gameGrid = [...Array(gridSize**2).keys()];
const colCluesDEMO = [...Array(gridSize).keys()]
const colClues2 = [[1,1],[2],[3,1],[10],[8,1],[7,2],[6,3],[5,4],[4,5],[3,6]];
const answer = [[1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1,1,0], [1,1,1,1,1,1,1,1,0,0], [1,1,1,1,1,1,1,0,0,0], [1,1,1,1,1,1,0,0,0,0],
                [0,0,0,0,1,1,1,1,1,1], [1,1,1,1,1,0,1,1,1,0], [1,1,1,1,1,1,1,1,0,0], [1,1,1,0,1,1,1,0,0,0], [0,1,1,1,1,1,0,0,0,0]];

const Game = ({isDarkMode}) => {

  const [gameGrid, setGameGrid] = useState(createGameObject(answer))
  const [gridSize, setGridSize] = useState(answer.length)
  const [rowClue, setRowClues] = useState(rowClues(answer))
  const [colClue, setColClues] = useState(colClues(answer))

  useEffect(() => {
    console.log(rowClue)
    console.log(colClue)
  }, [])
  
  return (
    <div id='game'>
      <GameHeader />
      <Grid container columns={10}>
        <Grid item xs={1}>
          <RowClues gridSize={gridSize} rowClues={rowClue} />
        </Grid>
        <Grid item xs={9}>
          <ColClues gridSize={gridSize} colClues={colClue} />
          <GameBoard gridSize={gridSize} gameGrid={gameGrid} isDarkMode={isDarkMode}/>
        </Grid>
      </Grid>
    </div>
  )
};

export default Game;
