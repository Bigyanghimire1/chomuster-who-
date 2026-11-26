import React from 'react';
import { PlayerAvatarId } from '../../types/game';
import { renderCaricatureArtwork } from './CaricatureAvatars';

interface PlayerAvatarProps {
  id: PlayerAvatarId | string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  isImposterStyle?: boolean;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  id,
  size = 'md',
  className = '',
  isImposterStyle = false,
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${currentSize} shrink-0 select-none ${className}`}
    >
      {renderCaricatureArtwork(id, isImposterStyle)}
    </svg>
  );
};
