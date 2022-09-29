import React, {useState, useEffect} from 'react'
import { Grid } from '@mui/material';
import ExampleRow from './ExampleRow';
import { useSelector } from 'react-redux'
import { selectGameConfig } from '../features/gameConfig/gameConfigSlice';

const ExampleGrid = ({nextStart, order}) => {
  const [nextAnim, setNextAnim] = useState(-1);

  const onToNext = () => {
      setNextAnim(nextAnim + 1);
    }

  useEffect(() => { nextStart === order && setNextAnim(0) }, [nextStart])

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
      <ExampleRow exClue={"3"} exArray={[1,1,1]} nextStart={nextAnim} order={0} onToNext={onToNext} />
      <ExampleRow exClue={"1"} exArray={[1,'','']} nextStart={nextAnim} order={1} onToNext={onToNext} />
      <ExampleRow exClue={"3"} exArray={[1,1,1]} nextStart={nextAnim} order={2} onToNext={onToNext} />
    </Grid>
  )
}

export default ExampleGrid