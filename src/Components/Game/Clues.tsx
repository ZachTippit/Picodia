import React from 'react';
import { Grid, GridDirection } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';

type ClueProps = {
  cell: any,
  index: number,
  rowOrCol: ResponsiveStyleValue<GridDirection>
}

const Clues: React.FunctionComponent<ClueProps> = ({cell, index, rowOrCol}) => {
  return ( 
    <Grid item xs={(rowOrCol==='column' ? 1 : 2)} className={`disable-select clue-${rowOrCol}-container`} key={`${rowOrCol}-clue@${index}`} draggable='false'>
        <Grid container direction={rowOrCol} justifyContent='flex-end' alignItems='center' style={{height: '100%'}} columnSpacing={1} draggable='false'>
            {cell.length > 0 ? 
              <>
              {
                cell.map((clue: boolean, index2: number) => (
                  <Grid item key={`${rowOrCol}-clue-item@${index2}`} className={`clue-${rowOrCol}`} draggable='false'>
                      <p className={`fade-in-${rowOrCol}`} draggable='false'>{clue}</p>
                  </Grid>))
              }
              </>
              :
              <Grid item key={`${rowOrCol}-empty-clue-item@${index}`} className={`clue-${rowOrCol}`} draggable='false'>
                <p className={`fade-in-${rowOrCol}`} draggable='false'> </p>
              </Grid>
            }
        </Grid>
    </Grid>  
  )
}

export default Clues;
