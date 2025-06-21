/**
 * Lightweight Direct DOM Spacing Fix
 * 
 * This is a simplified version that only applies fixes once at page load
 * and on crucial events, without continuous monitoring that can cause performance issues.
 */

(function() {
  // Constants for target elements and desired spacing
  const DAILY_PRACTICE_SELECTOR = '.daily-practice-todo-list';
  const DELIGHTS_INPUT_SELECTOR = '#delights-input-container';
  const TARGET_PADDING = '16px';
  const TARGET_MARGIN = '12px 0';
  const TARGET_GAP = '8px';
  
  // Wait for DOM to be fully loaded and hydrated
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyFixOnce);
  } else {
    // Small delay to ensure React hydration is complete
    setTimeout(applyFixOnce, 300);
  }
  
  // Run another fix after window load (when all assets are loaded)
  window.addEventListener('load', function() {
    setTimeout(applyFixOnce, 500);
  });
  
  // Apply fix once after navigation events
  window.addEventListener('popstate', applyFixOnce);
  
  // Main function to apply spacing fix once
  function applyFixOnce() {
    // Get the target elements
    const dailyPractice = document.querySelector(DAILY_PRACTICE_SELECTOR);
    const delightsInput = document.querySelector(DELIGHTS_INPUT_SELECTOR);
    
    // Apply fixes if elements exist
    if (dailyPractice && !dailyPractice.hasAttribute('data-spacing-fixed')) {
      fixElement(dailyPractice);
    }
    
    if (delightsInput && !delightsInput.hasAttribute('data-spacing-fixed')) {
      fixElement(delightsInput);
    }
  }
  
  // Apply spacing fix to a specific element
  function fixElement(element) {
    // Apply styles directly to the element
    element.style.cssText = `
      padding: ${TARGET_PADDING} !important;
      margin: ${TARGET_MARGIN} !important;
      gap: ${TARGET_GAP} !important;
      box-sizing: border-box !important;
      display: flex !important;
      flex-direction: column !important;
    `;
    
    // Mark the element as fixed
    element.setAttribute('data-spacing-fixed', 'true');
  }
})();
