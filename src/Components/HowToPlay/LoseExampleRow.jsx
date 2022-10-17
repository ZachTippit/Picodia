import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux'
import { Grid } from '@mui/material'

import {default as Heart} from '../../assets/heart.png'
import { default as HeartCB} from '../../assets/heart-cb.png'
import {default as EmptyHeart} from '../../assets/empty-heart.png'


const LoseExampleRow = ({exClue, exArray, activeCard, order}) => {
    const { isDarkMode, isRBBlind } = useSelector(state => state.gameConfig)

    const [nextAnim, setNextAnim] = useState();

    useEffect(() => {
        if(activeCard === order){
            setNextAnim(0)
        }
    }, [activeCard])

    useEffect(() => {
        if(nextAnim >= 0 && nextAnim <=exArray.length){
            setTimeout(() => {
                setNextAnim(nextAnim + 1)
            }, 300)
        }
    }, [nextAnim])

  return (
    <Grid container direction='row' margin='1rem 0'>
        <Grid container columns={13} width='60%'>
            <Grid item xs={3} alignSelf={'center'}>
                <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{exClue}</p>
            </Grid>
            {exArray.map((cell, index) => (
                <Grid item xs={2} className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + ((nextAnim>=index) ? (cell===1 ? 'right pulsate-fwd' : cell===0 ? (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ') : ' flagged pulsate-fwd') : ' ')} />
            ))}
        </Grid>
        <Grid container width='35%' marginLeft='5%'>
            {[...Array(3)].map((life, index) => (
                index+1>=nextAnim ?
                <Grid item xs>
                    <img className={'life '} src={isRBBlind ? HeartCB : Heart} alt='Lives' key={index}/>
                </Grid> 
                :
                <Grid item xs>
                    <img className={'life vibrate-1'} src={EmptyHeart} alt='Lives' key={index}/>
                </Grid>                   
                )).reverse()}
        </Grid>
    </Grid>
  )
}

export default LoseExampleRow