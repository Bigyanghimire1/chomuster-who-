import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { getInviteCodeFromUrl } from '../App';
import { isValidRoomCode } from '../services/multiplayer/roomCodeGenerator';

describe('Integration, URL Routing & Deployment Verification', () => {
  const originalWindow = (globalThis as any).window;

  beforeEach(() => {
    (globalThis as any).window = {
      location: {
        search: '',
        pathname: '/',
        origin: 'https://chomu.app',
      },
    };
  });

  afterEach(() => {
    if (originalWindow === undefined) {
      delete (globalThis as any).window;
    } else {
      (globalThis as any).window = originalWindow;
    }
  });

  describe('URL Parameter and Deep-Link Parser (getInviteCodeFromUrl)', () => {
    it('extracts and normalizes valid ?room=CODE query parameters', () => {
      (globalThis as any).window.location = {
        search: '?room=WXYZ',
        pathname: '/',
        origin: 'https://chomu.app',
      };

      const extracted = getInviteCodeFromUrl();
      expect(extracted).toBe('WXYZ');
      expect(isValidRoomCode(extracted!)).toBe(true);
    });

    it('extracts lowercase or unformatted ?room=code and auto-capitalizes', () => {
      (globalThis as any).window.location = {
        search: '?room=kmpq',
        pathname: '/',
        origin: 'https://chomu.app',
      };

      const extracted = getInviteCodeFromUrl();
      expect(extracted).toBe('KMPQ');
    });

    it('supports alternative ?code=CODE query parameter', () => {
      (globalThis as any).window.location = {
        search: '?code=KMPQ',
        pathname: '/',
        origin: 'https://chomu.app',
      };

      const extracted = getInviteCodeFromUrl();
      expect(extracted).toBe('KMPQ');
    });

    it('extracts invite room codes from /join/CODE pathname', () => {
      (globalThis as any).window.location = {
        search: '',
        pathname: '/join/KMPQ',
        origin: 'https://chomu.app',
      };

      const extracted = getInviteCodeFromUrl();
      expect(extracted).toBe('KMPQ');
    });

    it('extracts invite room codes from /join/CODE/ trailing slash', () => {
      (globalThis as any).window.location = {
        search: '',
        pathname: '/join/WXYZ/',
        origin: 'https://chomu.app',
      };

      const extracted = getInviteCodeFromUrl();
      expect(extracted).toBe('WXYZ');
    });

    it('supports explicit locationOverride object', () => {
      expect(getInviteCodeFromUrl({ search: '?room=ABCD' })).toBe('ABCD');
      expect(getInviteCodeFromUrl({ pathname: '/join/ABCD' })).toBe('ABCD');
    });

    it('rejects invalid or ambiguous characters in room codes (e.g. contains 1, I, O, L)', () => {
      (globalThis as any).window.location = {
        search: '?room=TOOL', // Contains 'O' and 'L' (ambiguous)
        pathname: '/',
        origin: 'https://chomu.app',
      };

      expect(getInviteCodeFromUrl()).toBeNull();
    });

    it('returns null when no room parameters exist in URL', () => {
      (globalThis as any).window.location = {
        search: '',
        pathname: '/',
        origin: 'https://chomu.app',
      };

      expect(getInviteCodeFromUrl()).toBeNull();
    });
  });

  describe('Deployment Rewrites & SPA Routing Configuration', () => {
    it('verifies vercel.json exists with rewrite rule to /index.html', () => {
      const vercelPath = path.resolve(process.cwd(), 'vercel.json');
      expect(fs.existsSync(vercelPath)).toBe(true);

      const content = fs.readFileSync(vercelPath, 'utf8');
      const parsed = JSON.parse(content);
      expect(parsed.rewrites).toBeDefined();
      expect(Array.isArray(parsed.rewrites)).toBe(true);
      expect(parsed.rewrites[0].source).toBe('/(.*)');
      expect(parsed.rewrites[0].destination).toBe('/index.html');
    });
  });

  describe('HomeView & App Integration Requirements', () => {
    it('verifies HomeView source includes both prominent game modes and auxiliary buttons', () => {
      const homeViewPath = path.resolve(
        process.cwd(),
        'src/components/views/HomeView.tsx'
      );
      const content = fs.readFileSync(homeViewPath, 'utf8');

      // Prominent Game Modes
      expect(content).toContain('Pass &amp; Play');
      expect(content).toContain('Offline Party');
      expect(content).toContain('Play Online');
      expect(content).toContain('With Friends');

      // Preserved Auxiliary Actions
      expect(content).toContain('Custom Words');
      expect(content).toContain('How to Play');
      expect(content).not.toContain('Word Bank Studio');
    });

    it('verifies App source includes MultiplayerProvider and VoiceControls HUD', () => {
      const appPath = path.resolve(process.cwd(), 'src/App.tsx');
      const content = fs.readFileSync(appPath, 'utf8');

      expect(content).toContain('MultiplayerProvider');
      expect(content).toContain('VoiceControls');
      expect(content).toContain('OnlineJoinModal');
      expect(content).toContain('OnlineLobbyView');
      expect(content).toContain('OnlineRoleRevealView');
      expect(content).toContain('OnlineRoundView');
      expect(content).toContain('OnlineVotingView');
      expect(content).toContain('OnlineResultsView');
    });
  });
});
