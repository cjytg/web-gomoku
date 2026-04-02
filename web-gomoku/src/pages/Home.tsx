import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Difficulty } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);

  const handleAIMode = () => {
    setShowDifficultySelector(true);
  };

  const startAIGame = () => {
    navigate(`/game?mode=ai&difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
          五子棋
        </h1>
        <p className="text-white/90 text-xl">Gomoku Online</p>
      </div>

      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          选择游戏模式
        </h2>

        <div className="space-y-4">
          <button
            onClick={handleAIMode}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🤖 人机对战
          </button>

          <button
            onClick={() => navigate('/game?mode=local')}
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            👥 本地双人
          </button>

          <button
            onClick={() => navigate('/game?mode=multiplayer')}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold text-lg rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            🌐 远程联机
          </button>
        </div>
      </div>

      {showDifficultySelector && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              选择难度
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setDifficulty('easy');
                  startAIGame();
                }}
                className="w-full py-3 px-6 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all"
              >
                简单
              </button>
              <button
                onClick={() => {
                  setDifficulty('medium');
                  startAIGame();
                }}
                className="w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-white font-medium rounded-lg transition-all"
              >
                中等
              </button>
              <button
                onClick={() => {
                  setDifficulty('hard');
                  startAIGame();
                }}
                className="w-full py-3 px-6 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-all"
              >
                困难
              </button>
            </div>
            <button
              onClick={() => setShowDifficultySelector(false)}
              className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700"
            >
              取消
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
