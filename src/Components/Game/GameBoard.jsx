import React, { useState, useEffect } from 'react';
import { Grid } from '@mui/material'
import '../styles.css';

import Clues from './Clues.jsx'
import Cell from './Cell.jsx'

const GameBoard = ({gridSize, gameGrid, isStarted, loseLife, isDarkMode}) => {

  return (
    <div id='game-board'>
        <Grid container columns={gridSize} style={{width: '90%', margin: 'auto', marginBottom: '2rem'}}>
            {gameGrid.map((cell, index) => (
                <>
                    { index === 0 || index === 1 ?
                        // Blank top-left corner
                        <Grid item xs={1} key={`blank@${index}`} />
                        :
                        // Column Clues (if index is in the first row)
                        <>
                            { (parseInt(index/gridSize)===0)  ? 
                            <Clues cell={cell} index={index} rowOrCol={'column'} key={index} isStarted={isStarted}/>
                            : 
                        // Row Clues (in index is on far left side after the first row)  
                            <>
                                { index%gridSize === 0 ? 
                                <Clues cell={cell} index={index} rowOrCol={'row'} key={index} isStarted={isStarted} />
                                :
                        // Space creator for above.
                                <>
                                {index%gridSize === 1  ? 
                                    null   
                                :   
                        // Aaaand the cells
                                    <Cell isDarkMode={isDarkMode} cell={cell} cellNum={index} loseLife={loseLife} key={`cell@${index}`}/>
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