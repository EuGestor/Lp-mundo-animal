import React from 'react';

interface LogoProps {
  /** `light` = sobre fundo claro (texto verde); `dark` = sobre fundo escuro (texto creme) */
  variant?: 'light' | 'dark';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ variant = 'light', className = '' }) => {
  const dark = variant === 'dark';
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src="/assets/marca/ma-monograma.svg"
        alt=""
        width={48}
        height={48}
        className={`h-11 w-11 sm:h-12 sm:w-12 shrink-0 rounded-full ${dark ? 'ring-1 ring-brand-orange/40' : ''}`}
      />
      <span className="flex flex-col items-start leading-none text-left">
        <span
          className={`font-display font-semibold text-lg sm:text-2xl tracking-tight ${
            dark ? 'text-cream' : 'text-brand-green-dark'
          }`}
        >
          Mundo Animal
        </span>
        <span
          className={`mt-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.2em] ${
            dark ? 'text-brand-orange' : 'text-gold-ink'
          }`}
        >
          Pet Shop · desde 1998
        </span>
      </span>
    </span>
  );
};

export default Logo;
