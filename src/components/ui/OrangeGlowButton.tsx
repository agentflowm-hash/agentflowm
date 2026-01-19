'use client';

import Link from 'next/link';
import { forwardRef } from 'react';

/**
 * OrangeGlowButton Component
 * Primary CTA button with orange glow effect
 * Variants: primary (orange glow), outline, ghost
 */

interface OrangeGlowButtonProps {
  label: string;
  href?: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  external?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
}

export const OrangeGlowButton = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  OrangeGlowButtonProps
>(({
  label,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  external = false,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}, ref) => {
  
  const sizeClasses = {
    sm: 'px-5 py-2.5 text-sm',
    md: 'px-7 py-3.5 text-base',
    lg: 'px-9 py-4 text-lg',
  };
  
  const variantClasses = {
    primary: `
      relative inline-flex items-center justify-center gap-2
      bg-[var(--color-accent)] text-white font-semibold
      rounded-full border-none cursor-pointer
      transition-all duration-300 ease-out
      shadow-[0_0_20px_var(--color-glow),0_4px_12px_var(--color-shadow)]
      hover:translate-y-[-3px]
      hover:shadow-[0_0_30px_var(--color-glow-strong),0_8px_20px_var(--color-shadow-strong)]
      active:translate-y-[-1px]
      focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-3
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
      before:absolute before:inset-0 before:rounded-full
      before:bg-gradient-to-br before:from-white/25 before:to-transparent
      before:pointer-events-none
    `,
    outline: `
      inline-flex items-center justify-center gap-2
      bg-transparent text-[var(--color-text-muted)] font-medium
      rounded-full border border-[var(--color-border)]
      cursor-pointer transition-all duration-300
      hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]
      hover:border-[var(--color-border-strong)]
      focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
    ghost: `
      inline-flex items-center justify-center gap-2
      bg-transparent text-[var(--color-text-muted)] font-medium
      rounded-full border-none cursor-pointer
      transition-all duration-300
      hover:text-[var(--color-accent)]
      focus-visible:outline-2 focus-visible:outline-[var(--color-accent)] focus-visible:outline-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed
    `,
  };
  
  const classes = `${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
  
  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </>
  );
  
  // External link
  if (href && external) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener nofollow"
        className={classes}
        onClick={onClick}
      >
        {content}
      </a>
    );
  }
  
  // Internal link
  if (href) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  }
  
  // Button
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
});

OrangeGlowButton.displayName = 'OrangeGlowButton';

export default OrangeGlowButton;
