import { Grid } from '@mui/material'

const Clues = ({cell, index, rowOrCol}) => {

  return ( 
    <Grid item xs={(rowOrCol==='column' ? 1 : 2)} className={`disable-select clue-${rowOrCol}-container`} key={`${rowOrCol}-clue@${index}`} draggable='false'>
        <Grid container direction={rowOrCol} justifyContent='flex-end' alignItems='center' style={{height: '100%'}} columnSpacing={1} draggable='false'>
            {cell.length > 0 ? 
              <>
              {
                cell.map((clue, index2) => (
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
