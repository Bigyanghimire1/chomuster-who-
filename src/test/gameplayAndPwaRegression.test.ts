import { describe, it, expect } from 'vitest';
import { gameReducer, initializeState } from '../context/gameReducer';
import { DEFAULT_SETTINGS } from '../services/storageService';
import { DEFAULT_CATEGORIES } from '../data/categories';
import { createDeterministicSource } from '../services/random';
import fs from 'fs';
import path from 'path';

describe('Complete Game Lifecycle Regression Suite', () => {
  it('executes full pass-and-play flow without skipping players or reassigning roles', () => {
    const players = [
      { id: 'p1', name: 'Alice', score: 0, avatar: 'sleuth' as const },
      { id: 'p2', name: 'Bob', score: 0, avatar: 'shadow' as const },
      { id: 'p3', name: 'Charlie', score: 0, avatar: 'agent' as const },
      { id: 'p4', name: 'Diana', score: 0, avatar: 'pokerface' as const },
    ];
    const settings = {
      ...DEFAULT_SETTINGS,
      imposterCount: 1,
      selectedCategoryIds: ['everyday_objects'],
    };

    let state = initializeState(players, settings);
    expect(state.phase).toBe('HOME');

    // 1. START_GAME
    const rng = createDeterministicSource(42);
    state = gameReducer(state, {
      type: 'START_GAME',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: rng,
    });

    expect(state.phase).toBe('PASS_DEVICE');
    expect(state.secret).not.toBeNull();
    expect(state.currentRevealIndex).toBe(0);

    const secretSnapshot = JSON.parse(JSON.stringify(state.secret));
    const revealOrder = state.secret!.revealOrder;
    expect(revealOrder.length).toBe(4);

    // Verify all 4 players are present in revealOrder
    expect(new Set(revealOrder).size).toBe(4);

    // 2. Advance through each player reveal
    for (let i = 0; i < revealOrder.length - 1; i++) {
      expect(state.currentRevealIndex).toBe(i);
      const activePlayerId = revealOrder[state.currentRevealIndex];
      const activePlayer = state.players.find(p => p.id === activePlayerId);
      expect(activePlayer).toBeDefined();

      state = gameReducer(state, { type: 'NEXT_REVEAL' });

      // Verify roles and word NEVER change when advancing between players
      expect(state.secret!.secretWord).toBe(secretSnapshot.secretWord);
      expect(state.secret!.roles).toEqual(secretSnapshot.roles);
      expect(state.secret!.revealOrder).toEqual(secretSnapshot.revealOrder);
    }

    // 3. Final player reached
    expect(state.currentRevealIndex).toBe(3);

    // Further NEXT_REVEAL on final player does NOT advance index out of bounds
    state = gameReducer(state, { type: 'NEXT_REVEAL' });
    expect(state.currentRevealIndex).toBe(3);

    // 4. START_ROUND
    state = gameReducer(state, { type: 'START_ROUND' });
    expect(state.phase).toBe('ROUND_IN_PROGRESS');

    // 5. REVEAL_IMPOSTERS (Reveal Chomas)
    state = gameReducer(state, { type: 'REVEAL_IMPOSTERS' });
    expect(state.phase).toBe('FINAL_REVEAL');

    // 6. REMATCH
    state = gameReducer(state, {
      type: 'REMATCH',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: createDeterministicSource(99),
    });
    expect(state.phase).toBe('PASS_DEVICE');
    expect(state.currentRevealIndex).toBe(0);
    expect(state.secret).not.toBeNull();
  });

  it('guarantees unique hints to each Chomu when multiple Chomas are configured', () => {
    const players = [
      { id: 'p1', name: 'P1', score: 0, avatar: 'sleuth' as const },
      { id: 'p2', name: 'P2', score: 0, avatar: 'shadow' as const },
      { id: 'p3', name: 'P3', score: 0, avatar: 'agent' as const },
      { id: 'p4', name: 'P4', score: 0, avatar: 'pokerface' as const },
      { id: 'p5', name: 'P5', score: 0, avatar: 'whiz' as const },
      { id: 'p6', name: 'P6', score: 0, avatar: 'maverick' as const },
      { id: 'p7', name: 'P7', score: 0, avatar: 'whisperer' as const },
      { id: 'p8', name: 'P8', score: 0, avatar: 'detective' as const },
    ];
    const settings = {
      ...DEFAULT_SETTINGS,
      imposterCount: 3,
      selectedCategoryIds: ['everyday_objects'],
      hintDifficulty: 'subtle' as const,
    };

    const state = gameReducer(initializeState(players, settings), {
      type: 'START_GAME',
      allCategories: DEFAULT_CATEGORIES,
      randomSource: createDeterministicSource(12345),
    });

    const chomuIds = Object.keys(state.secret!.roles).filter(id => state.secret!.roles[id].isImposter);
    expect(chomuIds.length).toBe(3);

    const hints = chomuIds.map(id => state.secret!.imposterHints[id]);
    // Each Chomu must receive a hint
    hints.forEach(h => expect(h && h.length > 0).toBe(true));
    // All 3 hints must be distinct (no duplication)
    expect(new Set(hints).size).toBe(3);
  });
});

