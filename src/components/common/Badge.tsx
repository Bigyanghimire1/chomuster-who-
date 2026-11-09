import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lime' | 'coral' | 'purple' | 'cyan' | 'yellow' | 'muted' | 'emerald' | 'crimson' | 'indigo';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  className = '',
}) => {
  const variants = {
    lime: 'bg-chomu-lime/15 text-chomu-lime border-chomu-lime/30',
    coral: 'bg-chomu-coral/15 text-chomu-coral border-chomu-coral/30',
    purple: 'bg-chomu-purple/15 text-chomu-purple border-chomu-purple/30',
    cyan: 'bg-chomu-cyan/15 text-chomu-cyan border-chomu-cyan/30',
    yellow: 'bg-chomu-yellow/15 text-chomu-yellow border-chomu-yellow/30',
    muted: 'bg-chomu-elevated text-chomu-muted border-chomu-border',
    // Aliases
    emerald: 'bg-chomu-lime/15 text-chomu-lime border-chomu-lime/30',
    crimson: 'bg-chomu-coral/15 text-chomu-coral border-chomu-coral/30',
    indigo: 'bg-chomu-purple/15 text-chomu-purple border-chomu-purple/30',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-full border ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};
