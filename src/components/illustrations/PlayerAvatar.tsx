import React from 'react';
import { PlayerAvatarId } from '../../types/game';

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

  // Custom vector character faces
  const renderFace = () => {
    switch (id) {
      case 'shadow':
        return (
          <g>
            <rect width="64" height="64" rx="16" fill={isImposterStyle ? '#3A1420' : '#1E1838'} />
            <path d="M12 48 C 12 30, 24 16, 32 16 C 40 16, 52 30, 52 48 Z" fill={isImposterStyle ? '#FF687F' : '#312A54'} />
            <ellipse cx="25" cy="36" rx="4" ry="2.5" fill={isImposterStyle ? '#FFF' : '#FF687F'} />
            <ellipse cx="39" cy="36" rx="4" ry="2.5" fill={isImposterStyle ? '#FFF' : '#FF687F'} />
          </g>
        );

      case 'pokerface':
        return (
          <g>
            <rect width="64" height="64" rx="16" fill="#1C233A" />
            <circle cx="32" cy="34" r="18" fill="#F0DCB8" />
            {/* Dark shades */}
            <rect x="20" y="28" width="10" height="7" rx="2" fill="#101323" />
            <rect x="34" y="28" width="10" height="7" rx="2" fill="#101323" />
            <rect x="29" y="30" width="6" height="2" fill="#101323" />
            {/* Flat neutral mouth */}
            <line x1="28" y1="44" x2="36" y2="44" stroke="#101323" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );

      case 'agent':
        return (
          <g>
            <rect width="64" height="64" rx="16" fill="#1A2033" />
            <circle cx="32" cy="30" r="16" fill="#E8CDA8" />
            <ellipse cx="27" cy="29" rx="2" ry="2" fill="#101323" />
            <ellipse cx="37" cy="29" rx="2" ry="2" fill="#101323" />
            {/* Black tie & suit collar */}
            <path d="M18 56 L 46 56 L 42 42 L 32 46 L 22 42 Z" fill="#101323" />
            <polygon points="32,46 35,56 29,56" fill="#9177FF" />
            {/* Earpiece */}
            <circle cx="16" cy="31" r="2.5" fill="#9177FF" />
            <path d="M16 33 Q 18 42 24 45" stroke="#9177FF" strokeWidth="1.5" fill="none" />
          </g>
        );

      case 'whiz':
        return (
          <g>
            <rect width="64" height="64" rx="16" fill="#152433" />
            <circle cx="32" cy="32" r="16" fill="#E8D1B5" />
            {/* Cyber visor */}
            <rect x="18" y="26" width="28" height="8" rx="4" fill="#B8EF78" />
            <circle cx="27" cy="30" r="2" fill="#101323" />
            <circle cx="37" cy="30" r="2" fill="#101323" />
            {/* Headband */}
            <path d="M16 28 C 16 18, 48 18, 48 28" stroke="#9177FF" strokeWidth="4" fill="none" />
          </g>
        );

      case 'maverick':
        return (
          <g>
            <rect width="64" height="64" rx="16" fill="#241B2E" />
            <circle cx="32" cy="33" r="16" fill="#F0D3B0" />
            {/* Aviator goggles perched up */}
            <rect x="20" y="18" width="10" height="7" rx="3" fill="#B8EF78" stroke="#101323" strokeWidth="1.5" />
            <rect x="34" y="18" width="10" height="7" rx="3" fill="#B8EF78" stroke="#101323" strokeWidth="1.5" />
            <line x1="29" y1="21" x2="35" y2="21" stroke="#101323" strokeWidth="2" />
            {/* Confident eyes */}
            <ellipse cx="26" cy="32" rx="2" ry="2" fill="#101323" />
            <ellipse cx="38" cy="32" rx="2" ry="2" fill="#101323" />
            {/* Smirk */}
            <path d="M28 42 Q 34 45 37 41" stroke="#101323" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );

      case 'whisperer':
        return (
          <g>
            <rect width="64" height="64" rx="16" fill="#1E2038" />
            <circle cx="32" cy="32" r="16" fill="#EAD4B9" />
            {/* Sleek lower face bandana / scarf */}
            <path d="M20 37 L 44 37 L 32 50 Z" fill="#9177FF" />
            <circle cx="26" cy="30" rx="2" ry="2" fill="#101323" />
            <circle cx="38" cy="30" rx="2" ry="2" fill="#101323" />
          </g>
        );

      case 'detective':
        return (
          <g>
            <rect width="64" height="64" rx="16" fill="#222030" />
            {/* Brown trench coat collar */}
            <path d="M16 54 L 48 54 L 44 42 L 32 46 L 20 42 Z" fill="#8C6E52" />
            <circle cx="32" cy="30" r="15" fill="#EACFB2" />
            {/* Fedora hat */}
            <path d="M16 25 Q 32 23 48 25 L 44 14 Q 32 17 20 14 Z" fill="#5E4530" />
            <rect x="14" y="24" width="36" height="3" rx="1.5" fill="#423020" />
            <circle cx="27" cy="32" r="2" fill="#101323" />
            <circle cx="37" cy="32" r="2" fill="#101323" />
          </g>
        );

      case 'sleuth':
      default:
        return (
          <g>
            <rect width="64" height="64" rx="16" fill="#192036" />
            <circle cx="32" cy="32" r="16" fill="#F0DCBC" />
            {/* Mystery fedora */}
            <path d="M18 24 C 22 14, 42 14, 46 24 Z" fill="#9177FF" />
            <ellipse cx="32" cy="24" rx="20" ry="3.5" fill="#7152EE" />
            {/* Curious eyes */}
            <circle cx="26" cy="33" r="2.5" fill="#101323" />
            <circle cx="38" cy="33" r="2.5" fill="#101323" />
            <circle cx="27" cy="32" r="0.8" fill="#FFF" />
            <circle cx="39" cy="32" r="0.8" fill="#FFF" />
            {/* Small smile */}
            <path d="M29 42 Q 32 44 35 42" stroke="#101323" strokeWidth="2" fill="none" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${currentSize} shrink-0 select-none ${className}`}
    >
      {renderFace()}
    </svg>
  );
};
