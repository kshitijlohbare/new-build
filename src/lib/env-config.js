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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU',
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
