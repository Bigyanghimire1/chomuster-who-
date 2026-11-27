import { Category } from '../types/game';
import { HINT_SUPPORTED_WORDS } from './wordDatabase';

function wordsFor(categoryId: string): string[] {
  return HINT_SUPPORTED_WORDS.filter((w) => w.categoryId === categoryId).map((w) => w.word);
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'everyday_objects',
    name: 'Everyday Objects',
    icon: 'Package',
    description: 'Familiar tools, accessories, and household items.',
    words: wordsFor('everyday_objects'),
  },
  {
    id: 'food_drinks',
    name: 'Food & Drinks',
    icon: 'Utensils',
    description: 'Delicious dishes, snacks, desserts, and beverages.',
    words: wordsFor('food_drinks'),
  },
  {
    id: 'animals',
    name: 'Animals',
    icon: 'PawPrint',
    description: 'Creatures from the jungle, ocean, sky, and savannah.',
    words: wordsFor('animals'),
  },
  {
    id: 'famous_people',
    name: 'Famous People',
    icon: 'UserCheck',
    description: 'Iconic historical figures, artists, innovators, and icons.',
    words: wordsFor('famous_people'),
  },
  {
    id: 'movies_tv',
    name: 'Movies & TV Shows',
    icon: 'Film',
    description: 'Blockbusters, binge-worthy series, and cinematic classics.',
    words: wordsFor('movies_tv'),
  },
  {
    id: 'geography',
    name: 'Countries & Cities',
    icon: 'Globe',
    description: 'Nations, capitals, and famous world destinations.',
    words: wordsFor('geography'),
  },
  {
    id: 'professions',
    name: 'Jobs & Professions',
    icon: 'Briefcase',
    description: 'Careers, vocations, and specialized trades.',
    words: wordsFor('professions'),
  },
  {
    id: 'brands',
    name: 'Popular Brands',
    icon: 'Tag',
    description: 'Global companies, consumer logos, and everyday labels.',
    words: wordsFor('brands'),
  },
  {
    id: 'hobbies',
    name: 'Hobbies & Activities',
    icon: 'Palette',
    description: 'Pastimes, creative crafts, and weekend adventures.',
    words: wordsFor('hobbies'),
  },
  {
    id: 'music',
    name: 'Music & Instruments',
    icon: 'Music',
    description: 'Instruments, genres, audio gear, and performances.',
    words: wordsFor('music'),
  },
  {
    id: 'sports',
    name: 'Sports & Games',
    icon: 'Trophy',
    description: 'Athletic competitions, team sports, and classic games.',
    words: wordsFor('sports'),
  },
  {
    id: 'technology',
    name: 'Technology & Science',
    icon: 'Cpu',
    description: 'Modern gadgets, computing, and scientific concepts.',
    words: wordsFor('technology'),
  },
  {
    id: 'nature',
    name: 'Nature & Wonders',
    icon: 'Mountain',
    description: 'Natural phenomena, ecosystems, and geological marvels.',
    words: wordsFor('nature'),
  },
  {
    id: 'vehicles',
    name: 'Vehicles & Transport',
    icon: 'Car',
    description: 'Land, air, sea, and space transportation machines.',
    words: wordsFor('vehicles'),
  },
  {
    id: 'landmarks',
    name: 'Places & Landmarks',
    icon: 'Landmark',
    description: 'Famous monuments, architectural marvels, and heritage sites.',
    words: wordsFor('landmarks'),
  },
];

export const TOTAL_BUILTIN_WORDS = DEFAULT_CATEGORIES.reduce(
  (acc, cat) => acc + cat.words.length,
  0
);
