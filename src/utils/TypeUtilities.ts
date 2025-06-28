/**
 * TypeUtilities.ts
 * Provides TypeScript type definitions to reduce the use of 'any' type
 * and improve type safety across the application.
 */

/**
 * Defines the structure of a therapist/practitioner
 */
export interface Practitioner {
  id: string;
  name: string;
  full_name?: string;
  specialty?: string;
  bio?: string;
  avatar_url?: string;
  photo_url?: string;
  email?: string;
  phone?: string;
  website?: string;
  booking_url?: string;
  session_fee?: number;
  session_length?: number;
  session_format?: string[];
  languages?: string[];
  specialties?: string[];
  approaches?: string[];
  availability?: string[];
  insurance_accepted?: boolean;
  insurance_providers?: string[];
  accepting_new_clients?: boolean;
  rating?: number;
  years_of_experience?: number;
  license_type?: string;
  license_number?: string;
  license_state?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Practice-related types, shared with context
 */
export interface PracticeStep {
  title: string;
  description: string;
  imageUrl?: string;
  completed?: boolean;
}

export interface Practice {
  id: number;
  icon?: string;
  name: string;
  description: string;
  benefits: string[];
  duration?: number;
  points?: number;
  completed: boolean;
  streak?: number;
  tags?: string[];
  steps?: PracticeStep[];
  source?: string;
  stepProgress?: number;
  isDaily?: boolean;
  userCreated?: boolean;
  createdByUserId?: string;
  isSystemPractice?: boolean;
}

/**
 * Filter category type
 */
export interface FilterCategory {
  id: string;
  label: string;
  count: number;
}

/**
 * User profile structure
 */
export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  created_at?: string;
  updated_at?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  notifications?: boolean;
  emailNotifications?: boolean;
  timezone?: string;
}

/**
 * API response handler type
 * Use this instead of any for API responses
 */
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  loading: boolean;
}

/**
 * Type-safe version of fetch for API calls
 * @param url The URL to fetch from
 * @param options The fetch options
 * @returns A promise with typed data
 */
export async function typedFetch<T>(
  url: string, 
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    
    const data: T = await response.json();
    return { data, error: null, loading: false };
  } catch (error) {
    console.error('API request failed:', error);
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error(String(error)), 
      loading: false 
    };
  }
}

/**
 * Safe type assertion (use instead of `as any`)
 * @param value Value to be type cast
 * @returns The value typed as T
 */
export function typedCast<T>(value: unknown): T {
  return value as T;
}

/**
 * A safer alternative to casting unknown values as any
 * @param value The input value
 * @returns The same value but typed
 */
export function safeValue<T>(value: unknown): T | undefined {
  return (value !== null && value !== undefined) ? value as T : undefined;
}
