import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material'
import '../styles.css';

import Cell from './Cell.jsx'

const GameBoardAll = ({gridSize, gameGrid, isDarkMode, loseLife}) => {

  return (
    <div id='game-board'>
        <Grid container item columns={gridSize} style={{width: '90%', margin: 'auto', marginBottom: '2rem'}}>
            {gameGrid.map((cell, index) => (
                <>
                    {   index === 0 || index === 1 ?
                        <Grid item xs={1}>
                        </Grid>
                        :
                        <>
                            { (parseInt(index/gridSize)===0)  ?
                            <Grid item xs={1}>
                                <Grid container direction='column' justifyContent='flex-end' style={{height: '100%'}}>
                                    {cell.map((clue, index2) => (
                                        <Grid item id={index2} key={index2} className='clue-col'>
                                            <p className='col-clues-txt' key={index2}>{clue}</p>
                                        </Grid>))}
                                </Grid>
                            </Grid>  
                            :   
                                <>
                                    { index%gridSize === 0 ?
                                        <Grid item xs={2}>
                                            <Grid container direction='row' columnSpacing={1} justifyContent='flex-end' alignItems='center' wrap="nowrap" sx={{pr: 2}} style={{height: '100%', marginRight: '0.5rem'}}>
                                                {cell.map((clue, index3) => (
                                                    <Grid item id={index3} key={index3} className='clue-row'>
                                                        <Typography className='row-clues-txt' key={index3} nowrap>{clue}</Typography>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                        :
                                        <>
                                            {index%gridSize === 1  ?
                                                null   
                                            :   
                                                <Grid item xs={1}>
                                                    <Cell isDarkMode={isDarkMode} cell={cell} cellNum={index} loseLife={loseLife}/>
                                                </Grid>
                                            }
                                        </>
                                            
                                    }
                                </>
                                
                            }       
                        </>
                    } 
            </>
            ))}
        </Grid>
    </div>
  )
}

export default GameBoardAll


// const createGameObject = (answer) => {
//     const rowClue = rowClues(answer);
//     const colClue = colClues(answer);
//     const gameArr = gameArray(answer);
//     const gridSize = answer.length + 1;
//     const gameArrLength = gridSize**2;
//     let gameObj = [];
//     let offsetter = -1;
//     [...Array(gameArrLength).keys()].map((item, index) => {
//         if(index === 0){
//           gameObj.push('');
//         } else if(parseInt(index/gridSize) === 0){
//             gameObj.push(colClue[index-1])
//         } else if(index%gridSize === 0){
//             gameObj.push(rowClue[parseInt(index/gridSize) -1])
//             offsetter++;
//         } else {
//             gameObj.push(gameArr[index-12-offsetter])
//         }
//     })
//     return gameObj;
// }