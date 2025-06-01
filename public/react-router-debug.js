// Debug script for React Router navigation issues
console.log('=== REACT ROUTER DEBUG SCRIPT ===');

// Store the original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
};

// Enhanced console.error to catch React Router issues
console.error = function(...args) {
  originalConsole.error.apply(console, args);
  
  // Look for specific React Router errors
  const errorString = args.join(' ');
  if (
    errorString.includes('useRoutes') || 
    errorString.includes('No routes matched') || 
    errorString.includes('useNavigate') ||
    errorString.includes('useParams') ||
    errorString.includes('Cannot update a component')
  ) {
    originalConsole.error('🔴 ROUTING ERROR DETECTED:', errorString);
    
    // Add debug info to the page
    appendDebugInfo({
      type: 'error',
      message: 'React Router error detected',
      details: errorString
    });
  }
};

// Monitoring navigation
let currentPath = window.location.pathname;
const pathHistory = [currentPath];

function monitorNavigation() {
  // Check every 500ms for path changes
  setInterval(() => {
    const newPath = window.location.pathname;
    
    if (newPath !== currentPath) {
      originalConsole.log(`🛣️ Navigation detected: ${currentPath} -> ${newPath}`);
      pathHistory.push(newPath);
      currentPath = newPath;
      
      appendDebugInfo({
        type: 'navigation',
        message: `Navigated to: ${newPath}`,
        history: [...pathHistory]
      });
      
      // Check for blank screen after navigation
      setTimeout(checkForBlankScreen, 200);
    }
  }, 500);
}

// Check if the screen is blank
function checkForBlankScreen() {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    originalConsole.error('🔴 No root element found!');
    return;
  }
  
  if (rootElement.children.length === 0 || rootElement.innerHTML.trim() === '') {
    originalConsole.error('🔴 BLANK SCREEN DETECTED: Root element is empty');
    
    // Add emergency navigation UI
    addEmergencyUI();
  } else {
    // Check for actual content vs. loading indicators
    const hasOnlyLoadingIndicator = 
      (rootElement.innerHTML.includes('loading') || 
       rootElement.innerHTML.includes('spinner')) &&
      rootElement.textContent.trim().length < 50;
    
    if (hasOnlyLoadingIndicator) {
      originalConsole.warn('⚠️ Only loading indicator detected');
    }
  }
}

// Add visible debug panel to the page
function appendDebugInfo(info) {
  let debugPanel = document.getElementById('react-router-debug-panel');
  
  if (!debugPanel) {
    debugPanel = document.createElement('div');
    debugPanel.id = 'react-router-debug-panel';
    debugPanel.style.cssText = `
      position: fixed;
      bottom: 0;
      right: 0;
      width: 300px;
      max-height: 200px;
      overflow: auto;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      z-index: 10000;
      border-top-left-radius: 5px;
    `;
    document.body.appendChild(debugPanel);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'X';
    closeBtn.style.cssText = `
      position: absolute;
      top: 5px;
      right: 5px;
      background: red;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    `;
    closeBtn.addEventListener('click', () => debugPanel.style.display = 'none');
    debugPanel.appendChild(closeBtn);
  }
  
  // Add entry
  const entry = document.createElement('div');
  entry.style.cssText = `
    padding: 5px 0;
    border-bottom: 1px solid rgba(255,255,255,0.3);
  `;
  
  let content = `<div><strong>${info.type.toUpperCase()}</strong>: ${info.message}</div>`;
  
  if (info.details) {
    content += `<div style="color:#ff8080; margin-top:3px; font-size:10px;">${info.details}</div>`;
  }
  
  if (info.history) {
    content += `<div style="color:#80ff80; margin-top:3px; font-size:10px;">History: ${info.history.join(' → ')}</div>`;
  }
  
  entry.innerHTML = content;
  debugPanel.appendChild(entry);
  
  // Scroll to bottom
  debugPanel.scrollTop = debugPanel.scrollHeight;
}

