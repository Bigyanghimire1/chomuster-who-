import React from 'react';
import { PlayerAvatarId } from '../../types/game';

/**
 * Pure scalable SVG caricature artwork (64x64 viewBox) with bold comic outlines,
 * asymmetrical facial proportions, oversized noses, goofy teeth, and distinct personalities.
 */
export const renderCaricatureArtwork = (
  id: PlayerAvatarId | string,
  isImposterStyle = false
): React.ReactNode => {
  const ink = '#0B111C';
  const badgeBg = isImposterStyle ? '#2D141B' : '#162030';
  const badgeRing = isImposterStyle ? '#FF5A5F' : '#26354B';

  switch (id) {
    // 1. Flagship Chomu Mascot: Tan detective hat, trench collar, bulbous nose, two missing middle upper front teeth
    case 'sleuth':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill={badgeBg} />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke={badgeRing} strokeWidth="2" />
          {/* Trenchcoat collar */}
          <path d="M12 62 L20 46 L44 46 L52 62 Z" fill="#C79248" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M24 46 L32 56 L40 46" fill="#0B111C" />
          <polygon points="32,49 35,58 32,62 29,58" fill="#1CE8C6" />
          {/* Big asymmetrical ears */}
          <ellipse cx="14" cy="36" rx="4.5" ry="6" fill="#B87654" stroke={ink} strokeWidth="2" />
          <ellipse cx="50" cy="35" rx="4.5" ry="6.5" fill="#B87654" stroke={ink} strokeWidth="2" />
          {/* Pear-shaped goofy head */}
          <path d="M16 32 C16 18, 48 18, 48 32 C49 44, 43 52, 32 52 C21 52, 15 44, 16 32 Z" fill="#C98560" stroke={ink} strokeWidth="2" />
          {/* Cheek lines */}
          <path d="M20 38 Q18 42 22 44" stroke={ink} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          <path d="M44 38 Q46 42 42 44" stroke={ink} strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
          {/* Big expressive mismatched eyes */}
          <ellipse cx="25" cy="30" rx="5" ry="5.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.8" />
          <ellipse cx="39" cy="30" rx="4.2" ry="4.8" fill="#FFFDF8" stroke={ink} strokeWidth="1.8" />
          <circle cx="26" cy="30.5" r="2.2" fill={isImposterStyle ? '#FF5A5F' : ink} />
          <circle cx="38" cy="30.5" r="2" fill={isImposterStyle ? '#FF5A5F' : ink} />
          <circle cx="27" cy="29.5" r="0.8" fill="#FFF" />
          <circle cx="39" cy="29.5" r="0.8" fill="#FFF" />
          {/* Raised bushy eyebrows */}
          <path d="M19 23 Q25 19 30 23" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
          <path d="M35 24 Q40 21 45 24" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          {/* Oversized bulbous nose */}
          <ellipse cx="32" cy="35.5" rx="4.8" ry="3.8" fill="#B56E4B" stroke={ink} strokeWidth="1.8" />
          {/* Wide goofy grin with TWO MISSING MIDDLE UPPER TEETH */}
          <path d="M21 41 Q32 50 43 41 Q38 49 26 49 Z" fill="#3B1016" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
          {/* Left upper teeth & right upper teeth leaving middle gap */}
          <path d="M22.5 41.5 L26 42 L26 45 L23 44.5 Z" fill="#FFFDF8" />
          <path d="M26.5 42 L29 42.3 L29 45.2 L26.5 45 Z" fill="#FFFDF8" />
          <path d="M35 42.3 L37.5 42 L37.5 45 L35 45.2 Z" fill="#FFFDF8" />
          <path d="M38 42 L41.5 41.5 L41 44.5 L38 45 Z" fill="#FFFDF8" />
          {/* Bottom teeth */}
          <rect x="28" y="46.2" width="8" height="2.2" rx="1" fill="#FFFDF8" />
          {/* Tan Detective Fedora */}
          <path d="M17 22 C19 10, 45 10, 47 22 Z" fill="#D9A75A" stroke={ink} strokeWidth="2" />
          <rect x="18" y="18.5" width="28" height="3.5" rx="1" fill="#FF5A5F" stroke={ink} strokeWidth="1.4" />
          <ellipse cx="32" cy="22" rx="22" ry="4" fill="#E5B971" stroke={ink} strokeWidth="2" />
        </g>
      );

    // 2. Spooky-Funny Lurker Hood
    case 'shadow':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill={isImposterStyle ? '#351019' : '#141B2D'} />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke={isImposterStyle ? '#FF5A5F' : '#2A3954'} strokeWidth="2" />
          {/* Oversized pointed hood */}
          <path
            d="M10 58 C10 34, 18 12, 32 10 C46 12, 54 34, 54 58 Z"
            fill={isImposterStyle ? '#9E2A3B' : '#25314D'}
            stroke={ink}
            strokeWidth="2.2"
          />
          {/* Deep hood cavity */}
          <path d="M17 50 C17 31, 23 20, 32 20 C41 20, 47 31, 47 50 C41 54, 23 54, 17 50 Z" fill="#090D16" />
          {/* Slanted mischievous glowing eyes */}
          <path d="M21 33 L29 36 L22 38 Z" fill={isImposterStyle ? '#FFFDF8' : '#FF5A5F'} />
          <path d="M43 33 L35 36 L42 38 Z" fill={isImposterStyle ? '#FFFDF8' : '#FF5A5F'} />
          {/* Crooked goofy toothy smirk in the dark */}
          <path d="M24 44 Q32 49 40 42" stroke="#F5F7FA" strokeWidth="2" strokeLinecap="round" />
          <polygon points="27,45 29,48 31,45.5" fill="#F5F7FA" />
          <polygon points="35,45 37,48 38.5,43.5" fill="#F5F7FA" />
        </g>
      );

    // 3. Shady Uncle: Square jaw, slicked hair, tiny dark shades, huge smug grin
    case 'pokerface':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#132232" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#233952" strokeWidth="2" />
          {/* Ears */}
          <circle cx="15" cy="34" r="4.5" fill="#E3B38C" stroke={ink} strokeWidth="2" />
          <circle cx="49" cy="34" r="4.5" fill="#E3B38C" stroke={ink} strokeWidth="2" />
          {/* Wide square chin */}
          <rect x="16" y="18" width="32" height="36" rx="12" fill="#F0C49E" stroke={ink} strokeWidth="2" />
          {/* Slicked black hair with curl */}
          <path d="M15 26 C15 12, 49 12, 49 26 C44 20, 22 20, 15 26 Z" fill="#182030" stroke={ink} strokeWidth="2" />
          <path d="M36 14 Q42 10 46 16" stroke="#38BDF8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          {/* Tiny sunglasses */}
          <rect x="19" y="27" width="11" height="7" rx="2" fill="#0B111C" stroke="#1CE8C6" strokeWidth="1.4" />
          <rect x="34" y="27" width="11" height="7" rx="2" fill="#0B111C" stroke="#1CE8C6" strokeWidth="1.4" />
          <line x1="30" y1="30" x2="34" y2="30" stroke={ink} strokeWidth="2" />
          {/* Big triangle nose */}
          <path d="M32 30 L28 38 L35 38 Z" fill="#D99B72" stroke={ink} strokeWidth="1.6" strokeLinejoin="round" />
          {/* Giant smug grin */}
          <path d="M22 43 Q32 51 43 42 Z" fill="#FFFDF8" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
          <line x1="27" y1="43" x2="27" y2="47" stroke={ink} strokeWidth="1.2" />
          <line x1="33" y1="43" x2="33" y2="47.5" stroke={ink} strokeWidth="1.2" />
          <line x1="38" y1="43" x2="38" y2="46.5" stroke={ink} strokeWidth="1.2" />
        </g>
      );

    // 4. Wide-Eyed Rookie: Bugged-out huge eyes, curly wild hair, nervous sweat, crooked bowtie
    case 'agent':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#152235" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#253A56" strokeWidth="2" />
          {/* Wild curly puffs */}
          <circle cx="20" cy="18" r="7" fill="#231F2D" stroke={ink} strokeWidth="2" />
          <circle cx="32" cy="14" r="8" fill="#231F2D" stroke={ink} strokeWidth="2" />
          <circle cx="44" cy="18" r="7" fill="#231F2D" stroke={ink} strokeWidth="2" />
          {/* Oval skinny face */}
          <ellipse cx="32" cy="35" rx="15" ry="18" fill="#F2CAA7" stroke={ink} strokeWidth="2" />
          {/* Comically GIANT bugged eyes */}
          <circle cx="25" cy="30" r="6.5" fill="#FFFDF8" stroke={ink} strokeWidth="2" />
          <circle cx="39" cy="30" r="6.5" fill="#FFFDF8" stroke={ink} strokeWidth="2" />
          <circle cx="26" cy="30" r="2.2" fill={ink} />
          <circle cx="38" cy="30" r="2.2" fill={ink} />
          {/* Nervous sweat drop */}
          <path d="M48 22 C50 26, 51 28, 48 30 C45 28, 46 26, 48 22 Z" fill="#38BDF8" stroke={ink} strokeWidth="1.2" />
          {/* Tiny pinched nose */}
          <ellipse cx="32" cy="36" rx="2.5" ry="2" fill="#DE9F78" stroke={ink} strokeWidth="1.5" />
          {/* Wavy nervous mouth */}
          <path d="M24 44 Q28 41 32 44 Q36 47 40 43" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
          {/* Crooked coral bowtie */}
          <polygon points="23,53 32,57 23,61" fill="#FF5A5F" stroke={ink} strokeWidth="1.6" />
          <polygon points="41,51 32,57 41,59" fill="#FF5A5F" stroke={ink} strokeWidth="1.6" />
          <circle cx="32" cy="57" r="2.5" fill="#F5C542" stroke={ink} strokeWidth="1.5" />
        </g>
      );

    // 5. Beanie Goof: Slouchy teal beanie, tiny eyes, giant unibrow, potato nose, buck tooth
    case 'whiz':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#11242B" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#1E3E4A" strokeWidth="2" />
          {/* Chubby cheeks head */}
          <path d="M15 36 C15 22, 49 22, 49 36 C51 49, 44 55, 32 55 C20 55, 13 49, 15 36 Z" fill="#F2C8A2" stroke={ink} strokeWidth="2" />
          {/* Teal beanie */}
          <path d="M16 27 C16 11, 48 11, 48 27 Z" fill="#1CE8C6" stroke={ink} strokeWidth="2" />
          <rect x="14" y="23" width="36" height="7" rx="3.5" fill="#12B59A" stroke={ink} strokeWidth="2" />
          <circle cx="32" cy="11" r="4" fill="#F5C542" stroke={ink} strokeWidth="1.8" />
          {/* Huge thick furrowed eyebrows */}
          <path d="M19 32 L29 34" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M45 32 L35 34" stroke={ink} strokeWidth="3.2" strokeLinecap="round" />
          {/* Tiny dot eyes */}
          <circle cx="24" cy="36" r="1.8" fill={ink} />
          <circle cx="40" cy="36" r="1.8" fill={ink} />
          {/* Big potato nose */}
          <ellipse cx="32" cy="40" rx="5.5" ry="4" fill="#E3A57E" stroke={ink} strokeWidth="1.8" />
          {/* Single goofy buck tooth */}
          <path d="M25 47 Q32 49 39 47" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <rect x="30" y="47.5" width="4.5" height="4" rx="1" fill="#FFFDF8" stroke={ink} strokeWidth="1.4" />
        </g>
      );

    // 6. Stache Boss: Shiny bald dome with side hair, squinty eyes, ENORMOUS walrus moustache
    case 'maverick':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#211D2D" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#362F48" strokeWidth="2" />
          {/* Side tufts */}
          <circle cx="15" cy="30" r="5" fill="#4A3B32" stroke={ink} strokeWidth="2" />
          <circle cx="49" cy="30" r="5" fill="#4A3B32" stroke={ink} strokeWidth="2" />
          {/* Round shiny head */}
          <ellipse cx="32" cy="34" rx="16" ry="19" fill="#EBBF99" stroke={ink} strokeWidth="2" />
          {/* Head shine */}
          <path d="M24 20 Q28 17 32 19" stroke="#FFFDF8" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
          {/* Angry/suspicious unibrow */}
          <path d="M19 28 Q26 24 32 29 Q38 24 45 28" stroke="#3A2C24" strokeWidth="3.2" strokeLinecap="round" />
          {/* Squinty eyes */}
          <line x1="22" y1="32" x2="28" y2="33" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          <line x1="42" y1="32" x2="36" y2="33" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="25" cy="33.5" r="1.5" fill={ink} />
          <circle cx="39" cy="33.5" r="1.5" fill={ink} />
          {/* Reddish nose */}
          <ellipse cx="32" cy="37" rx="4" ry="3.2" fill="#E38B78" stroke={ink} strokeWidth="1.6" />
          {/* ENORMOUS walrus moustache */}
          <path
            d="M15 44 C15 37, 27 37, 32 42 C37 37, 49 37, 49 44 C49 49, 39 48, 32 45 C25 48, 15 49, 15 44 Z"
            fill="#4A3B32"
            stroke={ink}
            strokeWidth="2"
          />
        </g>
      );

    // 7. Giggles: Pigtails, squinted happy eyes, giant laughing open mouth with missing tooth
    case 'whisperer':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#26192C" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#422B4B" strokeWidth="2" />
          {/* Bouncy pigtails */}
          <path d="M15 26 C7 22, 6 34, 13 38 Z" fill="#1F2435" stroke={ink} strokeWidth="2" />
          <path d="M49 26 C57 22, 58 34, 51 38 Z" fill="#1F2435" stroke={ink} strokeWidth="2" />
          <circle cx="16" cy="26" r="2.5" fill="#FF5A5F" stroke={ink} strokeWidth="1.4" />
          <circle cx="48" cy="26" r="2.5" fill="#FF5A5F" stroke={ink} strokeWidth="1.4" />
          {/* Round face */}
          <circle cx="32" cy="34" r="16" fill="#F0C5A0" stroke={ink} strokeWidth="2" />
          {/* Bangs */}
          <path d="M16 30 C18 16, 46 16, 48 30 L40 23 L32 27 L24 23 Z" fill="#1F2435" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          {/* Laughing squinted ^ ^ eyes */}
          <path d="M21 33 Q24 28 28 33" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M36 33 Q40 28 43 33" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          {/* Rosy cheeks */}
          <circle cx="21" cy="38" r="2.8" fill="#FF5A5F" opacity="0.45" />
          <circle cx="43" cy="38" r="2.8" fill="#FF5A5F" opacity="0.45" />
          {/* Giant laughing mouth */}
          <path d="M21 39 Q32 54 43 39 Z" fill="#3D0F18" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M27 47 Q32 44 37 47 Q32 50 27 47 Z" fill="#FF5A5F" />
          <rect x="25" y="39.5" width="4" height="2.8" rx="0.8" fill="#FFFDF8" />
          <rect x="35" y="39.5" width="4" height="2.8" rx="0.8" fill="#FFFDF8" />
        </g>
      );

    // 8. Snoopy Nose: Deerstalker cap, monocle, absurdly long pointed nose
    case 'detective':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#19212E" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2B394E" strokeWidth="2" />
          {/* Long narrow face */}
          <path d="M19 24 C19 16, 45 16, 45 24 L44 46 C44 53, 20 53, 20 46 Z" fill="#E8BF99" stroke={ink} strokeWidth="2" />
          {/* Deerstalker cap */}
          <path d="M17 24 C18 12, 46 12, 47 24 Z" fill="#7D6249" stroke={ink} strokeWidth="2" />
          <path d="M14 24 Q32 27 50 24" stroke="#5A4531" strokeWidth="3.5" strokeLinecap="round" />
          {/* Normal eye + giant monocle eye */}
          <circle cx="25" cy="31" r="2.2" fill={ink} />
          <circle cx="38" cy="31" r="5.5" fill="#38BDF8" fillOpacity="0.22" stroke="#F5C542" strokeWidth="2" />
          <circle cx="38" cy="31" r="2" fill={ink} />
          <path d="M43 33 L46 47" stroke="#F5C542" strokeWidth="1.2" />
          {/* Absurdly long pointed nose */}
          <path d="M31 32 L45 38 L30 41 Z" fill="#D4956E" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
          {/* Crooked suspicious mouth */}
          <path d="M24 46 Q30 44 37 47" stroke={ink} strokeWidth="2" strokeLinecap="round" />
        </g>
      );

    // 9. Cross-Eyed Gremlin: Bat ears, wild green hair, cross-eyed pupils, underbite fangs
    case 'gremlin':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#11241E" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#1E4236" strokeWidth="2" />
          {/* Giant bat-like ears */}
          <path d="M16 32 L5 22 L12 38 Z" fill="#88C999" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          <path d="M48 32 L59 22 L52 38 Z" fill="#88C999" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          {/* Head */}
          <ellipse cx="32" cy="35" rx="16" ry="15" fill="#9AE0AC" stroke={ink} strokeWidth="2" />
          {/* Spiky dark-teal hair */}
          <path d="M18 25 L23 13 L29 21 L34 11 L39 21 L46 15 L45 26 Z" fill="#103B34" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
          {/* Huge cross-eyed eyes */}
          <circle cx="25" cy="32" r="5.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.8" />
          <circle cx="39" cy="32" r="5.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.8" />
          <circle cx="28" cy="32" r="2.2" fill={ink} />
          <circle cx="36" cy="32" r="2.2" fill={ink} />
          {/* Underbite grin */}
          <path d="M21 43 Q32 49 43 43" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          <polygon points="24,44 26,39 28,44.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.2" />
          <polygon points="36,44.5 38,39 40,44" fill="#FFFDF8" stroke={ink} strokeWidth="1.2" />
        </g>
      );

    // 10. Sleepy Gramps: Heavy droopy eyelids, giant bulbous nose, wispy combover
    case 'sleepy':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#1A202C" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2D3748" strokeWidth="2" />
          <ellipse cx="32" cy="35" rx="16" ry="18" fill="#E8C2A2" stroke={ink} strokeWidth="2" />
          {/* 3 wispy hairs */}
          <path d="M26 18 Q30 11 35 16" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          <path d="M30 17 Q36 10 41 17" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
          {/* Heavy half-shut droopy eyes */}
          <circle cx="24" cy="32" r="4.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <circle cx="40" cy="32" r="4.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <path d="M19 31 L29 32 L29 27 L19 27 Z" fill="#D5A682" stroke={ink} strokeWidth="1.6" />
          <path d="M35 32 L45 31 L45 27 L35 27 Z" fill="#D5A682" stroke={ink} strokeWidth="1.6" />
          <circle cx="24" cy="33.5" r="1.5" fill={ink} />
          <circle cx="40" cy="33.5" r="1.5" fill={ink} />
          {/* Huge droopy nose */}
          <ellipse cx="32" cy="38" rx="5.5" ry="4.5" fill="#D9987B" stroke={ink} strokeWidth="1.8" />
          {/* Tiny O yawn mouth */}
          <ellipse cx="32" cy="47" rx="3.5" ry="2.8" fill="#3B161E" stroke={ink} strokeWidth="1.8" />
        </g>
      );

    // 11. Lil Fang: Spooky-funny pale lavender vampire wannabe with one crooked fang
    case 'fang':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#23162A" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#3F254C" strokeWidth="2" />
          {/* High cape collar */}
          <path d="M12 58 L18 40 L46 40 L52 58 Z" fill="#FF5A5F" stroke={ink} strokeWidth="2" />
          {/* Pointed chin head */}
          <path d="M17 26 C17 16, 47 16, 47 26 L44 43 L32 52 L20 43 Z" fill="#D5CAE8" stroke={ink} strokeWidth="2" />
          {/* Widow's peak hair */}
          <path d="M17 28 C18 14, 46 14, 47 28 L38 21 L32 27 L26 21 Z" fill="#141824" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
          {/* Raised suspicious brow + mismatched eyes */}
          <path d="M20 26 Q25 23 29 27" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M35 28 L43 26" stroke={ink} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="25" cy="32" r="3.8" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <circle cx="39" cy="32" r="3.2" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <circle cx="25.5" cy="32" r="1.6" fill="#FF5A5F" />
          <circle cx="38.5" cy="32" r="1.6" fill="#FF5A5F" />
          {/* Smirk + ONE goofy fang */}
          <path d="M24 42 Q32 45 40 41" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <polygon points="35,42.5 37,48 39,41.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.4" />
        </g>
      );

    // 12. Specs: Giant thick coke-bottle glasses magnifying mismatched eyes + buck teeth
    case 'nerd':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#142334" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#243D5A" strokeWidth="2" />
          <ellipse cx="32" cy="35" rx="15" ry="17" fill="#F0C9A6" stroke={ink} strokeWidth="2" />
          {/* Messy cowlick hair */}
          <path d="M17 26 C18 14, 46 14, 47 26 L36 22 L32 10 L28 22 Z" fill="#5A3928" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
          {/* HUGE round glasses */}
          <circle cx="24" cy="33" r="8" fill="#E0F2FE" stroke={ink} strokeWidth="2.4" />
          <circle cx="40" cy="33" r="8" fill="#E0F2FE" stroke={ink} strokeWidth="2.4" />
          <line x1="31" y1="32" x2="33" y2="32" stroke={ink} strokeWidth="2.4" />
          {/* Mismatched magnified pupils */}
          <circle cx="25" cy="33" r="3.2" fill={ink} />
          <circle cx="39" cy="32" r="1.8" fill={ink} />
          {/* Big buck teeth */}
          <path d="M24 44 Q32 47 40 44" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <rect x="28" y="44.5" width="3.8" height="4" rx="0.8" fill="#FFFDF8" stroke={ink} strokeWidth="1.2" />
          <rect x="32.2" y="44.5" width="3.8" height="4" rx="0.8" fill="#FFFDF8" stroke={ink} strokeWidth="1.2" />
        </g>
      );

    // 13. Side-Eye Diva: Big bouffant hair, gold hoop earrings, dramatic side-eye
    case 'diva':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#261724" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#42263E" strokeWidth="2" />
          {/* Big hair */}
          <ellipse cx="32" cy="24" rx="20" ry="16" fill="#2B1A2F" stroke={ink} strokeWidth="2" />
          {/* Gold hoop earrings */}
          <circle cx="15" cy="40" r="4" stroke="#F5C542" strokeWidth="2" fill="none" />
          <circle cx="49" cy="40" r="4" stroke="#F5C542" strokeWidth="2" fill="none" />
          {/* Face */}
          <ellipse cx="32" cy="36" rx="14.5" ry="16.5" fill="#D99B78" stroke={ink} strokeWidth="2" />
          {/* Dramatic arched brows */}
          <path d="M20 28 Q24 23 29 27" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          <path d="M35 28 Q40 26 44 28" stroke={ink} strokeWidth="2" strokeLinecap="round" />
          {/* Hard side-eye */}
          <ellipse cx="25" cy="33" rx="4.2" ry="3" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <ellipse cx="39" cy="33" rx="4.2" ry="3" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <circle cx="27" cy="33" r="1.8" fill={ink} />
          <circle cx="41" cy="33" r="1.8" fill={ink} />
          {/* Smug coral lips */}
          <path d="M27 44 Q33 46 39 42" stroke="#FF5A5F" strokeWidth="2.8" strokeLinecap="round" />
        </g>
      );

    // 14. Big Ears Goblin: Enormous flared ears, backwards cap, giant toothy grin
    case 'goblin':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#13262A" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#21434A" strokeWidth="2" />
          {/* Enormous ears */}
          <ellipse cx="11" cy="35" rx="6.5" ry="9" fill="#E8B892" stroke={ink} strokeWidth="2" />
          <ellipse cx="53" cy="35" rx="6.5" ry="9" fill="#E8B892" stroke={ink} strokeWidth="2" />
          {/* Squished round face */}
          <circle cx="32" cy="36" r="15" fill="#F2C6A0" stroke={ink} strokeWidth="2" />
          {/* Backwards cap */}
          <path d="M18 27 C18 16, 46 16, 46 27 Z" fill="#FF5A5F" stroke={ink} strokeWidth="2" />
          <rect x="40" y="23" width="12" height="4" rx="2" fill="#D93B41" stroke={ink} strokeWidth="1.6" />
          {/* Goofy eyes */}
          <circle cx="26" cy="33" r="3" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <circle cx="38" cy="33" r="3" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <circle cx="26" cy="33.5" r="1.5" fill={ink} />
          <circle cx="38" cy="33.5" r="1.5" fill={ink} />
          {/* Giant cheesy grin */}
          <path d="M22 40 Q32 49 42 40 Z" fill="#FFFDF8" stroke={ink} strokeWidth="1.8" strokeLinejoin="round" />
        </g>
      );

    // 15. Salty Cap: Knitted cap, squinting eye, giant nose, thick beard + toothpick
    case 'whiskers':
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#1B212E" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#2D384D" strokeWidth="2" />
          <ellipse cx="32" cy="34" rx="15.5" ry="17" fill="#E6B892" stroke={ink} strokeWidth="2" />
          {/* Thick curly beard */}
          <path d="M16 37 C16 53, 48 53, 48 37 L42 42 L32 40 L22 42 Z" fill="#5A4232" stroke={ink} strokeWidth="2" />
          {/* Knitted mustard beanie */}
          <path d="M17 24 C18 12, 46 12, 47 24 Z" fill="#F5C542" stroke={ink} strokeWidth="2" />
          <rect x="15" y="21" width="34" height="5.5" rx="2.5" fill="#D9A72A" stroke={ink} strokeWidth="1.8" />
          {/* One wide eye, one squinting */}
          <circle cx="25" cy="31" r="3.8" fill="#FFFDF8" stroke={ink} strokeWidth="1.6" />
          <circle cx="25" cy="31" r="1.6" fill={ink} />
          <path d="M35 31 L42 32" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
          {/* Giant round nose */}
          <ellipse cx="32" cy="36" rx="4.5" ry="3.5" fill="#D18868" stroke={ink} strokeWidth="1.8" />
          {/* Toothpick sticking out */}
          <line x1="36" y1="43" x2="48" y2="46" stroke="#F5C542" strokeWidth="1.8" strokeLinecap="round" />
        </g>
      );

    // 16. Chaos Kid: Wild asymmetrical puffs, mismatched eyes, big red nose, wavy grin
    case 'clown':
    default:
      return (
        <g>
          <rect width="64" height="64" rx="16" fill="#251822" />
          <rect x="1" y="1" width="62" height="62" rx="15" stroke="#42283B" strokeWidth="2" />
          {/* Wild side tufts */}
          <circle cx="14" cy="24" r="6.5" fill="#1CE8C6" stroke={ink} strokeWidth="2" />
          <circle cx="50" cy="22" r="7" fill="#FF5A5F" stroke={ink} strokeWidth="2" />
          <circle cx="32" cy="36" r="16" fill="#FCE5D2" stroke={ink} strokeWidth="2" />
          {/* Mismatched eyes (one X, one huge star/pupil) */}
          <circle cx="25" cy="31" r="4.5" fill="#FFFDF8" stroke={ink} strokeWidth="1.8" />
          <circle cx="25" cy="31" r="2" fill={ink} />
          <path d="M36 28 L42 34 M42 28 L36 34" stroke={ink} strokeWidth="2.4" strokeLinecap="round" />
          {/* Big round coral nose */}
          <circle cx="32" cy="37" r="4.5" fill="#FF5A5F" stroke={ink} strokeWidth="1.8" />
          {/* Giant wavy grin */}
          <path d="M21 43 Q27 49 32 45 Q37 49 43 43" stroke="#FF5A5F" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
  }
};
