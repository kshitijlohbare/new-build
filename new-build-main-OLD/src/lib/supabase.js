// Production version of Supabase client with SSL workaround
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Determine if we're in Node.js 
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';

// Create fetch options with SSL disabled for Node.js
const fetchOptions = isNode ? {
  fetch: (url, options) => {
    // Disable SSL verification in Node.js environment
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    console.warn('WARNING: SSL certificate verification disabled for Supabase fetch operations');
    return fetch(url, options);
  }
} : {};

let supabase;

// Create Supabase client with appropriate settings
if (isNode) {
  console.warn('Initializing Supabase client in Node.js environment with SSL verification disabled');
  // Disable SSL verification before client initialization
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  try {
    // Create client with custom fetch that has SSL verification disabled
    supabase = createClient(supabaseUrl, supabaseKey, fetchOptions);
  } catch (e) {
    console.error('Error initializing Supabase client:', e);
    
    // Last resort fallback - try again with even more forceful SSL disabling
    try {
      // Override global agent for https if available
      if (typeof require !== 'undefined') {
        const https = require('https');
        https.globalAgent.options.rejectUnauthorized = false;
        console.warn('SSL verification forcibly disabled via https.globalAgent');
      }
      
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (innerError) {
      console.error('All attempts to create Supabase client failed:', innerError);
      throw new Error('Unable to initialize Supabase client');
    }
  }
} else {
  // Browser environment - normal client is fine
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase };
