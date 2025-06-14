// This middleware script intercepts fetch requests to Supabase and adds CORS headers

document.addEventListener('DOMContentLoaded', () => {
  const originalFetch = window.fetch;
  
  window.fetch = async function(url, options = {}) {
    // Check if this is a supabase API request
    if (url && typeof url === 'string' && url.includes('svnczxevigicuskppyfz.supabase.co')) {
      // Add CORS headers to the request
      options.headers = {
        ...(options.headers || {}),
        'Origin': window.location.origin,
        'X-Client-Info': '@supabase/js@2',
        'X-Requested-With': 'XMLHttpRequest',
      };
      
      // For debugging
      console.log(`Intercepted Supabase fetch: ${url}`, options);
    }
    
    // Call the original fetch
    return originalFetch.call(this, url, options);
  };
  
  console.log('CORS fetch interceptor installed for Supabase requests');
});
