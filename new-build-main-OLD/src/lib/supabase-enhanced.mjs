import { createClient } from '@supabase/supabase-js';
import https from 'node:https';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Check if process.env.NODE_TLS_REJECT_UNAUTHORIZED is set to '0'
// This is NOT recommended for production use, but can be a temporary workaround
const isTlsVerificationDisabled = process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0';

// Setup options to help with SSL certificate issues on Node.js
const options = {};

// Only add fetch options for Node.js environment (not in browser)
if (typeof window === 'undefined') {
  try {
    // Try to create a proper HTTPS agent for better certificate handling
    const httpsAgent = new https.Agent({
      rejectUnauthorized: !isTlsVerificationDisabled,
      // Try to use Node's default CA store
    });
    
    options.global = {
      fetch: (url, fetchOptions) => {
        return fetch(url, {
          ...fetchOptions,
          agent: httpsAgent
        });
      }
    };
    
    if (isTlsVerificationDisabled) {
      console.warn(
        'WARNING: SSL certificate verification is disabled. ' +
        'This is insecure and should not be used in production.'
      );
    }
  } catch (err) {
    console.warn('Failed to create custom HTTPS agent:', err);
  }
}

// Create the Supabase client with the configured options
export const supabase = createClient(supabaseUrl, supabaseKey, options);

// Export a version for testing that disables SSL verification (ONLY FOR TESTING)
export const createTestClient = () => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn(
    'WARNING: Creating test client with SSL verification disabled. ' +
    'This is insecure and should NEVER be used in production.'
  );
  return createClient(supabaseUrl, supabaseKey);
};
