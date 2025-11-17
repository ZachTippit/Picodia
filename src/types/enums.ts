enum GameStatus {
  Pending = 'pending',
  InProgress = 'in_progress',
  Completed = 'completed',
  Voided = 'voided',
}

enum PuzzleOutcome {
  Win = 'win',
  Loss = 'loss',
  Pending = 'pending',
  Abandoned = 'abandoned',
}

export { GameStatus, PuzzleOutcome };