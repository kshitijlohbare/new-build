// Debug script for browser console
console.log('=== BROWSER DEBUG START ===');
console.log('Document ready state:', document.readyState);
console.log('Root element exists:', !!document.getElementById('root'));
console.log('Root element content:', document.getElementById('root')?.innerHTML);
console.log('Body content:', document.body.innerHTML);
console.log('Console errors so far:');

// Override console.error to catch any errors
const originalError = console.error;
console.error = function(...args) {
  console.log('CAUGHT ERROR:', ...args);
  originalError.apply(console, args);
};

// Check if React is loaded
console.log('React available:', typeof React !== 'undefined');

// Check DOM content after a short delay
setTimeout(() => {
  console.log('=== DELAYED CHECK ===');
  console.log('Root element content after delay:', document.getElementById('root')?.innerHTML);
  console.log('Any script errors on page?');
}, 1000);

console.log('=== BROWSER DEBUG END ===');
