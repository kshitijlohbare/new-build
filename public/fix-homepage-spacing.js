/**
 * Fix Homepage Spacing - Ultra-Aggressive Version
 * 
 * This script specifically targets and enforces consistent spacing for:
 * - .daily-practice-todo-list
 * - #delights-input-container
 * 
 * It runs on page load, watches for DOM changes, and uses multiple techniques
 * to ensure consistent spacing between browsing and inspect modes.
 */

(function() {
  const DEBUG = true; // Set to true for debugging info
  
  // Log debug messages
  function logDebug(...args) {
    if (DEBUG) {
      console.log('[Homepage Spacing Fix]', ...args);
    }
  }
  
  // All possible style properties we want to enforce for consistency
  const ENFORCED_STYLES = {
    dailyPracticeList: {
      'padding': '20px 10px',
      'gap': '10px',
      'box-sizing': 'border-box',
      'width': '100%',
      'background': '#F5F5F5',
      'border-radius': '20px',
      'display': 'flex',
      'flex-direction': 'column',
      'justify-content': 'flex-start',
      'align-items': 'flex-start',
      'overflow': 'hidden',
      'margin': '0'
    },
    delightsContainer: {
      'padding': '0 16px',
      'background-color': '#FFD400',
      'border': '2px solid white',
      'box-sizing': 'border-box',
      'position': 'fixed',
      'bottom': '20px',
      'left': '50%',
      'transform': 'translateX(-50%)',
      'width': 'calc(100% - 40px)',
      'max-width': '500px',
      'border-radius': '50px',
      'z-index': '1000'
    }
  };
  
  // Fix specific elements by force setting their styles
  function fixHomepageSpacing() {
    logDebug('Running homepage spacing fix (ultra-aggressive)...');
    
    // Create stylesheet if it doesn't exist
    if (!window._spacingFixStylesheet) {
      window._spacingFixStylesheet = document.createElement('style');
      window._spacingFixStylesheet.id = 'spacing-fix-stylesheet';
      window._spacingFixStylesheet.innerHTML = `
        /* Ultra-specific daily-practice-todo-list styles */
        .daily-practice-todo-list,
        div.daily-practice-todo-list,
        .daily-practices-container .daily-practice-todo-list,
        .daily-practices-container > .daily-practice-todo-list,
        #root .daily-practices-container .daily-practice-todo-list {
          padding: 20px 10px !important;
          gap: 10px !important;
          box-sizing: border-box !important;
          width: 100% !important;
          background: #F5F5F5 !important;
          border-radius: 20px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: flex-start !important;
          align-items: flex-start !important;
          overflow: hidden !important;
          margin: 0 !important;
        }
        
        /* Ultra-specific delights-input-container styles */
        #delights-input-container,
        div#delights-input-container,
        .input-bar#delights-input-container {
          padding: 0 16px !important;
          background-color: #FFD400 !important;
          border: 2px solid white !important;
          box-sizing: border-box !important;
          position: fixed !important;
          bottom: 20px !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          width: calc(100% - 40px) !important;
          max-width: 500px !important;
          border-radius: 50px !important;
          z-index: 1000 !important;
        }
      `;
      document.head.appendChild(window._spacingFixStylesheet);
      logDebug('Added spacing fix stylesheet to head');
    }
    
    // ------ daily-practice-todo-list fix ------
    const dailyPracticeList = document.querySelectorAll('.daily-practice-todo-list');
    logDebug(`Found ${dailyPracticeList.length} daily practice list elements`);
    
    dailyPracticeList.forEach((element, index) => {
      // Apply force styles directly
      Object.entries(ENFORCED_STYLES.dailyPracticeList).forEach(([prop, value]) => {
        element.style.setProperty(prop, value, 'important');
      });
      
      // Add unique attribute markers
      element.setAttribute('data-fixed-spacing', 'true');
      element.setAttribute('data-spacing-check', Date.now());
      
      logDebug(`Fixed daily practice list #${index}`, element);
    });
    
    // ------ delights-input-container fix ------
    const delightsContainer = document.getElementById('delights-input-container');
    if (delightsContainer) {
      // Apply force styles directly
      Object.entries(ENFORCED_STYLES.delightsContainer).forEach(([prop, value]) => {
        delightsContainer.style.setProperty(prop, value, 'important');
      });
      
      // Add unique attribute markers
      delightsContainer.setAttribute('data-fixed-spacing', 'true');
      delightsContainer.setAttribute('data-spacing-check', Date.now());
      
      logDebug('Fixed delights container', delightsContainer);
    } else {
      logDebug('Delights container not found');
    }
  }
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixHomepageSpacing);
  } else {
    fixHomepageSpacing();
  }
  
  // Run after window fully loads (for any delayed elements)
  window.addEventListener('load', fixHomepageSpacing);
  
  // Watch for DOM changes and fix new elements
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0 || 
          mutation.type === 'attributes' || 
          mutation.attributeName === 'style') {
        shouldRun = true;
      }
    });
    
    if (shouldRun) {
      logDebug('DOM changed, reapplying fixes');
      fixHomepageSpacing();
    }
  });
  
  // Start observing once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    });
  } else {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  // Also make a delayed run to catch any dynamic content
  setTimeout(fixHomepageSpacing, 1000);
  setTimeout(fixHomepageSpacing, 3000);
  
  // Create global function to force fix on demand
  window.forceFixHomepageSpacing = fixHomepageSpacing;
  
  logDebug('Spacing fix script initialized');
})()
  
  // Run on page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixHomepageSpacing);
  } else {
    fixHomepageSpacing();
  }
  
  // Run after window fully loads (for any delayed elements)
  window.addEventListener('load', fixHomepageSpacing);
  
  // Watch for DOM changes and fix new elements
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0 || 
          mutation.type === 'attributes' || 
          mutation.attributeName === 'style') {
        shouldRun = true;
      }
    });
    
    if (shouldRun) {
      logDebug('DOM changed, reapplying fixes');
      fixHomepageSpacing();
    }
  });
  
  // Start observing once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
      });
    });
  } else {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }
  
  // Also make a delayed run to catch any dynamic content
  setTimeout(fixHomepageSpacing, 1000);
  setTimeout(fixHomepageSpacing, 3000);
  
  // Intercept any appendChild or insertBefore calls that might add dynamic content
  const originalAppendChild = Element.prototype.appendChild;
  Element.prototype.appendChild = function() {
    const result = originalAppendChild.apply(this, arguments);
    setTimeout(fixHomepageSpacing, 0);
    return result;
  };
  
  const originalInsertBefore = Element.prototype.insertBefore;
  Element.prototype.insertBefore = function() {
    const result = originalInsertBefore.apply(this, arguments);
    setTimeout(fixHomepageSpacing, 0);
    return result;
  };
  
  // Create global function to force fix on demand
  window.forceFixHomepageSpacing = fixHomepageSpacing;
  
  logDebug('Spacing fix script initialized');
})();
