import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material'
import '../styles.css';

import ColClues from './ColClues.jsx'
import Cell from './Cell.jsx'

const GameBoard = ({gridSize, gameGrid, isDarkMode, loseLife}) => {

  return (
    <div id='game-board'>
        <Grid container columns={gridSize} style={{width: '90%', margin: 'auto', marginBottom: '2rem'}}>
            {gameGrid.map((cell, index) => (
                <>
                    {   index === 0 || index === 1 ?
                        <Grid item xs={1} key={`blank@${index}`}>
                        </Grid>
                        :
                        // Column Clues (if index is in the first row)
                        <>
                            { (parseInt(index/gridSize)===0)  ? 
                                <ColClues cell={cell} index={index}/>
                            :   
                                <>
                                    { index%gridSize === 0 ? //Row Clues (in index is on far left side after the first row)
                                        <Grid item xs={2} className={'disable-select'} key={`row-clue@${index}`}>
                                            <Grid container direction='row' columnSpacing={1} justifyContent='flex-end' alignItems='center' wrap="nowrap" sx={{pr: 2}} style={{height: '100%', marginRight: '0.5rem'}}>
                                                {cell.map((clue, index3) => (
                                                    <Grid item key={`row-clue-item@${index3}`} className='clue-row'>
                                                        <Typography className='row-clues-txt'>{clue}</Typography>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Grid>
                                        :
                                        <>
                                            {index%gridSize === 1  ? //Space creator for above.
                                                null   
                                            :   //Aaaand the cells
                                                <Grid item xs={1} key={`cell@${index}`}> 
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

export default GameBoard