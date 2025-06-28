/**
 * BackToTopButton.tsx
 * A reusable button component that appears when scrolling down
 * and allows users to quickly return to the top of the page
 */

import React, { useState, useEffect, useCallback } from 'react';
import './BackToTopButton.css';

interface BackToTopButtonProps {
  threshold?: number;
  smoothScroll?: boolean;
  className?: string;
  ariaLabel?: string;
  testId?: string;
}

const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  threshold = 300, // Show button after scrolling 300px
  smoothScroll = true,
  className = '',
  ariaLabel = 'Back to top',
  testId = 'back-to-top-button'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Check scroll position and update button visibility
  const checkScrollPosition = useCallback(() => {
    const currentScrollPos = window.scrollY;
    setIsVisible(currentScrollPos > threshold);
  }, [threshold]);
  
  // Scroll to top handler
  const scrollToTop = useCallback(() => {
    if (smoothScroll) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [smoothScroll]);
  
  // Add scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', checkScrollPosition);
    
    // Initial check
    checkScrollPosition();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', checkScrollPosition);
    };
  }, [checkScrollPosition]);
  
  // Add keyboard shortcut for "Home" key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Home' && !event.ctrlKey && !event.metaKey) {
        scrollToTop();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollToTop]);

  // Don't render if not visible
  if (!isVisible) return null;
  
  return (
    <button 
      className={`back-to-top-button ${className}`}
      onClick={scrollToTop}
      aria-label={ariaLabel}
      data-testid={testId}
      title="Back to top (Home key)"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15"></polyline>
      </svg>
    </button>
  );
};

export default React.memo(BackToTopButton);
