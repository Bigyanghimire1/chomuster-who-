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
      className={`bg-white border-[2.5px] border-[#050505] rounded-2xl p-5 shadow-[0_5px_0_#050505] transition-[background-color,transform,box-shadow] duration-100 ${
        isClickable
          ? 'cursor-pointer hover:bg-[#FFF9CC] active:translate-y-[3px] active:shadow-[0_2px_0_#050505] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#050505] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFDF00]'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
