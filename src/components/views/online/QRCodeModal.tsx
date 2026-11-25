import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, QrCode } from 'lucide-react';
import { Button } from '../../common/Button';
import { audioService } from '../../../services/audioService';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomCode: string;
  joinUrl?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  roomCode,
  joinUrl,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveUrl =
    joinUrl ||
    (typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?room=${roomCode}`
      : `https://chomu.app/?room=${roomCode}`);

  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      return;
    }

    let isSubscribed = true;

    QRCode.toDataURL(effectiveUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#0B0D14',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'M',
    })
      .then((url) => {
        if (isSubscribed) {
          setQrDataUrl(url);
          setError(null);
        }
      })
      .catch((err) => {
        if (isSubscribed) {
          setError('Unable to generate QR code');
          console.error('QR code generation error:', err);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, effectiveUrl]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(effectiveUrl);
      } else {
        const input = document.createElement('input');
        input.value = effectiveUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      audioService.playButtonTap();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-chomu-surface border border-white/[0.1] rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-[0_16px_48px_rgba(0,0,0,0.5)] space-y-5 text-center animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-[10px] bg-chomu-elevated border border-white/[0.08] flex items-center justify-center text-chomu-secondary">
              <QrCode className="w-4 h-4" strokeWidth={1.5} />
            </div>
            <div>
              <h3 id="qr-modal-title" className="text-base font-semibold text-chomu-text">
                Scan to join
              </h3>
              <p className="text-xs text-chomu-muted">
                Open camera to enter room
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] -mr-2 flex items-center justify-center rounded-[10px] text-chomu-secondary hover:text-chomu-text hover:bg-chomu-elevated transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Room Code Showcase */}
        <div className="bg-chomu-bgSecondary border border-white/[0.08] rounded-xl py-3 px-4">
          <span className="text-xs font-medium text-chomu-muted block mb-0.5">
            Room code
          </span>
          <span className="text-3xl font-mono font-semibold text-chomu-text tracking-[0.2em] tabular-nums">
            {roomCode}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="flex items-center justify-center">
          <div className="p-3 bg-white rounded-xl border border-white/20">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for room ${roomCode}`}
                className="w-52 h-52 rounded-lg select-none"
              />
            ) : error ? (
              <div className="w-52 h-52 flex items-center justify-center text-chomu-coral text-xs">
                {error}
              </div>
            ) : (
              <div className="w-52 h-52 flex items-center justify-center">
                <div className="w-6 h-6 rounded-full border-2 border-chomu-purple border-t-transparent animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* URL / Copy Actions */}
        <div className="space-y-2">
          <Button
            variant={copied ? 'lime' : 'secondary'}
            size="md"
            fullWidth
            leftIcon={
              copied ? (
                <Check className="w-4 h-4" strokeWidth={1.5} />
              ) : (
                <Copy className="w-4 h-4" strokeWidth={1.5} />
              )
            }
            onClick={handleCopy}
          >
            {copied ? 'Invite link copied' : 'Copy invite link'}
          </Button>

          <Button variant="ghost" size="sm" fullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
