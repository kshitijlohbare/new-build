/**
 * Header Gradient Update
 * This script ensures all headers, navbars, and navigation elements use the specified gradient
 */

(function() {
  // The gradient to apply
  const HEADER_GRADIENT = 'linear-gradient(180deg, #49DAEA 0%, rgba(196, 254, 255, 0.2) 100%)';
  
  // List of selectors to apply the gradient to
  const HEADER_SELECTORS = [
    '#main-header-bar',
    'header:not(#home-header)',
    'nav',
    '.app-navbar',
    '.navbar',
    '.header-bar',
    '.app-header',
    '.nav-bar',
    '[class*="header"]:not(.welcome-header)',
    '[class*="navbar"]'
  ];
  
  // Function to apply the gradient
  function applyGradient() {
    HEADER_SELECTORS.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Skip welcome-header and home-header elements
        if (el.classList.contains('welcome-header') || el.id === 'home-header') {
          // Remove any background gradient if present
          if (el.id === 'home-header') {
            el.style.background = '#FCDF4D';
          } else {
            el.style.background = 'transparent';
          }
          return;
        }
        el.style.background = HEADER_GRADIENT;
      });
    });
  }
  
  // Apply only once at page load and once after a short delay
  // This covers most cases without the overhead of constant observation
  
  // Initial application
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyGradient();
      // Apply once more after a delay to catch dynamically added elements
      setTimeout(applyGradient, 1000);
    });
  } else {
    applyGradient();
    // Apply once more after a delay to catch dynamically added elements
    setTimeout(applyGradient, 1000);
  }
})();
