import React from 'react';

export const RoundInProgressArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 280 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[260px] h-auto select-none ${className}`}
    >
      {/* Background radial glow */}
      <circle cx="140" cy="100" r="88" fill="#1D2340" />
      <circle cx="140" cy="100" r="70" stroke="#363D5B" strokeWidth="2" strokeDasharray="6 6" />

      {/* Central Magnifying Glass with Suspicious Eye */}
      <g transform="translate(140, 95)">
        <circle cx="0" cy="0" r="38" fill="#171A30" stroke="#9275FF" strokeWidth="4" />
        <ellipse cx="0" cy="0" rx="22" ry="14" fill="#101225" stroke="#F6F5FC" strokeWidth="2" />
        {/* Iris & Pupil */}
        <circle cx="0" cy="0" r="8" fill="#FF6987" />
        <circle cx="0" cy="0" r="4" fill="#101225" />
        <circle cx="-2" cy="-2" r="2" fill="#FFF" />
        {/* Handle */}
        <line x1="26" y1="26" x2="52" y2="52" stroke="#9275FF" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Playful question marks floating around */}
      <g transform="translate(56, 50)">
        <rect width="28" height="28" rx="8" fill="#262E4C" stroke="#363D5B" strokeWidth="1.5" />
        <text x="14" y="20" fill="#C5EF75" fontSize="16" fontWeight="900" textAnchor="middle">?</text>
      </g>

      <g transform="translate(200, 45)">
        <rect width="28" height="28" rx="8" fill="#262E4C" stroke="#363D5B" strokeWidth="1.5" />
        <text x="14" y="20" fill="#FFC86D" fontSize="16" fontWeight="900" textAnchor="middle">?</text>
      </g>

      <g transform="translate(68, 140)">
        <rect width="26" height="26" rx="8" fill="#262E4C" stroke="#363D5B" strokeWidth="1.5" />
        <text x="13" y="18" fill="#68D9E7" fontSize="14" fontWeight="900" textAnchor="middle">!</text>
      </g>
    </svg>
  );
};
