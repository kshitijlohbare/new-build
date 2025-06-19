import { createClient } from '@supabase/supabase-js';

// Get Supabase configuration from window if available (for development)
const getSupabaseConfig = () => {
  if (typeof window !== 'undefined') {
    return {
      url: window.SUPABASE_URL || 'https://svnczxevigicuskppyfz.supabase.co',
      key: window.SUPABASE_ANON_KEY || 'sb_publishable_SwYftYe96k-CZCD6UFLOrg_tFWUI55b'
    };
  }
  return {
    url: 'https://svnczxevigicuskppyfz.supabase.co',
    key: 'sb_publishable_SwYftYe96k-CZCD6UFLOrg_tFWUI55b'
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
