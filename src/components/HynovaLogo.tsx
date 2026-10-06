import React from 'react';

interface HynovaLogoProps {
  variant?: 'full' | 'mark' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  markClassName?: string;
  showTagline?: boolean;
  inverted?: boolean;
  onClick?: () => void;
}

export const HynovaLogo: React.FC<HynovaLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  className = '',
  markClassName,
  showTagline = true,
  inverted = false,
  onClick,
}) => {
  const markSizeClass = markClassName || (size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9');
  // SVG Mark component representing the official HYNOVA monogram
  const LogoMark = ({ customClass = markSizeClass }: { customClass?: string }) => (
    <svg
      viewBox="120 200 750 360"
      className={`${customClass} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HYNOVA Logo Mark"
    >
      {/* Left slanted dark charcoal bar */}
      <polygon
        points="160,227 326,227 451,490 305,490"
        fill={inverted ? '#FFFFFF' : '#231F20'}
      />

      {/* Red stylized dynamic Hynova wing, stem, and infinity loop */}
      <path
        fillRule="evenodd"
        fill="#C01E25"
        d="
          M 418,227
          L 584,227
          L 556,285
          C 544,310 535,335 528,362
          C 560,363 605,365 655,372
          C 745,385 830,420 845,465
          C 858,505 815,532 755,535
          C 660,540 575,505 520,430
          L 508,490
          L 370,490
          L 415,395
          L 252,395
          L 242,400
          L 212,400
          L 225,392
          L 200,392
          L 138,368
          L 248,365
          L 426,365
          L 458,295
          Z
          M 588,415
          C 645,410 735,420 760,450
          C 775,470 755,490 705,495
          C 645,500 580,470 548,435
          C 560,425 574,418 588,415
          Z
        "
      />
    </svg>
  );

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`} onClick={onClick}>
        <LogoMark />
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div
        className={`flex flex-col items-center text-center select-none ${className}`}
        onClick={onClick}
      >
        <LogoMark customClass="w-28 h-28 mb-3" />
        <span className="font-extrabold text-xl tracking-wide text-[#C01E25]">
          HYNOVA ENTERPRISES
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-semibold tracking-[0.28em] uppercase mt-0.5 ${
              inverted ? 'text-white/80' : 'text-[#231F20]'
            }`}
          >
            LIMITLESS ACCESS
          </span>
        )}
      </div>
    );
  }

  // Horizontal variant (default) - optimal for Navbars and Footers
  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-center">
        <LogoMark />
      </div>
      <div className="flex flex-col leading-none">
        <div className="flex items-center">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#C01E25]">
            HYNOVA
          </span>
          <span
            className={`ml-1 font-bold text-sm sm:text-base tracking-tight ${
              inverted ? 'text-white' : 'text-[#231F20]'
            }`}
          >
            ENTERPRISES
          </span>
        </div>
        {showTagline && (
          <span
            className={`text-[8.5px] sm:text-[9.5px] font-semibold tracking-[0.24em] uppercase mt-0.5 ${
              inverted ? 'text-white/70' : 'text-[#5C4D50]'
            }`}
          >
            LIMITLESS ACCESS
          </span>
        )}
      </div>
    </div>
  );
};
