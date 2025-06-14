// Custom file to set development environment config for Supabase

// Define Supabase configuration globals
window.SUPABASE_URL = 'https://svnczxevigicuskppyfz.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Production fallback URL (for non-local environments)
window.SUPABASE_DIRECT_URL = 'https://svnczxevigicuskppyfz.supabase.co';

// Add CORS proxy for development
if (window.location.hostname === 'localhost') {
  // Create a diagnostic logger for Supabase requests
  // This will help debug CORS and connection issues
  const originalFetch = window.fetch;
  
  window.fetch = function(...args) {
    let [url, options = {}] = args;
    
    // Only modify Supabase requests
    if (typeof url === 'string') {
      // Fix URL with missing protocol or domain for local development
      if ((url.startsWith('/rest/v1') || url.startsWith('/auth/v1') || 
           url.startsWith('/storage/v1') || url.startsWith('/realtime/v1')) && 
          !url.startsWith('http')) {
        // The URL is already proxied by Vite server
        console.debug(`Using proxied Supabase endpoint: ${url}`);
        
        // Add necessary headers
        options.headers = {
          ...options.headers,
          'apikey': window.SUPABASE_ANON_KEY,
          'X-Client-Info': '@supabase/js@2',
        };
      }
      else if (url.includes('svnczxevigicuskppyfz.supabase.co')) {
        // Direct Supabase URL - convert to proxy for local development
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        
        // Map to our proxy by extracting relevant parts
        const pathSegments = path.split('/');
        if (pathSegments.length >= 2) {
          const service = pathSegments[1]; // 'rest', 'auth', 'storage', etc.
          
          // Replace the URL with the appropriate proxy endpoint
          url = `/${service}/v1${path.substring(path.indexOf('v1') + 2)}${urlObj.search}`;
          
          console.debug(`Converted Supabase URL to proxy: ${url}`);
          
          // Add necessary headers
          options.headers = {
            ...options.headers,
            'apikey': window.SUPABASE_ANON_KEY,
            'X-Client-Info': '@supabase/js@2',
          };
        }
      }
    }
    
    return originalFetch.call(this, url, options);
  };
  
  console.log('Supabase CORS proxy enabled for development');
}
