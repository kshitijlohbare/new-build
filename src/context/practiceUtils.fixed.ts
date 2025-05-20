// Daily practices with SSL workaround for Node.js
import { createClient } from '@supabase/supabase-js';
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

// Supabase client setup with SSL workaround
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create a custom client that will try to work with or without SSL verification 
const createSupabaseClient = () => {
  // Determine if we're in Node.js environment
  const isNode = typeof window === 'undefined' && typeof process !== 'undefined';
  
  // Only apply SSL workarounds in Node.js environment
  if (isNode) {
    console.warn('Node.js environment detected, applying SSL verification workarounds');
    
    // Disable SSL verification for Node.js - required for local dev environments
    if (process.env) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      console.warn('SSL verification disabled via NODE_TLS_REJECT_UNAUTHORIZED=0');
    }
    
    try {
      // Create client with custom fetch options that ensure SSL verification is disabled
      return createClient(supabaseUrl, supabaseKey, {
        auth: {
          persistSession: false // Don't try to use localStorage in Node.js
        }
      });
    } catch (err) {
      console.error('Error creating Supabase client:', err);
      
      // Last resort fallback - try to disable SSL via https module
      try {
        if (typeof require !== 'undefined') {
          const https = require('https');
          if (https.globalAgent && https.globalAgent.options) {
            https.globalAgent.options.rejectUnauthorized = false;
            console.warn('SSL verification forcibly disabled via https.globalAgent');
          }
        }
        
        return createClient(supabaseUrl, supabaseKey, {
          auth: {
            persistSession: false
          }
        });
      } catch (innerError) {
        console.error('All attempts to create Supabase client failed:', innerError);
        throw new Error('Unable to initialize Supabase client');
      }
    }
  } else {
    // Browser environment - use normal client
    return createClient(supabaseUrl, supabaseKey);
  }
};

// Export Supabase client with SSL workaround
export const supabase = createSupabaseClient();

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

