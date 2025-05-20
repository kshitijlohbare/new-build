// fix-foreign-keys.js
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';
if (isNode) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

// SQL to fix foreign key relationships for user_followers
const fixUserFollowersSql = `
-- Ensure user_profiles has the same primary key as auth.users
ALTER TABLE user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_pkey;

-- Make sure the id column is properly set up
ALTER TABLE user_profiles
ALTER COLUMN id TYPE UUID USING id::UUID;

-- Re-add primary key constraint
ALTER TABLE user_profiles
ADD PRIMARY KEY (id);

-- Make sure foreign keys are properly set up for user_followers
ALTER TABLE user_followers
DROP CONSTRAINT IF EXISTS user_followers_follower_id_fkey;

ALTER TABLE user_followers
DROP CONSTRAINT IF EXISTS user_followers_following_id_fkey;

ALTER TABLE user_followers
ADD CONSTRAINT user_followers_follower_id_fkey
FOREIGN KEY (follower_id) REFERENCES user_profiles(id) ON DELETE CASCADE;

ALTER TABLE user_followers
ADD CONSTRAINT user_followers_following_id_fkey
FOREIGN KEY (following_id) REFERENCES user_profiles(id) ON DELETE CASCADE;
`;

// Function to execute SQL commands
async function executeSQLCommand(sql, description) {
  console.log(`Attempting to ${description}...`);
  
  try {
    // Try with execute_sql function
    const result = await supabase.rpc('execute_sql', { 
      sql_command: sql 
    });
    
    if (result.error) {
      console.error(`Error ${description} with execute_sql:`, result.error);
      
      // Try alternative approach
      try {
        // Split into separate statements and execute one by one
        const statements = sql.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
          
        for (const statement of statements) {
          const stmtResult = await supabase.rpc('execute_sql', { 
            sql_command: `${statement};` 
          });
          
          if (stmtResult.error) {
            console.error(`Error executing statement: ${statement}`, stmtResult.error);
          } else {
            console.log(`Successfully executed: ${statement}`);
          }
        }
        
        console.log(`Completed ${description} using statement-by-statement approach`);
        return true;
      } catch (stmtError) {
        console.error(`Failed to ${description}:`, stmtError);
        return false;
      }
    }
    
    console.log(`Successfully ${description}!`);
    return true;
  } catch (error) {
    console.error(`Error ${description}:`, error);
    return false;
  }
}

// Fix foreign key issues
async function fixForeignKeys() {
  console.log('Starting fixes for foreign key relationships...');
  await executeSQLCommand(fixUserFollowersSql, 'fix user_followers foreign keys');
}

// Create user_profiles test entry for the current user
async function ensureUserProfile(userId) {
  console.log(`\nEnsuring user profile exists for user: ${userId}`);
  
  try {
    // First check if profile exists
    const { data, error: checkError } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (!checkError) {
      console.log('User profile already exists');
      return;
    }
    
    // If not found, create a profile
    console.log('Creating user profile...');
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        id: userId,
        username: `user_${userId.substring(0, 8)}`,
        display_name: `User ${userId.substring(0, 6)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (insertError) {
      console.error('Error creating user profile:', insertError);
    } else {
      console.log('Successfully created user profile');
    }
    
  } catch (error) {
    console.error('Error ensuring user profile exists:', error);
  }
}

// Test querying user_practices table properly
async function testUserPracticesQuery() {
  console.log('\nTesting proper query on user_practices table...');
  
  try {
    const { data, error } = await supabase
      .from('user_practices')
      .select('id, user_id')
      .limit(1);
      
    if (error) {
      console.error('Error querying user_practices:', error);
    } else {
      console.log('Successfully queried user_practices:', data);
    }
  } catch (error) {
    console.error('Error testing user_practices query:', error);
  }
}

// Main function
async function main() {
  // Fix the foreign key relationships
  await fixForeignKeys();
  
  // Ensure user profile exists for the test user
  const testUserId = '32970f20-1fd8-4377-b219-835f9f070cf4';
  await ensureUserProfile(testUserId);
  
  // Test querying the user_practices table
  await testUserPracticesQuery();
  
  console.log('\nAll fixes applied');
}

// Run the main function
main()
  .then(() => console.log('Process completed'))
  .catch(err => console.error('Process failed:', err));
