import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

export const RulesView: React.FC = () => {
  const { dispatch } = useGame();

  return (
    <div
      className="max-w-md mx-auto px-4 py-5 space-y-5 animate-fade-in"
      style={{ paddingBottom: 'calc(3rem + env(safe-area-inset-bottom, 0px))' }}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
          className="flex items-center gap-1.5 text-xs text-chomu-muted hover:text-chomu-text transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </button>
        <span className="text-xs font-bold text-chomu-muted px-2.5 py-0.5 rounded-full bg-chomu-surface border border-chomu-border">
          Party Guide
        </span>
      </div>

      <div>
        <h2 className="text-2xl font-black text-chomu-text tracking-tight">
          How to Play <span className="text-chomu-purple">CHOMU WHO?</span>
        </h2>
        <p className="text-xs text-chomu-muted font-medium">
          A physical party game of bluffing, secrets, and deduction.
        </p>
      </div>

      <div className="space-y-3">
        {/* Step 1 */}
        <Card className="bg-chomu-surface border-chomu-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-chomu-purple/15 text-chomu-purple flex items-center justify-center font-black text-xs">
              1
            </div>
            <h3 className="text-sm font-black text-chomu-text">Pass the Device</h3>
          </div>
          <p className="text-xs text-chomu-muted leading-relaxed">
            Players pass the phone around one by one. Each player presses and holds the card to privately view their role.
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <Badge variant="lime" size="sm">Civilians</Badge>
            <span className="text-[11px] text-chomu-muted">See the secret word and category.</span>
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <Badge variant="coral" size="sm">Chomas</Badge>
            <span className="text-[11px] text-chomu-muted">Do NOT know the word, but get a single-word hint.</span>
          </div>
        </Card>

        {/* Step 2 */}
        <Card className="bg-chomu-surface border-chomu-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-chomu-purple/15 text-chomu-purple flex items-center justify-center font-black text-xs">
              2
            </div>
            <h3 className="text-sm font-black text-chomu-text">Give Clues in Person</h3>
          </div>
          <p className="text-xs text-chomu-muted leading-relaxed">
            Once everyone has seen their secret, place the device on the table. Take turns around the circle saying ONE word or short phrase related to the secret word.
          </p>
          <p className="text-[11px] text-chomu-muted/80 mt-1.5">
            <strong>Civilians:</strong> Give subtle clues so other civilians know you know, without giving the word away to the Chomu.
          </p>
          <p className="text-[11px] text-chomu-muted/80 mt-1">
            <strong>Chomas:</strong> Blend in, pretend you know the word, and use your hint wisely!
          </p>
        </Card>

        {/* Step 3 */}
        <Card className="bg-chomu-surface border-chomu-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-chomu-purple/15 text-chomu-purple flex items-center justify-center font-black text-xs">
              3
            </div>
            <h3 className="text-sm font-black text-chomu-text">Discuss and Accuse</h3>
          </div>
          <p className="text-xs text-chomu-muted leading-relaxed">
            Talk, debate, and call out suspicious clues. On the count of three, everyone points at who they think is the Chomu!
          </p>
        </Card>

        {/* Step 4 */}
        <Card className="bg-chomu-surface border-chomu-border p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-chomu-purple/15 text-chomu-purple flex items-center justify-center font-black text-xs">
              4
            </div>
            <h3 className="text-sm font-black text-chomu-text">Reveal Chomas</h3>
          </div>
          <p className="text-xs text-chomu-muted leading-relaxed">
            Tap <strong>REVEAL CHOMAS</strong> on the device to unveil who the real Chomu was and what the secret word was!
          </p>
        </Card>
      </div>
    </div>
  );
};
