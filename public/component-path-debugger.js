// Component Path Debugger
// This script helps identify which component is actually being rendered

console.log("🔍 Component Path Debugger loaded");

// Check if we're on the focus timer page
if (window.location.pathname.includes('focus-timer')) {
  console.log("Focus Timer page detected!");
  
  // Add a special element to help identify the page
  const debugElement = document.createElement('div');
  debugElement.style.position = 'fixed';
  debugElement.style.bottom = '10px';
  debugElement.style.left = '10px';
  debugElement.style.padding = '8px';
  debugElement.style.background = 'rgba(0,0,0,0.7)';
  debugElement.style.color = 'white';
  debugElement.style.zIndex = '9999';
  debugElement.style.fontSize = '12px';
  debugElement.style.borderRadius = '4px';
  debugElement.innerText = 'Debug: Focus Timer Page';
  document.body.appendChild(debugElement);
  
  // Give us component info after a delay
  setTimeout(() => {
    console.log("Checking components on page after delay:");
    
    // Check for focus timer components
    const header = document.querySelector('[data-testid="focus-timer-header-bar"]');
    const musicDrawer = document.querySelector('[data-testid="music-drawer"]');
    const playPauseButton = document.querySelector('[data-testid="play-pause-button"]');
    const stopButton = document.querySelector('[data-testid="stop-button"]');
    
    console.log("Focus timer header:", header);
    console.log("Music drawer:", musicDrawer);
    console.log("Play/Pause button:", playPauseButton);
    console.log("Stop button:", stopButton);
    
    if (header) {
      const computedStyle = window.getComputedStyle(header);
      console.log("Header background:", computedStyle.background);
      console.log("Header backgroundColor:", computedStyle.backgroundColor);
      
      // Show header background visually
      debugElement.innerText += `\nHeader bg: ${computedStyle.background}`;
    }
    
    if (musicDrawer) {
      const computedStyle = window.getComputedStyle(musicDrawer);
      console.log("Music drawer display:", computedStyle.display);
      console.log("Music drawer width:", computedStyle.width);
      console.log("Music drawer background:", computedStyle.background);
      
      // Show music drawer styles visually
      debugElement.innerText += `\nDrawer: ${computedStyle.display}, ${computedStyle.width}`;
    }
    
    // Print out all elements with data-testid attributes
    document.querySelectorAll('[data-testid]').forEach(el => {
      console.log(`Found element with data-testid="${el.getAttribute('data-testid')}"`, el);
    });
  }, 2000);
}
