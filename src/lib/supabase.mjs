import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from window if available (for development)
const getSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    return {
      url: window.SUPABASE_URL || 'https://svnczxevigicuskppyfz.supabase.co',
      key: window.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU'
    };
  }
  return {
    url: 'https://svnczxevigicuskppyfz.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9zZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU'
  };
};

// Get config
const config = getSupabaseConfig();

// Always use the real Supabase URL, even in development
const supabaseUrl = config.url;
const supabaseKey = config.key;

// Create options for the Supabase client
const options = {
  auth: {
    storageKey: 'caktus_coco.auth.token',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'X-Client-Info': '@supabase/js@2',
    },
  }
};

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey, options);

/**
 * Get current session synchronously from localStorage
 * This is useful for immediate UI decisions before async calls complete
 */
export const getSessionFromLocalStorage = () => {
  try {
    const storageKey = 'caktus_coco.auth.token'; // Must match storageKey in client init
    const localData = localStorage.getItem(storageKey);
    if (!localData) return null;
    
    const parsedData = JSON.parse(localData);
    return parsedData;
  } catch (error) {
    console.error('Error retrieving session from localStorage:', error);
    return null;
  }
};
