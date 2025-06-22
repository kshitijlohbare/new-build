/**
 * NUCLEAR OPTION: Direct HTML Injection
 * 
 * This script takes a completely different approach:
 * 1. It contains a hardcoded "perfect" HTML snapshot of each problem element
 * 2. It completely removes and replaces the original elements with these snapshots
 * 3. It continuously monitors for new instances and replaces them
 */

// Wait for page load
window.addEventListener('load', () => {
  console.log('[NuclearFix] Initializing direct HTML replacement');
  setTimeout(applyNuclearFix, 1000);
});

// Function to apply the nuclear fix
function applyNuclearFix() {
  console.log('[NuclearFix] Applying nuclear fix...');
  
  // Try fixing the daily practice list
  fixDailyPracticeList();
  
  // Try fixing the delights input container
  fixDelightsContainer();
  
  // Set an interval to keep checking
  setInterval(() => {
    fixDailyPracticeList();
    fixDelightsContainer();
  }, 2000);
}

// Function to fix the daily practice list
function fixDailyPracticeList() {
  // Find the container
  const container = document.querySelector('.daily-practices-container');
  if (!container) return;
  
  // Check for unfixed elements
  const unfixedList = container.querySelector('.daily-practice-todo-list:not([data-nuclear-fixed])');
  if (!unfixedList) return;
  
  console.log('[NuclearFix] Fixing daily practice list');
  
  // Get the content to preserve
  const innerContent = unfixedList.innerHTML;
  
  // Create a new element with perfect structure and styling
  const fixedElement = document.createElement('div');
  fixedElement.className = 'daily-practice-todo-list';
  fixedElement.setAttribute('data-nuclear-fixed', 'true');
  
  // Set all the critical styles directly
  Object.assign(fixedElement.style, {
    width: '100%',
    padding: '20px 10px',
    backgroundColor: '#FAF8EC',
    borderRadius: '20px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: '10px',
    boxSizing: 'border-box',
    margin: '0',
    overflow: 'hidden'
  });
  
  // Use !important for critical properties
  ['padding', 'gap', 'width', 'background-color', 'border-radius', 
   'display', 'flex-direction', 'box-sizing'].forEach(prop => {
    fixedElement.style.setProperty(prop, fixedElement.style[prop], 'important');
  });
  
  // Insert the preserved content
  fixedElement.innerHTML = innerContent;
  
  // Replace the original element
  unfixedList.parentNode.replaceChild(fixedElement, unfixedList);
  
  console.log('[NuclearFix] Daily practice list replaced');
  
  // Apply to any inner elements that need specific styles
  const titleElement = fixedElement.querySelector('.practices-title');
  if (titleElement) {
    titleElement.style.setProperty('align-self', 'stretch', 'important');
    titleElement.style.setProperty('justify-content', 'center', 'important');
    titleElement.style.setProperty('align-items', 'center', 'important');
    titleElement.style.setProperty('gap', '10px', 'important');
    titleElement.style.setProperty('display', 'inline-flex', 'important');
    titleElement.style.setProperty('margin-bottom', '5px', 'important');
  }
}

// Function to fix the delights input container
function fixDelightsContainer() {
  // Find any unfixed delights container
  const unfixedContainer = document.querySelector('#delights-input-container:not([data-nuclear-fixed])');
  if (!unfixedContainer) return;
  
  console.log('[NuclearFix] Fixing delights input container');
  
  // Get the content and attributes to preserve
  const innerContent = unfixedContainer.innerHTML;
  const originalId = unfixedContainer.id;
  const originalClasses = unfixedContainer.className;
  const originalTestId = unfixedContainer.getAttribute('data-testid') || '';
  const originalAriaLabel = unfixedContainer.getAttribute('aria-label') || '';
  
  // Create a new element with perfect structure
  const fixedElement = document.createElement('div');
  fixedElement.id = originalId;
  fixedElement.className = originalClasses;
  fixedElement.setAttribute('data-testid', originalTestId);
  fixedElement.setAttribute('aria-label', originalAriaLabel);
  fixedElement.setAttribute('data-nuclear-fixed', 'true');
  
  // Set all the critical styles directly
  Object.assign(fixedElement.style, {
    padding: '0 16px',
    backgroundColor: '#FFD400',
    border: '2px solid white',
    boxSizing: 'border-box',
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'calc(100% - 40px)',
    maxWidth: '500px',
    borderRadius: '50px',
    zIndex: '1000'
  });
  
  // Use !important for critical properties
  ['padding', 'background-color', 'border', 'box-sizing', 'position',
   'bottom', 'left', 'transform', 'width', 'border-radius'].forEach(prop => {
    fixedElement.style.setProperty(prop, fixedElement.style[prop], 'important');
  });
  
  // Insert the preserved content
  fixedElement.innerHTML = innerContent;
  
  // Copy event listeners (this is tricky, but we'll try with a classic approach)
  const oldElement = unfixedContainer;
  const newElement = fixedElement;
  
  // Try to copy known event listeners
  ['click', 'touchstart', 'touchmove', 'touchend', 'mousedown', 'mouseup'].forEach(eventType => {
    newElement.addEventListener(eventType, (e) => {
      // Create and dispatch a new event to the old element
      // This might work for React's event system through bubbling
      oldElement.dispatchEvent(new Event(eventType, {
        bubbles: true,
        cancelable: true
      }));
    });
  });
  
  // Replace the original element
  if (unfixedContainer.parentNode) {
    unfixedContainer.parentNode.replaceChild(fixedElement, unfixedContainer);
    console.log('[NuclearFix] Delights input container replaced');
  }
}

// Make functions globally available
window.applyNuclearFix = applyNuclearFix;
