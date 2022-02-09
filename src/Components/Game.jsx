import React from 'react';
import { Grid } from '@mui/material'
import './styles.css';

import GameHeader from './Game/GameHeader.jsx'
import GameBoard from './Game/GameBoard.jsx'
import ColClues from './Game/ColClues.jsx'
import RowClues from './Game/RowClues.jsx'

const gridSize = 10;
const gameGrid = [...Array(gridSize**2).keys()];
const colCluesDEMO = [...Array(gridSize).keys()]
const colClues = [[1,1],[2],[3,1],[10],[8,1],[7,2],[6,3],[5,4],[4,5],[3,6]];

const Game = () => {
  return (
    <div id='game'>
      <GameHeader />
      <Grid container columns={10}>
        <Grid item xs={1}>
          <RowClues gridSize={gridSize} rowClues={colClues} />
        </Grid>
        <Grid item xs={9}>
          <ColClues gridSize={gridSize} colClues={colClues} />
          <GameBoard gridSize={gridSize} gameGrid={gameGrid} />
        </Grid>
      </Grid>
    </div>
  )
};

export default Game;
