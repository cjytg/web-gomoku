export const BOARD_SIZE = 15;
export const CELL_SIZE = 32;
export const PIECE_RADIUS = 14;
export const BOARD_PADDING = 20;

export const PLAYER_COLORS = {
  1: '#000000',
  2: '#ffffff'
} as const;

export const WINNING_LENGTH = 5;

export const DIFFICULTY_LEVELS = {
  easy: 2,
  medium: 3,
  hard: 4
} as const;

export const SCORES = {
  FIVE: 100000,
  LIVE_FOUR: 10000,
  DEAD_FOUR: 1000,
  LIVE_THREE: 1000,
  DEAD_THREE: 100,
  LIVE_TWO: 100,
  DEAD_TWO: 10
} as const;