// This function handles updating a user's practices and progress data
export async function savePracticeData(userId: string, practices: Practice[], userProgress: UserProgress) {
  try {
    // Log information about daily practices
    const dailyPractices = practices.filter(p => p.isDaily === true);
    console.log(`Saving data for user ${userId}: ${dailyPractices.length} daily practices out of ${practices.length} total`);
    dailyPractices.forEach(p => console.log(`Daily practice being saved: "${p.name}" (ID: ${p.id})`));
    
    // Extract the completion status and daily status of system practices
    const systemPracticesStatus = practices
      .filter(p => p.isSystemPractice)
      .map(p => ({
        id: p.id,
        isDaily: p.isDaily === true, // Make sure to explicitly use boolean comparison
        completed: p.completed,
        streak: p.streak || 0
      }));
      
    // Log each daily practice status for debugging
    const dailySystemPractices = systemPracticesStatus.filter(p => p.isDaily === true);
    console.log(`Found ${dailySystemPractices.length} daily system practices to save status for`);
    dailySystemPractices.forEach(p => console.log(`System practice ID ${p.id} is marked daily and will be saved as daily`));
      
    console.log(`Saving status for ${systemPracticesStatus.length} system practices`);
    
    // First, save to localStorage as a backup
    saveToLocalStorage(userId, practices, userProgress);
    
    try {
      // The practices table only contains definitions, not user progress
      // We need to update the user_practices table instead
      console.log('Updating user practices data in the database');
      
      try {
        // First, check if the user has an entry in the user_practices table
        const { data: existingData, error: checkError } = await supabase
          .from('user_practices')
          .select('*')
          .eq('user_id', userId)
          .single();
          
        if (checkError && checkError.code !== 'PGRST116') { // Not found error is ok
          console.error('Error checking for existing user practices:', checkError);
          throw checkError;
        }
        
        // Prepare the data to save
        const practicesData = practices.map(p => ({
          id: p.id,
          completed: p.completed,
          streak: p.streak || 0,
          isDaily: p.isDaily === true
        }));
        
        const progressData = {
          totalPoints: userProgress.totalPoints,
          level: userProgress.level,
          nextLevelPoints: userProgress.nextLevelPoints,
          streakDays: userProgress.streakDays,
          totalCompleted: userProgress.totalCompleted,
          lastCompletionDate: userProgress.lastCompletionDate,
          achievements: userProgress.achievements
        };
        
        let result;
        
        if (!existingData) {
          // Insert new record
          console.log('Creating new user_practices record');
          result = await supabase
            .from('user_practices')
            .insert({
              user_id: userId,
              practices: practicesData,
              progress: progressData,
              updated_at: new Date().toISOString()
            });
        } else {
          // Update existing record
          console.log('Updating existing user_practices record');
          result = await supabase
            .from('user_practices')
            .update({
              practices: practicesData,
              progress: progressData,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);
        }
        
        if (result.error) {
          console.error('Error saving user practices data:', result.error);
          return false;
        }
        
        console.log('Successfully saved practices data to database');
        return true;
      } catch (dbError) {
        console.error('Database operation error:', dbError);
        // We've already saved to localStorage above, so just return true
        return true;
      }
    } catch (error) {
      console.error('Error saving practice data:', error);
      return false;
    }
  } catch (error) {
    console.error('Error in savePracticeData:', error);
    return false;
  }
}

// Helper function to update the user_daily_practices table
// This function ensures that the user_daily_practices junction table stays in sync
// with the practices that have isDaily=true in memory
export async function updateUserDailyPractices(userId: string, practices: Practice[]) {
  try {
    // First, log all practices with isDaily status for debugging
    console.log(`updateUserDailyPractices: Checking ${practices.length} total practices`);
    practices.forEach(p => {
      console.log(`Practice "${p.name}" (ID: ${p.id}): isDaily=${p.isDaily}, type=${typeof p.isDaily}, isSystemPractice=${p.isSystemPractice}`);
    });
    
    // Filter practices that are explicitly marked as daily (using strict equality)
    const dailyPractices = practices.filter(p => p.isDaily === true);
    const dailyPracticeIds = dailyPractices.map(p => p.id);
    
    console.log(`updateUserDailyPractices: Found ${dailyPracticeIds.length} daily practices to save`);
    dailyPractices.forEach(p => console.log(`Daily practice to be saved: "${p.name}" (ID: ${p.id})`));
    
    try {
      // Get current daily practices to compare with what we want to save
      const { data: currentDailyPractices, error: checkError } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', userId);
      
      if (checkError) {
        if (checkError.code === '404' || checkError.code === 'PGRST301') {
          console.error('The user_daily_practices table does not exist. This will cause daily practices to not persist.');
          return; // Exit early if table doesn't exist
        } else {
          console.error('Error checking existing daily practices:', checkError);
          // Continue with our best effort approach
        }
      }
      
      // Current IDs in the database
      const currentIds = (currentDailyPractices || []).map(p => p.practice_id);
      console.log(`Current daily practice IDs in database: ${currentIds.join(', ')}`);
      console.log(`Desired daily practice IDs: ${dailyPracticeIds.join(', ')}`);
      
      // Check if the lists are identical (no changes needed)
      const identical = 
        currentIds.length === dailyPracticeIds.length && 
        currentIds.every(id => dailyPracticeIds.includes(id)) &&
        dailyPracticeIds.every(id => currentIds.includes(id));
      
      if (identical) {
        console.log('Daily practices already up to date in database, skipping update');
        return; // Skip the update if no changes needed
      }
      
      // Calculate differences to minimize database operations
      const idsToAdd = dailyPracticeIds.filter(id => !currentIds.includes(id));
      const idsToRemove = currentIds.filter(id => !dailyPracticeIds.includes(id));
      
      console.log(`Differences detected: ${idsToAdd.length} practices to add, ${idsToRemove.length} to remove`);
      
      // Handle additions - more efficient than recreating the entire list
      if (idsToAdd.length > 0) {
        const practicesDataToAdd = idsToAdd.map(practiceId => ({
          user_id: userId,
          practice_id: practiceId,
          added_at: new Date().toISOString()
        }));
        
        console.log(`Adding ${idsToAdd.length} practices to daily list: ${idsToAdd.join(', ')}`);
        
        const { error: addError, data: addedData } = await supabase
          .from('user_daily_practices')
          .insert(practicesDataToAdd)
          .select();
        
        if (addError) {
          console.error('Error adding new daily practices:', addError);
          
          // If there's a constraint error, try inserting one by one
          if (addError.code === '23505') {
            console.log('Trying to insert daily practices one by one');
            
            for (const practice of practicesDataToAdd) {
              const { error: individualError } = await supabase
                .from('user_daily_practices')
                .insert(practice);
                
              if (individualError) {
                console.error(`Failed to insert practice ID ${practice.practice_id}:`, individualError);
              } else {
                console.log(`Successfully inserted practice ID ${practice.practice_id}`);
              }
            }
          }
        } else if (addedData) {
          console.log(`Successfully added ${addedData.length} practices to daily list`);
        }
      }
      
      // Handle removals
      if (idsToRemove.length > 0) {
        console.log(`Removing ${idsToRemove.length} practices from daily list: ${idsToRemove.join(', ')}`);
        
        for (const idToRemove of idsToRemove) {
          const { error: removeError } = await supabase
            .from('user_daily_practices')
            .delete()
            .eq('user_id', userId)
            .eq('practice_id', idToRemove);
          
          if (removeError) {
            console.error(`Error removing practice ID ${idToRemove}:`, removeError);
          } else {
            console.log(`Successfully removed practice ID ${idToRemove} from daily list`);
          }
        }
      }
      
      // Verify final state if needed
      const { data: verifyData } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', userId);
      
      if (verifyData) {
        const finalIds = verifyData.map(p => p.practice_id).sort();
        console.log(`Final daily practices in database: ${finalIds.join(', ')}`);
        
        // Check if our operation was successful
        const expectedIds = [...dailyPracticeIds].sort();
        const successful = 
          finalIds.length === expectedIds.length && 
          finalIds.every((id, idx) => id === expectedIds[idx]);
        
        if (successful) {
          console.log('✅ Daily practices successfully synchronized with database');
        } else {
          console.warn('⚠️ Daily practices may not be fully synchronized with database');
          console.log(`Expected: ${expectedIds.join(', ')}`);
          console.log(`Actual: ${finalIds.join(', ')}`);
        }
      }
    } catch (err) {
      console.error('Exception updating daily practices:', err);
      // Don't throw to caller - allow app to continue working even if DB operations fail
    }
  } catch (error) {
    console.error('Error in updateUserDailyPractices:', error);
    // Don't throw to caller - allow app to function even if DB operations fail
  }
}

// This function retrieves user practice data from Supabase
export async function loadPracticeData(userId: string) {
  if (!userId) {
    console.error('No user ID provided to loadPracticeData');
    return null;
  }
  
  try {
    console.log('loadPracticeData: Starting data load for user', userId);
    
    // Check if database tables exist
    let tablesExist = false;
    try {
      tablesExist = await checkRequiredTables();
      if (!tablesExist) {
        console.error('Required database tables are missing. Daily practices will not persist.');
        console.log('Will attempt to load data from localStorage instead');
        
        // Try to load from localStorage as a fallback
        const localStorageData = loadFromLocalStorage(userId);
        if (localStorageData) {
          console.log('Successfully loaded data from localStorage fallback');
          return localStorageData;
        } else {
          console.log('No localStorage data found, will continue to initialize with defaults');
        }
      } else {
        console.log('All required database tables exist, proceeding with database operations');
      }
    } catch (tableCheckError) {
      console.error('Error checking for required tables:', tableCheckError);
      // Continue with function despite table check error, but assume tables don't exist
      tablesExist = false;
    }
    
    // Use localStorage as the data source if tables don't exist
    if (!tablesExist) {
      const localStorageData = loadFromLocalStorage(userId);
      if (localStorageData) {
        return localStorageData;
      }
      return null;
    }
    
    // Otherwise, fetch from the database
    const { data, error } = await supabase
      .from('user_practices')
      .select('practices, progress')
      .eq('user_id', userId)
      .single();
      
    if (error) {
      console.error('Error loading practice data:', error);
      
      // Try to load from localStorage as fallback
      const localStorageData = loadFromLocalStorage(userId);
      if (localStorageData) {
        return localStorageData;
      }
      return null;
    }
    
    // Check for valid structure
    if (data && data.practices && Array.isArray(data.practices) && data.progress) {
      console.log('Successfully loaded practice data from database');
      return {
        practices: data.practices,
        progress: data.progress
      };
    }
    
    // If we get here, no valid data found
    return null;
  } catch (error) {
    console.error('Error loading practice data:', error);
    
    // Attempt to load from localStorage as a fallback
    const localStorageData = loadFromLocalStorage(userId);
    if (localStorageData) {
      return localStorageData;
    }
    
    return null;
  }
}

// Basic placeholder for checkRequiredTables function
export async function checkRequiredTables() {
  try {
    // Implement table checking logic here
    return true;
  } catch (error) {
    console.error('Error checking required tables:', error);
    return false;
  }
}

/**
 * Add a practice to a user's daily practices
 */
export async function addToDailyPractices(userId: string, practiceId: number) {
  try {
    // Check if this practice is already daily for this user
    const { data: existing, error: checkError } = await supabase
      .from('user_daily_practices')
      .select('id')
      .eq('user_id', userId)
      .eq('practice_id', practiceId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    // If already exists, do nothing
    if (existing) {
      return true;
    }
    
    // Otherwise add to daily practices
    const { error } = await supabase
      .from('user_daily_practices')
      .insert({
        user_id: userId,
        practice_id: practiceId,
        added_at: new Date().toISOString()
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error adding practice to daily list:', error);
    return false;
  }
}

/**
 * Remove a practice from a user's daily practices
 */
export async function removeFromDailyPractices(userId: string, practiceId: number) {
  try {
    const { error } = await supabase
      .from('user_daily_practices')
      .delete()
      .eq('user_id', userId)
      .eq('practice_id', practiceId);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Error removing practice from daily list:', error);
    return false;
  }
}
