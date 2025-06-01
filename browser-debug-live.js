// Browser-based test for practitioners
console.log('=== BROWSER PRACTITIONERS TEST ===');

// Test if the page is loading
console.log('Page loaded, checking practitioners...');

// Check if React components are mounted
setTimeout(() => {
  console.log('=== CHECKING DOM FOR PRACTITIONERS ===');
  
  // Look for practitioner cards in the DOM
  const practitionerCards = document.querySelectorAll('[data-testid="practitioner-card"]');
  console.log(`Found ${practitionerCards.length} practitioner cards in DOM`);
  
  // Look for loading indicators
  const loadingIndicators = document.querySelectorAll('[data-testid="loading"], .loading, .spinner');
  console.log(`Found ${loadingIndicators.length} loading indicators`);
  
  // Look for error messages
  const errorMessages = document.querySelectorAll('.error, [data-testid="error"]');
  console.log(`Found ${errorMessages.length} error messages`);
  
  // Check if there are any practitioners listed
  const practitionerElements = document.querySelectorAll('.practitioner, .therapist, .provider');
  console.log(`Found ${practitionerElements.length} practitioner-related elements`);
  
  // Check the main content area
  const mainContent = document.querySelector('main, .main-content, .content');
  if (mainContent) {
    console.log('Main content HTML preview:');
    console.log(mainContent.innerHTML.substring(0, 500) + '...');
  }
  
  // Check React error boundary
  const errorBoundary = document.querySelector('.error-boundary');
  if (errorBoundary) {
    console.log('Error boundary found:', errorBoundary.textContent);
  }
  
}, 3000);

// Test direct API call from browser
setTimeout(async () => {
  console.log('=== TESTING DIRECT API CALL FROM BROWSER ===');
  
  try {
    // Get the supabase client from window if available
    if (window.supabase) {
      console.log('Supabase client found on window');
      const { data, error } = await window.supabase
        .from('practitioners')
        .select('*');
        
      if (error) {
        console.error('Direct API error:', error);
      } else {
        console.log(`Direct API success: ${data?.length || 0} practitioners`);
        console.log('First practitioner:', data?.[0]);
      }
    } else {
      console.log('No supabase client found on window');
    }
  } catch (err) {
    console.error('Exception in direct API test:', err);
  }
}, 5000);
