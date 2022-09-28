import React, {useState, useEffect} from 'react'
import { Grid } from '@mui/material'
import {default as Heart} from '../assets/heart.png'
import {default as EmptyHeart} from '../assets/empty-heart.png'
import { useSelector } from 'react-redux'
import { selectGameConfig } from '../features/gameConfig/gameConfigSlice';


const LoseExampleRow = ({exClue, exArray, nextStart, order}) => {
    const isDarkMode = useSelector(selectGameConfig).isDarkMode

    const [nextAnim, setNextAnim] = useState(-1);
    const [fakeGameOver, setFakeGameOver] = useState();

    useEffect(() => {
        if(nextStart === order){
            setTimeout(() => {
                setNextAnim(0)
            }, 1000)
        }
    }, [nextStart])

    useEffect(() => {
        if(nextAnim === 3){
            setFakeGameOver(true);
        }
    }, [nextAnim])

  return (
    <Grid container direction='row' margin='1rem 0'>
        <Grid container columns={13} width='60%'>
            <Grid item xs={3} alignSelf={'center'}>
                <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{exClue}</p>
            </Grid>
            {exArray.map((cell, index) => (
                <Grid item xs={2} className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + ((nextAnim>=index) ? (cell===1 ? 'right pulsate-fwd' : cell===0 ? ' wrong pulsate-fwd' : ' flagged pulsate-fwd') : ' ')} onAnimationEnd={() => {setNextAnim(nextAnim + 1)}} />
            ))}
        </Grid>
        <Grid container width='35%' marginLeft='5%'>
            {[...Array(3)].map((life, index) => (
                index+2>=nextAnim ?
                <Grid item xs>
                    <img className={'life '} src={Heart} alt='Lives' key={index}/>
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