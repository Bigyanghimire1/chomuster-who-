import React from 'react';

interface SecretCardBackProps {
  isHolding?: boolean;
  className?: string;
}

export const SecretCardBack: React.FC<SecretCardBackProps> = ({
  isHolding = false,
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[176px] h-auto select-none transition-transform duration-300 ${
        isHolding ? 'scale-105' : ''
      } ${className}`}
    >
      {/* Offset yellow doodle badge */}
      <circle
        cx="110"
        cy="108"
        r="74"
        fill="#FFDF00"
        stroke="#050505"
        strokeWidth="4"
      />
      <circle
        cx="110"
        cy="108"
        r="58"
        fill="#FFFFFF"
        stroke="#050505"
        strokeWidth="3"
        strokeDasharray="7 6"
      />

      {/* Playful floating doodle marks */}
      <g transform="translate(28, 34) rotate(-8)">
        <rect
          width="30"
          height="30"
          rx="9"
          fill="#F28BCB"
          stroke="#050505"
          strokeWidth="3"
        />
        <text
          x="15"
          y="21"
          fill="#050505"
          fontSize="18"
          fontWeight="900"
          textAnchor="middle"
        >
          ?
        </text>
      </g>

      <g transform="translate(162, 30) rotate(10)">
        <rect
          width="28"
          height="28"
          rx="9"
          fill="#A9E5F2"
          stroke="#050505"
          strokeWidth="3"
        />
        <text
          x="14"
          y="20"
          fill="#050505"
          fontSize="16"
          fontWeight="900"
          textAnchor="middle"
        >
          !
        </text>
      </g>

      {/* Central Magnifying Glass + Suspicious Eye */}
      <g transform="translate(106, 104)">
        {/* Handle */}
        <path
          d="M28 28L56 56"
          stroke="#050505"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M28 28L56 56"
          stroke="#64E987"
          strokeWidth="6"
          strokeLinecap="round"
        />
        {/* Lens ring */}
        <circle
          cx="0"
          cy="0"
          r="40"
          fill="#FFFFFF"
          stroke="#050505"
          strokeWidth="4.5"
        />
        {/* Eye outline */}
        <path
          d="M-26 0C-18 -16 18 -16 26 0C18 16 -18 16 -26 0Z"
          fill="#FFF9CC"
          stroke="#050505"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Iris & Pupil */}
        <circle
          cx="0"
          cy="0"
          r="11"
          fill={isHolding ? '#64E987' : '#FF5D73'}
          stroke="#050505"
          strokeWidth="3"
        />
        <circle cx="0" cy="0" r="4.5" fill="#050505" />
        <circle cx="-3" cy="-3" r="2.2" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
