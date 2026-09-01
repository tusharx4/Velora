import React from 'react';

interface BrandLogoProps {
  variant?: 'dark' | 'light' | 'gold' | 'monochrome';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const isLight = variant === 'light';
  const isGold = variant === 'gold';

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-base tracking-[0.25em]',
    md: 'text-xl tracking-[0.28em]',
    lg: 'text-3xl tracking-[0.32em]',
  };

  const taglineSizes = {
    sm: 'text-[7px] tracking-[0.22em]',
    md: 'text-[8.5px] tracking-[0.26em]',
    lg: 'text-[11px] tracking-[0.3em]',
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 group select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      id="velora-brand-logo"
    >
      {/* Geometric Luxury Monogram 'V' */}
      <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
        >
          {/* Subtle Outer Diamond Ring */}
          <polygon
            points="50,4 96,50 50,96 4,50"
            stroke={isLight ? 'rgba(255,255,255,0.25)' : '#d4af37'}
            strokeWidth="2"
            strokeDasharray="4 2"
            className="opacity-70"
          />

          {/* Inner Geometric Shield */}
          <polygon
            points="50,12 88,50 50,88 12,50"
            fill={isLight ? 'rgba(255,255,255,0.06)' : '#111318'}
            stroke={isLight ? '#ffffff' : '#c59b27'}
            strokeWidth="2.5"
          />

          {/* Luxury 'V' Facets */}
          <path
            d="M26 30 L50 74 L74 30 H63 L50 58 L37 30 H26Z"
            fill="url(#veloraGoldGradient)"
          />
          <path
            d="M50 74 L63 30 H74 L50 74Z"
            fill="url(#veloraGoldShine)"
            opacity="0.9"
          />
          <circle cx="50" cy="24" r="2.5" fill="#fef08a" />

          {/* Gradients */}
          <defs>
            <linearGradient id="veloraGoldGradient" x1="26" y1="30" x2="74" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fef08a" />
              <stop offset="0.35" stopColor="#eab308" />
              <stop offset="0.7" stopColor="#ca8a04" />
              <stop offset="1" stopColor="#854d0e" />
            </linearGradient>
            <linearGradient id="veloraGoldShine" x1="50" y1="30" x2="74" y2="74" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fffbeb" />
              <stop offset="0.5" stopColor="#d97706" />
              <stop offset="1" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col">
        <div className="flex items-center">
          <span
            className={`font-serif font-black uppercase leading-none transition-colors duration-300 ${
              isLight
                ? 'text-white group-hover:text-amber-200'
                : isGold
                ? 'text-amber-600 group-hover:text-amber-700'
                : 'text-neutral-950 group-hover:text-amber-800'
            } ${titleSizes[size]}`}
            style={{ fontFamily: "'Cinzel', 'Playfair Display', Georgia, serif" }}
          >
            VELORA
          </span>
        </div>

        {showTagline && (
          <span
            className={`font-mono uppercase font-medium mt-1 leading-none ${
              isLight
                ? 'text-white/60'
                : isGold
                ? 'text-amber-700/80'
                : 'text-neutral-500'
            } ${taglineSizes[size]}`}
          >
            Dhaka · Luxury Atelier
          </span>
        )}
      </div>
    </div>
  );
};
