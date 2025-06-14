import { createClient } from '@supabase/supabase-js';

// Proxy URL for local development to avoid CORS issues
const useProxyUrl = true; // Set to true for development, false for production
const supabaseUrl = useProxyUrl 
  ? '/supabase'  // This will use the proxy we set up in vite.config.ts
  : 'https://svnczxevigicuskppyfz.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Set up client options
const clientOptions = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js/2.49.4'
    }
  }
};

// Create a singleton instance
const supabase = createClient(supabaseUrl, supabaseKey, clientOptions);

export { supabase };
