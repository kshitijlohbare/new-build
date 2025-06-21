/**
 * Conditional Debug Styles Loader
 * This script conditionally loads debug-related CSS like DisableAnimations.css
 * based on URL parameters or localStorage settings.
 */

// Check if debug mode is enabled via URL param or localStorage
const isDebugMode = () => {
  // Check URL parameters first
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('debug') || urlParams.has('debugStyles')) {
    return true;
  }
  
  // Check localStorage
  return localStorage.getItem('debugStyles') === 'true';
};

// Function to conditionally load the DisableAnimations CSS
export const loadDebugStyles = () => {
  if (isDebugMode()) {
    console.log('Debug mode enabled: Loading DisableAnimations.css');
    
    // Create a link element for the CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = '/src/styles/DisableAnimations.css';
    link.id = 'debug-styles';
    
    // Append to head
    document.head.appendChild(link);
    
    // Add control UI for toggling
    addDebugControls();
  }
};

// Add UI controls for toggling debug styles
const addDebugControls = () => {
  // Only add if not already present
  if (document.getElementById('debug-controls')) return;
  
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'debug-controls';
  controlsDiv.style.position = 'fixed';
  controlsDiv.style.bottom = '10px';
  controlsDiv.style.right = '10px';
  controlsDiv.style.zIndex = '9999';
  controlsDiv.style.background = 'rgba(0,0,0,0.7)';
  controlsDiv.style.color = 'white';
  controlsDiv.style.padding = '5px 10px';
  controlsDiv.style.borderRadius = '5px';
  controlsDiv.style.fontSize = '12px';
  
  const toggleButton = document.createElement('button');
  toggleButton.innerText = 'Disable Debug Styles';
  toggleButton.style.padding = '3px 8px';
  toggleButton.style.margin = '5px';
  
  toggleButton.addEventListener('click', () => {
    const link = document.getElementById('debug-styles');
    if (link) {
      link.disabled = !link.disabled;
      toggleButton.innerText = link.disabled ? 'Enable Debug Styles' : 'Disable Debug Styles';
      
      // Flash the background to indicate the change
      document.body.style.transition = 'background-color 0.3s';
      document.body.style.backgroundColor = link.disabled ? '#f0fff0' : '#fff0f0';
      setTimeout(() => {
        document.body.style.backgroundColor = '';
      }, 300);
    }
  });
  
  controlsDiv.appendChild(toggleButton);
  document.body.appendChild(controlsDiv);
};

// Initialize when imported
export default loadDebugStyles;
