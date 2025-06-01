// Debug script for blank screen issue
console.log('=== BLANK SCREEN DEBUG ===');
console.log('Document ready state:', document.readyState);
console.log('Root element exists:', !!document.getElementById('root'));
console.log('Root element content:', document.getElementById('root')?.innerHTML || 'EMPTY');
console.log('Body content length:', document.body.innerHTML.length);

// Check for any JavaScript errors
window.addEventListener('error', (e) => {
  console.error('JavaScript Error:', e.error);
  console.error('Message:', e.message);
  console.error('Filename:', e.filename);
  console.error('Line:', e.lineno);
});

// Check for React errors
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled Promise Rejection:', e.reason);
});

// Check if React is loaded
console.log('React available:', typeof React !== 'undefined');
console.log('Window React:', !!window.React);

// Check for Vite
console.log('Vite available:', !!window.__vite_plugin_react_preamble_installed__);

setTimeout(() => {
  console.log('After 2 seconds - Root content:', document.getElementById('root')?.innerHTML || 'STILL EMPTY');
}, 2000);
