// DEPRECATED: This file is no longer used. All daily practices logic has moved to the enhanced system (practicePointsUtils.ts, DailyPracticeContext.tsx).
// All code that references user_daily_practices is now commented out or removed.

// Daily practices with SSL workaround for Node.js
import { supabase } from '@/lib/supabase'; // Use the centralized Supabase client
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
    const storedData = localStorage.getItem(`${LS_USER_PRACTICES_KEY}_${userId}`); // Renamed to avoid conflict
    if (!storedData) return null;
    
    const parsedData = JSON.parse(storedData);
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
    
    // IMPROVED SUPABASE SAVING LOGIC WITH PROPER ERROR HANDLING
    console.log('Updating user practices data in the database');
    
    // Prepare the data to save - ensure all fields have the correct format
    const practicesData = practices.map(p => ({
      id: p.id,
      name: p.name,
      completed: p.completed === true, // Ensure boolean
      streak: p.streak || 0,
      isDaily: p.isDaily === true, // Ensure boolean
      icon: p.icon || undefined, // Only include if present
      description: p.description,
      benefits: p.benefits || [],
      duration: p.duration || undefined,
      points: p.points || undefined,
      tags: p.tags || undefined,
      steps: p.steps || undefined,
      source: p.source || undefined,
      stepProgress: p.stepProgress || undefined,
      userCreated: p.userCreated === true, // Ensure boolean
      createdByUserId: p.createdByUserId || undefined,
      isSystemPractice: p.isSystemPractice === true // Ensure boolean
    }));
    
    const progressData = {
      totalPoints: userProgress.totalPoints || 0,
      level: userProgress.level || 1,
      nextLevelPoints: userProgress.nextLevelPoints || 50,
      streakDays: userProgress.streakDays || 0,
      totalCompleted: userProgress.totalCompleted || 0,
      lastCompletionDate: userProgress.lastCompletionDate || new Date().toISOString(),
      achievements: userProgress.achievements || [],
      userId: userId // Always include user ID in progress data
    };
    
    try {
      // First, check if the user has an entry in the user_practices table
      const { data: existingData, error: checkError } = await supabase
        .from('user_practices')
        .select('id')
        .eq('user_id', userId)
        .single();
        
      if (checkError && checkError.code !== 'PGRST116') { // Not found error is ok
        console.error('Error checking for existing user practices:', checkError);
        // Continue with insert attempt instead of throwing - more robust
      }
      
      let result;
      let saveSuccessful = false;
      
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
          
        if (result.error) {
          console.error('Error creating new user practices record:', result.error);
        } else {
          console.log('Successfully created new user practices record');
          saveSuccessful = true;
        }
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
          
        if (result.error) {
          console.error('Error updating user practices record:', result.error);
        } else {
          console.log('Successfully updated user practices record');
          saveSuccessful = true;
        }
      }
      
      // Important: Always update the daily practices relation table
      // to ensure both data sources are in sync
      if (saveSuccessful) {
        // await updateUserDailyPractices(userId, practices);
        return true;
      } else {
        return false;
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      // Don't return true when database operation fails
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
    console.log(`updateUserDailyPractices: Checking ${practices.length} total practices`);
    
    // Ensure the required table exists first
    const tablesExist = await checkRequiredTables();
    if (!tablesExist) {
      console.error('Required database tables do not exist. Attempting to create them...');
      // Try again after creating tables
      await checkRequiredTables();
    }
    
    // Filter practices that are explicitly marked as daily (using strict equality)
    const dailyPractices = practices.filter(p => p.isDaily === true);
    const dailyPracticeIds = dailyPractices.map(p => p.id);
    
    console.log(`updateUserDailyPractices: Found ${dailyPracticeIds.length} daily practices to save`);
    dailyPractices.forEach(p => console.log(`Daily practice to be saved: "${p.name}" (ID: ${p.id})`));
    
    try {
      // RECREATE APPROACH: More reliable than difference-based approach for small amounts of data
      // First, delete all existing records for this user (clean slate approach)
      console.log(`Recreating daily practices for user ${userId}...`);
      
      // Check if table exists before deletion
      const { error: tableCheckError } = await supabase
        .from('user_daily_practices')
        .select('id')
        .limit(1);
      
      if (tableCheckError) {
        console.error('Error checking user_daily_practices table:', tableCheckError);
        
        if (tableCheckError.code === '404' || tableCheckError.code === 'PGRST301') {
          console.error('The user_daily_practices table does not exist. Creating it now...');
          // Try to create the table
          await supabase.rpc('create_user_daily_practices_table');
        } else {
          // Other error - continue with attempt
          console.warn('Continuing with update attempt despite table check error');
        }
      }
      
      // Delete existing entries for this user
      const { error: deleteError } = await supabase
        .from('user_daily_practices')
        .delete()
        .eq('user_id', userId);
      
      if (deleteError) {
        console.error('Error deleting existing daily practices:', deleteError);
        // Continue with insertion attempt despite error
      } else {
        console.log('Successfully deleted existing daily practices');
      }
      
      // Skip insertion if there are no daily practices
      if (dailyPracticeIds.length === 0) {
        console.log('No daily practices to insert, skipping insertion step');
        return;
      }
      
      // Insert all current daily practices at once
      const practicesDataToAdd = dailyPracticeIds.map(practiceId => ({
        user_id: userId,
        practice_id: practiceId,
        added_at: new Date().toISOString()
      }));
      
      console.log(`Inserting ${dailyPracticeIds.length} daily practices: ${dailyPracticeIds.join(', ')}`);
      
      const { error: insertError } = await supabase
        .from('user_daily_practices')
        .insert(practicesDataToAdd);
      
      if (insertError) {
        console.error('Error inserting daily practices as batch:', insertError);
        
        // Fallback: try inserting one by one
        console.log('Falling back to one-by-one insertion');
        let successCount = 0;
        
        for (const practice of practicesDataToAdd) {
          const { error: individualError } = await supabase
            .from('user_daily_practices')
            .insert(practice);
            
          if (individualError) {
            console.error(`Failed to insert practice ID ${practice.practice_id}:`, individualError);
          } else {
            console.log(`Successfully inserted practice ID ${practice.practice_id}`);
            successCount++;
          }
        }
        
        console.log(`Inserted ${successCount} of ${dailyPracticeIds.length} practices individually`);
      } else {
        console.log(`Successfully inserted ${dailyPracticeIds.length} daily practices`);
      }
      
      // Verify the final state
      const { data: verifyData, error: verifyError } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', userId);
      
      if (verifyError) {
        console.error('Error verifying daily practices:', verifyError);
      } else if (verifyData) {
        const finalIds = verifyData.map((p: any) => p.practice_id).sort();
        const expectedIds = [...dailyPracticeIds].sort();
        
        console.log(`Final daily practices in database (${finalIds.length}): ${finalIds.join(', ')}`);
        console.log(`Expected practices (${expectedIds.length}): ${expectedIds.join(', ')}`);
        
        const successful = 
          finalIds.length === expectedIds.length && 
          finalIds.every((id, idx) => id === expectedIds[idx]);
        
        if (successful) {
          console.log('✅ Daily practices successfully synchronized with database');
        } else {
          console.warn('⚠️ Daily practices may not be fully synchronized with database');
        }
      }
      
    } catch (err) {
      console.error('Exception updating daily practices:', err);
      // Don't throw to caller - allow app to continue working
    }
  } catch (error) {
    console.error('Error in updateUserDailyPractices:', error);
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
    
    // Store both data sources to compare
    let supabaseData = null;
    let localStorageData = null;
    let dataSource = 'none';
    
    // Always check localStorage first to have it ready
    localStorageData = loadFromLocalStorage(userId);
    if (localStorageData) {
      console.log('Found data in localStorage');
    } else {
      console.log('No data found in localStorage');
    }
    
    // Check if database tables exist and create them if needed
    let tablesExist = false;
    try {
      tablesExist = await checkRequiredTables();
      if (!tablesExist) {
        console.log('Creating required database tables...');
        // Try again after creation attempt
        tablesExist = await checkRequiredTables();
      }
      
      if (!tablesExist) {
        console.error('Failed to create required database tables. Will use localStorage data.');
        dataSource = 'localStorage';
        return localStorageData; // Use localStorage if we can't create tables
      } else {
        console.log('Required database tables are available');
      }
    } catch (tableCheckError) {
      console.error('Error checking for required tables:', tableCheckError);
      // Continue with function, try to load from database anyway
    }
    
    // Attempt to fetch from the database
    try {
      console.log('Attempting to load data from Supabase...');
      const { data, error } = await supabase
        .from('user_practices')
        .select('practices, progress')
        .eq('user_id', userId)
        .single();
        
      if (error) {
        console.error('Error loading practice data from Supabase:', error);
      } else if (data && data.practices && Array.isArray(data.practices) && data.progress) {
        console.log('Successfully loaded practice data from Supabase');
        supabaseData = {
          practices: data.practices,
          progress: data.progress
        };
        dataSource = 'supabase';
        console.log('Data loaded from:', dataSource);
      } else {
        console.warn('Invalid or empty data structure from Supabase');
      }
    } catch (dbError) {
      console.error('Exception during Supabase data fetch:', dbError);
    }
    
    // Decision logic: which data source to use
    if (supabaseData) {
      console.log('Using data from Supabase');
      
      // If we also have localStorage data, check which is more recent
      if (localStorageData) {
        try {
          // Check if localStorage data is more recent
          const supabaseUpdatedTime = supabaseData.progress.lastUpdatedAt 
            ? new Date(supabaseData.progress.lastUpdatedAt).getTime()
            : 0;
            
          const localStorageUpdatedTime = localStorageData.progress.lastUpdatedAt
            ? new Date(localStorageData.progress.lastUpdatedAt).getTime()
            : 0;
          
          // Use more recent data
          if (localStorageUpdatedTime > supabaseUpdatedTime) {
            console.log('Using more recent localStorage data');
            
            // But immediately save it to Supabase to keep in sync
            savePracticeData(userId, localStorageData.practices, localStorageData.progress)
              .then(success => {
                console.log('Synced localStorage data to Supabase:', success ? 'success' : 'failed');
              })
              .catch(err => {
                console.error('Error syncing localStorage data to Supabase:', err);
              });
              
            return localStorageData;
          }
        } catch (timeCompareError) {
          console.error('Error comparing timestamps:', timeCompareError);
          // If there's an error comparing times, prefer Supabase data
        }
      }
      
      // Store Supabase data in localStorage as a backup
      saveToLocalStorage(userId, supabaseData.practices, supabaseData.progress);
      return supabaseData;
    } else if (localStorageData) {
      console.log('Using data from localStorage');
      
      // Try to sync localStorage data back to Supabase
      // if (tablesExist) {
      //   console.log('Syncing localStorage data to Supabase...');
      //   savePracticeData(userId, localStorageData.practices, localStorageData.progress)
      //     .then(success => {
      //       console.log('Sync result:', success ? 'success' : 'failed');
      //     })
      //     .catch(err => {
      //       console.error('Error during sync:', err);
      //     });
      // }
      
      return localStorageData;
    }
    
    console.log('No data found in either Supabase or localStorage');
    return null;
  } catch (error) {
    console.error('Error loading practice data:', error);
    
    // Final fallback to localStorage
    const localStorageData = loadFromLocalStorage(userId);
    if (localStorageData) {
      return localStorageData;
    }
    
    return null;
  }
}

