import React, { useState } from 'react';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (name: string) => void;
  onJoinRoom: (code: string, name: string) => void;
  loading: boolean;
  error: string | null;
}

const RoomModal: React.FC<RoomModalProps> = ({
  isOpen,
  onClose,
  onCreateRoom,
  onJoinRoom,
  loading,
  error,
}) => {
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    if (mode === 'create') {
      onCreateRoom(playerName.trim());
    } else {
      if (!roomCode.trim()) return;
      onJoinRoom(roomCode.trim(), playerName.trim());
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' ? '创建房间' : '加入房间'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex mb-6">
          <button
            onClick={() => setMode('create')}
            className={`flex-1 py-2 font-medium transition-all ${
              mode === 'create'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            创建房间
          </button>
          <button
            onClick={() => setMode('join')}
            className={`flex-1 py-2 font-medium transition-all ${
              mode === 'join'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 border-b-2 border-transparent'
            }`}
          >
            加入房间
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              你的昵称
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="请输入你的昵称"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              maxLength={12}
              required
            />
          </div>

          {mode === 'join' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                房间号
              </label>
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="请输入6位房间号"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                maxLength={6}
                required
              />
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
          >
            {loading ? '处理中...' : (mode === 'create' ? '创建房间' : '加入房间')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
