interface Puzzle {
  id: number;
  day: number;
  puzzle_name: string;
  puzzle_array: number[][];
}

interface PuzzleAttempt {
  id: string;
  puzzle_id: number;
  user_id: string;
  attempt_date: string;
  status: GameStatus;
  outcome: PuzzleOutcome | null;
  started_at: string;
  completed_at: string | null;
  voided_at: string | null;
  lives_remaining: number | null;
  elapsed_seconds: number | null;
  progress: Record<string, any> | null;
  updated_at: string | null;
  metadata: Record<string, any> | null;
  mistakes_made: number | null;
  was_successful: boolean | null;
}

interface AttemptMetadata {
  puzzleId?: number | null;
  progress?: unknown;
  lives?: number | null;
  elapsedSeconds?: number | null;
  completed?: boolean;
  updatedAt?: string;
}

interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface PuzzleCellState {
  correct: boolean;
  filled: boolean;
  incorrect: boolean;
  id: string;
}

type HowToPlayCellState = 0 | 1 | 2;

interface HowToPlayRule {
  id: string;
  text: string;
  showLoginButton?: boolean;
  board?: HowToPlayCellState[][];
  rowRules?: (string | number)[][];
  colRules?: (string | number)[][];
}

interface ActiveSession {
  user_id: string;
  current_attempt_id: string | null;
  active_puzzle_id: string | null;
  started_at: string;
  updated_at: string;
  puzzle_attempts: PuzzleAttempt | null;
}

interface PuzzleProgressInput {
  progress: unknown;
  completed?: boolean;
  lives?: number | null;
  elapsedSeconds?: number | null;
}

interface EmailCredentials {
  email: string;
  password: string;
}
