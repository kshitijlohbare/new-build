// Script to detect and log potential blank screen issues in the React app

console.log('Starting blank screen debugging script...');

// Function to inject into window to monitor React rendering issues
const debugScript = `
// Check for React errors
(function() {
  let originalError = console.error;
  console.error = function(...args) {
    // Log to original console
    originalError.apply(console, args);
    
    // Check for React-specific errors that might cause blank screens
    const errorString = args.join(' ');
    if (
      errorString.includes('React') || 
      errorString.includes('render') || 
      errorString.includes('Suspense') ||
      errorString.includes('undefined is not an object') ||
      errorString.includes('Cannot read property') ||
      errorString.includes('null is not an object')
    ) {
      console.error('BLANK SCREEN ALERT: Potential React rendering error detected');
      
      // Try to capture component stack trace if available
      if (errorString.includes('component stack:')) {
        const stackStart = errorString.indexOf('component stack:');
        const stack = errorString.substring(stackStart);
        console.error('Component Stack:', stack);
      }
      
      // Log state of key elements
      console.log('Document body children count:', document.body.children.length);
      console.log('Root element:', document.getElementById('root'));
    }
  };

  // Monitor navigation state changes
  let lastUrl = window.location.href;
  setInterval(() => {
    const currentUrl = window.location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      console.log('Navigation detected to:', currentUrl);
      
      // Check for blank screen after navigation (delayed check)
      setTimeout(() => {
        const rootEl = document.getElementById('root');
        if (rootEl && (!rootEl.children || rootEl.children.length === 0)) {
          console.error('BLANK SCREEN ALERT: Empty root element detected after navigation');
        }
      }, 500);
    }
  }, 200);

  // Monitor Settings component specifically
  if (window.location.pathname.includes('settings')) {
    console.log('Settings page detected - enabling special monitoring');
    
    // Check for form submission
    document.addEventListener('submit', (e) => {
      console.log('Form submission detected in Settings');
      
      // Check UI state after submission
      setTimeout(() => {
        const rootEl = document.getElementById('root');
        if (rootEl && (!rootEl.children || rootEl.children.length === 0)) {
          console.error('BLANK SCREEN ALERT: Empty root after Settings form submission');
        }
      }, 500);
    });
  }

  console.log('Blank screen debugging initialized');
})();
`;

// In a real application, this script would be injected into the page
// or included in the dev environment
console.log('To use this script:');
console.log('1. Open your browser console');
console.log('2. Copy and paste the following code:');
console.log('\n' + debugScript + '\n');
console.log('3. Press Enter to run it');
console.log('4. Navigate to the Settings page and test submission');
console.log('5. Check console for any "BLANK SCREEN ALERT" messages');

// To detect server-side issues, we would also need server logging
console.log('\nFor server-side debugging:');
console.log('1. Add comprehensive error logging in your API routes');
console.log('2. Check database connection stability');
console.log('3. Verify that Supabase requests are completing properly');

console.log('\nDebug script preparation complete!');
