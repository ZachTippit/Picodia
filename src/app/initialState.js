// Slices have been defined as:
//      - gameConfigs:  all settings related to game configuration and management in Picodia
//      - statsState:   manager for all player statistics that are saved to localStorage (with a few choice vars sent to backend for logging)
//      - gameState:    handles all settings over each individual game played
//      - alertsState:  handles pop ups, opening, closure & timing of dialog boxes/menus

export const gameConfig = {
    dailyPuzzle: Array(8),
    puzzleReference: 0,
    whatIsIt: '',
    lastPlayed: 0,
    isDarkMode: false,

}

export const statsState = {
    prevGameArray: [],
    prevLives: 0,
    prevOutcome: '',
    prevTime: '',
}

export const gameState = {
    hardMode: false,
    maxLives: 3,
    lives: 3,
    isStarted: false,
    didWin: false,
    gameOver: false,
    gameOverNote: false,
    gameOverTime: ''
}

export const windowHandler = {
    isOpen: false,
    path: '',
    closing: false,
    ping: false,
    pingHowTo: false,
    preGameAnim: false,
    startPing: false,
    alert: false,
    goAlert: false,
}