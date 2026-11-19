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
        dark: '#101225',
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
          setError('Failed to generate QR code');
          console.error('QR code generation error:', err);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [isOpen, effectiveUrl]);

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
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-chomu-surface border border-chomu-border rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chomu-border/60 pb-3">
          <div className="flex items-center gap-2 text-left">
            <div className="w-8 h-8 rounded-xl bg-chomu-purple/20 flex items-center justify-center text-chomu-purple">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-chomu-text tracking-tight">
                Scan to Join
              </h3>
              <p className="text-[11px] text-chomu-muted font-medium">
                Point any phone camera to enter room
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-chomu-muted hover:text-chomu-text rounded-xl hover:bg-chomu-elevated transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Code Showcase */}
        <div className="bg-chomu-bg/70 border border-chomu-border rounded-2xl py-2.5 px-4">
          <span className="text-[10px] font-bold text-chomu-muted uppercase tracking-widest block mb-0.5">
            Room Code
          </span>
          <span className="text-3xl font-mono font-black text-chomu-lime tracking-[0.25em]">
            {roomCode}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="flex items-center justify-center">
          <div className="p-3 bg-white rounded-2xl shadow-inner border border-white/20">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for room ${roomCode}`}
                className="w-56 h-56 rounded-lg select-none"
              />
            ) : error ? (
              <div className="w-56 h-56 flex items-center justify-center text-chomu-coral text-xs">
                {error}
              </div>
            ) : (
              <div className="w-56 h-56 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-2 border-chomu-purple border-t-transparent animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* URL / Copy Actions */}
        <div className="space-y-2 pt-1">
          <Button
            variant={copied ? 'lime' : 'secondary'}
            size="md"
            fullWidth
            leftIcon={
              copied ? (
                <Check className="w-4 h-4 text-chomu-lime" />
              ) : (
                <Copy className="w-4 h-4 text-chomu-muted" />
              )
            }
            onClick={handleCopy}
          >
            {copied ? 'Invite Link Copied!' : 'Copy Invite Link'}
          </Button>

          <Button variant="ghost" size="sm" fullWidth onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};
