// Direct Element Styler
// This script will directly style the focus timer elements 
// to ensure proper appearance regardless of CSS precedence issues

console.log("⚡️ Direct Element Styler loaded");

// Function that applies styles directly to matched elements
const directlyStyleElements = () => {
  console.log("🎯 Applying direct styles to elements");

  // Target selectors
  const focusTimerHeaderSelectors = [
    '[data-testid="focus-timer-header-bar"]',
    '.header',
    '.focus-timer-header',
    'div[class*="focus-timer-header"]',
    'div[class*="timer-header"]'
  ];

  const controlButtonSelectors = [
    '[data-testid="play-pause-button"]',
    '[data-testid="stop-button"]',
    '.control-button',
    '.reset-button',
    'div[class*="control-button"]',
    'div[class*="reset-button"]',
    'button[class*="control-button"]',
    'button[class*="reset-button"]'
  ];

  const musicDrawerSelectors = [
    '[data-testid="music-drawer"]',
    '.music-drawer',
    'div[class*="music-drawer"]'
  ];

  // 1. Fix headers - remove background
  focusTimerHeaderSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      console.log(`Found header element: ${selector}`, el);
      Object.assign(el.style, {
        background: 'none',
        backgroundColor: 'transparent'
      });
    });
  });

  // 2. Fix control buttons - remove padding
  controlButtonSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      console.log(`Found control button: ${selector}`, el);
      Object.assign(el.style, {
        padding: '0'
      });
    });
  });

  // 3. Fix music drawer - make it hug content
  musicDrawerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      console.log(`Found music drawer: ${selector}`, el);
      Object.assign(el.style, {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        padding: '8px 0',
        width: 'auto',
        minWidth: '0',
        maxWidth: '90vw',
        zIndex: '1000'
      });
      
      // Style buttons inside
      el.querySelectorAll('button').forEach(btn => {
        Object.assign(btn.style, {
          background: 'none',
          border: 'none',
          padding: '6px 16px',
          margin: '0',
          fontSize: '16px',
          width: '100%',
          textAlign: 'left',
          cursor: 'pointer',
          borderRadius: '6px'
        });
        
        // Add hover effect with event listeners
        btn.addEventListener('mouseenter', () => {
          btn.style.background = '#FAF8EC';
        });
        
        btn.addEventListener('mouseleave', () => {
          btn.style.background = 'none';
        });
      });
    });
  });

  // Add visual debug markers to help identify where these elements are
  const debugMode = false; // Set to true to enable visual debugging
  
  if (debugMode) {
    focusTimerHeaderSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.border = '2px solid red';
      });
    });
    
    controlButtonSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.border = '2px solid blue';
      });
    });
    
    musicDrawerSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.style.border = '2px solid green';
      });
    });
  }
};

// Setup continuous monitoring for new elements being added
const setupMutationObserver = () => {
  // Create an observer instance linked to the callback function
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Only scan for focus timer elements if we're on the focus timer page
        if (window.location.href.includes('focus-timer')) {
          directlyStyleElements();
        }
      }
    }
  });

  // Start observing the document with the configured parameters
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Set up an intersection observer to catch elements as they become visible
  const ioCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        directlyStyleElements();
      }
    });
  };
  
  const io = new IntersectionObserver(ioCallback);
  io.observe(document.body);
  
  return observer;
};

// Run on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    directlyStyleElements();
    setupMutationObserver();
  });
} else {
  directlyStyleElements();
  setupMutationObserver();
}

// Also run when navigating to focus timer path
if (window.location.href.includes('focus-timer')) {
  console.log("🎮 Focus timer page detected by URL");
  setTimeout(directlyStyleElements, 500);
  setTimeout(directlyStyleElements, 1500);
  setTimeout(directlyStyleElements, 3000);
}

// Run periodically for good measure
const intervalCheck = setInterval(() => {
  if (window.location.href.includes('focus-timer')) {
    directlyStyleElements();
  }
}, 2000);

// Clean up interval after 30 seconds
setTimeout(() => {
  clearInterval(intervalCheck);
}, 30000);

// Hook into route changes
const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
  originalPushState.apply(this, arguments);
  if (window.location.href.includes('focus-timer')) {
    console.log("🔄 Focus timer page navigation detected via pushState");
    setTimeout(directlyStyleElements, 500);
    setTimeout(directlyStyleElements, 1500);
  }
};

history.replaceState = function() {
  originalReplaceState.apply(this, arguments);
  if (window.location.href.includes('focus-timer')) {
    console.log("🔄 Focus timer page navigation detected via replaceState");
    setTimeout(directlyStyleElements, 500);
    setTimeout(directlyStyleElements, 1500);
  }
};
