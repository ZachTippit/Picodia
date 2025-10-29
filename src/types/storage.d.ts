export {};

declare global {
  interface Storage {
    totalGames: any;
    wonGames: any;
    lostGames: any;
    playedPicodia: any;
    playedToday: any;
    avgLossTime: any;
    lossAvgTime: any;
    _1LifeWins: any;
    _1LifeAvgTime: any;
    _2LifeWins: any;
    _2LifeAvgTime: any;
    _3LifeWins: any;
    _3LifeAvgTime: any;
    prevTime: any;
    prevLives: any;
    prevOutcome: any;
    prevGameArray: any;
    currentStreak: any;
    maxStreak: any;
  }
}
