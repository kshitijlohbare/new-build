// Browser debug injection script
// Run this in the browser console to check what's happening

console.log('=== BROWSER DEBUG SCRIPT ===');

// Check if the page has loaded practitioners
setTimeout(() => {
  console.log('Checking for practitioners in the DOM...');
  
  // Look for practitioner cards or any content
  const practitionerCards = document.querySelectorAll('[data-testid*="practitioner"], .practitioner-card, .therapist-card');
  console.log('Found practitioner cards:', practitionerCards.length);
  
  // Look for any loading indicators
  const loadingIndicators = document.querySelectorAll('[data-testid*="loading"], .loading, .spinner');
  console.log('Loading indicators:', loadingIndicators.length);
  
  // Look for error messages
  const errorMessages = document.querySelectorAll('[data-testid*="error"], .error, .error-message');
  console.log('Error messages:', errorMessages.length);
  
  // Check if React has loaded
  console.log('React loaded:', !!window.React);
  console.log('Location:', window.location.href);
  
  // Try to access the window object for any debug info
  if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
    console.log('React DevTools available');
  }
  
  // Look for any text content that might indicate practitioners
  const bodyText = document.body.innerText.toLowerCase();
  if (bodyText.includes('dr.') || bodyText.includes('therapist') || bodyText.includes('practitioner')) {
    console.log('✅ Found practitioner-related text in DOM');
  } else {
    console.log('❌ No practitioner text found in DOM');
  }
  
  // Check for any fetch errors in the console (this script won't catch them, but will note if present)
  console.log('Check the Network tab for any failed requests to supabase.co');
  
}, 2000);

// Also check console for any existing errors
console.log('Current console errors should be visible above this message');
