// ssl-workaround.js - Import this at the top of any Node.js script that uses Supabase

// Only apply in Node.js environment
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  console.warn('Node.js environment detected, disabling SSL certificate verification');
  
  // Disable SSL verification
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  console.warn(
    'WARNING: SSL certificate verification is disabled. ' +
    'This is insecure and should only be used in development environments.'
  );
  
  // For even more forceful SSL disabling, try to modify https module if available
  try {
    // This will only work in CommonJS modules
    const https = require('https');
    if (https.globalAgent && https.globalAgent.options) {
      https.globalAgent.options.rejectUnauthorized = false;
      console.warn('SSL verification also disabled via https.globalAgent');
    }
  } catch (e) {
    // Ignore errors, this is just an extra precaution
  }
}

// Export a dummy value so this can be used as an ES module import
export default { applied: true };
