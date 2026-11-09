import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Shuffle,
  Play,
  Check,
  AlertCircle,
  Flame,
  Sparkles,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
import { CategoryVectorIcon } from '../illustrations/CategoryVectorIcons';
import { getMaxImposters } from '../../services/roleAssignment';
import { AVATAR_LIST } from '../../services/storageService';
import { HintDifficulty } from '../../data/wordDatabase';
import { Player } from '../../types/game';

export const SetupView: React.FC = () => {
  const { state, dispatch, allCategories } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const players = state.players;
  const settings = state.settings;
  const maxImposters = getMaxImposters(players.length);

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;

    if (players.some(p => p.name.toLowerCase() === trimmed.toLowerCase())) {
      setNameError(`A player named "${trimmed}" already exists.`);
      return;
    }
    if (players.length >= 15) {
      setNameError('Maximum 15 players supported.');
      return;
    }

    const nextAvatar = AVATAR_LIST[players.length % AVATAR_LIST.length];
    const newP: Player = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      score: 0,
      avatar: nextAvatar,
    };

    const updated = [...players, newP];
    dispatch({ type: 'UPDATE_PLAYERS', players: updated });
    setNewPlayerName('');
    setNameError(null);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 3) {
      setNameError('At least 3 players are required.');
      return;
    }
    const updated = players.filter(p => p.id !== id);
    dispatch({ type: 'UPDATE_PLAYERS', players: updated });

    const newMax = getMaxImposters(updated.length);
    if (settings.imposterCount > newMax) {
      dispatch({ type: 'UPDATE_SETTINGS', settings: { imposterCount: newMax } });
    }
  };

  const handleCycleAvatar = (playerId: string) => {
    const updated = players.map(p => {
      if (p.id === playerId) {
        const currentIdx = AVATAR_LIST.indexOf(p.avatar);
        const nextAvatar = AVATAR_LIST[(currentIdx + 1) % AVATAR_LIST.length];
        return { ...p, avatar: nextAvatar };
      }
      return p;
    });
    dispatch({ type: 'UPDATE_PLAYERS', players: updated });
  };

  const handleShufflePlayers = () => {
    const copy = [...players];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    dispatch({ type: 'UPDATE_PLAYERS', players: copy });
  };

  const handleToggleCategory = (id: string) => {
    const exists = settings.selectedCategoryIds.includes(id);
    let next: string[];
    if (exists) {
      next = settings.selectedCategoryIds.filter(c => c !== id);
    } else {
      next = [...settings.selectedCategoryIds, id];
    }
    dispatch({ type: 'UPDATE_SETTINGS', settings: { selectedCategoryIds: next } });
  };

  const handleSelectAllCategories = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { selectedCategoryIds: allCategories.map(c => c.id) },
    });
  };

  const handleClearAllCategories = () => {
    dispatch({ type: 'UPDATE_SETTINGS', settings: { selectedCategoryIds: [] } });
  };

  const canStart =
    players.length >= 3 &&
    settings.selectedCategoryIds.length > 0 &&
    !nameError;

  const handleStartGame = () => {
    if (!canStart) return;
    dispatch({ type: 'START_GAME', allCategories });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-5 space-y-5 pb-32 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-chomu-text tracking-tight">Game Setup</h2>
          <p className="text-xs text-chomu-muted font-medium">Add friends &amp; pick categories</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
        >
          Cancel
        </Button>
      </div>

      {/* 1. Players Section */}
      <Card className="bg-chomu-surface border-chomu-border p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-chomu-purple" />
            <span className="text-xs font-bold text-chomu-text uppercase tracking-wider">
              Players ({players.length}/15)
            </span>
          </div>
          <button
            onClick={handleShufflePlayers}
            className="flex items-center gap-1 text-[11px] text-chomu-purple hover:text-chomu-text font-semibold"
          >
            <Shuffle className="w-3 h-3" /> Shuffle
          </button>
        </div>

        <form onSubmit={handleAddPlayer} className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Add player name..."
            value={newPlayerName}
            maxLength={16}
            onChange={e => {
              setNewPlayerName(e.target.value);
              if (nameError) setNameError(null);
            }}
            className="flex-1 bg-chomu-bg border border-chomu-border rounded-xl px-3.5 py-2 text-sm text-chomu-text placeholder-chomu-muted/60 focus:outline-none focus:border-chomu-purple"
          />
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            disabled={!newPlayerName.trim() || players.length >= 15}
          >
            Add
          </Button>
        </form>

        {nameError && (
          <div className="flex items-center gap-1.5 text-chomu-coral text-xs mb-3 bg-chomu-coral/10 p-2 rounded-xl border border-chomu-coral/20">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{nameError}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {players.map(p => (
            <div
              key={p.id}
              className="flex items-center justify-between bg-chomu-bg border border-chomu-border rounded-xl px-2.5 py-1.5"
            >
              <div
                onClick={() => handleCycleAvatar(p.id)}
                title="Tap to change avatar"
                className="flex items-center gap-2 min-w-0 cursor-pointer group"
              >
                <div className="relative group-hover:scale-110 transition-transform">
                  <PlayerAvatar id={p.avatar} size="sm" />
                </div>
                <span className="text-xs font-semibold text-chomu-text truncate">
                  {p.name}
                </span>
              </div>
              <button
                onClick={() => handleRemovePlayer(p.id)}
                disabled={players.length <= 3}
                className="text-chomu-muted hover:text-chomu-coral p-1 disabled:opacity-20 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* 2. Imposter Count */}
      <Card className="bg-chomu-surface border-chomu-border p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-chomu-coral" />
            <span className="text-xs font-bold text-chomu-text uppercase tracking-wider">
              Imposters
            </span>
          </div>
          <span className="text-[11px] text-chomu-muted font-medium">
            Max {maxImposters} for {players.length} players
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3].map(count => {
            const isAvailable = count <= maxImposters;
            const isSelected = settings.imposterCount === count;
            return (
              <button
                key={count}
                type="button"
                disabled={!isAvailable}
                onClick={() => {
                  dispatch({ type: 'UPDATE_SETTINGS', settings: { imposterCount: count } });
                }}
                className={`py-2 px-1 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-chomu-coral/15 border-chomu-coral text-chomu-coral font-bold'
                    : isAvailable
                    ? 'bg-chomu-bg border-chomu-border text-chomu-muted hover:border-chomu-muted/60'
                    : 'bg-chomu-bg/40 border-chomu-border/30 text-chomu-muted/30 cursor-not-allowed'
                }`}
              >
                <span className="text-base font-black leading-none mb-0.5">{count}</span>
                <span className="text-[10px] font-medium">
                  {count === 1 ? '1 Imposter' : `${count} Imposters`}
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 3. Imposter Hint Difficulty (Default: Subtle) */}
      <Card className="bg-chomu-surface border-chomu-border p-4">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-chomu-purple" />
            <span className="text-xs font-bold text-chomu-text uppercase tracking-wider">
              Imposter Hint System
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {(
            [
              { id: 'subtle', label: 'Subtle', desc: 'Indirect single word' },
              { id: 'balanced', label: 'Balanced', desc: 'Clearer clue' },
              { id: 'easy', label: 'Easier', desc: 'High context' },
              { id: 'none', label: 'No Hint', desc: 'Blind mode' },
            ] as const
          ).map(diff => {
            const isSelected = settings.hintDifficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() =>
                  dispatch({
                    type: 'UPDATE_SETTINGS',
                    settings: { hintDifficulty: diff.id as HintDifficulty },
                  })
                }
                className={`p-2 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-chomu-purple/15 border-chomu-purple text-chomu-text font-bold shadow-sm'
                    : 'bg-chomu-bg border-chomu-border text-chomu-muted hover:border-chomu-muted/60'
                }`}
              >
                <span className="text-xs font-bold block leading-tight mb-0.5">{diff.label}</span>
                <span className="text-[9px] text-chomu-muted block leading-none">{diff.desc}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* 4. Categories Selector (NATURAL PAGE SCROLL - NO NESTED OVERFLOW SCROLLBAR) */}
      <Card className="bg-chomu-surface border-chomu-border p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-chomu-text uppercase tracking-wider">
            Categories ({settings.selectedCategoryIds.length}/{allCategories.length})
          </span>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleSelectAllCategories}
              className="text-chomu-purple hover:underline font-semibold"
            >
              All
            </button>
            <span className="text-chomu-muted">&bull;</span>
            <button
              onClick={handleClearAllCategories}
              className="text-chomu-muted hover:text-chomu-text font-medium"
            >
              Clear
            </button>
          </div>
        </div>

        {settings.selectedCategoryIds.length === 0 && (
          <div className="bg-chomu-coral/10 border border-chomu-coral/20 text-chomu-coral text-xs p-2 rounded-xl mb-3 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Select at least one category to play.</span>
          </div>
        )}

        {/* Natural page flow grid without nested scrollbar */}
        <div className="grid grid-cols-2 gap-2">
          {allCategories.map(cat => {
            const isSelected = settings.selectedCategoryIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleToggleCategory(cat.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-chomu-elevated border-chomu-purple text-chomu-text shadow-sm'
                    : 'bg-chomu-bg/70 border-chomu-border text-chomu-muted hover:border-chomu-muted/40'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-chomu-purple text-chomu-bg' : 'bg-chomu-surface text-chomu-muted'
                  }`}
                >
                  <CategoryVectorIcon id={cat.id} className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-xs font-bold truncate block">{cat.name}</span>
                  <span className="text-[10px] text-chomu-muted block">{cat.words.length} words</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-chomu-purple shrink-0" />}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 5. Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-chomu-bg/95 backdrop-blur-md border-t border-chomu-border z-30">
        <div className="max-w-md mx-auto">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            disabled={!canStart}
            onClick={handleStartGame}
            leftIcon={<Play className="w-5 h-5 fill-current" />}
          >
            START GAME
          </Button>
          {!canStart && (
            <p className="text-[11px] text-center text-chomu-muted mt-1.5">
              {players.length < 3
                ? 'Need at least 3 players to start'
                : 'Select at least one category'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
