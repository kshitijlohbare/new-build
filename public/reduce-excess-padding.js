/**
 * Reduce Padding Between Browsing and Inspect Modes
 * 
 * This script reduces excess padding in browsing mode by applying more
 * compact spacing similar to what's seen in inspect mode.
 */

(function() {
  const DEBUG = false; // Set to true for debugging information

  function logDebug(message, ...args) {
    if (DEBUG) {
      console.log(`[Padding Fix] ${message}`, ...args);
    }
  }

  // Specific element fixes based on known issues
  const specificFixes = [
    {
      selector: '#concepts-grid > div',
      styles: { padding: '6px', gap: '4px' }
    },
    {
      selector: '#concepts-grid [id^="concept-header-"]',
      styles: { gap: '4px', padding: '0', minHeight: '28px' }
    },
    {
      selector: '#concepts-grid [id^="concept-category-"]',
      styles: { padding: '2px 6px', minWidth: '60px', height: '22px' }
    },
    {
      selector: '#concepts-grid [id^="concept-description-row-"]',
      styles: { gap: '4px', minHeight: '26px', marginTop: '2px' }
    },
    {
      selector: '#concepts-grid [id^="expand-button-"]',
      styles: { padding: '2px 6px', minWidth: '36px', height: '22px' }
    },
    {
      selector: '#concepts-grid [id^="expanded-content-"]',
      styles: { padding: '8px', marginTop: '4px' }
    },
    {
      selector: '#practices-container .practice-card',
      styles: { padding: '8px', gap: '4px' }
    },
    {
      selector: '#practices-filter-chips-container, #learn-filter-chips-container',
      styles: { padding: '0 4px', gap: '6px' }
    },
    {
      selector: '.mobile-home-container, .mobile-home-root, #practices-page, #learn-page',
      styles: { padding: '12px' }
    }
  ];

  function applyCompactPadding() {
    logDebug('Applying compact padding...');
    
    // Add a class to body to help with CSS targeting
    document.body.classList.add('compact-padding-mode');
    
    // Apply specific fixes
    specificFixes.forEach(fix => {
      try {
        const elements = document.querySelectorAll(fix.selector);
        logDebug(`Fixing ${elements.length} elements matching: ${fix.selector}`);
        
        elements.forEach(element => {
          if (!element || !(element instanceof Element)) return;
          
          // Apply each style property
          Object.entries(fix.styles).forEach(([property, value]) => {
            // Only override if current value seems excessive
            const currentValue = window.getComputedStyle(element)[property];
            
            // For numeric properties like padding, compare values
            if (property.includes('padding') || property.includes('margin') || property.includes('gap')) {
              // Extract numeric value (removing px)
              const currentNumeric = parseInt(currentValue) || 0;
              const newNumeric = parseInt(value) || 0;
              
              // Only apply if current padding is larger than what we want
              if (currentNumeric > newNumeric) {
                element.style[property] = value + (value.includes('px') ? '' : 'px');
                logDebug(`Reduced ${property} from ${currentValue} to ${value} for`, element);
              }
            } else {
              // For other properties, just apply
              element.style[property] = value;
            }
          });
          
          // Mark as fixed
          element.dataset.paddingFixed = 'true';
        });
      } catch (e) {
        logDebug('Error applying fix:', e);
      }
    });
  }

  function removeRedundantPadding() {
    // Find elements with excessive padding
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      // Skip elements that have been explicitly fixed
      if (element.dataset.paddingFixed === 'true') return;
      
      const style = window.getComputedStyle(element);
      
      // Check for excessive padding
      const paddingTop = parseInt(style.paddingTop) || 0;
      const paddingRight = parseInt(style.paddingRight) || 0;
      const paddingBottom = parseInt(style.paddingBottom) || 0;
      const paddingLeft = parseInt(style.paddingLeft) || 0;
      
      // If padding seems excessive and element has certain classes/ids
      if ((paddingTop > 16 || paddingRight > 16 || paddingBottom > 16 || paddingLeft > 16) &&
          (element.id.includes('container') || 
           element.className.includes('container') || 
           element.className.includes('card') ||
           element.className.includes('section'))) {
        
        // Reduce padding proportionally but maintain ratio
        element.style.padding = `${Math.min(paddingTop, 12)}px ${Math.min(paddingRight, 12)}px ${Math.min(paddingBottom, 12)}px ${Math.min(paddingLeft, 12)}px`;
        logDebug('Reduced excessive padding for', element);
      }
    });
  }
  
  function fixPadding() {
    applyCompactPadding();
    setTimeout(removeRedundantPadding, 100);
  }
  
  // Run when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fixPadding);
  } else {
    fixPadding();
  }
  
  // Run again after window fully loads
  window.addEventListener('load', fixPadding);
  
  // Run after route changes for single page applications
  window.addEventListener('popstate', fixPadding);
  
  // Run once more after a delay to catch any dynamic content
  setTimeout(fixPadding, 1000);
  
  // Create a simple style tag to reset some base values
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .compact-padding-mode [class*="gap-"] {
      gap: 4px !important;
    }
    .compact-padding-mode [class*="p-"], .compact-padding-mode [class*="px-"], .compact-padding-mode [class*="py-"] {
      padding: 4px !important;
    }
  `;
  document.head.appendChild(styleTag);
})();
