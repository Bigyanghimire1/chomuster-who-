import React from 'react';

export const ChomuLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Light doodle magnifying-eye badge */}
      <circle cx="30" cy="30" r="22" fill="#FFFFFF" stroke="#050505" strokeWidth="4" />
      <line x1="46" y1="46" x2="58" y2="58" stroke="#050505" strokeWidth="6" strokeLinecap="round" />
      {/* Playful suspicious eye */}
      <path
        d="M16 30 C20 20, 40 20, 44 30 C40 40, 20 40, 16 30 Z"
        fill="#FFDF00"
        stroke="#050505"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="30" r="5.5" fill="#050505" />
      <circle cx="33.5" cy="28" r="1.8" fill="#FFFFFF" />
      {/* Tiny mischievous brow */}
      <path d="M18 19 Q30 14 42 20" stroke="#FF5D73" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
};
