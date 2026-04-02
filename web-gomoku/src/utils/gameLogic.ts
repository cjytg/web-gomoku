import { Board, Player, Position, Difficulty, SCORES, WINNING_LENGTH, BOARD_SIZE } from '../types';
import { DIFFICULTY_LEVELS } from '../constants/game';

export const createEmptyBoard = (): Board => {
  return Array(BOARD_SIZE).fill(0).map(() => Array(BOARD_SIZE).fill(0));
};

export const checkWin = (board: Board, row: number, col: number, player: Player): boolean => {
  const directions = [
    [0, 1],   // 水平
    [1, 0],   // 垂直
    [1, 1],   // 主对角线
    [1, -1]   // 副对角线
  ];

  for (const [dx, dy] of directions) {
    let count = 1;

    // 正向检查
    for (let i = 1; i < WINNING_LENGTH; i++) {
      const newRow = row + dx * i;
      const newCol = col + dy * i;
      if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE || board[newRow][newCol] !== player) {
        break;
      }
      count++;
    }

    // 反向检查
    for (let i = 1; i < WINNING_LENGTH; i++) {
      const newRow = row - dx * i;
      const newCol = col - dy * i;
      if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE || board[newRow][newCol] !== player) {
        break;
      }
      count++;
    }

    if (count >= WINNING_LENGTH) {
      return true;
    }
  }

  return false;
};

export const isBoardFull = (board: Board): boolean => {
  return board.every(row => row.every(cell => cell !== 0));
};

export const isValidMove = (board: Board, row: number, col: number): boolean => {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col] === 0;
};

const hasNeighbor = (board: Board, row: number, col: number, distance: number = 2): boolean => {
  for (let i = Math.max(0, row - distance); i <= Math.min(BOARD_SIZE - 1, row + distance); i++) {
    for (let j = Math.max(0, col - distance); j <= Math.min(BOARD_SIZE - 1, col + distance); j++) {
      if (board[i][j] !== 0) {
        return true;
      }
    }
  }
  return false;
};

const countPattern = (board: Board, row: number, col: number, dx: number, dy: number, player: Player): number => {
  let count = 0;
  let empty = 0;
  let blocked = 0;

  for (let i = 1; i < WINNING_LENGTH; i++) {
    const newRow = row + dx * i;
    const newCol = col + dy * i;

    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
      blocked++;
      break;
    }

    if (board[newRow][newCol] === player) {
      count++;
    } else if (board[newRow][newCol] === 0) {
      empty++;
      break;
    } else {
      blocked++;
      break;
    }
  }

  for (let i = 1; i < WINNING_LENGTH; i++) {
    const newRow = row - dx * i;
    const newCol = col - dy * i;

    if (newRow < 0 || newRow >= BOARD_SIZE || newCol < 0 || newCol >= BOARD_SIZE) {
      blocked++;
      break;
    }

    if (board[newRow][newCol] === player) {
      count++;
    } else if (board[newRow][newCol] === 0) {
      empty++;
      break;
    } else {
      blocked++;
      break;
    }
  }

  count += 1; // 包括当前位置

  if (count >= 5) return SCORES.FIVE;
  if (count === 4) {
    if (blocked === 0) return SCORES.LIVE_FOUR;
    if (blocked === 1) return SCORES.DEAD_FOUR;
  }
  if (count === 3) {
    if (blocked === 0 && empty >= 2) return SCORES.LIVE_THREE;
    if (blocked === 1 && empty >= 1) return SCORES.DEAD_THREE;
  }
  if (count === 2) {
    if (blocked === 0 && empty >= 3) return SCORES.LIVE_TWO;
    if (blocked === 1 && empty >= 2) return SCORES.DEAD_TWO;
  }

  return 0;
};

const evaluatePosition = (board: Board, row: number, col: number, player: Player): number => {
  if (!isValidMove(board, row, col)) return 0;

  const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
  let score = 0;

  for (const [dx, dy] of directions) {
    score += countPattern(board, row, col, dx, dy, player);
  }

  // 位置权重，中心位置更高
  const center = Math.floor(BOARD_SIZE / 2);
  const distance = Math.abs(row - center) + Math.abs(col - center);
  score += (center - distance) * 2;

  return score;
};

export const getBestMove = (board: Board, aiPlayer: Player, difficulty: Difficulty): Position => {
  const humanPlayer = aiPlayer === 1 ? 2 : 1;
  const depth = DIFFICULTY_LEVELS[difficulty];

  let bestScore = -Infinity;
  let bestMove: Position = { row: Math.floor(BOARD_SIZE / 2), col: Math.floor(BOARD_SIZE / 2) };

  // 优先下中心位置
  if (board[bestMove.row][bestMove.col] === 0) {
    return bestMove;
  }

  const candidateMoves: Position[] = [];

  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (isValidMove(board, i, j) && hasNeighbor(board, i, j, depth)) {
        const attackScore = evaluatePosition(board, i, j, aiPlayer);
        const defenseScore = evaluatePosition(board, i, j, humanPlayer);
        const totalScore = attackScore + defenseScore * 0.9; // 防守略低于进攻

        candidateMoves.push({ row: i, col: j });

        if (totalScore > bestScore) {
          bestScore = totalScore;
          bestMove = { row: i, col: j };
        }
      }
    }
  }

  // 如果没有找到候选位置，随机选一个附近的位置
  if (candidateMoves.length === 0) {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (isValidMove(board, i, j)) {
          return { row: i, col: j };
        }
      }
    }
  }

  return bestMove;
};
