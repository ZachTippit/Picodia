// Local Storage Handlers

const storageInit = () => {
  localStorage.totalGames = 0; // Total games played
  localStorage.wonGames = 0; // Games won
  localStorage.lostGames = 0; // Games lost
  localStorage.playedPicodia = true; // Played Picodia before?
  localStorage.playedToday = 0; // Played Picodia today? -- saves as daily number to check against
  localStorage.lostGames = 0;
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
};

const gameArrayChunker = (gameArray, puzzleSize) => {
  if (gameArray == null) {
    return;
  }
  const arr = JSON.parse(gameArray);
  console.log(arr);
  const res = [];
  for (let i = 0; i < arr.length; i += puzzleSize) {
    const chunk = arr.slice(i, i + puzzleSize);
    res.push(chunk);
  }
  console.log(res);
  return res;
};

export { storageInit, gameArrayChunker };
