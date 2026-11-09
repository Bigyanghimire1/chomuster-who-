import React from 'react';

export const FinalRevealArtwork: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 280 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[240px] h-auto select-none ${className}`}
    >
      {/* Dramatic burst rays */}
      <circle cx="140" cy="90" r="75" fill="#FF6987" fillOpacity="0.1" />
      <circle cx="140" cy="90" r="60" stroke="#FF6987" strokeWidth="2" strokeDasharray="4 4" />

      {/* Discarded disguise mask flying off */}
      <g transform="translate(140, 85)">
        {/* Trenchcoat collar */}
        <path d="M-40 50 L -15 20 L 0 35 L 15 20 L 40 50 Z" fill="#262E4C" stroke="#363D5B" strokeWidth="2" />
        <polygon points="0,30 4,45 0,50 -4,45" fill="#FF6987" />

        {/* Unmasked Face */}
        <circle cx="0" cy="0" r="28" fill="#1D2340" stroke="#FF6987" strokeWidth="2.5" />
        
        {/* Grinning Imposter Eyes */}
        <ellipse cx="-10" cy="-4" rx="5" ry="3.5" fill="#FF6987" />
        <ellipse cx="10" cy="-4" rx="5" ry="3.5" fill="#FF6987" />
        <circle cx="-10" cy="-5" r="1.5" fill="#FFF" />
        <circle cx="10" cy="-5" r="1.5" fill="#FFF" />
        
        {/* Wry smile */}
        <path d="M-10 12 Q 0 19 10 12" stroke="#FF6987" strokeWidth="2.5" strokeLinecap="round" />

        {/* Mask lifted up */}
        <g transform="translate(24, -36) rotate(22)">
          <rect x="-16" y="-10" width="32" height="18" rx="6" fill="#101225" stroke="#9275FF" strokeWidth="2" />
          <line x1="-10" y1="-2" x2="-4" y2="-2" stroke="#68D9E7" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="-2" x2="10" y2="-2" stroke="#68D9E7" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};
