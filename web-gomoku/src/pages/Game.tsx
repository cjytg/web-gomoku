import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGame } from '../hooks/useGame';
import { useMultiplayer } from '../hooks/useMultiplayer';
import Board from '../components/Board';
import GameControls from '../components/GameControls';
import RoomModal from '../components/RoomModal';
import { GameMode, Difficulty } from '../types';

const Game: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const mode = searchParams.get('mode') as GameMode;
  const difficulty = searchParams.get('difficulty') as Difficulty || 'medium';

  const [playerName, setPlayerName] = useState<string>('');
  const [opponentName, setOpponentName] = useState<string>('');
  const [showRoomModal, setShowRoomModal] = useState(mode === 'multiplayer');

  const { state, handleClick, restartGame, undoMove, updateBoardFromExternal, updateGameStatus } = useGame(mode, difficulty);
  const { room, loading, error, playerNumber, createRoom, joinRoom, makeMove: makeMultiplayerMove, restartRoom, leaveRoom } = useMultiplayer();

  useEffect(() => {
    if (!mode) {
      navigate('/');
      return;
    }

    if (mode === 'multiplayer' && room) {
      updateBoardFromExternal(room.board, room.current_player);
      setPlayerName(playerNumber === 1 ? room.player1 : room.player2 || '');
      setOpponentName(playerNumber === 1 ? room.player2 || '' : room.player1);

      if (room.status === 'finished') {
        updateGameStatus('win', room.winner);
      } else if (room.status === 'playing' && room.player2) {
        updateGameStatus('playing');
      }
    }
  }, [mode, navigate, room, playerNumber, updateBoardFromExternal, updateGameStatus]);

  const handleBoardClick = async (row: number, col: number) => {
    if (mode === 'multiplayer') {
      if (!room || !playerNumber || room.status !== 'playing' || room.current_player !== playerNumber) return;
      await makeMultiplayerMove({ row, col }, playerNumber);
    } else {
      handleClick(row, col);
    }
  };

  const handleCreateRoom = async (name: string) => {
    const code = await createRoom(name);
    if (code) {
      setShowRoomModal(false);
      setPlayerName(name);
    }
  };

  const handleJoinRoom = async (code: string, name: string) => {
    const success = await joinRoom(code, name);
    if (success) {
      setShowRoomModal(false);
      setPlayerName(name);
    }
  };

  const handleRestart = async () => {
    if (mode === 'multiplayer' && room) {
      // 联机模式下，游戏结束后在同一个房间重新开始
      if (state.gameStatus !== 'playing') {
        await restartRoom();
      } else {
        // 游戏进行中点击重新开始还是需要退出房间
        leaveRoom();
        setShowRoomModal(true);
      }
    }
    restartGame();
  };

  const handleBackToMenu = () => {
    if (mode === 'multiplayer') {
      leaveRoom();
    }
    navigate('/');
  };

  const getDisabled = () => {
    if (state.gameStatus !== 'playing') return true;
    if (state.isAIThinking) return true;
    if (mode === 'multiplayer') {
      return !room || !playerNumber || room.status !== 'playing' || room.current_player !== playerNumber;
    }
    return false;
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-6 drop-shadow-lg">
          {mode === 'ai' ? '人机对战' : mode === 'local' ? '本地双人' : '远程联机'}
        </h1>

        {mode === 'multiplayer' && room && (
          <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-md mx-auto mb-6 text-center">
            <p className="text-lg font-semibold text-gray-800">
              房间号: <span className="text-blue-600 text-xl font-bold">{room.code}</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              把房间号分享给好友，加入房间开始对战吧！
            </p>
            {room.status === 'waiting' && (
              <p className="text-yellow-600 mt-2 font-medium">
                等待对手加入...
              </p>
            )}
          </div>
        )}

        <GameControls
          currentPlayer={state.currentPlayer}
          gameStatus={state.gameStatus}
          winner={state.winner}
          isAIThinking={state.isAIThinking}
          onRestart={handleRestart}
          onUndo={undoMove}
          onBackToMenu={handleBackToMenu}
          playerName={playerName}
          opponentName={opponentName}
          playerNumber={playerNumber}
        />

        <Board
          board={state.board}
          lastMove={state.moves.length > 0 ? state.moves[state.moves.length - 1] : null}
          onCellClick={handleBoardClick}
          disabled={getDisabled()}
        />
      </div>

      <RoomModal
        isOpen={showRoomModal}
        onClose={() => navigate('/')}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Game;
