import React from 'react';

export const HeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 320 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[280px] sm:max-w-[320px] h-auto select-none ${className}`}
    >
      {/* Soft background ambient halo */}
      <ellipse cx="160" cy="148" rx="130" ry="22" fill="#171A30" />
      <ellipse cx="160" cy="144" rx="90" ry="12" fill="#1D2340" />

      {/* LEFT CHARACTER: The Sleuth with Magnifying Glass */}
      <g transform="translate(42, 45)">
        {/* Body */}
        <path d="M12 90 L 48 90 L 42 56 L 18 56 Z" fill="#262E4C" stroke="#363D5B" strokeWidth="1.5" />
        {/* Scarf */}
        <rect x="20" y="52" width="20" height="7" rx="3.5" fill="#9275FF" />
        {/* Head */}
        <circle cx="30" cy="38" r="16" fill="#F0DCB8" />
        {/* Fedora */}
        <ellipse cx="30" cy="26" rx="20" ry="4.5" fill="#7859EA" />
        <path d="M16 26 C 18 12, 42 12, 44 26 Z" fill="#9275FF" />
        {/* Suspicious eyes */}
        <circle cx="35" cy="37" r="2.5" fill="#101225" />
        <circle cx="25" cy="37" r="2.5" fill="#101225" />
        {/* Magnifying Glass */}
        <circle cx="52" cy="46" r="11" stroke="#C5EF75" strokeWidth="3" fill="#C5EF75" fillOpacity="0.15" />
        <line x1="60" y1="54" x2="70" y2="64" stroke="#C5EF75" strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* CENTER RIGHT: THE CHOMU IMPOSTER (Lurking disguise, glowing coral eye, question mark card) */}
      <g transform="translate(180, 28)">
        {/* Glow behind imposter */}
        <circle cx="36" cy="48" r="32" fill="#FF6987" fillOpacity="0.15" />
        {/* Coat / Hood */}
        <path d="M10 105 L 62 105 L 56 62 C 56 40, 16 40, 16 62 Z" fill="#1D2340" stroke="#FF6987" strokeWidth="2.5" />
        {/* Mask */}
        <rect x="20" y="52" width="32" height="18" rx="6" fill="#101225" />
        {/* Glowing coral imposter eyes */}
        <ellipse cx="28" cy="61" rx="4" ry="2.5" fill="#FF6987" />
        <ellipse cx="44" cy="61" rx="4" ry="2.5" fill="#FF6987" />
        <circle cx="28" cy="60" r="1" fill="#FFF" />
        <circle cx="44" cy="60" r="1" fill="#FFF" />
        {/* Held Secret Card */}
        <rect x="42" y="70" width="22" height="30" rx="4" fill="#FF6987" transform="rotate(12 42 70)" />
        <text x="51" y="91" fill="#101225" fontSize="16" fontWeight="900" textAnchor="middle" transform="rotate(12 51 91)">?</text>
      </g>

      {/* CENTER LEFT: The Poker Face Civilian */}
      <g transform="translate(118, 52)">
        {/* Body */}
        <path d="M14 83 L 50 83 L 44 50 L 20 50 Z" fill="#1D2340" stroke="#363D5B" strokeWidth="1.5" />
        {/* Head */}
        <circle cx="32" cy="34" r="16" fill="#E8D1B5" />
        {/* Dark shades */}
        <rect x="21" y="29" width="10" height="7" rx="2" fill="#101225" />
        <rect x="33" y="29" width="10" height="7" rx="2" fill="#101225" />
        <line x1="30" y1="32" x2="34" y2="32" stroke="#101225" strokeWidth="2" />
        {/* Flat mouth */}
        <line x1="28" y1="43" x2="36" y2="43" stroke="#101225" strokeWidth="2" strokeLinecap="round" />
        {/* Speech Bubble: "Secret Word" cue */}
        <rect x="44" y="6" width="36" height="20" rx="8" fill="#1D2340" stroke="#9275FF" strokeWidth="1.5" />
        <path d="M46 22 L 40 28 L 50 24 Z" fill="#1D2340" />
        <circle cx="53" cy="16" r="2" fill="#9275FF" />
        <circle cx="62" cy="16" r="2" fill="#9275FF" />
        <circle cx="71" cy="16" r="2" fill="#9275FF" />
      </g>
    </svg>
  );
};
