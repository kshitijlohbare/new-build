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
      
    if (checkError && checkError.code === '42P01') { // Table doesn't exist error code
      console.log('Table community_delights does not exist, creating it...');
      
      // Create the table
      const { error: createError } = await supabase.rpc('create_community_delights_table');
      
      if (createError) {
        console.error('Error creating community_delights table:', createError);
        return false;
      }
      
      console.log('Successfully created community_delights table');
      return true;
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
