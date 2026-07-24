import React from 'react';
import logoImg from '../assets/logo.png';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
  variant?: 'stacked' | 'horizontal';
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-10 md:h-12',
    md: 'h-16 md:h-20',
    lg: 'h-24 md:h-28',
    xl: 'h-36 md:h-44',
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none group cursor-pointer ${className}`}>
      <img
        src={logoImg}
        alt="SNAP STORIES"
        className={`${sizeMap} w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]`}
      />
      {showSubtitle && (
        <span className="font-space text-[10px] md:text-xs tracking-[0.25em] text-neutral-400 font-semibold uppercase mt-1">
          Reel Creator Platform
        </span>
      )}
    </div>
  );
};
