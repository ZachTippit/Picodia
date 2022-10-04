// Local Storage Handlers

const storageInit = () => {
    localStorage.totalGames = 0;        // Total games played
    localStorage.wonGames = 0;          // Games won
    localStorage.winPercent = 0;        // Percentage of games won   
    localStorage.lostGames = 0;         // Games lost
    localStorage.currentStreak = 0;     // Current win streak
    localStorage.maxStreak = 0;         // Best win streak
    localStorage.playedPicodia = false; // Played Picodia before?  
    localStorage.playedToday = false;   // Played Picodia today? -- saves as bool to check against date
    localStorage.avgLossTime = 0;
    localStorage.lossAvgTime = 0;
    localStorage._1LifeWins = 0;
    localStorage._1LifeAvgTime = 0;
    localStorage._2LifeWins = 0;
    localStorage._2LifeAvgTime = 0;
    localStorage._3LifeWins = 0;
    localStorage._3LifeAvgTime = 0;
    localStorage.prevTime = 0;
    localStorage.prevLives = 0;
    localStorage.prevOutcome = false;
    localStorage.prevGameArray = [];
    localStorage.currentGameArray = "";
    localStorage.blankArray = "[[2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2], [2,2,2,2,2,2,2,2]]";
    localStorage.lastPlayed = 0;
    localStorage.todayDate = '';
    localStorage.whatIsIt = '';
    localStorage.todayDate = '';
}

const onGameOver = (numLives, win, prevGameArray, puzzleReference, whatIsIt) => {  
        // SAVES CURRENT DAY'S GAME (# lives and T/F for win)
    localStorage.prevLives = numLives
    localStorage.todayDate = todayDate()
    localStorage.prevOutcome = win  
    localStorage.lastPlayed = puzzleReference
    localStorage.prevGameArray = JSON.stringify(prevGameArray)
    localStorage.whatIsIt = whatIsIt
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
    localStorage.currentStreak = parseInt(localStorage.currentStreak) + 1;

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

const checkDate = () => {
    const today = todayDate()
    return localStorage.todayDate == today
}

const todayDate = () => {
    const date = new Date()
    const day = date.getDay()
    const month = date.getMonth()
    const year = date.getFullYear()
    const today = new Date(year, month, day)
    return today
}

export {storageInit, onGameOver, handleWinStats, handleLoseStats, gameArrayChunker, checkDate, todayDate}