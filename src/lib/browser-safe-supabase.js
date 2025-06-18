// browser-safe-supabase.js - A Supabase client optimized for browser use 
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, isDevelopment, logEnvironmentInfo } from './env-config';

/**
 * Creates a Supabase client optimized for browser environments
 * This client handles CORS issues by using appropriate configuration
 */
const createBrowserSafeClient = () => {
  // Log environment information in development
  logEnvironmentInfo();
  
  // Get Supabase configuration from centralized config
  const { supabaseUrl, supabaseKey } = getSupabaseConfig();
  
  // Validate configuration
  if (!supabaseUrl) {
    throw new Error('Supabase URL is not configured. Please check your environment variables.');
  }
  
  if (!supabaseKey) {
    throw new Error('Supabase key is not configured. Please check your environment variables.');
  }
  
  // Create client options
  const options = {
    auth: {
      storageKey: 'caktus_coco.auth.token',
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      cookieOptions: {
        domain: typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'localhost' : 'caktuscoco.com',
        path: '/',
        sameSite: 'lax',
        secure: true
      }
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
    
    // For localhost development - must provide a valid URL even when using proxy
    return createClient(supabaseUrl, supabaseKey, {
      ...options,
      rest: {
        baseUrl: `${supabaseUrl}/rest/v1`
      },
      realtime: {
        baseUrl: `${supabaseUrl}/realtime/v1`
      },
      auth: {
        ...options.auth,
        baseUrl: `${supabaseUrl}/auth/v1`,
      },
      storage: {
        baseUrl: `${supabaseUrl}/storage/v1`
      },
    });
  } else {
    // For production, use direct URL
    return createClient(supabaseUrl, supabaseKey, options);
  }
};

// Create and export a singleton instance with error handling
let supabaseClient;
try {
  supabaseClient = createBrowserSafeClient();
  console.log('Supabase client successfully initialized');
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Fallback to a dummy client to prevent application crashes
  supabaseClient = {
    from: () => ({
      select: () => ({ data: [], error: new Error('Supabase client failed to initialize') }),
      insert: () => ({ data: null, error: new Error('Supabase client failed to initialize') }),
      update: () => ({ data: null, error: new Error('Supabase client failed to initialize') }),
      delete: () => ({ data: null, error: new Error('Supabase client failed to initialize') }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: null, error: null, unsubscribe: () => {} }),
    },
  };
}
export const supabase = supabaseClient;

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
