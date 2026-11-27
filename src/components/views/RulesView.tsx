import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const RulesView: React.FC = () => {
  const { dispatch } = useGame();

  return (
    <div
      className="max-w-lg mx-auto w-full px-4 py-6 space-y-5 animate-fade-in"
      style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
          className="inline-flex items-center gap-1.5 text-sm text-chomu-secondary hover:text-chomu-text transition-colors min-h-[44px] px-2 -ml-2 rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
          <span>Home</span>
        </button>
        <Badge variant="muted" size="sm">
          Party guide
        </Badge>
      </div>

      <div>
        <h1 className="text-2xl font-semibold text-chomu-text tracking-[-0.02em]">
          How to play Chomu Who
        </h1>
        <p className="text-sm text-chomu-secondary mt-1">
          A social deduction game of bluffing, secrets, and observation
        </p>
      </div>

      <div className="space-y-3">
        <Card className="p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-6 h-6 rounded-md bg-chomu-elevated border border-chomu-border text-chomu-text flex items-center justify-center font-mono text-xs font-medium">
              1
            </span>
            <h2 className="text-sm font-semibold text-chomu-text">View secret cards</h2>
          </div>
          <p className="text-sm text-chomu-secondary leading-5">
            In Pass &amp; Play, pass the phone around and hold the card to peek. Online, each player views their private card on their own screen.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Badge variant="lime" size="sm">Civilians</Badge>
            <span className="text-xs text-chomu-secondary">See the secret word and category</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="coral" size="sm">Chomas</Badge>
            <span className="text-xs text-chomu-secondary">Do not see the word, but receive a single-word hint</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-6 h-6 rounded-md bg-chomu-elevated border border-chomu-border text-chomu-text flex items-center justify-center font-mono text-xs font-medium">
              2
            </span>
            <h2 className="text-sm font-semibold text-chomu-text">Give clues in turns</h2>
          </div>
          <p className="text-sm text-chomu-secondary leading-5">
            Each player says one word or short clue related to the secret word.
          </p>
          <p className="text-xs text-chomu-muted mt-2 leading-5">
            <strong className="text-chomu-text font-medium">Civilians:</strong> Signal that you know the word without giving it away to the Chomu.
          </p>
          <p className="text-xs text-chomu-muted mt-1 leading-5">
            <strong className="text-chomu-text font-medium">Chomas:</strong> Blend in using your hint and the other players&apos; clues.
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-6 h-6 rounded-md bg-chomu-elevated border border-chomu-border text-chomu-text flex items-center justify-center font-mono text-xs font-medium">
              3
            </span>
            <h2 className="text-sm font-semibold text-chomu-text">Discuss and vote</h2>
          </div>
          <p className="text-sm text-chomu-secondary leading-5">
            Debate suspicious answers, then vote for who you think is the Chomu before revealing the truth.
          </p>
        </Card>
      </div>
    </div>
  );
};
