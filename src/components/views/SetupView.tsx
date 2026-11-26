import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Shuffle,
  Play,
  Check,
  X,
  Edit2,
  AlertCircle,
  Flame,
  Sliders,
  UserPlus,
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
import { audioService } from '../../services/audioService';

export const SetupView: React.FC = () => {
  const { state, dispatch, allCategories } = useGame();
  const [newPlayerName, setNewPlayerName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);

  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [editError, setEditError] = useState<string | null>(null);

  const players = state.players;
  const settings = state.settings;
  const maxImposters = getMaxImposters(players.length);

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) return;

    if (players.some(p => p.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setNameError(`A player named "${trimmed}" already exists`);
      return;
    }
    if (players.length >= 15) {
      setNameError('Maximum 15 players supported');
      return;
    }

    const usedAvatars = new Set(players.map(p => p.avatar));
    const availableAvatars = AVATAR_LIST.filter(id => !usedAvatars.has(id));
    const pool = availableAvatars.length > 0 ? availableAvatars : AVATAR_LIST;
    const nextAvatar = pool[Math.floor(Math.random() * pool.length)];
    const newP: Player = {
      id: `p_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      score: 0,
      avatar: nextAvatar,
    };

    const updated = [...players, newP];
    dispatch({ type: 'UPDATE_PLAYERS', players: updated });
    audioService.playPlayerAdded();
    setNewPlayerName('');
    setNameError(null);

    const newMax = getMaxImposters(updated.length);
    if (settings.imposterCount > newMax) {
      dispatch({ type: 'UPDATE_SETTINGS', settings: { imposterCount: newMax } });
    }
  };

  const handleStartRename = (player: Player) => {
    setEditingPlayerId(player.id);
    setEditingName(player.name);
    setEditError(null);
  };

  const handleSaveRename = (playerId: string) => {
    const trimmed = editingName.trim();
    if (!trimmed) {
      setEditError('Name cannot be empty');
      return;
    }

    const duplicate = players.some(
      p => p.id !== playerId && p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setEditError(`A player named "${trimmed}" already exists`);
      return;
    }

    const updated = players.map(p => (p.id === playerId ? { ...p, name: trimmed } : p));
    dispatch({ type: 'UPDATE_PLAYERS', players: updated });
    audioService.playButtonTap();
    setEditingPlayerId(null);
    setEditingName('');
    setEditError(null);
  };

  const handleCancelRename = () => {
    setEditingPlayerId(null);
    setEditingName('');
    setEditError(null);
  };

  const handleRemovePlayer = (id: string) => {
    const updated = players.filter(p => p.id !== id);
    dispatch({ type: 'UPDATE_PLAYERS', players: updated });
    audioService.playPlayerRemoved();

    if (editingPlayerId === id) {
      handleCancelRename();
    }
    if (nameError) {
      setNameError(null);
    }

    const newMax = getMaxImposters(updated.length);
    if (settings.imposterCount > newMax) {
      dispatch({ type: 'UPDATE_SETTINGS', settings: { imposterCount: Math.max(1, newMax) } });
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
    if (players.length < 2) return;
    const copy = [...players];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    dispatch({ type: 'UPDATE_PLAYERS', players: copy });
    audioService.playNav();
  };

  const handleToggleCategory = (id: string) => {
    audioService.playCategorySelect();
    const exists = settings.selectedCategoryIds.includes(id);
    const next = exists
      ? settings.selectedCategoryIds.filter(c => c !== id)
      : [...settings.selectedCategoryIds, id];
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
    !nameError &&
    !editingPlayerId;

  const handleStartGame = () => {
    if (!canStart) return;
    audioService.playGameStart();
    dispatch({ type: 'START_GAME', allCategories });
  };

  return (
    <div className="flex flex-col flex-1 w-full">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-fade-in flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-chomu-text tracking-[-0.02em]">
              Pass &amp; Play setup
            </h1>
            <p className="text-sm text-chomu-secondary mt-0.5">
              Add players and pick word categories
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
          >
            Cancel
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Roster & Chomu Count */}
          <div className="lg:col-span-6 space-y-5">
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-chomu-secondary" strokeWidth={1.5} />
                  <h2 className="text-sm font-semibold text-chomu-text">
                    Players
                  </h2>
                  <span className="text-xs font-mono text-chomu-muted tabular-nums">
                    {players.length}/15
                  </span>
                </div>
                {players.length >= 2 && (
                  <button
                    type="button"
                    onClick={handleShufflePlayers}
                    aria-label="Shuffle player order"
                    className="inline-flex items-center gap-1.5 min-h-[44px] px-3 text-xs text-chomu-secondary hover:text-chomu-text font-medium transition-colors rounded-[10px] hover:bg-chomu-elevated focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                  >
                    <Shuffle className="w-4 h-4" strokeWidth={1.5} />
                    <span>Shuffle</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleAddPlayer} className="flex gap-2 mb-3">
                <input
                  type="text"
                  placeholder={players.length === 0 ? 'First player name' : 'Player name'}
                  value={newPlayerName}
                  maxLength={18}
                  autoCapitalize="words"
                  onChange={e => {
                    setNewPlayerName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  className="flex-1 bg-chomu-bgSecondary border border-white/[0.1] rounded-[10px] px-3.5 py-2.5 text-base sm:text-sm text-chomu-text placeholder-chomu-muted focus:outline-none focus:border-chomu-purple transition-colors min-h-[44px]"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Plus className="w-4 h-4" strokeWidth={1.5} />}
                  disabled={!newPlayerName.trim() || players.length >= 15}
                >
                  Add
                </Button>
              </form>

              {nameError && (
                <div className="flex items-center gap-2 text-chomu-coral text-xs mb-3 bg-chomu-coral/10 p-3 rounded-[10px] border border-chomu-coral/25 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>{nameError}</span>
                </div>
              )}

              {players.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-xl bg-chomu-bgSecondary border border-dashed border-white/[0.1] space-y-2">
                  <div className="w-10 h-10 rounded-[10px] bg-chomu-elevated border border-white/[0.08] flex items-center justify-center mx-auto text-chomu-secondary">
                    <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-sm font-medium text-chomu-text">No players added yet</h3>
                  <p className="text-xs text-chomu-muted max-w-[260px] mx-auto leading-5">
                    Add at least 3 players above to begin a round.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {players.map(p => {
                    const isEditing = editingPlayerId === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between bg-chomu-bgSecondary border rounded-[10px] px-3 py-1.5 min-h-[52px] transition-colors ${
                          isEditing ? 'border-chomu-purple' : 'border-white/[0.08]'
                        }`}
                      >
                        <div
                          onClick={() => !isEditing && handleCycleAvatar(p.id)}
                          title={isEditing ? undefined : 'Tap to cycle avatar'}
                          className={`flex items-center gap-2.5 min-w-0 flex-1 ${!isEditing ? 'cursor-pointer' : ''}`}
                        >
                          <div className="shrink-0">
                            <PlayerAvatar id={p.avatar} size="sm" />
                          </div>

                          {isEditing ? (
                            <div className="flex-1 min-w-0 mr-1">
                              <input
                                type="text"
                                autoFocus
                                value={editingName}
                                maxLength={18}
                                autoCapitalize="words"
                                onChange={e => {
                                  setEditingName(e.target.value);
                                  if (editError) setEditError(null);
                                }}
                                onKeyDown={e => {
                                  if (e.key === 'Enter') handleSaveRename(p.id);
                                  if (e.key === 'Escape') handleCancelRename();
                                }}
                                className="w-full bg-chomu-surface border border-chomu-purple rounded-lg px-2 py-1 text-base sm:text-xs text-chomu-text focus:outline-none"
                              />
                              {editError && (
                                <span className="text-xs text-chomu-coral block mt-0.5 truncate">
                                  {editError}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span
                              onClick={() => handleStartRename(p)}
                              title="Click to rename"
                              className="text-sm font-medium text-chomu-text truncate hover:text-chomu-purple transition-colors cursor-pointer"
                            >
                              {p.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center shrink-0 ml-1">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveRename(p.id)}
                                title="Save name"
                                aria-label={`Save rename for ${p.name}`}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-chomu-lime hover:bg-chomu-elevated rounded-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                              >
                                <Check className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelRename}
                                title="Cancel"
                                aria-label="Cancel rename"
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-chomu-muted hover:text-chomu-coral rounded-[10px] hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                              >
                                <X className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartRename(p)}
                                title="Rename player"
                                aria-label={`Rename ${p.name}`}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-chomu-muted hover:text-chomu-text rounded-[10px] hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                              >
                                <Edit2 className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePlayer(p.id)}
                                title="Delete player"
                                aria-label={`Delete ${p.name}`}
                                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-chomu-muted hover:text-chomu-coral rounded-[10px] hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                              >
                                <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>

            {/* Chomu Count */}
            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-chomu-secondary" strokeWidth={1.5} />
                  <h2 className="text-sm font-semibold text-chomu-text">
                    Chomu count
                  </h2>
                </div>
                <span className="text-xs text-chomu-muted tabular-nums">
                  {players.length < 3
                    ? 'Needs 3+ players'
                    : `Up to ${maxImposters} for ${players.length} players`}
                </span>
              </div>

              <div role="radiogroup" aria-label="Select Chomu count" className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(count => {
                  const isAvailable = players.length >= 3 && count <= maxImposters;
                  const isSelected = settings.imposterCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      role="radio"
                      aria-checked={isSelected && isAvailable}
                      aria-label={`${count === 1 ? '1 Chomu' : `${count} Chomas`}`}
                      disabled={!isAvailable}
                      onClick={() => {
                        audioService.playButtonTap();
                        dispatch({ type: 'UPDATE_SETTINGS', settings: { imposterCount: count } });
                      }}
                      className={`min-h-[48px] py-2 px-3 rounded-full border border-b-[3px] flex flex-col items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal ${
                        isSelected && isAvailable
                          ? 'bg-chomu-teal border-chomu-teal text-chomu-bg font-semibold'
                          : isAvailable
                            ? 'bg-chomu-bgSecondary border-white/[0.08] text-chomu-secondary hover:text-chomu-text'
                            : 'bg-chomu-bgSecondary/40 border-white/[0.04] text-chomu-muted/40 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-base font-mono font-semibold tabular-nums leading-5">{count}</span>
                      <span className="text-xs font-normal">
                        {count === 1 ? 'Chomu' : 'Chomas'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right Column: Hints & Categories */}
          <div className="lg:col-span-6 space-y-5">
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sliders className="w-4 h-4 text-chomu-secondary" strokeWidth={1.5} />
                <h2 className="text-sm font-semibold text-chomu-text">
                  Chomu hint mode
                </h2>
              </div>

              <div role="radiogroup" aria-label="Select hint difficulty" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: 'subtle', label: 'Subtle', desc: 'Indirect clue' },
                    { id: 'balanced', label: 'Balanced', desc: 'Clearer clue' },
                    { id: 'easy', label: 'Easier', desc: 'High context' },
                    { id: 'none', label: 'No hint', desc: 'Blind bluff' },
                  ] as const
                ).map(diff => {
                  const isSelected = settings.hintDifficulty === diff.id;
                  return (
                    <button
                      key={diff.id}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`${diff.label} hint: ${diff.desc}`}
                      onClick={() =>
                        dispatch({
                          type: 'UPDATE_SETTINGS',
                          settings: { hintDifficulty: diff.id as HintDifficulty },
                        })
                      }
                      className={`min-h-[52px] p-2.5 rounded-2xl border border-b-[3px] text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal ${
                        isSelected
                          ? 'bg-chomu-teal/15 border-chomu-teal text-chomu-text'
                          : 'bg-chomu-bgSecondary border-white/[0.08] text-chomu-secondary hover:text-chomu-text'
                      }`}
                    >
                      <span className="text-xs font-medium block leading-4">{diff.label}</span>
                      <span className="text-xs text-chomu-muted block mt-0.5 leading-4">{diff.desc}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            <Card className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-chomu-text">
                    Categories
                  </h2>
                  <span className="text-xs font-mono text-chomu-muted tabular-nums">
                    {settings.selectedCategoryIds.length}/{allCategories.length}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={handleSelectAllCategories}
                    aria-label="Select all categories"
                    className="min-h-[44px] px-2.5 inline-flex items-center text-chomu-secondary hover:text-chomu-text font-medium rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={handleClearAllCategories}
                    aria-label="Clear all categories"
                    className="min-h-[44px] px-2.5 inline-flex items-center text-chomu-muted hover:text-chomu-text font-medium rounded-[10px] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {settings.selectedCategoryIds.length === 0 && (
                <div className="bg-chomu-coral/10 border border-chomu-coral/25 text-chomu-coral text-xs p-2.5 rounded-[10px] mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span>Select at least one category to play</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allCategories.map(cat => {
                  const isSelected = settings.selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleToggleCategory(cat.id)}
                      className={`min-h-[48px] flex items-center gap-2.5 px-3.5 py-2.5 rounded-full border border-b-[3px] text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple ${
                        isSelected
                          ? 'bg-chomu-elevated border-chomu-purple text-chomu-text'
                          : 'bg-chomu-bgSecondary border-white/[0.08] text-chomu-secondary hover:text-chomu-text'
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-chomu-purple text-chomu-bg' : 'bg-chomu-surface text-chomu-muted'
                        }`}
                      >
                        <CategoryVectorIcon id={cat.id} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-medium truncate block">{cat.name}</span>
                        <span className="text-xs font-mono text-chomu-muted tabular-nums block">
                          {cat.words.length} words
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-chomu-purple shrink-0" strokeWidth={1.5} />}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Non-overlapping docked action footer */}
      <div
        className="sticky bottom-0 z-30 border-t border-white/[0.08] bg-chomu-bgSecondary px-4 sm:px-6 py-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-chomu-secondary tabular-nums">
            {players.length < 3
              ? `Add ${3 - players.length} more ${3 - players.length === 1 ? 'player' : 'players'} to start`
              : settings.selectedCategoryIds.length === 0
                ? 'Select at least one category'
                : `${players.length} players ready`}
          </p>
          <Button
            variant="coral"
            size="lg"
            className="w-full sm:w-56"
            disabled={!canStart}
            onClick={handleStartGame}
            leftIcon={<Play className="w-4 h-4 fill-current" strokeWidth={1.5} />}
          >
            Start game
          </Button>
        </div>
      </div>
    </div>
  );
};
