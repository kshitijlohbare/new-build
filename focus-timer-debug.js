// This file will help diagnose which FocusTimer component is being rendered
console.log('Loading FocusTimer diagnostic script');

// Add an ID to the element when it loads
const addDebugIdentifiers = () => {
  console.log('Running FocusTimer debug script...');
  
  // Find our timer elements
  const timerElements = document.querySelectorAll('.timer-progress');
  console.log(`Found ${timerElements.length} timer-progress elements`);
  
  // Add identifiers to help us see which component is rendered
  timerElements.forEach((el, i) => {
    el.setAttribute('data-debug-id', `timer-${i}-${Date.now()}`);
    el.style.border = '2px solid red';
    console.log(`Added debug ID to timer element: ${el.getAttribute('data-debug-id')}`);
  });
  
  // Check for our FocusTimer component
  const focusTimerContainer = document.querySelector('[class*="focus-timer"]');
  if (focusTimerContainer) {
    focusTimerContainer.setAttribute('id', 'focus-timer-debug');
    focusTimerContainer.style.border = '2px solid blue';
    console.log('Found and marked FocusTimer container');
  } else {
    console.log('Could not find FocusTimer container');
  }
  
  // Force style refresh
  document.body.classList.add('debug-mode');
  setTimeout(() => document.body.classList.remove('debug-mode'), 100);
};

// Run immediately and also when DOM changes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addDebugIdentifiers);
} else {
  addDebugIdentifiers();
}

// Also run periodically to catch any delayed renders
setInterval(addDebugIdentifiers, 3000);
