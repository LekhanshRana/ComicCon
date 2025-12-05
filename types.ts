export interface WordConfig {
  id: string;
  displayName: string; // The clue/label might use this
  answer: string;
  clue: string;
  secretIndex: number; // Which index of the answer maps to the secret phrase
  secretPosition: number; // Where it goes in the secret phrase (0-16)
  direction: 'ACROSS' | 'DOWN';
  number: number;
}

export interface PlayerScore {
  name: string;
  timeSeconds: number;
  date: string;
  mistakes: number;
}

export enum GameStatus {
  WELCOME = 'WELCOME',
  PLAYING = 'PLAYING',
  COMPLETED = 'COMPLETED',
  LEADERBOARD = 'LEADERBOARD'
}

export interface GameState {
  status: GameStatus;
  playerName: string;
  startTime: number | null;
  endTime: number | null;
  answers: Record<string, string[]>; // Map of wordId -> array of letters
  mistakes: number;
}