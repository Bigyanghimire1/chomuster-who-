import React from 'react';

interface CardProps {
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
  return (
    <div
      onClick={onClick}
      className={`bg-chomu-surface border border-chomu-border rounded-2xl p-4 shadow-xl transition-all ${
        interactive
          ? 'cursor-pointer hover:border-chomu-purple/50 hover:bg-chomu-elevated active:scale-[0.99]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
