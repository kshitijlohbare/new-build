/**
 * Fix Inconsistent Padding Between Browsing and Inspect Modes
 * 
 * This script ensures padding dimensions remain consistent between normal browsing
 * and when the browser DevTools are open (inspect mode).
 */

(function() {
  const DEBUG = false; // Set to true for debugging information

  function logDebug(message, ...args) {
    if (DEBUG) {
      console.log(`[Padding Fix] ${message}`, ...args);
    }
  }

  function fixInconsistentPadding() {
    logDebug('Running padding consistency fix...');
    
    // Set data attribute to document for CSS targeting
    document.documentElement.setAttribute('data-consistent-padding', 'true');
    
    // Get computed styles from inspect mode and enforce in browsing
    const elementsToFix = [
      // Layout containers
      '#root', '.app-container', 'main', '.content-container',
      // Page-specific containers
      '#learn-page', '#practices-page', '#focus-timer-page', '.mobile-home-container',
      // Common components
      '[id$="-container"]', '.card', '[class*="card"]', '.input-container',
      // Grid containers
      '#concepts-grid > div', '#practices-container .practice-card'
    ];
    
    // Convert NodeList to Array and add specificity
    const allElements = [];
    elementsToFix.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          if (!allElements.includes(element)) {
            allElements.push(element);
          }
        });
      } catch (e) {
        logDebug('Error selecting elements:', e);
      }
    });
    
    logDebug(`Found ${allElements.length} elements to fix`);      // Fix each element
    allElements.forEach(element => {
      if (!element || !(element instanceof Element)) return;

      try {
        // Get computed style
        const computedStyle = window.getComputedStyle(element);
        const paddingTop = computedStyle.paddingTop;
        const paddingRight = computedStyle.paddingRight;
        const paddingBottom = computedStyle.paddingBottom;
        const paddingLeft = computedStyle.paddingLeft;
        
        // Convert padding values to numbers for comparison
        const paddingTopValue = parseInt(paddingTop);
        const paddingRightValue = parseInt(paddingRight);
        const paddingBottomValue = parseInt(paddingBottom);
        const paddingLeftValue = parseInt(paddingLeft);
        
        // Normalize large padding values
        const normalizedPaddingTop = paddingTopValue > 20 ? Math.min(paddingTopValue, 24) + 'px' : paddingTop;
        const normalizedPaddingRight = paddingRightValue > 20 ? Math.min(paddingRightValue, 24) + 'px' : paddingRight;
        const normalizedPaddingBottom = paddingBottomValue > 20 ? Math.min(paddingBottomValue, 24) + 'px' : paddingBottom;
        const normalizedPaddingLeft = paddingLeftValue > 20 ? Math.min(paddingLeftValue, 24) + 'px' : paddingLeft;
        
        // Store the original padding as a data attribute
        element.dataset.originalPaddingTop = paddingTop;
        element.dataset.originalPaddingRight = paddingRight;
        element.dataset.originalPaddingBottom = paddingBottom;
        element.dataset.originalPaddingLeft = paddingLeft;
        
        // Set CSS custom properties for reference
        element.style.setProperty('--original-padding-top', paddingTop);
        element.style.setProperty('--original-padding-right', paddingRight);
        element.style.setProperty('--original-padding-bottom', paddingBottom);
        element.style.setProperty('--original-padding-left', paddingLeft);
        
        // Set normalized padding values as CSS custom properties
        element.style.setProperty('--normalized-padding-top', normalizedPaddingTop);
        element.style.setProperty('--normalized-padding-right', normalizedPaddingRight);
        element.style.setProperty('--normalized-padding-bottom', normalizedPaddingBottom);
        element.style.setProperty('--normalized-padding-left', normalizedPaddingLeft);
        
        // If any padding value is large, add a specific class
        if (paddingTopValue > 20 || paddingRightValue > 20 || 
            paddingBottomValue > 20 || paddingLeftValue > 20) {
          element.classList.add('large-padding-fixed');
        }
        
        // Add a class that we can use to restore padding
        element.classList.add('padding-fixed');
        
        logDebug('Fixed element:', element, {
          id: element.id || 'no-id',
          class: element.className,
          originalPadding: `${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft}`,
          normalizedPadding: `${normalizedPaddingTop} ${normalizedPaddingRight} ${normalizedPaddingBottom} ${normalizedPaddingLeft}`
        });
      } catch (e) {
        logDebug('Error processing element:', e);
      }
    });
    
    // Mark the body as loaded to allow animations again
    setTimeout(() => {
      document.body.classList.add('loaded');
    }, 300);
  }
  
  // Run when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixInconsistentPadding);
  } else {
    fixInconsistentPadding();
  }
  
  // Run again after window fully loads
  window.addEventListener('load', fixInconsistentPadding);
  
  // Run after route changes for single page applications
  window.addEventListener('popstate', fixInconsistentPadding);
  
  // Also run when DOM changes significantly
  const observer = new MutationObserver(mutations => {
    let shouldRun = false;
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        shouldRun = true;
      }
    });
    
    if (shouldRun) {
      logDebug('DOM changed, re-running fix');
      fixInconsistentPadding();
    }
  });
  
  // Start observing once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { childList: true, subtree: true });
    });
  } else {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  
  // Run once more after a short delay to catch any dynamically loaded content
  setTimeout(fixInconsistentPadding, 1000);
  setTimeout(fixInconsistentPadding, 3000);
})();
