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

// LocalStorage key
const LS_USER_PRACTICES_KEY = 'wellbeing_user_practices';

// Helper function to save data to localStorage
function saveToLocalStorage(userId: string, practices: Practice[], userProgress: UserProgress) {
  try {
    const data = {
      practices,
      progress: userProgress,
      updated_at: new Date().toISOString()
    };
    localStorage.setItem(`${LS_USER_PRACTICES_KEY}_${userId}`, JSON.stringify(data));
    console.log('Practice data saved to localStorage successfully');
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

// Helper function to load data from localStorage
function loadFromLocalStorage(userId: string) {
  try {
    const data = localStorage.getItem(`${LS_USER_PRACTICES_KEY}_${userId}`);
    if (!data) return null;
    
    const parsedData = JSON.parse(data);
    console.log('Successfully loaded practice data from localStorage');
    return {
      practices: parsedData.practices,
      progress: parsedData.progress
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

// This function will save updated practices and progress data to Supabase
export async function savePracticeData(userId: string, practices: Practice[], userProgress: UserProgress) {
  try {
    // Log daily practices that we're about to save
    const dailyPractices = practices.filter(p => p.isDaily === true);
    console.log(`Attempting to save ${dailyPractices.length} daily practices:`);
    dailyPractices.forEach(p => console.log(`- ${p.name} (ID: ${p.id}, isDaily: ${p.isDaily})`));

    // First check if user already has data
    const { data: existingData, error: checkError } = await supabase
      .from('user_practices')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    if (checkError) {
      // First try: if there's a Supabase error, use localStorage as fallback
      console.error('Supabase error, falling back to localStorage:', checkError);
      console.error(`Error code: ${checkError.code}, Error message: ${checkError.message}`);
      
      // Save to localStorage instead
      return saveToLocalStorage(userId, practices, userProgress);
    }
    
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
      
      if (error) {
        console.error('Error updating practice data:', error);
        console.error(`Error code: ${error.code}, Error message: ${error.message}`);
        
        // Save to localStorage on error
        return saveToLocalStorage(userId, practices, userProgress);
      }
      console.log('Practice data updated successfully in Supabase');
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
      
      if (error) {
        console.error('Error inserting practice data:', error);
        console.error(`Error code: ${error.code}, Error message: ${error.message}`);
        
        // Save to localStorage on error
        return saveToLocalStorage(userId, practices, userProgress);
      }
      console.log('Practice data created successfully in Supabase');
    }
    
    return true;
  } catch (error) {
    console.error('Error saving practice data:', error);
    
    // Final fallback to localStorage
    return saveToLocalStorage(userId, practices, userProgress);
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
    
    if (error) {
      console.error('Error loading practice data from Supabase:', error);
      console.log('Attempting to load from localStorage instead');
      
      // Try to load from localStorage instead
      return loadFromLocalStorage(userId);
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
        
        // Try localStorage as fallback
        return loadFromLocalStorage(userId);
      }
      
      console.log('Successfully loaded user practices data from Supabase');
      return data;
    } else {
      // No data found in Supabase, try localStorage
      console.log('No data found in Supabase, trying localStorage');
      return loadFromLocalStorage(userId);
    }
    
    return null;
  } catch (error) {
    console.error('Exception in loadPracticeData:', error);
    
    // Try to load from localStorage as last resort
    return loadFromLocalStorage(userId);
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
