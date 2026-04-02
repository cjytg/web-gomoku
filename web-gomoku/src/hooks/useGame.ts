import { useState, useCallback, useEffect } from 'react';
import { GameState, Player, Position, GameMode, Difficulty, GameStatus, Move } from '../types';
import { createEmptyBoard, checkWin, isBoardFull, isValidMove, getBestMove } from '../utils/gameLogic';

const initialState: GameState = {
  board: createEmptyBoard(),
  currentPlayer: 1,
  gameMode: null,
  difficulty: 'medium',
  gameStatus: 'playing',
  winner: null,
  moves: [],
  isAIThinking: false,
};

export const useGame = (initialMode?: GameMode, initialDifficulty?: Difficulty) => {
  const [state, setState] = useState<GameState>({
    ...initialState,
    gameMode: initialMode || null,
    difficulty: initialDifficulty || 'medium',
  });

  const makeMove = useCallback((row: number, col: number, player?: Player): boolean => {
    if (state.gameStatus !== 'playing' || !isValidMove(state.board, row, col)) {
      return false;
    }

    const currentPlayer = player || state.currentPlayer;
    const newBoard = state.board.map(row => [...row]);
    newBoard[row][col] = currentPlayer;

    const newMoves = [...state.moves, { row, col, player: currentPlayer }];
    const hasWon = checkWin(newBoard, row, col, currentPlayer);
    const isFull = isBoardFull(newBoard);

    let newStatus: GameStatus = 'playing';
    let newWinner: Player | null = null;

    if (hasWon) {
      newStatus = 'win';
      newWinner = currentPlayer;
    } else if (isFull) {
      newStatus = 'draw';
    }

    setState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer: currentPlayer === 1 ? 2 : 1,
      gameStatus: newStatus,
      winner: newWinner,
      moves: newMoves,
    }));

    return true;
  }, [state]);

  const aiMove = useCallback(() => {
    if (state.gameMode !== 'ai' || state.gameStatus !== 'playing' || state.currentPlayer === 1) {
      return;
    }

    setState(prev => ({ ...prev, isAIThinking: true }));

    setTimeout(() => {
      const move = getBestMove(state.board, 2, state.difficulty);
      makeMove(move.row, move.col, 2);
      setState(prev => ({ ...prev, isAIThinking: false }));
    }, 500);
  }, [state, makeMove]);

  useEffect(() => {
    if (state.gameMode === 'ai' && state.currentPlayer === 2 && state.gameStatus === 'playing') {
      aiMove();
    }
  }, [state.currentPlayer, state.gameMode, state.gameStatus, aiMove]);

  const handleClick = useCallback((row: number, col: number) => {
    if (state.isAIThinking) return;

    if (state.gameMode === 'ai') {
      if (state.currentPlayer === 2) return;
      const success = makeMove(row, col, 1);
      return success;
    } else if (state.gameMode === 'local') {
      return makeMove(row, col);
    }
    return false;
  }, [state, makeMove]);

  const restartGame = useCallback((mode?: GameMode, difficulty?: Difficulty) => {
    setState({
      ...initialState,
      gameMode: mode || state.gameMode,
      difficulty: difficulty || state.difficulty,
    });
  }, [state.gameMode, state.difficulty]);

  const undoMove = useCallback(() => {
    if (state.moves.length === 0 || state.gameStatus !== 'playing') return;

    if (state.gameMode === 'ai') {
      // 人机模式撤销两步（玩家和AI各一步）
      if (state.moves.length < 2) {
        const newBoard = createEmptyBoard();
        setState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: 1,
          moves: [],
        }));
      } else {
        const newMoves = state.moves.slice(0, -2);
        const newBoard = createEmptyBoard();
        newMoves.forEach(move => {
          newBoard[move.row][move.col] = move.player;
        });
        setState(prev => ({
          ...prev,
          board: newBoard,
          currentPlayer: 1,
          moves: newMoves,
        }));
      }
    } else {
      // 本地双人模式撤销一步
      const newMoves = state.moves.slice(0, -1);
      const newBoard = createEmptyBoard();
      newMoves.forEach(move => {
        newBoard[move.row][move.col] = move.player;
      });
      setState(prev => ({
        ...prev,
        board: newBoard,
        currentPlayer: prev.currentPlayer === 1 ? 2 : 1,
        moves: newMoves,
      }));
    }
  }, [state.moves, state.gameMode, state.gameStatus]);

  const updateBoardFromExternal = useCallback((newBoard: Board, currentPlayer: Player) => {
    setState(prev => ({
      ...prev,
      board: newBoard,
      currentPlayer,
    }));
  }, []);

  const updateGameStatus = useCallback((status: GameStatus, winner?: Player) => {
    setState(prev => ({
      ...prev,
      gameStatus: status,
      winner: winner || null,
    }));
  }, []);

  return {
    state,
    handleClick,
    makeMove,
    restartGame,
    undoMove,
    updateBoardFromExternal,
    updateGameStatus,
  };
};