describe('PWA & Startup Performance Budget Suite', () => {
  it('validates index.html contains required Apple PWA and viewport metadata', () => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');

    expect(html).toContain('viewport-fit=cover');
    expect(html).toContain('apple-mobile-web-app-capable');
    expect(html).toContain('apple-mobile-web-app-status-bar-style');
    expect(html).toContain('content="black-translucent"');
    expect(html).toContain('theme-color');
    expect(html).toContain('Chomu Who?');
  });

  it('validates production dist bundle does not exceed startup budget', () => {
    const distAssetsPath = path.resolve(__dirname, '../../dist/assets');
    if (!fs.existsSync(distAssetsPath)) {
      return; // Skip if dist has not been built in this environment yet
    }

    const files = fs.readdirSync(distAssetsPath);
    const mainJsFile = files.find(f => f.startsWith('index-') && f.endsWith('.js'));
    expect(mainJsFile).toBeDefined();

    const stats = fs.statSync(path.join(distAssetsPath, mainJsFile!));
    const sizeKb = stats.size / 1024;

    // Critical startup bundle must be under 300 KB minified (was previously 1,124 KB!)
    expect(sizeKb).toBeLessThan(300);
  });

  it('verifies manifest.webmanifest exists with standalone display and Chomu branding', () => {
    const manifestPath = path.resolve(__dirname, '../../dist/manifest.webmanifest');
    if (!fs.existsSync(manifestPath)) return;

    const content = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    expect(content.name).toBe('Chomu Who?');
    expect(content.short_name).toBe('Chomu Who?');
    expect(content.display).toBe('standalone');
    expect(content.theme_color).toBe('#101225');
  });

  it('validates all required PNG icon assets exist with correct dimensions', () => {
    const appleTouchPath = path.resolve(__dirname, '../../public/apple-touch-icon.png');
    const pwa192Path = path.resolve(__dirname, '../../public/pwa-192x192.png');
    const pwa512Path = path.resolve(__dirname, '../../public/pwa-512x512.png');
    const pwaMaskablePath = path.resolve(__dirname, '../../public/pwa-maskable-512x512.png');
    const iosAppIconPath = path.resolve(
      __dirname,
      '../../ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png'
    );

    expect(fs.existsSync(appleTouchPath)).toBe(true);
    expect(fs.existsSync(pwa192Path)).toBe(true);
    expect(fs.existsSync(pwa512Path)).toBe(true);
    expect(fs.existsSync(pwaMaskablePath)).toBe(true);
    expect(fs.existsSync(iosAppIconPath)).toBe(true);

    // PNG headers contain width and height at bytes 16-24
    const getPngDimensions = (filePath: string) => {
      const buffer = fs.readFileSync(filePath);
      const width = buffer.readUInt32BE(16);
      const height = buffer.readUInt32BE(20);
      return { width, height };
    };

    expect(getPngDimensions(appleTouchPath)).toEqual({ width: 180, height: 180 });
    expect(getPngDimensions(pwa192Path)).toEqual({ width: 192, height: 192 });
    expect(getPngDimensions(pwa512Path)).toEqual({ width: 512, height: 512 });
    expect(getPngDimensions(pwaMaskablePath)).toEqual({ width: 512, height: 512 });
    expect(getPngDimensions(iosAppIconPath)).toEqual({ width: 1024, height: 1024 });
  });

  it('verifies index.html links to apple-touch-icon.png with sizes 180x180', () => {
    const indexPath = path.resolve(__dirname, '../../index.html');
    const html = fs.readFileSync(indexPath, 'utf-8');
    expect(html).toContain('apple-touch-icon');
    expect(html).toContain('/apple-touch-icon.png');
    expect(html).toContain('sizes="180x180"');
  });

  it('verifies index.css enforces minimum 16px font-size on mobile inputs to eliminate iOS auto-zoom', () => {
    const cssPath = path.resolve(__dirname, '../../src/index.css');
    const css = fs.readFileSync(cssPath, 'utf-8');
    expect(css).toContain('font-size: 16px !important;');
    expect(css).toContain('max-width: 768px');
  });
});

