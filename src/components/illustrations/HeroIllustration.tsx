import React from 'react';

/**
 * Detailed Flagship Chomu Mascot Illustration — cel-shaded cartoon caricature with
 * expressive eyebrows, shaded ears/cheeks, oversized bulbous nose, signature
 * two missing middle upper front teeth, detective fedora, trenchcoat, and magnifying glass.
 */
export const HeroIllustration: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      viewBox="0 0 320 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full max-w-[300px] sm:max-w-[340px] h-auto select-none ${className}`}
    >
      <defs>
        <radialGradient id="chomuStageGlow" cx="50%" cy="55%" r="50%">
          <stop offset="0%" stopColor="#1CE8C6" stopOpacity="0.16" />
          <stop offset="65%" stopColor="#182233" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#070B12" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="trenchCoatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D7A154" />
          <stop offset="100%" stopColor="#A9742D" />
        </linearGradient>
        <linearGradient id="skinShadeGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D5926D" />
          <stop offset="100%" stopColor="#AE6C4A" />
        </linearGradient>
        <linearGradient id="fedoraGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EAC17C" />
          <stop offset="100%" stopColor="#BA883E" />
        </linearGradient>
      </defs>

      {/* Soft stage backdrop */}
      <ellipse cx="164" cy="146" rx="134" ry="102" fill="url(#chomuStageGlow)" />
      <ellipse cx="164" cy="242" rx="116" ry="11" fill="#05080E" opacity="0.85" />

      {/* Playful comic motion sparks */}
      <path d="M40 52 L48 40 M53 60 L64 54" stroke="#F5C542" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M276 48 L286 37 M284 62 L296 59" stroke="#F5C542" strokeWidth="3.5" strokeLinecap="round" />

      {/* Floating Secret Card Clue */}
      <g transform="translate(18, 126) rotate(-14)">
        <rect x="2" y="4" width="46" height="58" rx="10" fill="#05080E" opacity="0.55" />
        <rect width="46" height="58" rx="10" fill="#E5B971" stroke="#0B111C" strokeWidth="3" />
        <rect x="6" y="6" width="34" height="46" rx="6" fill="#111824" stroke="#233044" strokeWidth="1.5" />
        <text x="23" y="38" fill="#F5C542" fontSize="26" fontWeight="900" textAnchor="middle">
          ?
        </text>
      </g>

      {/* Flagship Chomu Character */}
      <g transform="translate(74, 14)">
        {/* Coat Shoulders & Lapels */}
        <path
          d="M24 224 L42 156 C44 148, 52 144, 62 144 L126 144 C136 144, 144 148, 146 156 L164 224 Z"
          fill="url(#trenchCoatGrad)"
          stroke="#0B111C"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Shirt V & Bowtie */}
        <path d="M64 144 L94 186 L124 144 Z" fill="#111824" stroke="#0B111C" strokeWidth="3" strokeLinejoin="round" />
        {/* Lapel fold shadows */}
        <path d="M64 144 L48 164 L66 174 L76 164" fill="#BA843B" stroke="#0B111C" strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M124 144 L140 164 L122 174 L112 164" fill="#BA843B" stroke="#0B111C" strokeWidth="2.8" strokeLinejoin="round" />
        {/* Crisp Bowtie */}
        <polygon points="78,158 94,166 78,174" fill="#0B111C" />
        <polygon points="110,158 94,166 110,174" fill="#0B111C" />
        <circle cx="94" cy="166" r="5" fill="#1CE8C6" stroke="#0B111C" strokeWidth="2.2" />

        {/* Neck */}
        <rect x="78" y="128" width="32" height="22" rx="8" fill="#A96846" stroke="#0B111C" strokeWidth="3" />

        {/* Oversized Asymmetrical Ears with inner detail */}
        <ellipse cx="42" cy="96" rx="11" ry="16" fill="#B87452" stroke="#0B111C" strokeWidth="3" />
        <path d="M39 90 C36 94, 37 101, 42 103" stroke="#0B111C" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="146" cy="94" rx="11" ry="17" fill="#B87452" stroke="#0B111C" strokeWidth="3" />
        <path d="M149 88 C152 92, 151 99, 146 101" stroke="#0B111C" strokeWidth="2" strokeLinecap="round" />

        {/* Expressive Caricature Head */}
        <path
          d="M46 82 C46 42, 142 42, 142 82 C144 114, 130 144, 94 144 C58 144, 44 114, 46 82 Z"
          fill="url(#skinShadeGrad)"
          stroke="#0B111C"
          strokeWidth="3.5"
        />
        {/* Forehead worry creases & cheek contour */}
        <path d="M74 56 Q94 52 114 56" stroke="#0B111C" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        <path d="M56 104 Q51 115 62 122" stroke="#0B111C" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
        <path d="M132 104 Q137 115 126 122" stroke="#0B111C" strokeWidth="2.2" strokeLinecap="round" opacity="0.4" />
        <ellipse cx="64" cy="100" rx="7" ry="4" fill="#FF5A5F" opacity="0.22" />
        <ellipse cx="124" cy="100" rx="7" ry="4" fill="#FF5A5F" opacity="0.22" />

        {/* Big Comical Asymmetrical Eyes */}
        <ellipse cx="75" cy="82" rx="13" ry="14" fill="#FFFDF8" stroke="#0B111C" strokeWidth="3" />
        <ellipse cx="113" cy="82" rx="11" ry="12" fill="#FFFDF8" stroke="#0B111C" strokeWidth="3" />
        {/* Irises & Catchlights */}
        <circle cx="77" cy="83" r="6" fill="#182233" />
        <circle cx="111" cy="83" r="5.2" fill="#182233" />
        <circle cx="77" cy="83" r="3" fill="#0B111C" />
        <circle cx="111" cy="83" r="2.6" fill="#0B111C" />
        <circle cx="79.5" cy="80.5" r="2" fill="#FFF" />
        <circle cx="113" cy="80.5" r="1.8" fill="#FFF" />

        {/* Thick Expressive Bushy Eyebrows */}
        <path d="M58 65 Q74 54 88 66" stroke="#0B111C" strokeWidth="5" strokeLinecap="round" />
        <path d="M100 67 Q114 57 129 64" stroke="#0B111C" strokeWidth="4.5" strokeLinecap="round" />

        {/* Oversized Shaded Bulbous Nose */}
        <path
          d="M84 86 C80 96, 82 105, 94 105 C106 105, 108 96, 104 86 C100 81, 88 81, 84 86 Z"
          fill="#B66E4C"
          stroke="#0B111C"
          strokeWidth="3"
        />
        <ellipse cx="90" cy="91" rx="4" ry="2.5" fill="#E3A57E" opacity="0.65" />

        {/* Signature Wide Grin with TWO MISSING MIDDLE UPPER TEETH */}
        <path
          d="M62 110 Q94 137 126 110 Q116 132 94 132 C72 132 62 110 62 110 Z"
          fill="#3B0F18"
          stroke="#0B111C"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Tongue */}
        <path d="M80 128 Q94 121 108 128 Q94 133 80 128 Z" fill="#FF5A5F" />
        {/* Upper side teeth with big gap in middle */}
        <path d="M65 111 L74 113 L74 120 L66 118 Z" fill="#FFFDF8" stroke="#0B111C" strokeWidth="1.5" />
        <path d="M75 113 L83 114 L83 121 L75 120 Z" fill="#FFFDF8" stroke="#0B111C" strokeWidth="1.5" />
        <path d="M105 114 L113 113 L112 120 L105 121 Z" fill="#FFFDF8" stroke="#0B111C" strokeWidth="1.5" />
        <path d="M114 113 L123 111 L122 118 L114 120 Z" fill="#FFFDF8" stroke="#0B111C" strokeWidth="1.5" />
        {/* Bottom teeth */}
        <rect x="81" y="125.5" width="26" height="4.5" rx="2" fill="#FFFDF8" />

        {/* Detective Fedora Hat with Ribbon & Brim */}
        <path d="M48 58 C54 22, 134 22, 140 58 Z" fill="url(#fedoraGrad)" stroke="#0B111C" strokeWidth="3.5" />
        <path d="M84 31 Q94 37 104 31" stroke="#A67432" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="50" y="48" width="88" height="8.5" rx="2.5" fill="#FF5A5F" stroke="#0B111C" strokeWidth="2.5" />
        <ellipse cx="94" cy="58" rx="56" ry="9.5" fill="#EAC17C" stroke="#0B111C" strokeWidth="3.5" />
      </g>

      {/* Oversized Detective Magnifying Glass */}
      <g transform="translate(204, 136)">
        <line x1="30" y1="44" x2="54" y2="70" stroke="#0B111C" strokeWidth="12" strokeLinecap="round" />
        <line x1="30" y1="44" x2="54" y2="70" stroke="#D9A75A" strokeWidth="6" strokeLinecap="round" />
        <circle cx="20" cy="26" r="24" fill="#1CE8C6" fillOpacity="0.2" stroke="#0B111C" strokeWidth="6" />
        <circle cx="20" cy="26" r="24" stroke="#F5C542" strokeWidth="3" />
        <path d="M8 16 Q17 8 28 13" stroke="#FFFDF8" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>
    </svg>
  );
};
