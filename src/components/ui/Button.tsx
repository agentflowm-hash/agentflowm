'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  href?: string;
  external?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  href,
  external,
  className,
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold text-base leading-none
    border rounded-button cursor-pointer
    transition-all duration-200
    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: `
      bg-[var(--color-accent)] text-white border-[var(--color-accent)]
      shadow-glow
      hover:bg-[var(--color-accent-hover)] hover:border-[var(--color-accent-hover)]
      hover:-translate-y-0.5 hover:shadow-glow-strong
    `,
    outline: `
      bg-transparent text-[var(--color-text)] border-[var(--color-border)]
      hover:bg-[var(--color-surface)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]
    `,
    ghost: `
      bg-transparent text-[var(--color-text-muted)] border-transparent
      hover:bg-[var(--color-surface-elevated)] hover:text-[var(--color-text)]
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 min-h-[36px] text-sm',
    md: 'px-6 py-3 min-h-[44px]',
    lg: 'px-8 py-4 min-h-[52px] text-lg',
  };

  const classes = clsx(baseStyles, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener nofollow' : undefined}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
