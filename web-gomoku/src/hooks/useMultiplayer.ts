import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Room, Board, Player, Position } from '../types';
import { checkWin, isBoardFull } from '../utils/gameLogic';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const useMultiplayer = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [playerNumber, setPlayerNumber] = useState<Player | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const createRoom = useCallback(async (playerName: string): Promise<string | null> => {
    if (!supabase) {
      setError('Supabase配置未完成，无法使用联机功能');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const code = generateRoomCode();
      const emptyBoard: Board = Array(15).fill(0).map(() => Array(15).fill(0));

      const { data, error } = await supabase
        .from('rooms')
        .insert([
          {
            code,
            player1: playerName,
            board: emptyBoard,
            current_player: 1,
            status: 'waiting',
            moves: []
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setRoom(data);
      setPlayerNumber(1);
      return code;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinRoom = useCallback(async (code: string, playerName: string): Promise<boolean> => {
    if (!supabase) {
      setError('Supabase配置未完成，无法使用联机功能');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: existingRoom, error: fetchError } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code.toUpperCase())
        .single();

      if (fetchError) throw fetchError;

      if (existingRoom.status !== 'waiting') {
        throw new Error('房间已满或游戏已开始');
      }

      if (existingRoom.player1 === playerName) {
        throw new Error('不能加入自己创建的房间');
      }

      const { data: updatedRoom, error: updateError } = await supabase
        .from('rooms')
        .update({
          player2: playerName,
          status: 'playing',
        })
        .eq('id', existingRoom.id)
        .select()
        .single();

      if (updateError) throw updateError;

      setRoom(updatedRoom);
      setPlayerNumber(2);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const makeMove = useCallback(async (position: Position, player: Player) => {
    if (!supabase || !room || player !== playerNumber || room.status !== 'playing' || room.current_player !== player) {
      return false;
    }

    try {
      const newBoard = JSON.parse(JSON.stringify(room.board));
      newBoard[position.row][position.col] = player;

      const hasWon = checkWin(newBoard, position.row, position.col, player);
      const isFull = isBoardFull(newBoard);

      let status = 'playing';
      let winner = null;

      if (hasWon) {
        status = 'finished';
        winner = player;
      } else if (isFull) {
        status = 'finished';
      }

      const newMoves = [...room.moves, { ...position, player }];

      const { error } = await supabase
        .from('rooms')
        .update({
          board: newBoard,
          current_player: player === 1 ? 2 : 1,
          status,
          winner,
          last_move: { ...position, player },
          moves: newMoves
        })
        .eq('id', room.id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [room, playerNumber, supabase]);

  const restartRoom = useCallback(async (): Promise<boolean> => {
    if (!supabase || !room) {
      setError('房间不存在，无法重新开始');
      return false;
    }

    try {
      const emptyBoard: Board = Array(15).fill(0).map(() => Array(15).fill(0));

      const { error } = await supabase
        .from('rooms')
        .update({
          board: emptyBoard,
          current_player: 1,
          status: 'playing',
          winner: null,
          last_move: null,
          moves: []
        })
        .eq('id', room.id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [room, supabase]);

  const undoMove = useCallback(async (): Promise<boolean> => {
    if (!supabase || !room || room.status !== 'playing' || room.moves.length < 2) {
      setError('当前状态无法悔棋');
      return false;
    }

    try {
      // 联机模式和人机模式一致，每次悔棋撤销最后两步（双方各一步）
      const newMoves = [...room.moves];
      const lastMove1 = newMoves.pop(); // 对方的最后一步
      const lastMove2 = newMoves.pop(); // 自己的上一步

      // 重新构建棋盘，清空最后两步的棋子
      const newBoard = JSON.parse(JSON.stringify(room.board));
      if (lastMove1) {
        newBoard[lastMove1.row][lastMove1.col] = 0;
      }
      if (lastMove2) {
        newBoard[lastMove2.row][lastMove2.col] = 0;
      }

      // 悔棋后还是轮到当前玩家走
      const newLastMove = newMoves.length > 0 ? newMoves[newMoves.length - 1] : null;

      const { error } = await supabase
        .from('rooms')
        .update({
          board: newBoard,
          current_player: room.current_player, // 保持当前玩家不变
          last_move: newLastMove,
          moves: newMoves
        })
        .eq('id', room.id);

      if (error) throw error;
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    }
  }, [room, supabase]);

  const leaveRoom = useCallback(async () => {
    if (subscription) {
      supabase?.removeChannel(subscription);
      setSubscription(null);
    }
    setRoom(null);
    setPlayerNumber(null);
    setError(null);
  }, [subscription, supabase]);

  useEffect(() => {
    if (!room || !supabase) return;

    const channel = supabase
      .channel(`room:${room.id}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${room.id}`,
      }, (payload) => {
        setRoom(payload.new as Room);
      })
      .subscribe();

    setSubscription(channel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room, supabase]);

  return {
    room,
    loading,
    error,
    playerNumber,
    createRoom,
    joinRoom,
    makeMove,
    restartRoom,
    undoMove,
    leaveRoom,
  };
};
