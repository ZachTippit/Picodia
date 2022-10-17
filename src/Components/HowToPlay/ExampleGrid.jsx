import {useState, useEffect} from 'react'
import { Grid } from '@mui/material';
import ExampleRow from './ExampleRow';
import { useSelector } from 'react-redux'

const ExampleGrid = ({activeCard, order}) => {
  const {isDarkMode, isRBBlind} = useSelector(state => state.gameConfig)
  const [nextAnim, setNextAnim] = useState(-1);

  const onToNext = () => {
    setNextAnim(nextAnim + 1);
  }

  useEffect(() => { 
    activeCard === order && setNextAnim(0) 
  }, [activeCard])

  useEffect(() => {
    if(nextAnim >= 0 && nextAnim <= 9){
        setTimeout(() => {
            setNextAnim(nextAnim + 1)
        }, 300)
    }
}, [nextAnim])

  return (
    <Grid container columns={4} width='70%' mb={4}  justifyContent='center' className='ex-grid3-3' ml={4}>
      <Grid container columns={13} width='70%' marginLeft='2rem' className='ex-grid'>
        <Grid item xs={3} alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}> </p>
        </Grid>
        <Grid item xs alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'center', paddingRight: '0.5rem'}}>3</p>
        </Grid>
        <Grid item xs alignSelf={'center'}>
          <p style={{margin: 0, textAlign: 'center', paddingRight: '0.5rem'}}>1</p>
        </Grid>
        <Grid item xs alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'center', paddingRight: '0.5rem'}}>1</p>
            <p style={{margin: 0, textAlign: 'center', paddingRight: '0.5rem'}}>1</p>
        </Grid>
      </Grid>
      <Grid container columns={13} width='70%' marginLeft='2rem' className='ex-grid'>
        <Grid item xs={3} alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{'3'}</p>
        </Grid>
        {[1,1,1].map((cell, index) => (
            <Grid item xs className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + ((nextAnim>=index) ? (cell===1 ? 'right pulsate-fwd ' : cell===0 ? (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ') : cell===2 ? 'flagged pulsate-fwd ' : ' pulsate-fwd') : ' ')} />
        ))}
    </Grid>
    <Grid container columns={13} width='70%' marginLeft='2rem' className='ex-grid'>
        <Grid item xs={3} alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{'1'}</p>
        </Grid>
        {[1,'',''].map((cell, index) => (
            <Grid item xs className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + ((nextAnim>=(index+3)) ? (cell===1 ? 'right pulsate-fwd ' : cell===0 ? (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ') : cell===2 ? 'flagged pulsate-fwd ' : ' pulsate-fwd') : ' ')} />
        ))}
    </Grid>
    <Grid container columns={13} width='70%' marginLeft='2rem' className='ex-grid'>
        <Grid item xs={3} alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{'1 1'}</p>
        </Grid>
        {[1,'',1].map((cell, index) => (
            <Grid item xs className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + ((nextAnim>=(index+6)) ? (cell===1 ? 'right pulsate-fwd ' : cell===0 ? (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ') : cell===2 ? 'flagged pulsate-fwd ' : ' pulsate-fwd') : ' ')} />
        ))}
    </Grid>
    </Grid>
  )
}

export default ExampleGrid