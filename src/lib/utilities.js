// Local Storage Handlers

const storageInit = () => {
    localStorage.totalGames = 0;        // Total games played
    localStorage.wonGames = 0;          // Games won
    localStorage.winPercent = 0;      // Percentage of games won   
    localStorage.lostGames = 0;         // Games lost
    localStorage.currentStreak = 0;     // Current win streak
    localStorage.maxStreak = 0;         // Best win streak
    localStorage.playedPicodia = false; // Played Picodia before?  
    localStorage.playedToday = 0;       // Played Picodia today? -- saves as daily number to check against        
    localStorage.avgLossTime = 0;
    localStorage.lossAvgTime = 0;
    localStorage._1LifeWins = 0;
    localStorage._1LifeAvgTime = 0;
    localStorage._2LifeWins = 0;
    localStorage._2LifeAvgTime = 0;
    localStorage._3LifeWins = 0;
    localStorage._3LifeAvgTime = 0;
    localStorage.prevTime = 0
    localStorage.prevLives = 0
    localStorage.prevOutcome = false
    localStorage.prevGameArray = []
}

const onGameOver = (numLives, win, prevGameArray, puzzleReference) => {
    localStorage.playedPicodia === undefined && storageInit();  
        // SAVES CURRENT DAY'S GAME (# lives and T/F for win)
    localStorage.prevLives = numLives
    localStorage.prevOutcome = win  

    localStorage.prevGameArray = JSON.stringify(prevGameArray)
        // You've played today
    localStorage.playedToday = puzzleReference;
        // ++ Total games played
    localStorage.totalGames = parseInt(localStorage.totalGames) + 1;
}

const gameArrayChunker = (gameArray, puzzleSize) => {
    if(gameArray == null){
        return
    }
    const arr = JSON.parse(gameArray)
    console.log(arr)
    const res = [];
    for(let i = 0; i < arr.length; i+=puzzleSize){
        const chunk = arr.slice(i, i + puzzleSize);
        res.push(chunk)
    }
    console.log(res)
    return res
}

const handleWinStats = (numLives) => {
    let lifeWins = parseInt(localStorage.getItem(`_${numLives}LifeWins`))
    let avgTimes = parseInt(localStorage.getItem(`_${numLives}LifeAvgTime`))
      // ++ won games
    localStorage.wonGames = parseInt(localStorage.wonGames) + 1;
    localStorage.currentStreak += 1;

    if((localStorage.currentStreak + 1) > localStorage.maxStreak){
      localStorage.maxStreak = parseInt(localStorage.maxStreak) + 1;
    }

    localStorage.winPercent = (parseInt(localStorage.wonGames)/parseInt(localStorage.totalGames) * 100).toFixed(1) | 0

    localStorage.setItem(`_${[numLives]}LifeWins`, parseInt(localStorage.getItem(`_${numLives}LifeWins`)) + 1);
    localStorage.setItem(`_${numLives}LifeAvgTime`, ((lifeWins*avgTimes + localStorage.prevTime)/(lifeWins + 1)))
}

const handleLoseStats = () => {
    let losses = parseInt(localStorage.lostGames)
    let avgLossTime = parseInt(localStorage.avgLossTime)
    localStorage.lossAvgTime = (losses * avgLossTime + localStorage.prevTime)/(losses + 1)
        // Resets current streak
    localStorage.lostGames = parseInt(localStorage.lostGames) + 1;
    localStorage.currentStreak = 0;      
}

export {storageInit, onGameOver, handleWinStats, handleLoseStats, gameArrayChunker}