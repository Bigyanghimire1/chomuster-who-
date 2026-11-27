import React from 'react';

export const FinalRevealArtwork: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <svg
      viewBox="0 0 260 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[230px] h-auto select-none ${className}`}
    >
      {/* Pop-art burst backdrop */}
      <circle
        cx="130"
        cy="118"
        r="86"
        fill="#FFFFFF"
        stroke="#050505"
        strokeWidth="4"
      />
      <circle
        cx="130"
        cy="118"
        r="70"
        fill="#FFF9CC"
        stroke="#050505"
        strokeWidth="2.5"
        strokeDasharray="8 6"
      />

      {/* Floating doodle accents */}
      <g transform="translate(22, 42) rotate(-12)">
        <rect
          width="32"
          height="32"
          rx="10"
          fill="#FF5D73"
          stroke="#050505"
          strokeWidth="3.2"
        />
        <text
          x="16"
          y="23"
          fill="#050505"
          fontSize="20"
          fontWeight="900"
          textAnchor="middle"
        >
          !
        </text>
      </g>

      <g transform="translate(204, 38) rotate(12)">
        <rect
          width="32"
          height="32"
          rx="10"
          fill="#64E987"
          stroke="#050505"
          strokeWidth="3.2"
        />
        <text
          x="16"
          y="23"
          fill="#050505"
          fontSize="19"
          fontWeight="900"
          textAnchor="middle"
        >
          ?
        </text>
      </g>

      {/* Expressive Neo-Brutalist Chomu Character */}
      <g transform="translate(130, 126)">
        {/* Shoulders / Hoodie */}
        <path
          d="M-54 62C-54 32 -32 20 0 20C32 20 54 32 54 62Z"
          fill="#FF5D73"
          stroke="#050505"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        {/* Hoodie collar */}
        <path
          d="M-24 23C-14 34 14 34 24 23"
          stroke="#050505"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Ears */}
        <circle cx="-42" cy="-16" r="10" fill="#FCD3A1" stroke="#050505" strokeWidth="3.5" />
        <circle cx="42" cy="-16" r="10" fill="#FCD3A1" stroke="#050505" strokeWidth="3.5" />

        {/* Head */}
        <rect
          x="-38"
          y="-58"
          width="76"
          height="82"
          rx="36"
          fill="#FCD3A1"
          stroke="#050505"
          strokeWidth="4"
        />

        {/* Hair / Beanie */}
        <path
          d="M-38 -30C-38 -64 38 -64 38 -30Z"
          fill="#B68AF2"
          stroke="#050505"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <rect
          x="-42"
          y="-38"
          width="84"
          height="14"
          rx="7"
          fill="#FFDF00"
          stroke="#050505"
          strokeWidth="3.5"
        />

        {/* Lifted Disguise Mask (caught red-handed!) */}
        <g transform="translate(0, -48) rotate(-8)">
          <path
            d="M-36 0C-22 -8 22 -8 36 0L32 18C20 22 10 14 0 14C-10 14 -20 22 -32 18Z"
            fill="#050505"
          />
          <ellipse cx="-14" cy="7" rx="8" ry="5" fill="#FFFFFF" />
          <ellipse cx="14" cy="7" rx="8" ry="5" fill="#FFFFFF" />
        </g>

        {/* Big Goofy Side-Eye Expression */}
        <ellipse
          cx="-15"
          cy="-12"
          rx="10"
          ry="11"
          fill="#FFFFFF"
          stroke="#050505"
          strokeWidth="3"
        />
        <ellipse
          cx="15"
          cy="-12"
          rx="10"
          ry="11"
          fill="#FFFFFF"
          stroke="#050505"
          strokeWidth="3"
        />
        <circle cx="-11" cy="-11" r="4.5" fill="#050505" />
        <circle cx="19" cy="-11" r="4.5" fill="#050505" />
        <circle cx="-13" cy="-13" r="1.8" fill="#FFFFFF" />
        <circle cx="17" cy="-13" r="1.8" fill="#FFFFFF" />

        {/* Sweat drop */}
        <path
          d="M32 -28C32 -28 38 -20 38 -16C38 -12.7 35.3 -10 32 -10C28.7 -10 26 -12.7 26 -16C26 -20 32 -28 32 -28Z"
          fill="#A9E5F2"
          stroke="#050505"
          strokeWidth="2.5"
        />

        {/* Cheeky Smirk */}
        <path
          d="M-14 10C-4 18 12 16 18 7"
          stroke="#050505"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
