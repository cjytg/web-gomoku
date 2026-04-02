export type Player = 1 | 2;
export type Board = (0 | Player)[][];
export type GameMode = 'ai' | 'local' | 'multiplayer';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameStatus = 'playing' | 'win' | 'draw';

export interface Position {
  row: number;
  col: number;
}

export interface Move extends Position {
  player: Player;
}

export interface Room {
  id: string;
  code: string;
  player1: string;
  player2?: string;
  current_player: Player;
  board: Board;
  status: 'waiting' | 'playing' | 'finished';
  winner?: Player;
  last_move?: Move;
  created_at: string;
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  gameMode: GameMode | null;
  difficulty: Difficulty;
  gameStatus: GameStatus;
  winner: Player | null;
  moves: Move[];
  isAIThinking: boolean;
}
