export type GameStatus = 'CLOSED' | 'OPEN' | 'LOCKED' | 'REVEALED';

export interface Game {
  id: number;
  year: number;
  status: GameStatus;
  winningCategory: string | null;
  guessingOpensAt: string | null;
  createdAt: string;
  guesses: Guess[];
}

export interface Guess {
  id: number;
  gameId: number;
  guesserName: string;
  category: string;
  guessedAt: string;
}
