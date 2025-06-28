/**
 * PageBackgroundImproved.tsx
 * An enhanced version of PageBackground for practitioner onboarding pages
 */

import React, { ReactNode } from 'react';
import '@/styles/PractitionerOnboardingStyles.css';

export interface PageBackgroundImprovedProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  gradient?: boolean;
}

/**
 * PageBackgroundImproved component - An enhanced background component
 * Provides a styled container with optional gradient background
 */
const PageBackgroundImproved: React.FC<PageBackgroundImprovedProps> = ({
  children,
  className = '',
  style = {},
  gradient = true
}) => {
  return (
    <div 
      className={`min-h-screen bg-background py-10 ${className}`}
      style={{
        ...style,
        background: gradient
          ? 'linear-gradient(135deg, var(--background-subtle) 0%, var(--background-color) 100%)'
          : style.background || 'var(--background-color)'
      }}
    >
      {children}
    </div>
  );
};

export default PageBackgroundImproved;
