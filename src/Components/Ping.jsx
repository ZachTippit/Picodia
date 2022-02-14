import React, { useState } from 'react'
import './styles.css'

const Ping = ({note}) => {
    const [close, setClose] = useState(false);

  return (
    <div id='clip-ping' className={'clip-anim-in ' + (close && 'clip-anim-out')} onAnimationEnd={() => setTimeout(() => setClose(!close), 2000)}>{note}</div>
  )
}

export default Ping