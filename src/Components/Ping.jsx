import React, { useState } from 'react'

const Ping = ({note, didWin, playedToday=false, startPing=false}) => {
    const [close, setClose] = useState(false);

  return (
    <div id='clip-ping' className={'clip-anim-in ' + ((playedToday || startPing) ? 'played-ping ' : (didWin ? 'win-ping ' : 'lose-ping ') + (close && 'clip-anim-out ')) } onAnimationEnd={() => setTimeout(() => setClose(!close), 2000)}>{note}</div>
  )
}

export default Ping