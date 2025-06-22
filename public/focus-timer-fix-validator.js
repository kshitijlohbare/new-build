// Focus Timer Fix Validator
// This script validates that our CSS fixes are being applied correctly

console.log("⏰ Focus Timer Fix Validator is running...");

function checkFocusTimerStyles() {
  console.log("Checking Focus Timer styles...");
  
  // 1. Check if our CSS files are loaded
  const allStylesheets = Array.from(document.styleSheets);
  const focusTimerStylesheets = allStylesheets.filter(sheet => {
    try {
      return sheet.href && (
        sheet.href.includes('FocusTimer.css') || 
        sheet.href.includes('FocusTimerFix.css') || 
        sheet.href.includes('FocusTimerHeaderFix.css')
      );
    } catch (e) {
      // Cross-origin stylesheets will throw an error
      return false;
    }
  });
  
  console.log(`Found ${focusTimerStylesheets.length} FocusTimer stylesheets:`, 
    focusTimerStylesheets.map(s => s.href).join('\n'));
  
  // 2. Check for the control buttons
  const playPauseButton = document.querySelector('[data-testid="play-pause-button"]');
  const stopButton = document.querySelector('[data-testid="stop-button"]');
  
  if (playPauseButton) {
    console.log("Play/Pause button found:", playPauseButton);
    const computedStyle = window.getComputedStyle(playPauseButton);
    console.log("Play/Pause button padding:", computedStyle.padding);
    
    // Add visual indicator for debugging
    playPauseButton.style.border = "2px solid red";
    setTimeout(() => playPauseButton.style.border = "", 3000);
  } else {
    console.warn("Play/Pause button not found");
  }
  
  if (stopButton) {
    console.log("Stop button found:", stopButton);
    const computedStyle = window.getComputedStyle(stopButton);
    console.log("Stop button padding:", computedStyle.padding);
    
    // Add visual indicator for debugging
    stopButton.style.border = "2px solid blue";
    setTimeout(() => stopButton.style.border = "", 3000);
  } else {
    console.warn("Stop button not found");
  }
  
  // 3. Check header background
  const header = document.querySelector('[data-testid="focus-timer-header-bar"]');
  if (header) {
    console.log("Header found:", header);
    const computedStyle = window.getComputedStyle(header);
    console.log("Header background:", computedStyle.background);
    
    // Add visual indicator
    header.style.border = "2px solid green";
    setTimeout(() => header.style.border = "", 3000);
  } else {
    console.warn("Header not found with data-testid='focus-timer-header-bar'");
  }

  // 4. Check music drawer
  const musicDrawer = document.querySelector('[data-testid="music-drawer"]');
  if (musicDrawer) {
    console.log("Music drawer found:", musicDrawer);
    const computedStyle = window.getComputedStyle(musicDrawer);
    console.log("Music drawer display:", computedStyle.display);
    console.log("Music drawer width:", computedStyle.width);
    
    // Add visual indicator
    musicDrawer.style.border = "2px solid purple";
    setTimeout(() => musicDrawer.style.border = "", 3000);
  } else {
    console.warn("Music drawer not found with data-testid='music-drawer'");
  }
  
  console.log("Focus Timer style check complete");
}

// Run immediately if document is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  checkFocusTimerStyles();
} else {
  // Otherwise wait for DOMContentLoaded
  document.addEventListener('DOMContentLoaded', checkFocusTimerStyles);
}

// Also run after a delay to ensure React components are mounted
setTimeout(checkFocusTimerStyles, 2000);
// And once more after a longer delay
setTimeout(checkFocusTimerStyles, 5000);
