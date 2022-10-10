import { useDispatch, useSelector } from 'react-redux'
import { togglesDarkMode, togglesRBColorBlindMode } from "../features/gameConfig/gameConfigSlice"
import { toggleHardMode } from '../features/gameState/gameStateSlice'


const Toggle = ({clickHandler, defVal}) => {
    const dispatch = useDispatch()

    const { isRBBlind } = useSelector(state => state.gameConfig)

    const handleClick = (clickHandler) => {
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
            <div class="button b2" id="button-11">
                <input type="checkbox" class="checkbox" onClick={() => handleClick(clickHandler)} defaultChecked={defVal}/>
                <div class={isRBBlind ? 'knobs cb ' : 'knobs'}><span></span></div>
                <div class={isRBBlind ? 'layer cb-layer' : 'layer'}></div>
            </div>
        </label>
    </div>
  )
}

export default Toggle