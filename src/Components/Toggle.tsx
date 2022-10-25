import React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { togglesDarkMode, togglesRBColorBlindMode } from "../features/gameConfig/gameConfigSlice"
import { toggleHardMode } from '../features/gameState/gameStateSlice'

type ToggleProps = {
    clickHandler: any;
    defVal: boolean;
}

const Toggle: React.FunctionComponent<ToggleProps> = ({clickHandler, defVal}) => {
    const dispatch = useDispatch()

    const { isRBBlind } = useSelector((state: any) => state.gameConfig)

    const handleClick = (clickHandler: string) => {
        switch(clickHandler){
            case 'dark mode':
                dispatch(togglesDarkMode()) 
                break;
            case 'hard mode':
                dispatch(toggleHardMode())
                break;
            case 'color blind mode':
                dispatch(togglesRBColorBlindMode())  
                break;
            default:
                return;
        }
    }

  return (
    <div>
        <label className=" setting-switch">
            <div className="button b2" id="button-11">
                <input type="checkbox" className="checkbox" onClick={() => handleClick(clickHandler)} defaultChecked={defVal}/>
                <div className={isRBBlind ? 'knobs cb ' : 'knobs'}><span></span></div>
                <div className={isRBBlind ? 'layer cb-layer' : 'layer'}></div>
            </div>
        </label>
    </div>
  )
}

export default Toggle