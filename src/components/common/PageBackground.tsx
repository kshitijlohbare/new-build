/**
 * PageBackground.tsx
 * A reusable component for rendering page backgrounds
 */

import React, { ReactNode } from 'react';

export interface PageBackgroundProps {
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  testId?: string;
  gradient?: boolean;
}

const PageBackground: React.FC<PageBackgroundProps> = ({
  children,
  className = '',
  style = {},
  id = 'page-background-container',
  testId = 'page-background-container',
  gradient = true
}) => {
  return (
    <div 
      className={`fixed top-0 left-0 w-full h-screen overflow-hidden z-0 pointer-events-auto p-0 ${className}`}
      id={id}
      data-testid={testId}
      style={{
        ...style,
        background: gradient
          ? 'linear-gradient(to bottom, var(--colors-background-subtle), var(--colors-neutral-white))'
          : style.background || 'var(--colors-background-default)'
      }}
    >
      {children}
    </div>
  );
};

export default PageBackground;
