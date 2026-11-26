import React from 'react';

export const SecretCardBack: React.FC<{ isHolding?: boolean }> = ({ isHolding = false }) => {
  return (
    <svg
      viewBox="0 0 240 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[240px] select-none"
    >
      {/* Outer Border */}
      <rect
        x="6"
        y="6"
        width="228"
        height="308"
        rx="20"
        fill="#111824"
        stroke={isHolding ? '#1CE8C6' : '#233044'}
        strokeWidth="2"
        strokeDasharray={isHolding ? 'none' : '8 6'}
      />

      {/* Inner Frame */}
      <rect
        x="16"
        y="16"
        width="208"
        height="288"
        rx="14"
        fill="#070B12"
        stroke="#182233"
        strokeWidth="1.5"
      />

      {/* 4 Corner Dossier Brackets */}
      <path d="M26 40 L 26 26 L 40 26" stroke="#1CE8C6" strokeWidth="2" strokeLinecap="round" />
      <path d="M214 40 L 214 26 L 200 26" stroke="#1CE8C6" strokeWidth="2" strokeLinecap="round" />
      <path d="M26 280 L 26 294 L 40 294" stroke="#1CE8C6" strokeWidth="2" strokeLinecap="round" />
      <path d="M214 280 L 214 294 L 200 294" stroke="#1CE8C6" strokeWidth="2" strokeLinecap="round" />

      {/* Concentric Center Rings */}
      <circle cx="120" cy="150" r="64" stroke="#182233" strokeWidth="1.5" />
      <circle cx="120" cy="150" r="48" stroke="#233044" strokeWidth="1.5" strokeDasharray="6 4" />
      <circle cx="120" cy="150" r="34" fill="#111824" stroke="#1CE8C6" strokeWidth="1.5" />

      {/* Keyhole Eye Medallion */}
      <path
        d="M102 150 C 102 138, 138 138, 138 150 C 138 162, 102 162, 102 150 Z"
        stroke="#F5F7FA"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="120" cy="150" r="7" fill="#1CE8C6" />
      <circle cx="120" cy="150" r="2.5" fill="#070B12" />

      {/* Top Case Label */}
      <rect x="74" y="56" width="92" height="22" rx="6" fill="#182233" stroke="#233044" strokeWidth="1" />
      <text
        x="120"
        y="71"
        fill="#9AA8BE"
        fontSize="10"
        fontWeight="600"
        letterSpacing="1"
        textAnchor="middle"
      >
        TOP SECRET
      </text>

      {/* Bottom Instruction */}
      <rect x="55" y="238" width="130" height="26" rx="8" fill="#182233" stroke="#233044" strokeWidth="1" />
      <text
        x="120"
        y="255"
        fill="#F5F7FA"
        fontSize="11"
        fontWeight="500"
        textAnchor="middle"
      >
        Hold to reveal
      </text>
    </svg>
  );
};
