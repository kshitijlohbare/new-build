/**
 * Spacing Inspector and Fixer
 * 
 * This script provides immediate visual feedback about spacing issues and fixes them
 * It works by:
 * 1. Adding visual indicators to show padding/margin/gaps
 * 2. Displaying measurements directly in the UI
 * 3. Forcing consistent spacing through multiple methods
 * 4. Monitoring for DOM changes and reapplying fixes
 * 5. Adding a control panel to toggle different fix strategies
 */

(function() {
  // Configuration
  const config = {
    elements: {
      dailyPractice: '.daily-practice-todo-list',
      delightsInput: '#delights-input-container'
    },
    targetSpacing: {
      padding: '16px',
      margin: '12px 0',
      gap: '8px'
    },
    inspectionInterval: 2000, // Less frequent checks (2000ms)
    fixStrategies: ['css', 'inline'], // Remove resource-heavy strategies
    activeStrategies: ['css'] // Use only CSS by default to reduce overhead
  };
  
  // State
  let inspectionTimer = null;
  let controlPanel = null;
  let highlightElements = {};
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
  
  function initialize() {
    console.log('🔍 Spacing Inspector: Initializing...');
    
    // Create control panel
    createControlPanel();
    
    // Initial inspection and fix
    inspectAndFix();
    
    // Set up monitoring
    startMonitoring();
    
    // Add event listeners
    window.addEventListener('resize', inspectAndFix);
    document.addEventListener('scroll', inspectAndFix);
    
    // Monitor for React re-renders and other DOM changes
    const observer = new MutationObserver(debounce(inspectAndFix, 100));
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
    
    console.log('🔍 Spacing Inspector: Initialized and monitoring spacing issues');
  }
  
  function inspectAndFix() {
    const dailyPractice = document.querySelector(config.elements.dailyPractice);
    const delightsInput = document.querySelector(config.elements.delightsInput);
    
    if (!dailyPractice || !delightsInput) {
      console.log('🔍 Spacing Inspector: Target elements not found, waiting...');
      return;
    }
    
    // Collect spacing information
    const dailyPracticeSpacing = getElementSpacing(dailyPractice);
    const delightsInputSpacing = getElementSpacing(delightsInput);
    
    // Log current spacing
    console.log('🔍 Daily Practice Spacing:', dailyPracticeSpacing);
    console.log('🔍 Delights Input Spacing:', delightsInputSpacing);
    
    // Check for differences
    const hasDifferences = detectDifferences(dailyPracticeSpacing, delightsInputSpacing);
    
    if (hasDifferences) {
      console.log('⚠️ Spacing differences detected! Applying fixes...');
      
      // Apply active fix strategies
      if (config.activeStrategies.includes('css')) {
        applyCssFix();
      }
      
      if (config.activeStrategies.includes('inline')) {
        applyInlineFix(dailyPractice, delightsInput);
      }
      
      if (config.activeStrategies.includes('clone')) {
        applyCloneFix(dailyPractice, delightsInput);
      }
      
      if (config.activeStrategies.includes('hardcoded')) {
        applyHardcodedFix(dailyPractice, delightsInput);
      }
      
      // Add visual indicators
      updateVisualIndicators(dailyPractice, delightsInput);
    } else {
      console.log('✅ Spacing is consistent between elements');
      
      // Keep visual indicators if they're present, but mark them as consistent
      updateVisualIndicators(dailyPractice, delightsInput, true);
    }
  }
  
  function getElementSpacing(element) {
    if (!element) return null;
    
    const computedStyle = window.getComputedStyle(element);
    
    return {
      padding: {
        top: computedStyle.paddingTop,
        right: computedStyle.paddingRight,
        bottom: computedStyle.paddingBottom,
        left: computedStyle.paddingLeft
      },
      margin: {
        top: computedStyle.marginTop,
        right: computedStyle.marginRight,
        bottom: computedStyle.marginBottom,
        left: computedStyle.marginLeft
      },
      gap: computedStyle.gap || 'not set',
      borderBox: computedStyle.boxSizing,
      width: computedStyle.width,
      height: computedStyle.height,
      position: computedStyle.position,
      display: computedStyle.display,
      parent: {
        selector: element.parentElement ? getSelector(element.parentElement) : 'none',
        display: element.parentElement ? window.getComputedStyle(element.parentElement).display : 'none'
      }
    };
  }
  
  function detectDifferences(spacing1, spacing2) {
    if (!spacing1 || !spacing2) return true;
    
    // Check for padding differences
    if (spacing1.padding.top !== spacing2.padding.top ||
        spacing1.padding.right !== spacing2.padding.right ||
        spacing1.padding.bottom !== spacing2.padding.bottom ||
        spacing1.padding.left !== spacing2.padding.left) {
      return true;
    }
    
    // Check for margin differences
    if (spacing1.margin.top !== spacing2.margin.top ||
        spacing1.margin.right !== spacing2.margin.right ||
        spacing1.margin.bottom !== spacing2.margin.bottom ||
        spacing1.margin.left !== spacing2.margin.left) {
      return true;
    }
    
    // Check for gap differences (if applicable)
    if (spacing1.gap !== spacing2.gap) {
      return true;
    }
    
    return false;
  }
  
  function applyCssFix() {
    // Create a style element if it doesn't exist
    let styleElement = document.getElementById('spacing-inspector-styles');
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'spacing-inspector-styles';
      document.head.appendChild(styleElement);
    }
    
    // Apply super-specific CSS that should override everything
    styleElement.textContent = `
      html body .daily-practice-todo-list,
      html body .daily-practice-todo-list[class],
      html body div.daily-practice-todo-list,
      html body div[class].daily-practice-todo-list,
      html body div[class][class].daily-practice-todo-list {
        padding: ${config.targetSpacing.padding} !important;
        margin: ${config.targetSpacing.margin} !important;
        gap: ${config.targetSpacing.gap} !important;
        box-sizing: border-box !important;
      }
      
      html body #delights-input-container,
      html body #delights-input-container[id],
      html body div#delights-input-container,
      html body div[id]#delights-input-container,
      html body div[id][id]#delights-input-container {
        padding: ${config.targetSpacing.padding} !important;
        margin: ${config.targetSpacing.margin} !important;
        gap: ${config.targetSpacing.gap} !important;
        box-sizing: border-box !important;
      }
    `;
  }
  
  function applyInlineFix(dailyPractice, delightsInput) {
    if (dailyPractice) {
      Object.assign(dailyPractice.style, {
        padding: `${config.targetSpacing.padding} !important`,
        margin: `${config.targetSpacing.margin} !important`,
        gap: `${config.targetSpacing.gap} !important`,
        boxSizing: 'border-box !important'
      });
    }
    
    if (delightsInput) {
      Object.assign(delightsInput.style, {
        padding: `${config.targetSpacing.padding} !important`,
        margin: `${config.targetSpacing.margin} !important`,
        gap: `${config.targetSpacing.gap} !important`,
        boxSizing: 'border-box !important'
      });
    }
  }
  
  function applyCloneFix(dailyPractice, delightsInput) {
    if (dailyPractice && !dailyPractice.hasAttribute('data-clone-fixed')) {
      const clone = dailyPractice.cloneNode(true);
      clone.style.padding = config.targetSpacing.padding;
      clone.style.margin = config.targetSpacing.margin;
      clone.style.gap = config.targetSpacing.gap;
      clone.style.boxSizing = 'border-box';
      clone.setAttribute('data-clone-fixed', 'true');
      
      dailyPractice.parentNode.replaceChild(clone, dailyPractice);
    }
    
    if (delightsInput && !delightsInput.hasAttribute('data-clone-fixed')) {
      const clone = delightsInput.cloneNode(true);
      clone.style.padding = config.targetSpacing.padding;
      clone.style.margin = config.targetSpacing.margin;
      clone.style.gap = config.targetSpacing.gap;
      clone.style.boxSizing = 'border-box';
      clone.setAttribute('data-clone-fixed', 'true');
      
      delightsInput.parentNode.replaceChild(clone, delightsInput);
    }
  }
  
  function applyHardcodedFix(dailyPractice, delightsInput) {
    // This is a hard replacement approach - use with caution
    if (dailyPractice && !dailyPractice.hasAttribute('data-hardcoded-fixed')) {
      const originalContent = dailyPractice.innerHTML;
      const originalClasses = dailyPractice.getAttribute('class');
      
      // Create a completely new element with hardcoded styles
      const newElement = document.createElement('div');
      newElement.className = originalClasses;
      newElement.innerHTML = originalContent;
      
      // Apply hardcoded styles
      newElement.style.cssText = `
        padding: ${config.targetSpacing.padding} !important;
        margin: ${config.targetSpacing.margin} !important;
        gap: ${config.targetSpacing.gap} !important;
        box-sizing: border-box !important;
      `;
      newElement.setAttribute('data-hardcoded-fixed', 'true');
      
      dailyPractice.parentNode.replaceChild(newElement, dailyPractice);
    }
    
    if (delightsInput && !delightsInput.hasAttribute('data-hardcoded-fixed')) {
      const originalContent = delightsInput.innerHTML;
      const originalId = delightsInput.id;
      const originalClasses = delightsInput.getAttribute('class');
      
      // Create a completely new element with hardcoded styles
      const newElement = document.createElement('div');
      newElement.id = originalId;
      if (originalClasses) newElement.className = originalClasses;
      newElement.innerHTML = originalContent;
      
      // Apply hardcoded styles
      newElement.style.cssText = `
        padding: ${config.targetSpacing.padding} !important;
        margin: ${config.targetSpacing.margin} !important;
        gap: ${config.targetSpacing.gap} !important;
        box-sizing: border-box !important;
      `;
      newElement.setAttribute('data-hardcoded-fixed', 'true');
      
      delightsInput.parentNode.replaceChild(newElement, delightsInput);
    }
  }
  
  function updateVisualIndicators(dailyPractice, delightsInput, isConsistent = false) {
    // Remove existing highlights
    Object.values(highlightElements).forEach(el => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
    
    highlightElements = {};
    
    // Create new highlights
    if (dailyPractice) {
      highlightElements.dailyPractice = createHighlight(dailyPractice, 'Daily Practice', isConsistent);
    }
    
    if (delightsInput) {
      highlightElements.delightsInput = createHighlight(delightsInput, 'Delights Input', isConsistent);
    }
  }
  
  function createHighlight(element, label, isConsistent) {
    const elementRect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    const highlight = document.createElement('div');
    highlight.className = 'spacing-inspector-highlight';
    highlight.style.cssText = `
      position: absolute;
      top: ${elementRect.top + scrollTop}px;
      left: ${elementRect.left + scrollLeft}px;
      width: ${elementRect.width}px;
      height: ${elementRect.height}px;
      border: 2px dashed ${isConsistent ? '#4CAF50' : '#FF5722'};
      pointer-events: none;
      z-index: 10000;
      box-sizing: content-box !important;
    `;
    
    // Add label
    const labelElement = document.createElement('div');
    labelElement.className = 'spacing-inspector-label';
    labelElement.style.cssText = `
      position: absolute;
      top: -24px;
      left: 0;
      background-color: ${isConsistent ? '#4CAF50' : '#FF5722'};
      color: white;
      padding: 2px 6px;
      font-size: 12px;
      font-family: Arial, sans-serif;
      border-radius: 3px;
      white-space: nowrap;
      z-index: 10001;
    `;
    labelElement.textContent = label;
    highlight.appendChild(labelElement);
    
    // Add measurements
    const computedStyle = window.getComputedStyle(element);
    const paddingInfo = document.createElement('div');
    paddingInfo.className = 'spacing-inspector-info';
    paddingInfo.style.cssText = `
      position: absolute;
      bottom: -60px;
      left: 0;
      background-color: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 8px;
      font-size: 11px;
      font-family: monospace;
      border-radius: 3px;
      white-space: nowrap;
      z-index: 10001;
    `;
    paddingInfo.innerHTML = `
      Padding: ${computedStyle.paddingTop} ${computedStyle.paddingRight} ${computedStyle.paddingBottom} ${computedStyle.paddingLeft}<br>
      Margin: ${computedStyle.marginTop} ${computedStyle.marginRight} ${computedStyle.marginBottom} ${computedStyle.marginLeft}<br>
      Gap: ${computedStyle.gap || 'none'} | Box: ${computedStyle.boxSizing}
    `;
    highlight.appendChild(paddingInfo);
    
    document.body.appendChild(highlight);
    return highlight;
  }
  
  function startMonitoring() {
    if (inspectionTimer) {
      clearInterval(inspectionTimer);
    }
    
    inspectionTimer = setInterval(inspectAndFix, config.inspectionInterval);
  }
  
  function stopMonitoring() {
    if (inspectionTimer) {
      clearInterval(inspectionTimer);
      inspectionTimer = null;
    }
  }
  
  function createControlPanel() {
    // Remove existing panel if it exists
    if (controlPanel) {
      document.body.removeChild(controlPanel);
    }
    
    // Create new control panel
    controlPanel = document.createElement('div');
    controlPanel.id = 'spacing-inspector-controls';
    controlPanel.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #333;
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10002;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      min-width: 200px;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      border-bottom: 1px solid #555;
      padding-bottom: 5px;
    `;
    
    const title = document.createElement('div');
    title.textContent = 'Spacing Inspector';
    title.style.fontWeight = 'bold';
    
    const closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.cssText = `
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      font-size: 14px;
    `;
    closeButton.onclick = () => {
      controlPanel.style.display = 'none';
    };
    
    header.appendChild(title);
    header.appendChild(closeButton);
    controlPanel.appendChild(header);
    
    // Add fix strategy toggles
    const strategiesTitle = document.createElement('div');
    strategiesTitle.textContent = 'Fix Strategies:';
    strategiesTitle.style.marginBottom = '5px';
    controlPanel.appendChild(strategiesTitle);
    
    config.fixStrategies.forEach(strategy => {
      const strategyToggle = document.createElement('div');
      strategyToggle.style.cssText = `
        display: flex;
        align-items: center;
        margin-bottom: 5px;
      `;
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `strategy-${strategy}`;
      checkbox.checked = config.activeStrategies.includes(strategy);
      checkbox.onchange = () => {
        if (checkbox.checked) {
          if (!config.activeStrategies.includes(strategy)) {
            config.activeStrategies.push(strategy);
          }
        } else {
          const index = config.activeStrategies.indexOf(strategy);
          if (index > -1) {
            config.activeStrategies.splice(index, 1);
          }
        }
        
        // Re-run inspection and fix
        inspectAndFix();
      };
      
      const label = document.createElement('label');
      label.htmlFor = `strategy-${strategy}`;
      label.textContent = strategy.charAt(0).toUpperCase() + strategy.slice(1);
      label.style.marginLeft = '5px';
      
      strategyToggle.appendChild(checkbox);
      strategyToggle.appendChild(label);
      controlPanel.appendChild(strategyToggle);
    });
    
    // Add action buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.style.cssText = `
      display: flex;
      gap: 5px;
      margin-top: 10px;
    `;
    
    const inspectButton = document.createElement('button');
    inspectButton.textContent = 'Inspect Now';
    inspectButton.style.cssText = buttonStyles();
    inspectButton.onclick = inspectAndFix;
    
    const toggleButton = document.createElement('button');
    toggleButton.textContent = inspectionTimer ? 'Stop Monitoring' : 'Start Monitoring';
    toggleButton.style.cssText = buttonStyles(inspectionTimer ? '#C62828' : '#388E3C');
    toggleButton.onclick = () => {
      if (inspectionTimer) {
        stopMonitoring();
        toggleButton.textContent = 'Start Monitoring';
        toggleButton.style.backgroundColor = '#388E3C';
      } else {
        startMonitoring();
        toggleButton.textContent = 'Stop Monitoring';
        toggleButton.style.backgroundColor = '#C62828';
      }
    };
    
    buttonsContainer.appendChild(inspectButton);
    buttonsContainer.appendChild(toggleButton);
    controlPanel.appendChild(buttonsContainer);
    
    document.body.appendChild(controlPanel);
  }
  
  function buttonStyles(bgColor = '#2196F3') {
    return `
      background-color: ${bgColor};
      border: none;
      color: white;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      font-size: 12px;
      flex: 1;
    `;
  }
  
  // Helper function to get a selector for an element
  function getSelector(element) {
    if (!element) return '';
    
    if (element.id) {
      return `#${element.id}`;
    }
    
    if (element.className && typeof element.className === 'string') {
      return `.${element.className.split(' ').join('.')}`;
    }
    
    return element.tagName.toLowerCase();
  }
  
  // Debounce function to prevent too many calls
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
})();
