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
      className={`bg-chomu-surface border border-white/[0.08] rounded-xl p-5 transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isClickable
          ? 'cursor-pointer hover:border-white/[0.16] hover:bg-chomu-elevated active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-purple focus-visible:ring-offset-2 focus-visible:ring-offset-chomu-bg'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
