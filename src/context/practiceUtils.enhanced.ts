// Utility functions for handling practice data with Supabase - Enhanced Version
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

// This function handles updating a user's practices and progress data
export async function savePracticeData(userId: string, practices: Practice[], userProgress: UserProgress) {
  try {
    // Always enforce key practices as daily before saving
    const keyPracticeNames = [
      "Cold Shower Exposure",
      "Gratitude Journal",
      "Focus Breathing (3:3:6)"
    ];
    const normalizedPractices = practices.map(practice => ({
      ...practice,
      isDaily: keyPracticeNames.includes(practice.name) ? true : practice.isDaily === true, // Force key practices to daily
      completed: practice.completed === true // Explicitly convert to boolean
    }));
    
    // Log information about daily practices
    const dailyPractices = normalizedPractices.filter(p => p.isDaily === true);
    const dailyPracticeIds = dailyPractices.map(p => p.id);
    const dailyPoints = dailyPractices.reduce((sum, p) => sum + (p.completed ? (p.points || 1) : 0), 0);
    const streaks = userProgress.streakDays || 0;
    console.log(`Saving data for user ${userId}: ${dailyPractices.length} daily practices out of ${normalizedPractices.length} total`);
    dailyPractices.forEach(p => console.log(`Daily practice being saved: "${p.name}" (ID: ${p.id})`));
    
    // Extract the completion status and daily status of system practices
    const systemPracticesStatus = normalizedPractices
      .filter(p => p.isSystemPractice)
      .map(p => ({
        id: p.id,
        isDaily: p.isDaily === true, // Make sure to explicitly use boolean comparison
        completed: p.completed === true, // Make sure to explicitly use boolean comparison
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
      // Check if user already has data
      const { data: existingData, error: checkError } = await supabase
        .from('user_practices')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') { // Not found is okay
        console.error('Error checking if user has data:', checkError);
        return true; // Return true since we've backed up to localStorage
      }
    
      if (existingData) {
        // Update existing record
        const { error } = await supabase
          .from('user_practices')
          .update({
            // Save user-created practices in full plus system practice status
            practices: [
              ...practices.filter(p => p.userCreated), // User-created practices in full
              ...systemPracticesStatus // Just the status info for system practices
            ],
            progress: userProgress,
            daily_practices: dailyPracticeIds,
            daily_points: dailyPoints,
            streaks: streaks,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        if (error) throw error;
        
        // Update the user's daily practices in the separate table
        await updateUserDailyPractices(userId, practices);
        
        console.log('Practice data updated successfully');
      } else {
        // Insert new record for user
        const { error } = await supabase
          .from('user_practices')
          .insert({
            user_id: userId,
            // Save user-created practices in full plus system practice status
            practices: [
              ...practices.filter(p => p.userCreated), // User-created practices in full
              ...systemPracticesStatus // Just the status info for system practices
            ],
            progress: userProgress,
            daily_practices: dailyPracticeIds,
            daily_points: dailyPoints,
            streaks: streaks,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
        
        // Initialize user's daily practices
        await updateUserDailyPractices(userId, practices);
        
        console.log('Practice data created successfully');
      }
      
      // Save to localStorage as a fallback
      saveToLocalStorage(userId, practices, userProgress);
      
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
}

// Helper function to update the user_daily_practices table
async function updateUserDailyPractices(userId: string, practices: Practice[]) {
  try {
    // First, log all practices with isDaily status for debugging
    console.log(`updateUserDailyPractices: Checking ${practices.length} total practices`);
    practices.forEach(p => {
      console.log(`Practice "${p.name}" (ID: ${p.id}): isDaily=${p.isDaily}, type=${typeof p.isDaily}, isSystemPractice=${p.isSystemPractice}`);
    });
    
    // Filter practices that are explicitly marked as daily (using strict equality)
    // Extra explicit normalization to ensure boolean values
    const normalizedPractices = practices.map(p => ({
      ...p,
      isDaily: p.isDaily === true // Explicitly convert to boolean
    }));
    
    const dailyPractices = normalizedPractices.filter(p => p.isDaily === true);
    const dailyPracticeIds = dailyPractices.map(p => p.id);
    
    // Force key practices to be daily
    const keyPracticeNames = ["Cold Shower Exposure", "Gratitude Journal", "Focus Breathing (3:3:6)"];
    const keyPracticeIds = normalizedPractices
      .filter(p => keyPracticeNames.includes(p.name))
      .map(p => p.id);
    
    // Make sure key practices are included in dailyPracticeIds
    keyPracticeIds.forEach(id => {
      if (!dailyPracticeIds.includes(id)) {
        dailyPracticeIds.push(id);
      }
    });
    
    console.log(`updateUserDailyPractices: Found ${dailyPracticeIds.length} daily practices to save (including key practices)`);
    dailyPractices.forEach(p => console.log(`Daily practice to be saved: "${p.name}" (ID: ${p.id})`));
    keyPracticeIds.forEach(id => console.log(`Key practice ID to ensure as daily: ${id}`));
    
    try {
      // Get current daily practices to compare with what we want to save
      const { data: currentDailyPractices, error: checkError } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', userId);
      
      if (checkError) {
        console.error('Error checking existing daily practices:', checkError);
        // Continue with our best effort approach
      }
      
      // Current IDs in the database
      const currentIds = (currentDailyPractices || []).map((p: any) => p.practice_id as number);
      console.log(`Current daily practice IDs in database: ${currentIds.join(', ')}`);
      console.log(`Desired daily practice IDs: ${dailyPracticeIds.join(', ')}`);
      
      // Check if the lists are identical (no changes needed)
      const identical = 
        currentIds.length === dailyPracticeIds.length && 
        currentIds.every((id: number) => dailyPracticeIds.includes(id)) &&
        dailyPracticeIds.every(id => currentIds.includes(id));
      
      if (identical) {
        console.log('Daily practices already up to date in database, skipping update');
        return; // Skip the update if no changes needed
      }
      
      // Calculate differences to minimize database operations
      const idsToAdd = dailyPracticeIds.filter((id: number) => !currentIds.includes(id));
      const idsToRemove = currentIds.filter((id: number) => !dailyPracticeIds.includes(id));
      
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
    
    // 1. Get system/default practices
    const { data: systemPractices, error: systemError } = await supabase
      .from('practices')
      .select('*')
      .eq('is_system_practice', true);
    
    if (systemError) {
      console.error('Error loading system practices:', systemError);
      if (systemError.code === '404' || systemError.code === 'PGRST301') {
        console.error('The practices table does not exist in the database.');
      }
      throw systemError;
    }
    
    // 2. Get user-created practices and user-specific data
    const { data: userData, error: userError } = await supabase
      .from('user_practices')
      .select('practices, progress, daily_practices, daily_points, streaks')
      .eq('user_id', userId)
      .single();
    
    if (userError) {
      if (userError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error('Error loading user practices:', userError);
        if (userError.code === '404' || userError.code === 'PGRST301') {
          console.error('The user_practices table does not exist in the database.');
        }
        throw userError;
      } else {
        console.log('No existing user data found. Will initialize with defaults.');
      }
    }
    
    // 3. Get user's daily practice IDs
    let dailyPractices: Array<{practice_id: number}> = [];
    let dailyError = null;
    
    // Only try to fetch daily practices if tables exist
    if (tablesExist) {
      const dailyPracticesResult = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', userId);
      
      dailyPractices = (dailyPracticesResult.data || []).map((p: any) => ({ practice_id: Number(p.practice_id) }));
      dailyError = dailyPracticesResult.error;
      
      if (dailyError) {
        console.error('Error loading daily practices:', dailyError);
        if (dailyError.code === '404' || dailyError.code === 'PGRST301') {
          console.error('The user_daily_practices table does not exist in the database.');
          console.error('Will fall back to using isDaily flags from localStorage or memory');
        }
        // Don't throw - continue with empty daily practices list
        dailyPractices = [];
      }
    } else {
      console.log('Tables do not exist, skipping dailyPractices fetch');
    }
    
    // Use daily_practices from userData if available
    let dailyPracticeIds: number[] = [];
    if (userData && userData.daily_practices && Array.isArray(userData.daily_practices)) {
      dailyPracticeIds = userData.daily_practices;
    } else if (dailyPractices && Array.isArray(dailyPractices)) {
      dailyPracticeIds = dailyPractices.map(row => row.practice_id);
    }
    
    console.log(`Loaded ${dailyPracticeIds.length} daily practice IDs from user_daily_practices table:`, dailyPracticeIds);
    
    // Key practices information (not auto-added to daily by default anymore)
    const keyPracticeNames = ["Cold Shower Exposure", "Gratitude Journal", "Focus Breathing (3:3:6)"];
    
    // No warnings about missing key practices since they're not meant to be auto-added
    
    // Convert system practices to our Practice interface format
    const formattedSystemPractices = systemPractices ? systemPractices.map((p: any) => {
      const isInDailyTable = dailyPracticeIds.includes(p.id as number);
      const isKeyPractice = keyPracticeNames.includes(p.name as string);
      
      // Only mark practices as daily if they're explicitly in the daily table
      const isDaily = isInDailyTable;
      
      console.log(`System practice "${p.name}" (ID: ${p.id}): isDaily=${isDaily}, isKeyPractice=${isKeyPractice}, inDailyTable=${isInDailyTable}`);
      
      
      return {
        id: p.id,
        icon: p.icon,
        name: p.name,
        description: p.description,
        benefits: p.benefits || [],
        duration: p.duration,
        points: p.points,
        completed: false, // Reset completion status for system practices
        streak: 0, // Reset streaks for system practices
        tags: p.tags,
        steps: p.steps,
        source: p.source,
        isSystemPractice: true,
        isDaily: isDaily // Mark as daily if in the user's daily list or if it's a key practice
      };
    }) : [];
    
    console.log(`Loaded ${formattedSystemPractices.length} system practices. Daily practice IDs: ${dailyPracticeIds.join(', ')}`);
    
    // Extract user-created practices and system practice status from userData
    const userPracticesData = (userData?.practices || []) as any[];
    
    // Separate user-created practices from system practice status info
    const userCreatedPractices = userPracticesData.filter((p: any) => p.userCreated === true);
    const systemPracticeStatusData = userPracticesData.filter((p: any) => !p.userCreated && p.id);
    
    console.log(`Found ${userCreatedPractices.length} user-created practices and ${systemPracticeStatusData.length} system practice status entries`);
    
    // Helper function to check if a date is today
    const isToday = (date: Date): boolean => {
      const today = new Date();
      return date.getFullYear() === today.getFullYear() &&
             date.getMonth() === today.getMonth() &&
             date.getDate() === today.getDate();
    };

    // Get the last completion date from user progress to determine if practices should be reset
    const userProgressData = userData?.progress as UserProgress;
    const lastCompletionDate = userProgressData?.lastCompletionDate 
      ? new Date(userProgressData.lastCompletionDate) 
      : null;
    
    const shouldResetCompletion = !lastCompletionDate || !isToday(lastCompletionDate);
    
    if (shouldResetCompletion) {
      console.log('🔄 Resetting practice completion status - practices were not completed today');
    } else {
      console.log('✅ Preserving practice completion status - practices were completed today');
    }
    
    // For user-created practices, update daily status based on dailyPracticeIds
    const formattedUserPractices = userCreatedPractices.map((p: Practice) => {
      const isDaily = dailyPracticeIds.includes(p.id);
      console.log(`User practice "${p.name}" (ID: ${p.id}) isDaily: ${isDaily}`);
      
      return {
        ...p,
        isDaily: isDaily, // Update daily status
        completed: shouldResetCompletion ? false : p.completed // Reset completion status if needed
      };
    });

    // Apply system practice status data (completion and streaks) to the system practices
    const updatedSystemPractices = formattedSystemPractices.map(systemPractice => {
      // Find the status data for this system practice if it exists
      const statusData = systemPracticeStatusData.find((s: any) => s.id === systemPractice.id);
      
      if (statusData) {
        // Apply the saved status, but reset completion if it wasn't completed today
        const updatedPractice = {
          ...systemPractice,
          completed: shouldResetCompletion ? false : (statusData.completed === true),
          streak: statusData.streak || 0,
          // isDaily is already set from dailyPracticeIds above
        };
        
        console.log(`Applied saved status to system practice "${updatedPractice.name}": completed=${updatedPractice.completed} (was ${statusData.completed}, reset=${shouldResetCompletion}), streak=${updatedPractice.streak}, isDaily=${updatedPractice.isDaily}`);
        return updatedPractice;
      }
      
      return systemPractice;
    });
    
    // Combine updated system and user practices
    const allPractices = [
      ...updatedSystemPractices,
      ...formattedUserPractices
    ];
    
    // We no longer automatically add key practices to daily practices
    // All practices (including key ones) must be explicitly added by the user
    console.log(`Loaded ${allPractices.length} total practices, none automatically added to daily practices`);
    
    // Validate and return data
    if (allPractices.length > 0) {
      console.log('Successfully loaded user practices data');
      return {
        practices: allPractices,
        progress: userData?.progress ? {
          ...(userData.progress as any),
          dailyPoints: userData?.daily_points || 0,
          streaks: userData?.streaks || 0
        } : {
          totalPoints: 0,
          level: 1,
          nextLevelPoints: 100,
          streakDays: 0,
          totalCompleted: 0,
          achievements: []
        }
      };
    }
    
    // Return null if no data found
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

/**
 * Create a new SQL file to set up the required tables in Supabase
 */
export function generateDatabaseSetupSQL() {
  return `
-- Create a practices table for system-defined practices
CREATE TABLE IF NOT EXISTS practices (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits JSONB DEFAULT '[]'::jsonb,
  duration INTEGER,
  points INTEGER,
  icon TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  source TEXT,
  is_system_practice BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a user_practices table to store user-specific data
CREATE TABLE IF NOT EXISTS user_practices (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practices JSONB DEFAULT '[]'::jsonb, -- Stores user-created custom practices
  progress JSONB DEFAULT '{}'::jsonb,  -- Stores user progress data
  daily_practices INTEGER[] DEFAULT '{}', -- Stores IDs of daily practices
  daily_points INTEGER DEFAULT 0,        -- Stores total points from daily practices
  streaks INTEGER DEFAULT 0,            -- Stores current streak
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create a table for user daily practices (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_daily_practices (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, practice_id)
);

-- Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_user_daily_practices_user_id ON user_daily_practices(user_id);
  `;
}

/**
 * Verify that the required tables exist in Supabase
 */
export async function checkRequiredTables() {
  try {
    console.log('Checking if required database tables exist...');
    
    // Test queries to see if we can access the tables
    const tables = ['user_practices', 'practices', 'user_daily_practices'];
    const results = [];
    
    for (const table of tables) {
      try {
        console.log(`Checking table: ${table}`);
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1);
          
        if (error) {
          console.error(`Table '${table}' check failed:`, error);
          console.error(`Error code: ${error.code}, Error message: ${error.message}`);
          results.push({ table, exists: false, error });
        } else {
          console.log(`Table '${table}' exists`);
          results.push({ table, exists: true });
        }
      } catch (err) {
        console.error(`Exception checking table '${table}':`, err);
        results.push({ table, exists: false, error: err });
      }
    }
    
    const allTablesExist = results.every(result => result.exists);
    
    if (!allTablesExist) {
      const missingTables = results.filter(r => !r.exists).map(r => r.table);
      console.error('Some required database tables are missing:', missingTables.join(', '));
      console.log('Application will use localStorage for data persistence instead of Supabase');
      
      if (missingTables.includes('user_daily_practices')) {
        console.error('CRITICAL: user_daily_practices table is missing - daily practices will not be properly persisted');
        console.error('To fix this issue, run: npm run setup-db');
      }
    } else {
      console.log('All required tables exist');
    }
    
    // Return the actual status - this helps calling code know if it should rely on the database
    return allTablesExist;
  } catch (error) {
    console.error('Error checking required tables:', error);
    console.log('Application will use localStorage for data persistence due to database connection error');
    // Return true to allow the app to function with localStorage fallback
    return true;
  }
}

/**
 * Additional utility functions can be defined below as needed
 */
