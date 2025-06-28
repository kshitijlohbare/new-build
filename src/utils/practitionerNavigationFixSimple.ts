/**
 * Simplified utility for practitioner data fetching for improved components
 */
import { SupabaseClient } from '@supabase/supabase-js';

interface User {
  id: string;
}

type SupabaseType = SupabaseClient;

/**
 * Simplified function to fetch practitioner data for improved components
 */
export const fetchPractitionerDataSimple = async (
  user: User | null,
  supabase: SupabaseType,
  practitionerId?: string | null
): Promise<any> => {
  if (!user) return null;
  
  try {
    let query = supabase
      .from('practitioners')
      .select('*');
      
    if (practitionerId) {
      query = query.eq('id', practitionerId);
    } else {
      query = query.eq('user_id', user.id);
    }
    
    const { data, error } = await query.single();
    
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching practitioner data:", error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error("Exception fetching practitioner data:", error);
    return null;
  }
};

/**
 * Simplified function for the edit profile load function for improved components
 */
export const ensureEditProfileLoadsSimple = (): void => {
  // For simplified version, we just remove any stale flags
  localStorage.removeItem('practitioner-reload-in-progress');
};
