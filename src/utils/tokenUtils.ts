import { supabase } from '@/lib/supabase';

/**
 * Checks if there's a stored refresh token
 */
export const hasRefreshToken = (): boolean => {
  // Check if there's a session in localStorage
  const localStorageData = localStorage.getItem('supabase.auth.token');
  if (!localStorageData) return false;
  
  try {
    const parsedData = JSON.parse(localStorageData);
    return !!parsedData?.refresh_token;
  } catch (error) {
    console.error('Error parsing auth token data:', error);
    return false;
  }
};

/**
 * Gets the stored access token expiry time
 */
export const getTokenExpiryTime = async (): Promise<number | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.expires_at || null;
  } catch (error) {
    console.error('Error getting token expiry time:', error);
    return null;
  }
};

/**
 * Checks if the current token will expire soon (within given minutes)
 */
export const willTokenExpireSoon = async (withinMinutes: number = 5): Promise<boolean> => {
  const expiryTimestamp = await getTokenExpiryTime();
  if (!expiryTimestamp) return true;
  
  const expiryDate = new Date((expiryTimestamp as number) * 1000);
  const currentDate = new Date();
  const timeUntilExpiry = expiryDate.getTime() - currentDate.getTime();
  const minutesUntilExpiry = timeUntilExpiry / (1000 * 60);
  
  return minutesUntilExpiry <= withinMinutes;
};

/**
 * Refreshes the auth token
 */
export const refreshToken = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.auth.refreshSession();
    return !error && !!data.session;
  } catch (error) {
    console.error('Error refreshing token:', error);
    return false;
  }
};

/**
 * Clear all stored tokens (used on logout)
 */
export const clearTokens = (): void => {
  // Sign out will clear tokens from localStorage
  supabase.auth.signOut();
};
