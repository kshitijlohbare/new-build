/**
 * Continuous Spacing Enforcer
 * 
 * This script uses multiple approaches to ensure spacing consistency:
 * 1. Continuous checking and correction at 100ms intervals
 * 2. MutationObserver for real-time monitoring
 * 3. Element attribute freezing to prevent changes
 * 4. Special handling for inspect mode
 */

(function() {
  // Configuration
  const config = {
    selectors: {
      daily: '.daily-practice-todo-list',
      delights: '#delights-input-container'
    },
    styles: {
      padding: '16px',
      margin: '12px 0',
      gap: '8px',
      boxSizing: 'border-box'
    },
    interval: 1000, // Less frequent checks (1000ms instead of 100ms)
    duration: 5000, // Run for only 5 seconds instead of 30
    logEnabled: false // Disable logging to reduce overhead
  };

  // State
  let intervalId = null;
  let startTime = null;
  let fixCount = 0;
  
  // Start enforcing consistent spacing
  function startEnforcing() {
    console.log('🔄 Starting continuous spacing enforcement');
    startTime = Date.now();
    
    // Immediate fix
    enforceSpacing();
    
    // Set up continuous checking
    intervalId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      
      // After duration, stop continuous checking
      if (elapsed > config.duration) {
        stopContinuousChecking();
        return;
      }
      
      enforceSpacing();
    }, config.interval);
    
    // Set up MutationObserver for real-time monitoring
    const observer = new MutationObserver((mutations) => {
      let needsFixing = false;
      
      for (const mutation of mutations) {
        // Check if this mutation affects our target elements
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          const target = mutation.target;
          if (target.matches && (
              target.matches(config.selectors.daily) ||
              target.matches(config.selectors.delights)
          )) {
            needsFixing = true;
            break;
          }
        }
        
        // Check for added or changed nodes
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // Element node
              if (node.matches && (
                  node.matches(config.selectors.daily) ||
                  node.matches(config.selectors.delights) ||
                  node.querySelector(config.selectors.daily) ||
                  node.querySelector(config.selectors.delights)
              )) {
                needsFixing = true;
                break;
              }
            }
          }
        }
      }
      
      if (needsFixing) {
        enforceSpacing();
      }
    });
    
    // Start observing the entire document
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['style', 'class']
    });
    
    // Set up event listeners for key events
    window.addEventListener('resize', enforceSpacing);
    document.addEventListener('scroll', debounce(enforceSpacing, 50));
    document.addEventListener('click', debounce(enforceSpacing, 50));
    document.addEventListener('keyup', debounce(enforceSpacing, 50));
    
    // Special case for React hydration
    window.addEventListener('load', () => {
      setTimeout(enforceSpacing, 500);
      setTimeout(enforceSpacing, 1500);
      setTimeout(enforceSpacing, 3000);
    });
  }
  
  // Stop continuous checking, but keep event listeners
  function stopContinuousChecking() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      console.log(`🔄 Stopping continuous checks. Applied ${fixCount} fixes.`);
      console.log('⚠️ Still monitoring via events and MutationObserver.');
    }
  }
  
  // Main function to enforce spacing consistency
  function enforceSpacing() {
    const dailyElement = document.querySelector(config.selectors.daily);
    const delightsElement = document.querySelector(config.selectors.delights);
    
    let applied = false;
    
    if (dailyElement) {
      applied = applyStyles(dailyElement) || applied;
    }
    
    if (delightsElement) {
      applied = applyStyles(delightsElement) || applied;
    }
    
    if (applied) {
      fixCount++;
      
      if (config.logEnabled && fixCount % 10 === 0) {
        console.log(`🔄 Applied ${fixCount} spacing fixes so far`);
      }
    }
    
    return applied;
  }
  
  // Apply consistent styles to an element
  function applyStyles(element) {
    // Check if the element already has the correct styles
    const currentStyles = window.getComputedStyle(element);
    const paddingCorrect = 
      currentStyles.paddingTop === config.styles.padding &&
      currentStyles.paddingRight === config.styles.padding &&
      currentStyles.paddingBottom === config.styles.padding &&
      currentStyles.paddingLeft === config.styles.padding;
    
    const gapCorrect = currentStyles.gap === config.styles.gap;
    const boxSizingCorrect = currentStyles.boxSizing === config.styles.boxSizing;
    
    // If styles are already correct, no need to apply again
    if (paddingCorrect && gapCorrect && boxSizingCorrect) {
      return false;
    }
    
    // Apply styles directly with !important
    element.style.setProperty('padding', config.styles.padding, 'important');
    element.style.setProperty('margin', config.styles.margin, 'important');
    element.style.setProperty('gap', config.styles.gap, 'important');
    element.style.setProperty('box-sizing', config.styles.boxSizing, 'important');
    
    // Mark the element as fixed
    element.setAttribute('data-continuous-fixed', 'true');
    
    // Apply additional class with css rules
    element.classList.add('consistent-spacing-fixed');
    
    // Freeze the element's style to prevent changes
    freezeElementStyles(element);
    
    return true;
  }
  
  // Freeze element styles to prevent changes
  function freezeElementStyles(element) {
    // Use Object.defineProperty to prevent style changes
    const elementStyle = element.style;
    const cssProps = ['padding', 'margin', 'gap', 'boxSizing'];
    
    cssProps.forEach(prop => {
      try {
        // Create a descriptor that returns our fixed value and ignores sets
        const value = config.styles[prop];
        
        Object.defineProperty(elementStyle, prop, {
          get: function() { return value; },
          set: function() { return value; }, // Silently ignore attempts to change
          configurable: true // Allow redefinition in case this causes issues
        });
      } catch (e) {
        // If this fails, we still have the !important styles
      }
    });
  }
  
  // Helper function to debounce events
  function debounce(func, delay) {
    let timeout;
    return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), delay);
    };
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEnforcing);
  } else {
    startEnforcing();
  }
})();
