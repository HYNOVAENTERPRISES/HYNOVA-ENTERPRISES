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
  const markSizeClass =
    markClassName ||
    (size === 'sm'
      ? 'h-6 w-auto'
      : size === 'lg'
      ? 'h-11 w-auto'
      : 'h-9 w-auto');

  // SVG Mark component representing the official HYNOVA monogram
  // The 'H' is solid, balanced, and complete with dual-tone uprights and dynamic innovation loop
  const LogoMark = ({ customClass = markSizeClass }: { customClass?: string }) => (
    <svg
      viewBox="140 205 740 350"
      className={`${customClass} shrink-0`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HYNOVA Logo Mark"
    >
      {/* Left slanted solid charcoal bar (unbroken, pristine upright) */}
      <polygon
        points="160,227 310,227 435,490 285,490"
        fill={inverted ? '#FFFFFF' : '#231F20'}
      />
      {/* Right slanted solid crimson bar (unbroken, complete upright) */}
      <polygon
        points="425,227 575,227 700,490 550,490"
        fill="#C01E25"
      />
      {/* Solid crimson crossbar uniting both uprights seamlessly */}
      <polygon
        points="368,345 484,345 508,395 392,395"
        fill="#C01E25"
      />
      {/* Dynamic HYNOVA innovation wing and limitless loop */}
      <path
        fill="#C01E25"
        fillRule="evenodd"
        d="
          M 560,345
          C 625,345 745,355 815,405
          C 855,435 845,480 780,500
          C 700,520 610,480 565,420
          C 595,425 640,455 700,465
          C 755,475 790,455 780,430
          C 760,395 670,375 560,375
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
        <LogoMark customClass="h-24 w-auto mb-3" />
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
