/**
 * BRUTE FORCE: Continuous Spacing Enforcement
 * 
 * This script continuously enforces spacing rules every few milliseconds,
 * ensuring that elements maintain their spacing regardless of what other
 * scripts or styles might do.
 */

// Settings
const INTERVAL_FREQUENCY = 100; // ms - how often to check and enforce styles
const MAX_RUNTIME = 60000; // ms - how long to run (1 minute by default)

// Log with timestamp
function logWithTime(message) {
  const now = new Date();
  const timeString = now.toISOString().substring(11, 23); // HH:MM:SS.mmm
  console.log(`[${timeString}] [BruteForce] ${message}`);
}

// The styles to enforce for each element
const ENFORCED_STYLES = {
  '.daily-practice-todo-list': {
    'padding': '20px 10px',
    'gap': '10px',
    'box-sizing': 'border-box',
    'width': '100%',
    'background-color': '#FAF8EC',
    'border-radius': '20px',
    'display': 'flex',
    'flex-direction': 'column',
    'align-items': 'flex-start'
  },
  '#delights-input-container': {
    'padding': '0 16px',
    'background-color': '#FFD400',
    'border': '2px solid white',
    'box-sizing': 'border-box'
  }
};

// Enforce styles forcefully
function enforceStyles() {
  Object.entries(ENFORCED_STYLES).forEach(([selector, styles]) => {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
      // Apply each style with !important
      Object.entries(styles).forEach(([property, value]) => {
        element.style.setProperty(property, value, 'important');
        
        // Double-check by setting the style directly
        try {
          // @ts-ignore - Force style via direct access
          element.style[property] = value;
        } catch (e) {
          // Some properties can't be set this way
        }
      });
      
      // Mark as modified
      element.setAttribute('data-brute-force-fixed', 'true');
    });
  });
}

// Start continuous enforcement
logWithTime('Starting continuous style enforcement');

// Run immediately
enforceStyles();

// Set up interval
const intervalId = setInterval(() => {
  enforceStyles();
}, INTERVAL_FREQUENCY);

// Set a timeout to stop after MAX_RUNTIME
setTimeout(() => {
  clearInterval(intervalId);
  logWithTime(`Stopped continuous enforcement after ${MAX_RUNTIME}ms`);
  
  // But keep enforcing on scroll, resize, and click events
  ['scroll', 'resize', 'click', 'touchstart', 'touchend'].forEach(eventType => {
    window.addEventListener(eventType, enforceStyles);
  });
}, MAX_RUNTIME);

// Make it globally accessible
window.enforceBruteForceStyles = enforceStyles;
window.stopBruteForceEnforcement = () => clearInterval(intervalId);
