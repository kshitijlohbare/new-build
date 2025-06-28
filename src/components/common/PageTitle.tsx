/**
 * PageTitle.tsx
 * A reusable component for rendering page titles
 */

import React from 'react';
import '@/styles/HappyMonkeyFont.css';

export interface PageTitleProps {
  title: string;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  testId?: string;
  color?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({
  title,
  className = '',
  style = {},
  id = 'page-title',
  testId = 'page-title',
  color = '#04C4D5'
}) => {
  return (
    <div 
      className={`w-full h-[18px] text-center relative z-20 ${className}`} 
      id={id}
      data-testid={testId}
      style={style}
    >
      <span 
        className={`font-normal text-[16px] leading-[18px] text-center lowercase`}
        id={`${id}-text`}
        data-testid={`${testId}-text`}
        style={{ 
          fontFamily: 'var(--typography-fontFamily-primary)',
          color: color || 'var(--colors-primary-light)' 
        }}
      >
        {title}
      </span>
    </div>
  );
};

export default PageTitle;