// Add emergency navigation UI if blank screen is detected
function addEmergencyUI() {
  // Check if emergency UI already exists
  if (document.getElementById('emergency-nav-ui')) return;
  
  originalConsole.log('Adding emergency navigation UI...');
  
  const emergencyUI = document.createElement('div');
  emergencyUI.id = 'emergency-nav-ui';
  emergencyUI.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    z-index: 10001;
    max-width: 90%;
    width: 500px;
  `;
  
  emergencyUI.innerHTML = `
    <h2 style="margin-top:0; color:#148BAF;">Navigation Assistant</h2>
    <p>It looks like you might be experiencing navigation issues. Use these links to get to key pages:</p>
    <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
      <a href="/" style="padding:10px; background:linear-gradient(to right, #04C4D5, #148BAF); color:white; text-decoration:none; border-radius:5px; text-align:center;">Home Page</a>
      <a href="/therapist-listing" style="padding:10px; background:linear-gradient(to right, #04C4D5, #148BAF); color:white; text-decoration:none; border-radius:5px; text-align:center;">Therapist Listing</a>
      <a href="/practitioner/1" style="padding:10px; background:linear-gradient(to right, #04C4D5, #148BAF); color:white; text-decoration:none; border-radius:5px; text-align:center;">Dr. Sarah Johnson (ID: 1)</a>
      <a href="/practitioner/2" style="padding:10px; background:linear-gradient(to right, #04C4D5, #148BAF); color:white; text-decoration:none; border-radius:5px; text-align:center;">Dr. Michael Chen (ID: 2)</a>
      <a href="/practitioner/3" style="padding:10px; background:linear-gradient(to right, #04C4D5, #148BAF); color:white; text-decoration:none; border-radius:5px; text-align:center;">Dr. Emily Rodriguez (ID: 3)</a>
    </div>
    <div style="margin-top:20px;">
      <button id="emergency-reload" style="padding:10px; background:#ff6b6b; color:white; border:none; border-radius:5px; cursor:pointer; margin-right:10px;">Reload Page</button>
      <button id="emergency-close" style="padding:10px; background:#333; color:white; border:none; border-radius:5px; cursor:pointer;">Close This Panel</button>
    </div>
  `;
  
  document.body.appendChild(emergencyUI);
  
  // Add event handlers
  document.getElementById('emergency-reload').addEventListener('click', () => {
    window.location.reload();
  });
  
  document.getElementById('emergency-close').addEventListener('click', () => {
    emergencyUI.style.display = 'none';
  });
}

// Function to override React Router's useNavigate if there are issues
function patchReactRouter() {
  // Wait for React Router to be available
  const interval = setInterval(() => {
    if (window.ReactRouter || (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)) {
      clearInterval(interval);
      originalConsole.log('Attempting to patch React Router...');
      
      try {
        // This is a very hacky approach that attempts to inject a last-resort
        // navigation handler if React Router's navigation fails
        const origPush = history.pushState;
        history.pushState = function(state, title, url) {
          originalConsole.log(`🔄 History push: ${url}`);
          origPush.apply(history, [state, title, url]);
          
          // If we detect a navigation attempt, set a short timeout to check if the UI updated
          setTimeout(() => {
            checkForBlankScreen();
          }, 300);
        };
        
        appendDebugInfo({
          type: 'info',
          message: 'History API patched for debugging'
        });
      } catch (err) {
        originalConsole.error('Failed to patch React Router:', err);
      }
    }
  }, 500);
}

// Start monitoring after the page has loaded
window.addEventListener('DOMContentLoaded', () => {
  originalConsole.log('DOM loaded, starting navigation monitoring...');
  monitorNavigation();
  patchReactRouter();
  
  // Initial check
  setTimeout(checkForBlankScreen, 1000);
});

// Also attach to window.onload for good measure
window.onload = () => {
  originalConsole.log('Window loaded, checking for blank screen...');
  setTimeout(checkForBlankScreen, 1000);
};

// Export debug functions to global scope for manual use
window.RouterDebug = {
  checkForBlankScreen,
  addEmergencyUI,
  navigateDirectly: (path) => {
    window.location.href = path;
  }
};

originalConsole.log('🟢 Router Debug initialized successfully');
