// This script applies direct fixes to the focus timer when the component is detected in the DOM
// It ensures our styling requirements are met regardless of what's happening with the CSS files

console.log("Applying focus timer direct fixes");

function applyFocusTimerFixes() {
  // Target specific elements and apply styles directly
  
  // 1. Fix play/pause and stop buttons - remove padding
  const playPauseButton = document.querySelector('[data-testid="play-pause-button"]');
  const stopButton = document.querySelector('[data-testid="stop-button"]');
  
  if (playPauseButton) {
    playPauseButton.style.padding = '0';
    console.log("Applied padding fix to play/pause button");
  }
  
  if (stopButton) {
    stopButton.style.padding = '0';
    console.log("Applied padding fix to stop button");
  }
  
  // 2. Fix header - remove background
  const header = document.querySelector('[data-testid="focus-timer-header-bar"]');
  
  if (header) {
    header.style.background = 'none';
    console.log("Applied background fix to header");
  }
  
  // Find all elements with class containing 'control-button' and reset padding
  document.querySelectorAll('[class*="control-button"]').forEach(button => {
    button.style.padding = '0';
    console.log("Applied padding fix to control button:", button);
  });
  
  document.querySelectorAll('[class*="reset-button"]').forEach(button => {
    button.style.padding = '0';
    console.log("Applied padding fix to reset button:", button);
  });
  
  // Apply fixes to music drawer if visible
  const musicDrawer = document.querySelector('[data-testid="music-drawer"]');
  if (musicDrawer) {
    const computedStyle = window.getComputedStyle(musicDrawer);
    if (computedStyle.display !== 'none') {
      musicDrawer.style.display = 'flex';
      musicDrawer.style.alignItems = 'flex-start';
      musicDrawer.style.justifyContent = 'flex-start';
      console.log("Applied style fixes to music drawer");
    }
  }
  
  console.log("Focus timer fixes applied");
}

// Create a MutationObserver to watch for the focus timer component being added to the DOM
const observer = new MutationObserver(mutations => {
  // Check each mutation for focus timer components
  mutations.forEach(mutation => {
    // If new nodes were added
    if (mutation.addedNodes.length) {
      mutation.addedNodes.forEach(node => {
        // Only check elements, not text nodes etc.
        if (node.nodeType === 1) {
          // Check if this is a focus timer component or contains one
          if (
            node.querySelector('[data-testid="focus-timer-header-bar"]') ||
            node.querySelector('[data-testid="play-pause-button"]') ||
            node.querySelector('[data-testid="stop-button"]') ||
            node.querySelector('[data-testid="music-drawer"]') ||
            node.dataset.testid === 'focus-timer-header-bar' ||
            node.dataset.testid === 'play-pause-button' ||
            node.dataset.testid === 'stop-button' ||
            node.dataset.testid === 'music-drawer'
          ) {
            console.log("Focus timer component detected, applying fixes");
            applyFocusTimerFixes();
          }
        }
      });
    }
  });
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

// Also run once on load to catch any elements already in the DOM
document.addEventListener('DOMContentLoaded', applyFocusTimerFixes);

// And once more after a delay to ensure React components are mounted
setTimeout(applyFocusTimerFixes, 1000);
setTimeout(applyFocusTimerFixes, 3000);

// Try to detect navigation to focus timer
if (window.location.pathname.includes('focus-timer')) {
  console.log("Focus timer page detected by URL, applying fixes");
  setTimeout(applyFocusTimerFixes, 500);
  setTimeout(applyFocusTimerFixes, 2000);
}

// Apply fixes whenever the URL changes (for single-page applications)
const originalPushState = history.pushState;
history.pushState = function() {
  originalPushState.apply(this, arguments);
  if (window.location.pathname.includes('focus-timer')) {
    console.log("Focus timer page navigation detected, applying fixes");
    setTimeout(applyFocusTimerFixes, 500);
    setTimeout(applyFocusTimerFixes, 2000);
  }
};
