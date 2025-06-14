import { createClient } from '@supabase/supabase-js';

// Supabase URL and anon key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create options for the Supabase client
const options = {
  auth: {
    storageKey: 'caktus_coco.auth.token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    // Create custom headers to assist with CORS
    headers: {
      'X-Client-Info': '@supabase/js@2',
      'Origin': window.location.origin,
      'X-Requested-With': 'XMLHttpRequest',
    },
  }
};

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey, options);

// Helper function for localStorage access
export const getSessionFromLocalStorage = () => {
  try {
    const storageKey = 'caktus_coco.auth.token';
    const localData = localStorage.getItem(storageKey);
    if (!localData) return null;
    
    const parsedData = JSON.parse(localData);
    return parsedData;
  } catch (error) {
    console.error('Error retrieving session from localStorage:', error);
    return null;
  }
};
