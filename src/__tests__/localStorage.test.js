const storageInit = () => {
    localStorage.test.totalGames = 0;       // Total games played
    localStorage.test.wonGames = 0;         // Games won
    localStorage.test.lostGames = 0         // Games lost
    localStorage.test.playedPicodia = true  // Played Picodia before?  
    localStorage.test.playedToday = 0       // Played Picodia today? -- saves as daily number to check against
    localStorage.test.lostGames = 0         
    localStorage.test.avgLossTime = 0;
    localStorage.test.lossAvgTime = 0;
    localStorage.test._1LifeWins = 0;
    localStorage.test._1LifeAvgTime = 0;
    localStorage.test._2LifeWins = 0;
    localStorage.test._2LifeAvgTime = 0;
    localStorage.test._3LifeWins = 0;
    localStorage.test._3LifeAvgTime = 0;
    localStorage.test.prevTime = 0
    localStorage.test.prevLives = 0
    localStorage.test.prevOutcome = false
    localStorage.test.prevGameArray = []
}