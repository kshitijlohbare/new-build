import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU'

// Determine if we're in Node.js 
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';

// Create Supabase client with appropriate settings
if (isNode && typeof process !== 'undefined' && process.env) {
  console.warn('Initializing Supabase client in Node.js environment with SSL verification disabled');
  // Disable SSL verification before client initialization
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Create the client with proper typing
export const supabase = createClient(supabaseUrl, supabaseKey);
