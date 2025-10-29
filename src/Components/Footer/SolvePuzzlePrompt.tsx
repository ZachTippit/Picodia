import { use } from 'react'
import { GameContext } from '../../GameContext';

const SolvePuzzlePrompt = () => {
    const { state: { preGameAnim } } = use(GameContext);
    return (
        <div className={preGameAnim ? 'fade-out-right ' : ' '}>
            <p className="solve-to-start-txt">
                <b>Solve the puzzle to start</b>
            </p>
        </div>
  )
}

export default SolvePuzzlePrompt