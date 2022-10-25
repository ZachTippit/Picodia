import React, { useState, useEffect } from 'react'
import { Grid } from '@mui/material'
import { useSelector } from 'react-redux'

type ExampleRowProps = {
    exClue: string,
    exArray: any,
    onToNext: any,
    order: number,
    activeCard: any,
    checked: boolean
}

const ExampleRow: React.FunctionComponent<ExampleRowProps> = ({exClue, exArray, onToNext, order, activeCard, checked}) => {
    const {isDarkMode, isRBBlind} = useSelector((state: any) => state.gameConfig)

    const [nextAnim, setNextAnim] = useState<number | undefined>(undefined);

    useEffect(() => {
        if(activeCard === order){
            setNextAnim(0)
        }
    }, [activeCard])

    useEffect(() => {
        if(nextAnim !== undefined){
            if(nextAnim >= 0 && nextAnim <=exArray.length){
                setTimeout(() => {
                    setNextAnim(nextAnim + 1)
                }, 300)
            }
            if(nextAnim === exArray.length){
                setTimeout(() => {
                    onToNext()
                }, 500)
            }
        }
    }, [nextAnim])

  return (
    <Grid container columns={13} width='70%' marginLeft='2rem' className='ex-grid'>
        <Grid item xs={3} alignSelf={'center'}>
            <p style={{margin: 0, textAlign: 'right', paddingRight: '0.5rem'}}>{exClue}</p>
        </Grid>
        {exArray.map((cell: number, index: number) => (
            <Grid item xs className={'ex-cell ' + (isDarkMode ? 'light-' : 'dark-') + ((nextAnim!==undefined && nextAnim>=index) ? (cell===1 ? 'right pulsate-fwd ' : cell===0 ? (isRBBlind ? ' color-blind-wrong pulsate-fwd ' : ' wrong pulsate-fwd ') : (cell===2 && checked) ? 'flagged pulsate-fwd ' : ' pulsate-fwd') : ' ')} />
        ))}
    </Grid>
  )
}

export default ExampleRow