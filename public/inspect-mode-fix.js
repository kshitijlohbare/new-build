/**
 * Inspect Mode Spacing Fix
 * 
 * This script ensures that spacing remains consistent when using browser dev tools (inspect mode)
 * It handles cases where browser dev tools might modify element styles or when React hydrates differently
 * during inspection.
 */

(function() {
  // Configuration
  const config = {
    targets: {
      dailyPractice: '.daily-practice-todo-list',
      delightsInput: '#delights-input-container'
    },
    spacing: {
      padding: '16px',
      margin: '12px 0',
      gap: '8px'
    },
    // Detect DevTools opening by listening to specific events and CSS changes
    devToolsDetection: {
      checkInterval: 1000,  // How often to check for DevTools (in ms)
      cssProps: ['resize', 'animation', 'cursor']  // CSS properties that might change when DevTools opens
    }
  };
  
  // State
  let isDevToolsOpen = false;
  let checkInterval = null;
  
  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  function initialize() {
    console.log('🔍 Inspect Mode Fix: Initializing...');
    
    // Apply initial fix
    applyFix();
    
    // Set up DevTools detection
    detectDevTools();
    
    // Add event listeners for window resize and orientation change
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('orientationchange', applyFix);
    
    // Listen for DOM changes
    const observer = new MutationObserver(onDomChange);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('🔍 Inspect Mode Fix: Initialized');
  }
  
  function applyFix() {
    const dailyPractice = document.querySelector(config.targets.dailyPractice);
    const delightsInput = document.querySelector(config.targets.delightsInput);
    
    if (dailyPractice) {
      applyStylesToElement(dailyPractice);
      
      // If in DevTools mode, add special indicator
      if (isDevToolsOpen) {
        dailyPractice.setAttribute('data-inspect-mode', 'true');
      } else {
        dailyPractice.removeAttribute('data-inspect-mode');
      }
    }
    
    if (delightsInput) {
      applyStylesToElement(delightsInput);
      
      // If in DevTools mode, add special indicator
      if (isDevToolsOpen) {
        delightsInput.setAttribute('data-inspect-mode', 'true');
      } else {
        delightsInput.removeAttribute('data-inspect-mode');
      }
    }
    
    // When in DevTools mode, add a global CSS rule
    if (isDevToolsOpen) {
      ensureGlobalCssRules();
    }
  }
  
  function applyStylesToElement(element) {
    // Reset computed style to ensure we start from a clean state
    resetElementStyles(element);
    
    // Apply the fixed styles with !important
    element.style.setProperty('padding', config.spacing.padding, 'important');
    element.style.setProperty('margin', config.spacing.margin, 'important');
    element.style.setProperty('gap', config.spacing.gap, 'important');
    element.style.setProperty('box-sizing', 'border-box', 'important');
    
    // Make sure other styles don't interfere
    element.style.setProperty('display', 'flex', 'important');
    element.style.setProperty('flex-direction', 'column', 'important');
    
    // Add special class for our CSS selectors
    element.classList.add('fixed-spacing');
    
    // Add an attribute to mark this element as fixed
    element.setAttribute('data-spacing-fixed', 'true');
  }
  
  function resetElementStyles(element) {
    // Remove any inline styles that might conflict with our fixes
    const stylesToReset = [
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
      'gap', 'box-sizing'
    ];
    
    // Store original styles before we modify
    if (!element.hasAttribute('data-original-styles')) {
      const computedStyle = window.getComputedStyle(element);
      const originalStyles = {};
      
      stylesToReset.forEach(prop => {
        originalStyles[prop] = computedStyle.getPropertyValue(prop);
      });
      
      element.setAttribute('data-original-styles', JSON.stringify(originalStyles));
    }
  }
  
  function ensureGlobalCssRules() {
    let styleElement = document.getElementById('inspect-mode-styles');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'inspect-mode-styles';
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = `
      /* Ultra-specific selectors for inspect mode */
      html body [data-inspect-mode].daily-practice-todo-list,
      html body [data-inspect-mode]#delights-input-container,
      html body .daily-practice-todo-list[data-inspect-mode],
      html body #delights-input-container[data-inspect-mode] {
        padding: ${config.spacing.padding} !important;
        margin: ${config.spacing.margin} !important;
        gap: ${config.spacing.gap} !important;
        box-sizing: border-box !important;
        position: relative !important;
      }
      
      /* Add a visual indicator during inspect mode */
      [data-inspect-mode]::after {
        content: "Spacing Fixed";
        position: absolute;
        top: -22px;
        right: 0;
        background: rgba(25, 118, 210, 0.8);
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 10px;
        pointer-events: none;
        z-index: 9999;
      }
    `;
  }
  
  function detectDevTools() {
    // Method 1: Check for resize - DevTools opening often causes window resize
    const widthThreshold = 0.8;
    const heightThreshold = 0.9;
    
    // Store original dimensions
    const originalWidth = window.outerWidth;
    const originalHeight = window.outerHeight;
    
    // Set up periodic check for DevTools
    checkInterval = setInterval(() => {
      // Method 1: Check window dimensions
      const widthCheck = window.outerWidth / window.screen.availWidth > widthThreshold;
      const heightCheck = window.outerHeight / window.screen.availHeight > heightThreshold;
      
      // Method 2: Check for specific CSS properties
      const element = document.createElement('div');
      element.style.display = 'none';
      document.body.appendChild(element);
      
      // DevTools might affect these CSS properties
      for (const prop of config.devToolsDetection.cssProps) {
        element.style[prop] = 'initial';
      }
      
      const computedStyle = window.getComputedStyle(element);
      let hasCssChanges = false;
      
      for (const prop of config.devToolsDetection.cssProps) {
        if (computedStyle[prop] !== 'initial') {
          hasCssChanges = true;
          break;
        }
      }
      
      document.body.removeChild(element);
      
      // Method 3: Check if window dimensions have changed significantly
      const hasWindowChanged = 
        Math.abs(window.outerWidth - originalWidth) > 100 || 
        Math.abs(window.outerHeight - originalHeight) > 100;
      
      // Determine if DevTools is likely open
      const devToolsLikelyOpen = !(widthCheck && heightCheck) || hasCssChanges || hasWindowChanged;
      
      // If DevTools state has changed
      if (devToolsLikelyOpen !== isDevToolsOpen) {
        isDevToolsOpen = devToolsLikelyOpen;
        console.log(`🔍 DevTools ${isDevToolsOpen ? 'opened' : 'closed'}, applying spacing fix...`);
        applyFix();
      }
    }, config.devToolsDetection.checkInterval);
  }
  
  function onWindowResize() {
    // Apply fix with slight delay to let browser stabilize
    setTimeout(applyFix, 100);
  }
  
  function onDomChange(mutations) {
    let shouldApplyFix = false;
    
    // Check if mutations affect our target elements
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && 
          (mutation.target.matches(config.targets.dailyPractice) || 
           mutation.target.matches(config.targets.delightsInput))) {
        shouldApplyFix = true;
        break;
      }
      
      if (mutation.type === 'childList') {
        // Check added nodes
        for (let i = 0; i < mutation.addedNodes.length; i++) {
          const node = mutation.addedNodes[i];
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.matches && 
                (node.matches(config.targets.dailyPractice) || 
                 node.matches(config.targets.delightsInput) ||
                 node.querySelector(config.targets.dailyPractice) || 
                 node.querySelector(config.targets.delightsInput))) {
              shouldApplyFix = true;
              break;
            }
          }
        }
        
        if (shouldApplyFix) break;
      }
    }
    
    if (shouldApplyFix) {
      console.log('🔍 DOM changed, reapplying spacing fix...');
      applyFix();
    }
  }
})();
