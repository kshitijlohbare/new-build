import { useState, useEffect, RefObject } from 'react';

/**
 * Hook to handle visual viewport changes, particularly useful for adjusting 
 * input elements when the mobile keyboard appears.
 * 
 * @returns An object with viewport height information
 */
export function useVisualViewport() {
  const [viewport, setViewport] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
    offsetTop: 0,
  });
  
  useEffect(() => {
    // Check if Visual Viewport API is available
    const visualViewport = window.visualViewport;
    
    if (!visualViewport) {
      return;
    }

    const onResize = () => {
      setViewport({
        height: visualViewport.height,
        width: visualViewport.width,
        offsetTop: visualViewport.offsetTop,
      });
    };

    const onScroll = () => {
      setViewport(prevState => ({
        ...prevState,
        offsetTop: visualViewport.offsetTop,
      }));
    };

    // Add event listeners
    visualViewport.addEventListener('resize', onResize);
    visualViewport.addEventListener('scroll', onScroll);
    
    // Initial call to set the viewport
    onResize();
    
    // Cleanup event listeners
    return () => {
      visualViewport.removeEventListener('resize', onResize);
      visualViewport.removeEventListener('scroll', onScroll);
    };
  }, []);
  
  return viewport;
}

/**
 * Hook to adjust an input element's position when the keyboard appears
 * 
 * @param inputRef Reference to the input element
 * @returns An object with functions to handle focus and blur events
 */
export function useKeyboardAwareInput(inputRef: RefObject<HTMLInputElement | HTMLTextAreaElement>) {
  const viewport = useVisualViewport();
  const [isFocused, setIsFocused] = useState(false);
  
  useEffect(() => {
    if (!inputRef.current || !isFocused) return;
    
    const input = inputRef.current;
    const inputRect = input.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const viewportHeight = viewport.height;
    
    // Only adjust if the viewport height is less than window height (keyboard is open)
    if (viewportHeight < windowHeight) {
      const inputBottom = inputRect.bottom;
      const viewportBottom = viewportHeight;
      
      // Calculate if the input is hidden behind the keyboard
      if (inputBottom > viewportBottom) {
        // Calculate the amount we need to scroll to make the input visible
        const scrollAmount = inputBottom - viewportBottom + 20; // 20px padding
        
        // Adjust the scroll position
        window.scrollBy({
          top: scrollAmount,
          behavior: 'smooth'
        });
        
        // For iOS Safari, sometimes we need to focus the input again
        setTimeout(() => {
          input.focus();
        }, 100);
      }
    }
  }, [inputRef, viewport, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };
  
  return { handleFocus, handleBlur, isFocused };
}
