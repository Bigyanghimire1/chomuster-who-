import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  interactive = false,
}) => {
  const isClickable = Boolean(onClick || interactive);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isClickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`bg-chomu-surface border border-chomu-border rounded-2xl p-4 shadow-xl transition-all ${
        isClickable
          ? 'cursor-pointer hover:border-chomu-purple/50 hover:bg-chomu-elevated active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple focus-visible:ring-offset-2 focus-visible:ring-offset-chomu-bg'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
