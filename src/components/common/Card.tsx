/**
 * Card.tsx
 * A reusable card component with consistent styling
 */

import React, { ReactNode } from 'react';

export type CardVariant = 
  | 'default'    // Standard card
  | 'primary'    // Primary themed card
  | 'secondary'  // Secondary themed card
  | 'elevated';  // Card with more shadow

export interface CardProps {
  children: ReactNode;
  variant?: CardVariant;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  id?: string;
  testId?: string;
  noPadding?: boolean;
  glassmorphism?: boolean; // Applies a glassmorphism effect
  roundedFull?: boolean; // Uses full rounding (20px)
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  style = {},
  onClick,
  id,
  testId,
  noPadding = false,
  glassmorphism = false,
  roundedFull = false,
}) => {
  // Base classes that all cards share
  const baseClasses = 'flex flex-col';
  
  // Padding classes
  const paddingClasses = noPadding ? '' : 'p-[10px]';
  
  // Variant-specific classes using CSS variables
  const variantClasses = {
    default: 'bg-[var(--colors-neutral-white)]/80',
    primary: glassmorphism ? 'bg-[var(--colors-background-subtle)]/80' : 'bg-[var(--colors-background-subtle)]',
    secondary: glassmorphism ? 'bg-[var(--colors-background-highlight)]/80' : 'bg-[var(--colors-background-highlight)]',
    elevated: 'bg-[var(--colors-neutral-white)]/80 shadow-md',
  };
  
  // Glassmorphism effect
  const glassmorphismClasses = glassmorphism ? 'backdrop-blur-xl' : '';
  
  // Rounding classes
  const roundingClasses = roundedFull ? 'rounded-[20px]' : 'rounded-[8px]';
  
  // Shadow effect using CSS variable
  const shadowClasses = 'shadow-[var(--shadows-DEFAULT)]';
  
  // Click handler
  const clickableClasses = onClick ? 'cursor-pointer hover:shadow-lg transition-shadow duration-200' : '';
  
  // Combine all classes
  const cardClasses = `
    ${baseClasses}
    ${paddingClasses}
    ${variantClasses[variant]}
    ${glassmorphismClasses}
    ${roundingClasses}
    ${shadowClasses}
    ${clickableClasses}
    ${className}
  `.trim();
  
  return (
    <div
      id={id}
      data-testid={testId}
      className={cardClasses}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default React.memo(Card);
