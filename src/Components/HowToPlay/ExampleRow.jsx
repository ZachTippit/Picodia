import React, {useState, useEffect} from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'

const ExampleRow = ({exClue, exArray, nextStart, onToNext, order}) => {
    const isDarkMode = useSelector(state => state.gameConfig.isDarkMode)

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
            }, 500)
        }
    }, [nextAnim])

  return (
    <Grid container columns={13} width='70%' marginLeft='2rem' className='ex-grid'>
        <Grid item xs={3} alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{exClue}</p>
        </Grid>
        {exArray.map((cell, index) => (
            <Grid item xs className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + ((nextAnim>=index) ? (cell===1 ? 'right pulsate-fwd ' : cell===0 ? 'wrong pulsate-fwd ' : cell===2 ? 'flagged pulsate-fwd ' : ' pulsate-fwd') : ' ')} onAnimationEnd={() => {setNextAnim(nextAnim + 1)}} />
        ))}
    </Grid>
  )
}

export default ExampleRow