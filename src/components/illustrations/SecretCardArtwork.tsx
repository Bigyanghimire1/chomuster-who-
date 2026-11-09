import React from 'react';

export const SecretCardBack: React.FC<{ isHolding?: boolean }> = ({ isHolding = false }) => {
  return (
    <svg
      viewBox="0 0 240 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full max-w-[240px] select-none"
    >
      {/* Outer Border with rounded corners */}
      <rect
        x="6"
        y="6"
        width="228"
        height="308"
        rx="22"
        fill="#1D2340"
        stroke={isHolding ? '#9275FF' : '#363D5B'}
        strokeWidth="3"
        strokeDasharray={isHolding ? 'none' : '8 6'}
      />

      {/* Inner Frame */}
      <rect
        x="16"
        y="16"
        width="208"
        height="288"
        rx="16"
        fill="#101225"
        stroke="#262E4C"
        strokeWidth="1.5"
      />

      {/* 4 Corner Geometric Accents */}
      <path d="M26 40 L 26 26 L 40 26" stroke="#9275FF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M214 40 L 214 26 L 200 26" stroke="#9275FF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M26 280 L 26 294 L 40 294" stroke="#9275FF" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M214 280 L 214 294 L 200 294" stroke="#9275FF" strokeWidth="2.5" strokeLinecap="round" />

      {/* Concentric Center Rings */}
      <circle cx="120" cy="150" r="64" stroke="#1D2340" strokeWidth="1.5" />
      <circle cx="120" cy="150" r="48" stroke="#363D5B" strokeWidth="2" strokeDasharray="6 4" />
      <circle cx="120" cy="150" r="34" fill="#1D2340" stroke="#9275FF" strokeWidth="2" />

      {/* Mystery Keyhole / Eye Medallion in Center */}
      <path
        d="M102 150 C 102 138, 138 138, 138 150 C 138 162, 102 162, 102 150 Z"
        stroke="#F6F5FC"
        strokeWidth="2.5"
        fill="none"
      />
      <circle cx="120" cy="150" r="7" fill="#9275FF" />
      <circle cx="120" cy="150" r="2.5" fill="#FFF" />

      {/* Top Banner Label */}
      <rect x="74" y="56" width="92" height="22" rx="11" fill="#262E4C" stroke="#363D5B" strokeWidth="1" />
      <text
        x="120"
        y="71"
        fill="#A9ADC5"
        fontSize="10"
        fontWeight="800"
        letterSpacing="2"
        textAnchor="middle"
      >
        TOP SECRET
      </text>

      {/* Bottom Hold Instruction Label */}
      <rect x="55" y="238" width="130" height="26" rx="13" fill="#262E4C" stroke="#363D5B" strokeWidth="1" />
      <text
        x="120"
        y="255"
        fill="#F6F5FC"
        fontSize="11"
        fontWeight="700"
        letterSpacing="1.5"
        textAnchor="middle"
      >
        HOLD TO REVEAL
      </text>
    </svg>
  );
};
