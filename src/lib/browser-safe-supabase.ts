// browser-safe-supabase.ts - A Supabase client optimized for browser use 
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client optimized for browser environments
 * This client handles CORS issues by using appropriate configuration
 */
const createBrowserSafeClient = (): SupabaseClient => {
  // Get Supabase configuration - use window globals if available
  const supabaseUrl = typeof window !== 'undefined' && (window as any).SUPABASE_URL 
    ? (window as any).SUPABASE_URL 
    : 'https://svnczxevigicuskppyfz.supabase.co';
  
  const supabaseKey = typeof window !== 'undefined' && (window as any).SUPABASE_ANON_KEY
    ? (window as any).SUPABASE_ANON_KEY
    : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

  // Detect if we're running in development mode (localhost)
  const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';
  
  // Create client options
  const options = {
    auth: {
      storageKey: 'caktus_coco.auth.token',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    global: {
      headers: {
        'X-Client-Info': '@supabase/js@2'
      }
    }
  };
  
  // When in development, use local proxy paths
  if (isDevelopment) {
    console.log('Creating Supabase client in development mode with proxy support');

    // For localhost development - using compatible options for Supabase v2
    return createClient(supabaseUrl, supabaseKey, {
      auth: options.auth,
      global: options.global
    });
  } else {
    // For production, use direct URL
    return createClient(supabaseUrl, supabaseKey, options);
  }
};

// Create and export a singleton instance
export const supabase = createBrowserSafeClient();

// Helper function for getting session data
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
