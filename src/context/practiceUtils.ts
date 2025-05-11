// Utility functions for handling practice data with Supabase
import { supabase } from '@/lib/supabase';
import { Practice } from './PracticeContext';

interface UserProgress {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  streakDays: number;
  totalCompleted: number;
  lastCompletionDate?: string;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

// This function will save updated practices and progress data to Supabase
export async function savePracticeData(userId: string, practices: Practice[], userProgress: UserProgress) {
  try {
    // First check if user already has data
    const { data: existingData } = await supabase
      .from('user_practices')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (existingData) {
      // Update existing record
      const { error } = await supabase
        .from('user_practices')
        .update({
          practices: practices,
          progress: userProgress,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      if (error) throw error;
      console.log('Practice data updated successfully');
    } else {
      // Insert new record
      const { error } = await supabase
        .from('user_practices')
        .insert({
          user_id: userId,
          practices: practices,
          progress: userProgress,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      console.log('Practice data created successfully');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving practice data:', error);
    return false;
  }
}

// This function will retrieve user practice data from Supabase
export async function loadPracticeData(userId: string) {
  if (!userId) {
    console.error('No user ID provided to loadPracticeData');
    return null;
  }
  
  try {
    const { data, error } = await supabase
      .from('user_practices')
      .select('practices, progress')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    // Validate data structure before returning
    if (data) {
      const isValidData = 
        data.practices && 
        Array.isArray(data.practices) && 
        data.progress && 
        typeof data.progress === 'object' &&
        'totalPoints' in data.progress;
      
      if (!isValidData) {
        console.warn('Retrieved practice data has invalid structure', data);
        return null;
      }
      
      console.log('Successfully loaded user practices data');
      return data;
    }
    
    // Return null if no data found
    return null;
  } catch (error) {
    console.error('Error loading practice data:', error);
    return null;
  }
}

/**
 * Verify that the user_practices table exists in Supabase
 * This can be useful when initializing the app to ensure
 * the required table structure exists
 */
export async function checkUserPracticesTable() {
  try {
    // Test query to see if we can access the table
    const { error } = await supabase
      .from('user_practices')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('Error checking user_practices table:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error checking user_practices table:', error);
    return false;
  }
}
