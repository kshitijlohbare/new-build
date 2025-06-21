/**
 * Force Element Cloning Solution
 * 
 * This script takes a more radical approach to ensure spacing consistency:
 * 1. It captures the exact layout of elements when DevTools is open
 * 2. It creates a snapshot with absolute positioning and dimensions
 * 3. It swaps problem elements with their cloned versions
 */

// Configuration - elements to fix
const ELEMENTS_TO_FIX = [
  '.daily-practice-todo-list',
  '#delights-input-container'
];

// Debugging
const DEBUG = true;
function log(...args) {
  if (DEBUG) console.log('[CloneFix]', ...args);
}

// Utility to capture all computed styles of an element
function captureComputedStyles(element) {
  const computed = window.getComputedStyle(element);
  const styles = {};
  
  // Get all computed styles
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    styles[prop] = computed.getPropertyValue(prop);
  }
  
  return styles;
}

// Clone an element with exact dimensions and styles
function cloneWithExactStyles(element) {
  // First, capture element information
  const rect = element.getBoundingClientRect();
  const styles = captureComputedStyles(element);
  const originalClasses = element.className;
  const originalId = element.id;
  
  // Create a wrapper to position exactly
  const wrapper = document.createElement('div');
  wrapper.className = 'clone-wrapper';
  wrapper.style.position = 'relative';
  wrapper.style.width = rect.width + 'px';
  wrapper.style.height = rect.height + 'px';
  
  // Clone the element for content
  const clone = element.cloneNode(true);
  
  // Ensure the clone has the exact same ID and classes as original
  clone.id = originalId;
  clone.className = originalClasses + ' cloned-element';
  
  // Set explicit dimensions and styles on clone
  clone.style.position = 'relative';
  clone.style.width = '100%';
  clone.style.height = '100%';
  
  // Apply all captured styles
  Object.entries(styles).forEach(([prop, value]) => {
    // Skip position-related styles that would conflict
    if (!['position', 'top', 'left', 'width', 'height'].includes(prop)) {
      try {
        clone.style.setProperty(prop, value, 'important');
      } catch (e) {
        // Some properties might be read-only
      }
    }
  });

  // Add special styles for the specific elements we're fixing
  if (element.classList.contains('daily-practice-todo-list')) {
    clone.style.padding = '20px 10px';
    clone.style.gap = '10px';
    clone.style.boxSizing = 'border-box';
  }
  
  if (element.id === 'delights-input-container') {
    clone.style.padding = '0 16px';
    clone.style.backgroundColor = '#FFD400';
    clone.style.border = '2px solid white';
  }
  
  // Add clone to wrapper
  wrapper.appendChild(clone);
  
  // Mark as fixed
  wrapper.setAttribute('data-clone-fix', 'true');
  clone.setAttribute('data-cloned-from', element.tagName);
  
  return {
    wrapper,
    clone,
    originalRect: rect,
    parentNode: element.parentNode
  };
}

// Replace elements with clones
function replaceWithClones() {
  log('Replacing elements with style-frozen clones');
  
  ELEMENTS_TO_FIX.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    log(`Found ${elements.length} elements matching ${selector}`);
    
    elements.forEach((element, index) => {
      // Check if already cloned
      if (element.parentNode && element.parentNode.hasAttribute('data-clone-fix')) {
        log(`Element ${selector} #${index} already cloned`);
        return;
      }
      
      // Clone element
      const { wrapper, clone, originalRect, parentNode } = cloneWithExactStyles(element);
      
      // Save reference to original element
      if (!window._originalElements) window._originalElements = new Map();
      window._originalElements.set(clone, element);
      
      // Replace element
      try {
        parentNode.replaceChild(wrapper, element);
        log(`Replaced ${selector} #${index} with cloned version`);
      } catch (e) {
        log(`Error replacing ${selector} #${index}:`, e);
      }
    });
  });
}

// Restore original elements if needed
function restoreOriginals() {
  if (!window._originalElements) return;
  
  window._originalElements.forEach((original, clone) => {
    const wrapper = clone.parentNode;
    if (wrapper && wrapper.parentNode) {
      wrapper.parentNode.replaceChild(original, wrapper);
    }
  });
  
  window._originalElements = new Map();
}

// Run with a delay to ensure page is fully rendered
setTimeout(() => {
  replaceWithClones();
  
  // Setup continuous monitoring
  const intervalId = setInterval(() => {
    let anyFound = false;
    
    ELEMENTS_TO_FIX.forEach(selector => {
      const nonClonedElements = document.querySelectorAll(`${selector}:not(.cloned-element)`);
      if (nonClonedElements.length > 0) {
        anyFound = true;
      }
    });
    
    if (anyFound) {
      replaceWithClones();
    }
  }, 1000);
  
  // Expose functions globally
  window.forceReplaceWithClones = replaceWithClones;
  window.restoreOriginalElements = restoreOriginals;
  
  log('Clone fix initialized');
}, 500);

// Export for module usage
export { replaceWithClones, restoreOriginals };
