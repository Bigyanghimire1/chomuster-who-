import { PlayerAvatarId } from '../../types/game';

export type AvatarCategory = 'Chomas' | 'Weirdos' | 'Suspicious' | 'Goofballs' | 'Spooky';

export interface AvatarMeta {
  id: PlayerAvatarId;
  label: string;
  tagline: string;
  category: AvatarCategory;
  accent: string;
}

export const AVATAR_REGISTRY: Record<PlayerAvatarId, AvatarMeta> = {
  sleuth: {
    id: 'sleuth',
    label: 'Chomu Chief',
    tagline: 'Missing two front teeth, zero shame',
    category: 'Chomas',
    accent: '#F5C542',
  },
  shadow: {
    id: 'shadow',
    label: 'Lurker',
    tagline: 'Always watching from the corner',
    category: 'Spooky',
    accent: '#FF5A5F',
  },
  pokerface: {
    id: 'pokerface',
    label: 'Shady Uncle',
    tagline: 'Tiny shades, massive smug grin',
    category: 'Suspicious',
    accent: '#1CE8C6',
  },
  agent: {
    id: 'agent',
    label: 'Wide-Eye',
    tagline: 'Definitely not sweating right now',
    category: 'Goofballs',
    accent: '#38BDF8',
  },
  whiz: {
    id: 'whiz',
    label: 'Beanie Goof',
    tagline: 'Tiny eyes, giant eyebrows',
    category: 'Goofballs',
    accent: '#1CE8C6',
  },
  maverick: {
    id: 'maverick',
    label: 'Stache Boss',
    tagline: '90% moustache, 10% trust',
    category: 'Suspicious',
    accent: '#F5C542',
  },
  whisperer: {
    id: 'whisperer',
    label: 'Giggles',
    tagline: 'Laughing through every accusation',
    category: 'Chomas',
    accent: '#FF5A5F',
  },
  detective: {
    id: 'detective',
    label: 'Snoopy Nose',
    tagline: 'Sniffs out lies from three rooms away',
    category: 'Suspicious',
    accent: '#F5C542',
  },
  gremlin: {
    id: 'gremlin',
    label: 'Cross-Eye',
    tagline: 'Looking at two suspects at once',
    category: 'Weirdos',
    accent: '#34D399',
  },
  sleepy: {
    id: 'sleepy',
    label: 'Sleepy Gramps',
    tagline: 'Woke up just to accuse somebody',
    category: 'Weirdos',
    accent: '#9AA8BE',
  },
  fang: {
    id: 'fang',
    label: 'Lil Fang',
    tagline: 'One crooked tooth, spooky vibes',
    category: 'Spooky',
    accent: '#FF5A5F',
  },
  nerd: {
    id: 'nerd',
    label: 'Specs',
    tagline: 'Overanalyzing every single word',
    category: 'Weirdos',
    accent: '#38BDF8',
  },
  diva: {
    id: 'diva',
    label: 'Side-Eye',
    tagline: 'Knows you are lying already',
    category: 'Suspicious',
    accent: '#FF5A5F',
  },
  goblin: {
    id: 'goblin',
    label: 'Big Ears',
    tagline: 'Heard your whisper from miles away',
    category: 'Goofballs',
    accent: '#1CE8C6',
  },
  whiskers: {
    id: 'whiskers',
    label: 'Salty Cap',
    tagline: 'Squinting with pure suspicion',
    category: 'Chomas',
    accent: '#F5C542',
  },
  clown: {
    id: 'clown',
    label: 'Chaos Kid',
    tagline: 'Here strictly to cause trouble',
    category: 'Weirdos',
    accent: '#FF5A5F',
  },
};

export const AVATAR_CATEGORIES: AvatarCategory[] = [
  'Chomas',
  'Suspicious',
  'Goofballs',
  'Weirdos',
  'Spooky',
];

export function getAvatarMeta(id: PlayerAvatarId | string): AvatarMeta {
  return AVATAR_REGISTRY[id as PlayerAvatarId] || AVATAR_REGISTRY.sleuth;
}
