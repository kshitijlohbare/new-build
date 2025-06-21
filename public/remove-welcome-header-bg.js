/**
 * Welcome Header Background Removal
 * This script specifically targets the welcome-header to ensure it has no background
 */

(function() {
  function removeWelcomeHeaderBackground() {
    const welcomeHeader = document.getElementById('mobile-welcome-header');
    if (welcomeHeader) {
      welcomeHeader.style.background = 'none';
      welcomeHeader.style.backgroundColor = 'transparent';
      welcomeHeader.style.backgroundImage = 'none';
    }
  }
  
  // Run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', removeWelcomeHeaderBackground);
  } else {
    removeWelcomeHeaderBackground();
  }
  
  // Also run every 100ms for the first second to make absolutely sure
  let attempts = 0;
  const interval = setInterval(() => {
    removeWelcomeHeaderBackground();
    attempts++;
    if (attempts >= 10) clearInterval(interval);
  }, 100);
})();
