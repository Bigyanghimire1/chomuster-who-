import React, { useState, useRef } from 'react';
import {
  Users,
  Plus,
  Shuffle,
  Play,
  Check,
  X,
  Edit2,
  AlertCircle,
  Sliders,
  UserPlus,
  Minus,
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { CategoryCard } from '../common/CategoryCard';
import { PlayerAvatar } from '../illustrations/PlayerAvatar';
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
  const addInputRef = useRef<HTMLInputElement>(null);

  const players = state.players;
  const settings = state.settings;
  const maxImposters = getMaxImposters(players.length);

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newPlayerName.trim();
    if (!trimmed) {
      setNameError('Enter a player name first');
      return;
    }

    if (players.some((p) => p.name.trim().toLowerCase() === trimmed.toLowerCase())) {
      setNameError(`A player named "${trimmed}" already exists`);
      return;
    }
    if (players.length >= 15) {
      setNameError('Maximum 15 players supported');
      return;
    }

    const usedAvatars = new Set(players.map((p) => p.avatar));
    const availableAvatars = AVATAR_LIST.filter((id) => !usedAvatars.has(id));
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
      (p) => p.id !== playerId && p.name.trim().toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setEditError(`A player named "${trimmed}" already exists`);
      return;
    }

    const updated = players.map((p) => (p.id === playerId ? { ...p, name: trimmed } : p));
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
    const updated = players.filter((p) => p.id !== id);
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
    const updated = players.map((p) => {
      if (p.id !== playerId) return p;
      const idx = AVATAR_LIST.indexOf(p.avatar);
      const next = AVATAR_LIST[(idx + 1) % AVATAR_LIST.length];
      return { ...p, avatar: next };
    });
    dispatch({ type: 'UPDATE_PLAYERS', players: updated });
    audioService.playButtonTap();
  };

  const handleShufflePlayers = () => {
    if (players.length < 2) return;
    const copy = [...players];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    dispatch({ type: 'UPDATE_PLAYERS', players: copy });
    audioService.playButtonTap();
  };

  const handleToggleCategory = (catId: string) => {
    const current = settings.selectedCategoryIds;
    const exists = current.includes(catId);
    const updated = exists ? current.filter((id) => id !== catId) : [...current, catId];
    dispatch({ type: 'UPDATE_SETTINGS', settings: { selectedCategoryIds: updated } });
    audioService.playCategorySelect();
  };

  const handleSelectAllCategories = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { selectedCategoryIds: allCategories.map((c) => c.id) },
    });
    audioService.playButtonTap();
  };

  const handleClearAllCategories = () => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      settings: { selectedCategoryIds: [] },
    });
    audioService.playButtonTap();
  };

  const canStart = players.length >= 3 && settings.selectedCategoryIds.length >= 1;

  const handleStartGame = () => {
    if (!canStart) return;
    audioService.playGameStart();
    dispatch({ type: 'START_GAME', allCategories });
  };

  return (
    <div className="flex flex-col flex-1 w-full pb-28 sm:pb-8">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 space-y-6 animate-fade-in">
        {/* Oversized Heading */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#050505] tracking-[-0.03em]">
              Pass &amp; Play
            </h1>
            <p className="text-sm font-bold text-[#26282E] mt-0.5">
              Add players, pick categories, and pass the phone.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch({ type: 'SET_PHASE', phase: 'HOME' })}
          >
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Players + Game Settings */}
          <div className="lg:col-span-5 space-y-6">
            {/* PLAYERS SECTION */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#050505]" strokeWidth={2.4} />
                  <h2 className="text-xl font-extrabold text-[#050505] tracking-tight">
                    Players
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FFDF00] border-2 border-[#050505] text-xs font-extrabold tabular-nums">
                    {players.length}/15
                  </span>
                </div>
                {players.length >= 2 && (
                  <button
                    type="button"
                    onClick={handleShufflePlayers}
                    aria-label="Shuffle player order"
                    className="inline-flex items-center gap-1.5 min-h-[40px] px-3 text-xs font-extrabold text-[#050505] bg-[#F5F6F8] hover:bg-[#A9E5F2] border-2 border-[#050505] rounded-xl shadow-[0_2px_0_#050505] active:translate-y-[2px] active:shadow-none transition-all"
                  >
                    <Shuffle className="w-3.5 h-3.5" strokeWidth={2.2} />
                    <span>Shuffle</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleAddPlayer} className="flex gap-2">
                <input
                  ref={addInputRef}
                  type="text"
                  placeholder={players.length === 0 ? 'Enter first player name' : 'Add player name'}
                  value={newPlayerName}
                  maxLength={18}
                  autoCapitalize="words"
                  onFocus={() => {
                    setTimeout(() => {
                      addInputRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
                    }, 120);
                  }}
                  onChange={(e) => {
                    setNewPlayerName(e.target.value);
                    if (nameError) setNameError(null);
                  }}
                  className="flex-1 bg-white border-[2.5px] border-[#050505] rounded-xl px-3.5 py-2.5 text-base sm:text-sm font-bold text-[#050505] placeholder-[#52555E] focus:outline-none focus:bg-[#FFF9CC] shadow-[0_3px_0_#050505] min-h-[48px]"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  leftIcon={<Plus className="w-4 h-4" strokeWidth={2.8} />}
                  disabled={!newPlayerName.trim() || players.length >= 15}
                >
                  Add
                </Button>
              </form>

              {nameError && (
                <div className="flex items-center gap-2 text-[#050505] text-xs font-bold bg-[#FF5D73] p-3 rounded-xl border-2 border-[#050505] shadow-[0_3px_0_#050505] animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2.2} />
                  <span>{nameError}</span>
                </div>
              )}

              {players.length === 0 ? (
                <div className="py-8 px-4 text-center rounded-2xl bg-[#F5F6F8] border-2 border-dashed border-[#050505] space-y-2">
                  <div className="w-11 h-11 rounded-xl bg-[#FFDF00] border-2 border-[#050505] flex items-center justify-center mx-auto text-[#050505]">
                    <UserPlus className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#050505]">No players added yet</h3>
                  <p className="text-xs font-semibold text-[#52555E] max-w-[260px] mx-auto">
                    Add at least 3 players above to start.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {players.map((p, index) => {
                    const isEditing = editingPlayerId === p.id;
                    return (
                      <div
                        key={p.id}
                        className={`flex items-center justify-between bg-white border-[2.5px] border-[#050505] rounded-xl px-3 py-2 min-h-[56px] shadow-[0_4px_0_#050505] animate-scale-in ${
                          isEditing ? 'bg-[#FFF9CC]' : ''
                        }`}
                      >
                        <div
                          onClick={() => !isEditing && handleCycleAvatar(p.id)}
                          title={isEditing ? undefined : 'Tap to change character'}
                          className={`flex items-center gap-3 min-w-0 flex-1 ${
                            !isEditing ? 'cursor-pointer' : ''
                          }`}
                        >
                          <span className="text-xs font-extrabold text-[#52555E] w-4 tabular-nums">
                            {index + 1}
                          </span>
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
                                onChange={(e) => {
                                  setEditingName(e.target.value);
                                  if (editError) setEditError(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSaveRename(p.id);
                                  } else if (e.key === 'Escape') {
                                    handleCancelRename();
                                  }
                                }}
                                className="w-full bg-white border-2 border-[#050505] rounded-lg px-2.5 py-1.5 text-sm font-bold text-[#050505] focus:outline-none min-h-[38px]"
                              />
                              {editError && (
                                <span className="text-[11px] font-bold text-[#FF5D73] block mt-0.5">
                                  {editError}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm font-extrabold text-[#050505] truncate">
                              {p.name}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveRename(p.id)}
                                aria-label="Save name"
                                className="w-10 h-10 rounded-xl bg-[#64E987] border-2 border-[#050505] flex items-center justify-center text-[#050505]"
                              >
                                <Check className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelRename}
                                aria-label="Cancel rename"
                                className="w-10 h-10 rounded-xl bg-white border-2 border-[#050505] flex items-center justify-center text-[#050505]"
                              >
                                <X className="w-4 h-4" strokeWidth={2.5} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartRename(p)}
                                title="Rename player"
                                aria-label={`Rename ${p.name}`}
                                className="w-10 h-10 flex items-center justify-center text-[#050505] rounded-xl hover:bg-[#FFF9CC] transition-colors"
                              >
                                <Edit2 className="w-4 h-4" strokeWidth={2.2} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemovePlayer(p.id)}
                                title="Remove player"
                                aria-label={`Delete ${p.name}`}
                                className="w-10 h-10 flex items-center justify-center text-[#050505] rounded-xl hover:bg-[#FF5D73] transition-colors"
                              >
                                <X className="w-4 h-4" strokeWidth={2.5} />
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

            {/* GAME SETTINGS SECTION */}
            <Card className="p-5 space-y-5">
              <div className="flex items-center gap-2 border-b-2 border-[#050505] pb-3">
                <Sliders className="w-4 h-4 text-[#050505]" strokeWidth={2.4} />
                <h2 className="text-lg font-extrabold text-[#050505]">
                  Game settings
                </h2>
              </div>

              {/* Numeric Stepper for Chomus */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="text-sm font-extrabold text-[#050505] block">
                    Number of Chomus
                  </span>
                  <span className="text-xs font-semibold text-[#52555E]">
                    {players.length < 3
                      ? 'Needs 3+ players'
                      : `Up to ${maxImposters} for ${players.length} players`}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={settings.imposterCount <= 1}
                    aria-label="Decrease Chomus"
                    onClick={() => {
                      audioService.playButtonTap();
                      dispatch({
                        type: 'UPDATE_SETTINGS',
                        settings: { imposterCount: Math.max(1, settings.imposterCount - 1) },
                      });
                    }}
                    className="w-11 h-11 rounded-xl bg-white hover:bg-[#FFF9CC] disabled:bg-[#C6C9D1] border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-[#050505]"
                  >
                    <Minus className="w-4 h-4" strokeWidth={2.8} />
                  </button>
                  <span className="w-10 text-center text-xl font-extrabold text-[#050505] tabular-nums">
                    {settings.imposterCount}
                  </span>
                  <button
                    type="button"
                    disabled={players.length < 3 || settings.imposterCount >= maxImposters}
                    aria-label="Increase Chomus"
                    onClick={() => {
                      audioService.playButtonTap();
                      dispatch({
                        type: 'UPDATE_SETTINGS',
                        settings: {
                          imposterCount: Math.min(maxImposters, settings.imposterCount + 1),
                        },
                      });
                    }}
                    className="w-11 h-11 rounded-xl bg-[#F28BCB] hover:bg-[#EB74BD] disabled:bg-[#C6C9D1] border-2 border-[#050505] shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none flex items-center justify-center text-[#050505]"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.8} />
                  </button>
                </div>
              </div>

              {/* Chomu Hint Mode */}
              <div className="space-y-2">
                <span className="text-sm font-extrabold text-[#050505] block">
                  Chomu hint mode
                </span>
                <div
                  role="radiogroup"
                  aria-label="Select hint difficulty"
                  className="grid grid-cols-2 gap-2.5"
                >
                  {(
                    [
                      { id: 'subtle', label: 'Subtle', desc: 'Indirect clue' },
                      { id: 'balanced', label: 'Balanced', desc: 'Clearer clue' },
                      { id: 'easy', label: 'Easier', desc: 'High context' },
                      { id: 'none', label: 'No hint', desc: 'Blind bluff' },
                    ] as const
                  ).map((diff) => {
                    const isSelected = settings.hintDifficulty === diff.id;
                    return (
                      <button
                        key={diff.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={`${diff.label} hint: ${diff.desc}`}
                        onClick={() => {
                          audioService.playButtonTap();
                          dispatch({
                            type: 'UPDATE_SETTINGS',
                            settings: { hintDifficulty: diff.id as HintDifficulty },
                          });
                        }}
                        className={`p-3 rounded-xl border-2 border-[#050505] text-left transition-all shadow-[0_3px_0_#050505] active:translate-y-[2px] active:shadow-none ${
                          isSelected
                            ? 'bg-[#F28BCB] text-[#050505]'
                            : 'bg-white text-[#050505] hover:bg-[#FFF9CC]'
                        }`}
                      >
                        <span className="text-sm font-extrabold block leading-tight">
                          {diff.label}
                        </span>
                        <span className="text-xs font-semibold text-[#26282E] block mt-0.5">
                          {diff.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: CATEGORIES (2-column illustrated grid) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white border-[2.5px] border-[#050505] rounded-2xl p-4 shadow-[0_5px_0_#050505]">
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-extrabold uppercase tracking-tight text-[#050505]">
                  Categories
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#F28BCB] border-2 border-[#050505] text-xs font-extrabold tabular-nums">
                  {settings.selectedCategoryIds.length}/{allCategories.length}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAllCategories}
                  aria-label="Select all categories"
                  className="px-3 py-1.5 rounded-xl bg-[#64E987] border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold text-[#050505]"
                >
                  Select all
                </button>
                <button
                  type="button"
                  onClick={handleClearAllCategories}
                  aria-label="Clear all categories"
                  className="px-3 py-1.5 rounded-xl bg-white border-2 border-[#050505] shadow-[0_2px_0_#050505] active:translate-y-[2px] active:shadow-none text-xs font-extrabold text-[#050505]"
                >
                  Clear all
                </button>
              </div>
            </div>

            {settings.selectedCategoryIds.length === 0 && (
              <div className="bg-[#FF5D73] border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505] text-[#050505] text-xs font-extrabold p-3.5 rounded-2xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" strokeWidth={2.5} />
                <span>Select at least one category to play</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              {allCategories.map((cat) => (
                <CategoryCard
                  key={cat.id}
                  category={cat}
                  selected={settings.selectedCategoryIds.includes(cat.id)}
                  onToggle={handleToggleCategory}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Launch Bar */}
      <div
        className="fixed bottom-0 inset-x-0 sm:sticky sm:bottom-0 z-30 border-t-[3px] border-[#050505] bg-white px-4 sm:px-6 py-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p className="text-xs font-extrabold text-[#050505] tabular-nums">
            {players.length < 3
              ? `Add ${3 - players.length} more ${3 - players.length === 1 ? 'player' : 'players'} to start`
              : settings.selectedCategoryIds.length === 0
                ? 'Select at least one category'
                : `${players.length} players ready · ${settings.selectedCategoryIds.length} categories`}
          </p>
          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-64"
            disabled={!canStart}
            onClick={handleStartGame}
            leftIcon={<Play className="w-4 h-4 fill-current" strokeWidth={2.2} />}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};
