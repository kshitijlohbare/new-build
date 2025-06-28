/**
 * Button.tsx
 * A reusable button component with consistent styling and variants
 */

import React, { ReactNode } from 'react';

export type ButtonVariant = 
  | 'primary'    // Main actions (blue)
  | 'secondary'  // Alternative actions (white)
  | 'success'    // Positive actions (green)
  | 'warning'    // Caution actions (yellow) 
  | 'danger'     // Destructive actions (red)
  | 'ghost';     // Minimal styling

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  id?: string;
  testId?: string;
  ariaLabel?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className = '',
  style = {},
  onClick,
  type = 'button',
  id,
  testId,
  ariaLabel,
}) => {
  // Base classes that all buttons share
  const baseClasses = 'flex items-center justify-center rounded-[8px] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size-specific classes
  const sizeClasses = {
    sm: 'py-1 px-2 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // Variant-specific classes using CSS variables
  const variantClasses = {
    primary: 'bg-[var(--colors-primary-main)] text-[var(--colors-primary-contrast)] hover:bg-[var(--colors-primary-dark)] focus:ring-[var(--colors-primary-main)] disabled:bg-[var(--colors-primary-light)]',
    secondary: 'bg-[var(--colors-neutral-white)] text-[var(--colors-primary-main)] border border-[var(--colors-primary-main)] hover:bg-[var(--colors-background-subtle)] focus:ring-[var(--colors-primary-main)] disabled:text-[var(--colors-text-disabled)] disabled:border-[var(--colors-neutral-mediumGray)]',
    success: 'bg-[var(--colors-feedback-success)] text-white hover:brightness-90 focus:ring-[var(--colors-feedback-success)] disabled:opacity-60',
    warning: 'bg-[var(--colors-secondary-main)] text-black hover:bg-[var(--colors-secondary-dark)] focus:ring-[var(--colors-secondary-main)] disabled:bg-[var(--colors-secondary-light)]',
    danger: 'bg-[var(--colors-feedback-error)] text-white hover:brightness-90 focus:ring-[var(--colors-feedback-error)] disabled:opacity-60',
    ghost: 'bg-transparent text-[var(--colors-primary-main)] hover:bg-[var(--colors-background-subtle)] focus:ring-[var(--colors-primary-main)] disabled:text-[var(--colors-text-disabled)]',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClasses}
    ${className}
  `.trim();
  
  return (
    <button
      id={id}
      data-testid={testId}
      type={type}
      className={buttonClasses}
      style={style}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default React.memo(Button);
