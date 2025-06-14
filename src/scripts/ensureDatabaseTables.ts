import { supabase } from '@/lib/supabase';

/**
 * Ensures that all required database tables exist for the application
 * @returns {Promise<boolean>} True if all tables were verified or created
 */
export const ensureDatabaseTables = async (): Promise<boolean> => {
  console.log('Starting database table verification...');
  
  try {
    // Check if user_profiles exists
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
      
    if (userProfilesError) {
      console.log('Creating user_profiles table...');
      await supabase.rpc('create_user_profiles_table');
    }

    // Check if user_practices exists
    const { error: userPracticesError } = await supabase
      .from('user_practices')
      .select('user_id')
      .limit(1);
      
    if (userPracticesError) {
      console.log('Creating user_practices table...');
      await supabase.rpc('create_user_practices_table');
    }

    // Check if user_daily_practices exists
    const { error: userDailyPracticesError } = await supabase
      .from('user_daily_practices')
      .select('user_id')
      .limit(1);
      
    if (userDailyPracticesError) {
      console.log('Creating user_daily_practices table...');
      // Create the user_daily_practices table
      const { error: createDailyPracticesError } = await supabase.rpc('create_user_daily_practices_table');
      
      if (createDailyPracticesError) {
        console.error('Error creating user_daily_practices table:', createDailyPracticesError);
        return false;
      }
    }

    // Verify all tables were created successfully
    const { error: finalUserDailyPracticesError } = await supabase
      .from('user_daily_practices')
      .select('user_id')
      .limit(1);
      
    if (finalUserDailyPracticesError && 
        finalUserDailyPracticesError.message !== 'No rows returned by the query' && 
        finalUserDailyPracticesError.code !== 'PGRST116') {
      console.error('Failed to verify user_daily_practices table:', finalUserDailyPracticesError);
      return false;
    }

    console.log('All required database tables verified or created successfully');
    return true;
  } catch (error) {
    console.error('Error ensuring database tables:', error);
    return false;
  }
};

/**
 * Create RPC functions for creating tables if they don't exist
 */
export const createDatabaseFunctions = async (): Promise<boolean> => {
  try {
    // Create function to create user_profiles table
    await supabase.rpc('create_function_to_create_user_profiles_table');
    
    // Create function to create user_practices table
    await supabase.rpc('create_function_to_create_user_practices_table');
    
    // Create function to create user_daily_practices table
    await supabase.rpc('create_function_to_create_user_daily_practices_table');
    
    return true;
  } catch (error) {
    console.error('Error creating database functions:', error);
    return false;
  }
};
