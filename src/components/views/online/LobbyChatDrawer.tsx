import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { MessageCircle, ArrowUp, X, RotateCcw, Loader2 } from 'lucide-react';
import { ChatPayload } from '../../../types/multiplayer';
import { audioService } from '../../../services/audioService';

interface ChatItem {
  id: string;
  senderName: string;
  text: string;
  isSystem?: boolean;
  status?: 'sending' | 'failed';
}

interface LobbyChatDrawerProps {
  messages: ChatPayload[];
  onSend: (text: string) => Promise<void> | void;
  playerCount?: number;
}

/**
 * LobbyChatDrawer — Neo-Brutalist Lobby-only chat.
 * - Mobile (< lg): compact trigger pill with unread badge opening a portaled bottom sheet
 *   positioned strictly above the global media toolbar (--voice-dock-height) and responsive
 *   to visualViewport when the mobile keyboard opens.
 * - Desktop (lg+): crisp side panel in the lobby grid.
 * Strictly mounted only while in LOBBY.
 */
export const LobbyChatDrawer: React.FC<LobbyChatDrawerProps> = ({
  messages,
  onSend,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [pendingMessages, setPendingMessages] = useState<ChatItem[]>([]);
  const [seenCount, setSeenCount] = useState<number>(messages.length);
  const [viewportState, setViewportState] = useState<{
    height: number | null;
    offsetTop: number;
    isKeyboardOpen: boolean;
  }>({ height: null, offsetTop: 0, isKeyboardOpen: false });

  const listRef = useRef<HTMLDivElement>(null);
  const desktopListRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef<boolean>(true);

  const unreadCount = isOpen ? 0 : Math.max(0, messages.length - seenCount);

  useEffect(() => {
    if (isOpen) {
      setSeenCount(messages.length);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (!isOpen || typeof window === 'undefined') return;
    const vp = window.visualViewport;
    if (!vp) return;

    const handleViewportChange = () => {
      const keyboardOpen = window.innerHeight - vp.height > 120;
      setViewportState({
        height: vp.height,
        offsetTop: vp.offsetTop,
        isKeyboardOpen: keyboardOpen,
      });
    };

    handleViewportChange();
    vp.addEventListener('resize', handleViewportChange);
    vp.addEventListener('scroll', handleViewportChange);
    return () => {
      vp.removeEventListener('resize', handleViewportChange);
      vp.removeEventListener('scroll', handleViewportChange);
    };
  }, [isOpen]);

  const scrollToBottomIfNear = (el: HTMLDivElement | null) => {
    if (!el || !isNearBottomRef.current) return;
    el.scrollTop = el.scrollHeight;
  };

  useEffect(() => {
    scrollToBottomIfNear(desktopListRef.current);
    if (isOpen) {
      scrollToBottomIfNear(listRef.current);
    }
  }, [messages.length, pendingMessages.length, isOpen, viewportState.height]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    isNearBottomRef.current = distanceFromBottom < 48;
  };

  const dispatchMessage = async (text: string, retryId?: string) => {
    const tempId = retryId || `pending-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    if (retryId) {
      setPendingMessages((prev) =>
        prev.map((m) => (m.id === retryId ? { ...m, status: 'sending' } : m))
      );
    } else {
      setPendingMessages((prev) => [
        ...prev,
        { id: tempId, senderName: 'You', text, status: 'sending' },
      ]);
    }

    setIsSending(true);
    try {
      await Promise.resolve(onSend(text));
      setPendingMessages((prev) => prev.filter((m) => m.id !== tempId));
      audioService.playButtonTap();
    } catch {
      setPendingMessages((prev) =>
        prev.map((m) => (m.id === tempId ? { ...m, status: 'failed' } : m))
      );
      setInput((prev) => (prev ? prev : text));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setInput('');
    isNearBottomRef.current = true;
    await dispatchMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const renderMessageList = (refObj: React.RefObject<HTMLDivElement>) => (
    <div
      ref={refObj}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto py-3 space-y-2 pr-1 overscroll-contain"
    >
      {messages.length === 0 && pendingMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <span className="px-3 py-1.5 rounded-full bg-[#FFDF00] border-2 border-[#050505] text-xs font-extrabold text-[#050505] shadow-[0_2px_0_#050505]">
            Say hi while everyone joins!
          </span>
        </div>
      ) : (
        <>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`text-xs rounded-2xl px-3 py-2 border-2 border-[#050505] ${
                msg.isSystem
                  ? 'bg-[#FFDF00]/55 text-[#050505] font-bold'
                  : 'bg-[#F5F6F8] text-[#050505]'
              }`}
            >
              {!msg.isSystem && (
                <span className="font-extrabold text-[#050505] mr-1.5">
                  {msg.senderName}:
                </span>
              )}
              <span className="whitespace-pre-wrap break-words">{msg.text}</span>
            </div>
          ))}
          {pendingMessages.map((pm) => (
            <div
              key={pm.id}
              className={`text-xs rounded-2xl px-3 py-2 border-2 border-[#050505] flex items-center justify-between gap-2 ${
                pm.status === 'failed'
                  ? 'bg-[#FF5D73]/25 text-[#050505]'
                  : 'bg-[#A9E5F2]/40 text-[#050505] opacity-85'
              }`}
            >
              <div className="min-w-0">
                <span className="font-extrabold mr-1.5">{pm.senderName}:</span>
                <span className="whitespace-pre-wrap break-words">{pm.text}</span>
                <span className="ml-2 text-[10px] font-bold text-[#26282E]">
                  {pm.status === 'failed' ? 'Failed' : 'Sending...'}
                </span>
              </div>
              {pm.status === 'failed' && (
                <button
                  type="button"
                  onClick={() => dispatchMessage(pm.text, pm.id)}
                  className="shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white border-2 border-[#050505] text-[10px] font-extrabold text-[#050505] hover:bg-[#FFDF00]"
                >
                  <RotateCcw className="w-3 h-3" strokeWidth={2.2} />
                  Retry
                </button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );

  const renderComposer = () => (
    <form
      onSubmit={handleSubmit}
      className="shrink-0 pt-2.5 border-t-2 border-[#050505]/15 bg-white"
    >
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border-[2.5px] border-[#050505] shadow-[0_3px_0_#050505] focus-within:bg-[#FFFDF0] transition-colors">
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={200}
          placeholder="Send a message..."
          aria-label="Lobby chat message"
          className="flex-1 bg-transparent px-2.5 py-1.5 text-sm sm:text-xs font-medium text-[#050505] placeholder-[#52555E] focus:outline-none resize-none max-h-24 leading-snug"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          aria-label="Send chat message"
          className="min-w-[40px] min-h-[40px] px-3 rounded-xl bg-[#FFDF00] hover:bg-[#F2D300] disabled:bg-[#E2E4EA] disabled:text-[#52555E] border-2 border-[#050505] text-[#050505] shadow-[0_2px_0_#050505] disabled:shadow-none active:translate-y-[1px] active:shadow-none flex items-center justify-center shrink-0 transition-all"
        >
          {isSending ? (
            <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2.5} />
          ) : (
            <ArrowUp className="w-4 h-4" strokeWidth={2.75} />
          )}
        </button>
      </div>
    </form>
  );

  const mobileOverlayStyle: React.CSSProperties = viewportState.isKeyboardOpen && viewportState.height
    ? {
        top: `${viewportState.offsetTop}px`,
        height: `${viewportState.height}px`,
      }
    : {
        top: 0,
        bottom: 'var(--voice-dock-height, 68px)',
      };

  const mobileDrawerNode = isOpen ? (
    <div
      className="fixed left-0 right-0 z-[60] lg:hidden flex flex-col justify-end bg-[#050505]/55 backdrop-blur-xs animate-fade-in"
      style={mobileOverlayStyle}
      onClick={() => setIsOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Lobby chat"
        className={`w-full bg-white border-t-[3px] border-x-[3px] border-[#050505] rounded-t-3xl shadow-[0_-6px_0_#050505] p-4 flex flex-col animate-slide-up ${
          viewportState.isKeyboardOpen ? 'h-full max-h-full rounded-t-2xl' : 'h-[78%] max-h-[calc(100%-1rem)]'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 rounded-full bg-[#050505]/25 mx-auto mb-2.5 shrink-0" />
        <div className="flex items-center justify-between pb-2.5 border-b-2 border-[#050505]/15 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#A9E5F2] border-2 border-[#050505] flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-[#050505]" strokeWidth={2.25} />
            </span>
            <h2 className="text-base font-extrabold text-[#050505]">Lobby chat</h2>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="min-w-[40px] min-h-[40px] rounded-full bg-[#F5F6F8] border-2 border-[#050505] flex items-center justify-center text-[#050505] hover:bg-[#FFDF00]"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {renderMessageList(listRef)}
        {renderComposer()}
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Mobile Trigger Pill (< lg) */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            audioService.playButtonTap();
          }}
          className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white border-[2.5px] border-[#050505] shadow-[0_4px_0_#050505] active:translate-y-[2px] active:shadow-none transition-all text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-8 h-8 rounded-xl bg-[#A9E5F2] border-2 border-[#050505] flex items-center justify-center shrink-0">
              <MessageCircle className="w-4 h-4 text-[#050505]" strokeWidth={2.25} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-[#050505] leading-tight">
                Lobby chat
              </p>
              <p className="text-xs text-[#26282E] truncate">
                {messages.length > 0
                  ? `${messages[messages.length - 1].senderName}: ${messages[messages.length - 1].text}`
                  : 'Tap to message players in the room'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-[#FF5D73] border-2 border-[#050505] text-xs font-extrabold text-[#050505] tabular-nums shadow-[0_2px_0_#050505]">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
            <span className="px-2.5 py-1 rounded-full bg-[#FFDF00] border-2 border-[#050505] text-xs font-extrabold text-[#050505]">
              Open
            </span>
          </div>
        </button>
      </div>

      {/* Desktop Side Panel (lg+) */}
      <div className="hidden lg:flex lg:col-span-4 flex-col bg-white border-[2.5px] border-[#050505] rounded-3xl shadow-[0_5px_0_#050505] p-4 h-[400px]">
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b-2 border-[#050505]/15 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#A9E5F2] border-2 border-[#050505] flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-[#050505]" strokeWidth={2.25} />
            </span>
            <h2 className="text-sm font-extrabold text-[#050505]">Lobby chat</h2>
          </div>
          <span className="text-[11px] font-bold text-[#26282E] tabular-nums">
            {messages.length}
          </span>
        </div>

        {renderMessageList(desktopListRef)}
        {renderComposer()}
      </div>

      {/* Portaled Mobile Bottom Sheet (always sits cleanly above global VoiceControls dock) */}
      {mobileDrawerNode &&
        (typeof document !== 'undefined'
          ? createPortal(mobileDrawerNode, document.body)
          : mobileDrawerNode)}
    </>
  );
};