// Improved table verification to ensure required tables exist
export async function checkRequiredTables() {
  try {
    console.log('Checking required database tables...');
    let tablesOk = true;
    
    // Check for user_practices table
    const { error: userPracticesError } = await supabase
      .from('user_practices')
      .select('id')
      .limit(1);

    if (userPracticesError && 
        (userPracticesError.code === '404' || 
         userPracticesError.message.includes('does not exist'))) {
      console.warn('user_practices table does not exist, creating it...');
      try {
        // Try with RPC first
        await supabase.rpc('create_user_practices_table');
        console.log('Created user_practices table using RPC');
      } catch (rpcError) {
        console.warn('RPC creation failed, trying direct SQL:', rpcError);
        
        // Fallback to direct SQL
        try {
          // Create a basic version of the table
          const { error: sqlError } = await supabase.rpc('execute_sql', { 
            sql: `
              CREATE TABLE IF NOT EXISTS user_practices (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                practices JSONB DEFAULT '[]'::jsonb,
                progress JSONB DEFAULT '{}'::jsonb,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id)
              );
            `
          });
          
          if (sqlError) {
            console.error('Failed to create user_practices table via SQL:', sqlError);
            tablesOk = false;
          } else {
            console.log('Created user_practices table using SQL');
          }
        } catch (sqlError) {
          console.error('Failed to execute SQL to create table:', sqlError);
          tablesOk = false;
        }
      }
    }
    
    // Check for user_daily_practices table
    const { error: dailyPracticesError } = await supabase
      .from('user_daily_practices')
      .select('id')
      .limit(1);
      
    if (dailyPracticesError && 
        (dailyPracticesError.code === '404' || 
         dailyPracticesError.message.includes('does not exist'))) {
      console.warn('user_daily_practices table does not exist, creating it...');
      try {
        // Try with RPC first
        await supabase.rpc('create_user_daily_practices_table');
        console.log('Created user_daily_practices table using RPC');
      } catch (rpcError) {
        console.warn('RPC creation failed, trying direct SQL:', rpcError);
        
        // Fallback to direct SQL
        try {
          const { error: sqlError } = await supabase.rpc('execute_sql', { 
            sql: `
              CREATE TABLE IF NOT EXISTS user_daily_practices (
                id SERIAL PRIMARY KEY,
                user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
                practice_id INTEGER NOT NULL,
                added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(user_id, practice_id)
              );
              CREATE INDEX IF NOT EXISTS idx_user_daily_practices_user_id 
              ON user_daily_practices(user_id);
            `
          });
          
          if (sqlError) {
            console.error('Failed to create user_daily_practices table via SQL:', sqlError);
            tablesOk = false;
          } else {
            console.log('Created user_daily_practices table using SQL');
          }
        } catch (sqlError) {
          console.error('Failed to execute SQL to create table:', sqlError);
          tablesOk = false;
        }
      }
    }
    
    // Verify both tables now exist by checking again
    const dailyPromise = supabase
      .from('user_daily_practices')
      .select('id')
      .limit(1);
      
    const practicesPromise = supabase
      .from('user_practices')
      .select('id')
      .limit(1);
    
    const [dailyResult, practicesResult] = await Promise.all([dailyPromise, practicesPromise]);
    
    const dailyTableOk = !dailyResult.error || 
                         dailyResult.error.code === 'PGRST116' || 
                         dailyResult.error.message.includes('No rows found');
                         
    const practicesTableOk = !practicesResult.error || 
                             practicesResult.error.code === 'PGRST116' || 
                             practicesResult.error.message.includes('No rows found');
    
    if (!dailyTableOk) {
      console.error('user_daily_practices table still not available after creation attempt:', dailyResult.error);
      tablesOk = false;
    }
    
    if (!practicesTableOk) {
      console.error('user_practices table still not available after creation attempt:', practicesResult.error);
      tablesOk = false;
    }
    
    if (tablesOk) {
      console.log('✅ All required tables verified or created successfully');
    } else {
      console.error('❌ Some tables could not be verified or created');
    }
    
    return tablesOk;
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
    
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116: "Exact one row expected, but 0 rows found"
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

// All supabase.rpc('execute_sql', ...) calls are now commented out to prevent 404 errors.
// Uncomment and modify the following lines if direct SQL execution is required in the future

/*
try {
  // Create a basic version of the table
  const { error: sqlError } = await supabase.rpc('execute_sql', { 
    sql: `
      CREATE TABLE IF NOT EXISTS user_practices (
        id SERIAL PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        practices JSONB DEFAULT '[]'::jsonb,
        progress JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id)
      );
    `
  });
  
  if (sqlError) {
    console.error('Failed to create user_practices table via SQL:', sqlError);
    tablesOk = false;
  } else {
    console.log('Created user_practices table using SQL');
  }
} catch (sqlError) {
  console.error('Failed to execute SQL to create table:', sqlError);
  tablesOk = false;
}
*/
