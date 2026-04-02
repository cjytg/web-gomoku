import React from 'react';
import { Player } from '../types';
import { PIECE_RADIUS } from '../constants/game';

interface PieceProps {
  player: Player;
  isLastMove?: boolean;
}

const Piece: React.FC<PieceProps> = ({ player, isLastMove }) => {
  const color = player === 1 ? '#000000' : '#ffffff';
  const strokeColor = player === 1 ? '#ffffff' : '#000000';

  return (
    <g>
      <circle
        cx={0}
        cy={0}
        r={PIECE_RADIUS}
        fill={color}
        stroke={strokeColor}
        strokeWidth={1}
        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.3))"
      />
      {isLastMove && (
        <circle
          cx={0}
          cy={0}
          r={4}
          fill="#ff0000"
        />
      )}
    </g>
  );
};

export default Piece;
