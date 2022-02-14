import React, {useState, useEffect} from 'react'
import { Grid } from '@mui/material'

const ExampleRow = ({exClue, exArray, nextStart, onToNext, order, isDarkMode}) => {
    const [nextAnim, setNextAnim] = useState();

    useEffect(() => {
        if(nextStart === order){
            setTimeout(() => {
                setNextAnim(0)
            }, 1000)
        }
    }, [nextStart])

    useEffect(() => {
        if(nextAnim === exArray.length){
            setTimeout(() => {
                onToNext();
            }, 1000)
        }
    }, [nextAnim])

  return (
    <Grid container columns={13} width='70%' marginLeft='2rem' className='ex-grid'>
        <Grid item xs={3} alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{exClue}</p>
        </Grid>
        {exArray.map((cell, index) => (
            <Grid item xs={2} className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + (cell===1 ? 'right ' : cell===0 ? ' wrong ' : ' flagged ') + ((nextAnim===index) && ' pulsate-fwd ') } onAnimationEnd={() => {setNextAnim(nextAnim + 1)}}>
                
            </Grid>
        ))}
    </Grid>
  )
}

export default ExampleRow