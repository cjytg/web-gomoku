import React from 'react';
import { Player, GameStatus } from '../types';
import { PLAYER_COLORS } from '../constants/game';

interface GameControlsProps {
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  isAIThinking: boolean;
  onRestart: () => void;
  onUndo: () => void;
  onBackToMenu: () => void;
  playerName?: string;
  opponentName?: string;
  playerNumber?: Player | null;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  gameStatus,
  winner,
  isAIThinking,
  onRestart,
  onUndo,
  onBackToMenu,
  playerName,
  opponentName,
  playerNumber,
}) => {
  const getStatusText = () => {
    if (gameStatus === 'win') {
      const winnerName = winner === playerNumber ? playerName : opponentName;
      return `🎉 ${winner ? (winnerName || `${winner === 1 ? '黑方' : '白方'}`) : ''}获胜！`;
    }
    if (gameStatus === 'draw') {
      return '🤝 平局！';
    }
    if (isAIThinking) {
      return '🤔 AI正在思考...';
    }
    const currentPlayerName = currentPlayer === playerNumber ? playerName : opponentName;
    return `轮到 ${currentPlayerName || `${currentPlayer === 1 ? '黑方' : '白方'}`} 落子`;
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 max-w-md mx-auto mb-6">
      <div className="text-center mb-4">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-semibold"
          style={{
            backgroundColor: gameStatus === 'playing' ? (currentPlayer === 1 ? '#000' : '#fff') : '#10b981',
            color: gameStatus === 'playing' ? (currentPlayer === 1 ? '#fff' : '#000') : '#fff',
          }}
        >
          {getStatusText()}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onBackToMenu}
          className="px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          返回菜单
        </button>
        <button
          onClick={onUndo}
          className="px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          悔棋
        </button>
        <button
          onClick={onRestart}
          className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          重新开始
        </button>
      </div>
    </div>
  );
};

export default GameControls;
