/**
 * Environment Configuration Helper
 * This file centralizes environment variable access and provides fallbacks
 */

// Supabase Configuration
export const getSupabaseConfig = () => {
  return {
    supabaseUrl: 
      // Check for window globals first (useful for runtime configuration)
      (typeof window !== 'undefined' && window.SUPABASE_URL) ||
      // Check for import.meta.env (Vite)
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
      // Check for process.env (Node.js)
      (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
      // Default value
      'https://svnczxevigicuskppyfz.supabase.co',

    supabaseKey:
      // Check for window globals first
      (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) ||
      // Check for import.meta.env (Vite)
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
      // Check for process.env (Node.js)
      (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
      // Default value
      'sb_publishable_SwYftYe96k-CZCD6UFLOrg_tFWUI55b',
  };
};

// Check if we're running in development mode
export const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';

// Helper to log environment info in development
export const logEnvironmentInfo = () => {
  if (isDevelopment) {
    const { supabaseUrl } = getSupabaseConfig();
    console.log(`[Environment] Running in ${isDevelopment ? 'development' : 'production'} mode`);
    console.log(`[Environment] Using Supabase URL: ${supabaseUrl ? 'Configured ✓' : 'Missing ✗'}`);
  }
};