describe('Player Management & Strict 3-Player Minimum Suite', () => {
  it('defaults to an empty roster on fresh initialization without predefined demo names', () => {
    const freshState = initializeState([], DEFAULT_SETTINGS);
    expect(freshState.players).toEqual([]);
    expect(freshState.players.length).toBe(0);
  });

  it('strictly rejects starting a game when player count is below 3', () => {
    const baseSettings = { ...DEFAULT_SETTINGS, selectedCategoryIds: ['everyday_objects'] };

    // 0 players
    const state0 = initializeState([], baseSettings);
    const result0 = gameReducer(state0, { type: 'START_GAME', allCategories: DEFAULT_CATEGORIES });
    expect(result0.phase).toBe('HOME');
    expect(result0.secret).toBeNull();

    // 1 player
    const state1 = initializeState([{ id: 'p1', name: 'Maya', score: 0, avatar: 'sleuth' }], baseSettings);
    const result1 = gameReducer(state1, { type: 'START_GAME', allCategories: DEFAULT_CATEGORIES });
    expect(result1.phase).toBe('HOME');
    expect(result1.secret).toBeNull();

    // 2 players
    const state2 = initializeState(
      [
        { id: 'p1', name: 'Maya', score: 0, avatar: 'sleuth' },
        { id: 'p2', name: 'Liam', score: 0, avatar: 'shadow' },
      ],
      baseSettings
    );
    const result2 = gameReducer(state2, { type: 'START_GAME', allCategories: DEFAULT_CATEGORIES });
    expect(result2.phase).toBe('HOME');
    expect(result2.secret).toBeNull();

    // 3 players — succeeds!
    const state3 = initializeState(
      [
        { id: 'p1', name: 'Maya', score: 0, avatar: 'sleuth' },
        { id: 'p2', name: 'Liam', score: 0, avatar: 'shadow' },
        { id: 'p3', name: 'Noah', score: 0, avatar: 'agent' },
      ],
      baseSettings
    );
    const result3 = gameReducer(state3, { type: 'START_GAME', allCategories: DEFAULT_CATEGORIES });
    expect(result3.phase).toBe('PASS_DEVICE');
    expect(result3.secret).not.toBeNull();
  });

  it('allows players to be updated, renamed, and individually removed down to zero', () => {
    let state = initializeState([], DEFAULT_SETTINGS);

    // 1. Add player 1
    state = gameReducer(state, {
      type: 'UPDATE_PLAYERS',
      players: [{ id: 'p1', name: 'Maya', score: 0, avatar: 'sleuth' }],
    });
    expect(state.players.length).toBe(1);

    // 2. Add player 2 & 3
    state = gameReducer(state, {
      type: 'UPDATE_PLAYERS',
      players: [
        { id: 'p1', name: 'Maya', score: 0, avatar: 'sleuth' },
        { id: 'p2', name: 'Liam', score: 0, avatar: 'shadow' },
        { id: 'p3', name: 'Noah', score: 0, avatar: 'agent' },
      ],
    });
    expect(state.players.length).toBe(3);

    // 3. Rename player (preserve stable ID)
    state = gameReducer(state, {
      type: 'UPDATE_PLAYERS',
      players: [
        { id: 'p1', name: 'Maya Angelou', score: 0, avatar: 'sleuth' },
        { id: 'p2', name: 'Liam', score: 0, avatar: 'shadow' },
        { id: 'p3', name: 'Noah', score: 0, avatar: 'agent' },
      ],
    });
    expect(state.players[0].name).toBe('Maya Angelou');
    expect(state.players[0].id).toBe('p1');

    // 4. Delete players down to 2
    state = gameReducer(state, {
      type: 'UPDATE_PLAYERS',
      players: [
        { id: 'p1', name: 'Maya Angelou', score: 0, avatar: 'sleuth' },
        { id: 'p2', name: 'Liam', score: 0, avatar: 'shadow' },
      ],
    });
    expect(state.players.length).toBe(2);

    // 5. Delete down to 1
    state = gameReducer(state, {
      type: 'UPDATE_PLAYERS',
      players: [{ id: 'p1', name: 'Maya Angelou', score: 0, avatar: 'sleuth' }],
    });
    expect(state.players.length).toBe(1);

    // 6. Delete all players (empty roster)
    state = gameReducer(state, {
      type: 'UPDATE_PLAYERS',
      players: [],
    });
    expect(state.players.length).toBe(0);
  });
});
