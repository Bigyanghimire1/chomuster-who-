import React from 'react';

export const ChomuLogo: React.FC<{ size?: 'sm' | 'md' | 'lg'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14',
  };

  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} shrink-0 select-none ${className}`}
    >
      <rect width="100" height="100" rx="26" fill="#111824" stroke="#233044" strokeWidth="3" />
      
      {/* Detective Fedora */}
      <path d="M26 38 C28 20, 72 20, 74 38 Z" fill="#D9A75A" stroke="#0B111C" strokeWidth="2" />
      <ellipse cx="50" cy="38" rx="34" ry="7" fill="#E5B971" stroke="#0B111C" strokeWidth="2" />
      <rect x="30" y="34" width="40" height="4" rx="2" fill="#FF5A5F" />

      {/* Face / Mask */}
      <circle cx="50" cy="54" r="19" fill="#182233" stroke="#233044" strokeWidth="2" />
      
      {/* Sunglasses */}
      <rect x="36" y="47" width="12" height="9" rx="3" fill="#070B12" stroke="#1CE8C6" strokeWidth="1.5" />
      <rect x="52" y="47" width="12" height="9" rx="3" fill="#070B12" stroke="#1CE8C6" strokeWidth="1.5" />
      <line x1="47" y1="51" x2="53" y2="51" stroke="#1CE8C6" strokeWidth="1.5" />
      
      {/* Teal lens gleam */}
      <line x1="38" y1="49" x2="42" y2="49" stroke="#1CE8C6" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="54" y1="49" x2="58" y2="49" stroke="#1CE8C6" strokeWidth="1.5" strokeLinecap="round" />

      {/* Trench coat collar & Tie */}
      <path d="M24 88 L 38 68 L 50 78 L 62 68 L 76 88 Z" fill="#182233" stroke="#233044" strokeWidth="2" />
      <polygon points="50,74 53,84 50,88 47,84" fill="#FF5A5F" />
    </svg>
  );
};
