import { createClient, SupabaseClientOptions } from '@supabase/supabase-js';

// In development and production, connect directly to Supabase
// Proxy approach was causing 404 errors, so using direct connection
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';

// This is your public anon key.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabaseOptions: SupabaseClientOptions<"public"> = {
  auth: {
    storageKey: 'caktus_coco.auth.token', // Your custom storage key
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true, // Important for OAuth and password recovery flows
  },
  // global.headers are not needed here for apikey or X-Client-Info.
  // The supabaseAnonKey provided to createClient ensures the apikey header is sent.
  // X-Client-Info is added by the Supabase client library by default.
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseOptions);

export const getSessionFromLocalStorage = () => {
  try {
    const storageKey = 'caktus_coco.auth.token';
    const localData = localStorage.getItem(storageKey);
    if (!localData) return null;
    return JSON.parse(localData);
  } catch (error) {
    console.error('Error retrieving session from localStorage:', error);
    return null;
  }
};

/**
 * Check if a valid session token exists
 */
export const isTokenValid = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    
    // Check if we have a session and if it has a valid access token
    const isValid = !!data?.session?.access_token;
    
    // If token exists but is about to expire, refresh it
    if (isValid && data.session && isTokenExpiringSoon(data.session.expires_at)) {
      await refreshSession();
    }
    
    return isValid;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

/**
 * Check if the token will expire soon (within 1 hour)
 */
export const isTokenExpiringSoon = (expiresAt?: number): boolean => {
  if (!expiresAt) return true;
  
  // Check if token expires within the next hour (3600 seconds)
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  return expiresAt - now < 3600;
};

/**
 * Refresh the current session
 */
export const refreshSession = async () => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error refreshing session:', error);
    return null;
  }
};

/**
 * Configure persistent login with extended session
 * This can be used when signing in to request a longer session
 */
export const signInWithExtendedSession = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

/**
 * Configure OAuth login with extended session
 */
export const signInWithOAuthExtended = async (provider: 'google' | 'github') => {
  return await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
};

// Simple utility to log auth status
export const logAuthStatus = async () => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session ? 'Authenticated' : 'Not authenticated';
  } catch (e) {
    return `Error: ${e}`;
  }
};