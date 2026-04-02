import React from 'react';
import { Board as BoardType, Move } from '../types';
import Piece from './Piece';
import { BOARD_SIZE, CELL_SIZE, BOARD_PADDING } from '../constants/game';

interface BoardProps {
  board: BoardType;
  lastMove?: Move | null;
  onCellClick: (row: number, col: number) => void;
  disabled?: boolean;
}

const Board: React.FC<BoardProps> = ({ board, lastMove, onCellClick, disabled = false }) => {
  const boardSize = (BOARD_SIZE - 1) * CELL_SIZE + BOARD_PADDING * 2;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - BOARD_PADDING;
    const y = e.clientY - rect.top - BOARD_PADDING;

    const col = Math.round(x / CELL_SIZE);
    const row = Math.round(y / CELL_SIZE);

    if (row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE) {
      onCellClick(row, col);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <svg
        width={boardSize}
        height={boardSize}
        onClick={handleClick}
        className={`bg-[#DEB887] rounded-lg shadow-2xl ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      >
        {/* 绘制网格 */}
        <g transform={`translate(${BOARD_PADDING}, ${BOARD_PADDING})`}>
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={0}
              y1={i * CELL_SIZE}
              x2={(BOARD_SIZE - 1) * CELL_SIZE}
              y2={i * CELL_SIZE}
              stroke="#000"
              strokeWidth={1}
            />
          ))}
          {Array.from({ length: BOARD_SIZE }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * CELL_SIZE}
              y1={0}
              x2={i * CELL_SIZE}
              y2={(BOARD_SIZE - 1) * CELL_SIZE}
              stroke="#000"
              strokeWidth={1}
            />
          ))}

          {/* 绘制天元和星位 */}
          {[
            { row: 3, col: 3 },
            { row: 3, col: 11 },
            { row: 7, col: 7 },
            { row: 11, col: 3 },
            { row: 11, col: 11 },
          ].map((pos, i) => (
            <circle
              key={`star-${i}`}
              cx={pos.col * CELL_SIZE}
              cy={pos.row * CELL_SIZE}
              r={3}
              fill="#000"
            />
          ))}

          {/* 绘制棋子 */}
          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              if (cell === 0) return null;
              const isLastMove = lastMove && lastMove.row === rowIndex && lastMove.col === colIndex;
              return (
                <g
                  key={`piece-${rowIndex}-${colIndex}`}
                  transform={`translate(${colIndex * CELL_SIZE}, ${rowIndex * CELL_SIZE})`}
                >
                  <Piece player={cell} isLastMove={isLastMove} />
                </g>
              );
            })
          )}
        </g>
      </svg>
    </div>
  );
};

export default Board;
