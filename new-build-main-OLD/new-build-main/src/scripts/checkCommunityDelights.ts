import { supabase } from '../lib/supabase';

/**
 * Script to verify the community_delights table exists and create it if needed
 */
export const checkCommunityDelightsTable = async () => {
  try {
    console.log('Checking for community_delights table...');
    
    // First, check if the table exists
    const { error: checkError } = await supabase
      .from('community_delights')
      .select('id')
      .limit(1);
      
    if (checkError && (checkError.code === '42P01' || checkError.message.includes('does not exist'))) { // Table doesn't exist error code
      console.log('Table community_delights does not exist, creating it...');
      
      try {
        // Try with RPC first
        const { error: createError } = await supabase.rpc('create_community_delights_table');
        
        if (createError) {
          console.error('Error using RPC to create community_delights table:', createError);
          
          // Try direct SQL as fallback
          console.log('Trying direct SQL to create community_delights table...');
          const { error: sqlError } = await supabase.rpc('execute_sql', { 
            sql: `
              CREATE TABLE IF NOT EXISTS community_delights (
                id SERIAL PRIMARY KEY,
                text TEXT NOT NULL,
                user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
                username TEXT NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                cheers INTEGER DEFAULT 0,
                comments JSONB DEFAULT '[]'::jsonb
              );
            `
          });
          
          if (sqlError) {
            console.error('Failed to create community_delights table via SQL:', sqlError);
            return false;
          } else {
            console.log('Successfully created community_delights table using SQL');
            return true;
          }
        } else {
          console.log('Successfully created community_delights table using RPC');
          return true;
        }
      } catch (err) {
        console.error('Error trying to create table:', err);
        return false;
      }
    } else if (checkError) {
      console.error('Error checking for community_delights table:', checkError);
      return false;
    } else {
      console.log('community_delights table already exists');
      return true;
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
};

// This function can be imported and used in App initialization or elsewhere
