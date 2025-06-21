/**
 * Inspector Changes Utility
 * 
 * This script helps identify and fix differences between normal browsing mode
 * and inspect mode by:
 * 1. Disabling all animations and transitions
 * 2. Forcing consistent spacing and alignment
 * 3. Adding debugging outlines to key UI elements
 */

(function() {
  // Elements that should be checked for centering
  const ELEMENTS_TO_CHECK = [
    '[data-testid="player-controls-center-panel"]', 
    '.input-bar',
    '#delights-input-container'
  ];

  // Add debugging outlines to visualize alignment
  function addDebuggingOutlines() {
    ELEMENTS_TO_CHECK.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.outline = '2px solid red';
        
        // Add center marker
        const centerMarker = document.createElement('div');
        centerMarker.style.position = 'absolute';
        centerMarker.style.width = '2px';
        centerMarker.style.height = '100%';
        centerMarker.style.backgroundColor = 'blue';
        centerMarker.style.left = '50%';
        centerMarker.style.top = '0';
        centerMarker.style.transform = 'translateX(-50%)';
        centerMarker.style.pointerEvents = 'none';
        centerMarker.style.zIndex = '9999';
        
        // Only add if element is positioned relative or absolute
        const position = window.getComputedStyle(el).position;
        if (position === 'relative' || position === 'absolute' || position === 'fixed') {
          el.appendChild(centerMarker);
        }
      });
    });
    
    console.log('Debugging outlines added to elements:', ELEMENTS_TO_CHECK);
  }

  // Force central alignment on elements that need to be centered
  function forceCentralAlignment() {
    ELEMENTS_TO_CHECK.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Get computed style
        const style = window.getComputedStyle(el);
        
        // Only adjust if it's supposed to be centered
        if (style.left === '50%' || 
            style.transform.includes('translateX') || 
            style.margin.includes('auto')) {
          
          el.style.left = '50%';
          el.style.transform = 'translateX(-50%)';
          
          // Force alignment properties
          if (selector.includes('player-controls')) {
            el.style.bottom = '20px';
          }
          
          console.log('Forced central alignment on:', selector);
        }
      });
    });
  }

  // Initialize the fixes
  function init() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runFixes);
    } else {
      runFixes();
    }
  }

  function runFixes() {
    // Apply fixes
    forceCentralAlignment();
    
    // Uncomment to show debugging outlines
    // addDebuggingOutlines();
    
    // Run periodically to catch dynamically added elements
    setInterval(forceCentralAlignment, 1000);
  }

  // Start the fixes
  init();
})();
