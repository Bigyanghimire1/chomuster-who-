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
      className={`bg-chomu-surface border border-white/[0.1] rounded-3xl p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_10px_28px_rgba(0,0,0,0.32)] transition-[background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        isClickable
          ? 'cursor-pointer border-b-[3px] border-b-[#080D16] hover:border-chomu-teal/40 hover:bg-chomu-elevated active:translate-y-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-chomu-teal focus-visible:ring-offset-2 focus-visible:ring-offset-chomu-bg'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
