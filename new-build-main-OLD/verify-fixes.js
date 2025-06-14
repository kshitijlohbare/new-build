// verify-fixes.js
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

// Test user ID
const testUserId = '32970f20-1fd8-4377-b219-835f9f070cf4';

// Function to verify user_profiles table and queries
async function verifyUserProfiles() {
  console.log('\nVerifying user_profiles table...');
  
  try {
    // Check if we can query user_profiles by ID
    console.log(`Querying user_profiles for user: ${testUserId}`);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, username, display_name')
      .eq('id', testUserId)
      .single();
      
    if (error) {
      console.error('❌ Error querying user_profiles:', error);
      return false;
    }
    
    console.log('✅ Successfully retrieved user profile:', data);
    return true;
  } catch (error) {
    console.error('Error verifying user_profiles:', error);
    return false;
  }
}

// Function to verify user_followers table and queries
async function verifyUserFollowers() {
  console.log('\nVerifying user_followers table...');
  
  try {
    // Check if we can query user_followers
    console.log(`Querying followers for user: ${testUserId}`);
    
    const { data, error } = await supabase
      .from('user_followers')
      .select('follower_id')
      .eq('following_id', testUserId);
      
    if (error) {
      console.error('❌ Error querying user_followers:', error);
      return false;
    }
    
    console.log(`✅ Successfully retrieved followers: ${data.length} followers found`);
    
    // If there are followers, test getting their profiles separately
    if (data.length > 0) {
      const followerIds = data.map(item => item.follower_id);
      
      console.log('Getting profiles for followers...');
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, username, display_name')
        .in('id', followerIds);
        
      if (profilesError) {
        console.error('❌ Error getting follower profiles:', profilesError);
        return false;
      }
      
      console.log(`✅ Successfully retrieved follower profiles: ${profiles.length} profiles found`);
    } else {
      console.log('No followers to get profiles for');
    }
    
    // Try creating a test follower relationship
    try {
      const testFollowerId = '00000000-0000-0000-0000-000000000000'; // Fake ID
      
      // Check if this follower already exists
      const { data: existingFollower } = await supabase
        .from('user_followers')
        .select('id')
        .eq('follower_id', testFollowerId)
        .eq('following_id', testUserId)
        .single();
        
      if (!existingFollower) {
        // Try to create a new user_profile for testing
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            id: testFollowerId,
            username: 'test_follower',
            display_name: 'Test Follower',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
          
        if (profileError) {
          console.log('Note: Could not create test profile (may already exist)');
        }
        
        // Create a follower relationship
        const { error: followerError } = await supabase
          .from('user_followers')
          .insert({
            follower_id: testFollowerId,
            following_id: testUserId,
            created_at: new Date().toISOString()
          });
          
        if (followerError) {
          console.error('❌ Error creating test follower relationship:', followerError);
        } else {
          console.log('✅ Successfully created test follower relationship');
        }
      } else {
        console.log('Test follower relationship already exists');
      }
    } catch (testError) {
      console.error('Error creating test follower:', testError);
    }
    
    return true;
  } catch (error) {
    console.error('Error verifying user_followers:', error);
    return false;
  }
}

// Function to verify user_practices table queries (using proper select)
async function verifyUserPractices() {
  console.log('\nVerifying user_practices table with proper select pattern...');
  
  try {
    // Use the correct pattern - select fields, not count(*)
    const { data, error } = await supabase
      .from('user_practices')
      .select('id, user_id, updated_at')
      .eq('user_id', testUserId);
      
    if (error) {
      console.error('❌ Error querying user_practices:', error);
      return false;
    }
    
    console.log(`✅ Successfully retrieved user_practices using proper select pattern: ${data.length} records found`);
    return true;
  } catch (error) {
    console.error('Error verifying user_practices:', error);
    return false;
  }
}

// Main function to run all verifications
async function verifyAllFixes() {
  console.log('Verifying all database fixes...');
  
  // Check user_profiles
  const profilesFixed = await verifyUserProfiles();
  
  // Check user_followers
  const followersFixed = await verifyUserFollowers();
  
  // Check user_practices with proper query
  const practicesFixed = await verifyUserPractices();
  
  // Summary
  console.log('\n--- VERIFICATION SUMMARY ---');
  console.log(`user_profiles: ${profilesFixed ? '✅ FIXED' : '❌ STILL ISSUES'}`);
  console.log(`user_followers: ${followersFixed ? '✅ FIXED' : '❌ STILL ISSUES'}`);
  console.log(`user_practices: ${practicesFixed ? '✅ FIXED' : '❌ STILL ISSUES'}`);
  
  const allFixed = profilesFixed && followersFixed && practicesFixed;
  console.log(`\nAll issues fixed: ${allFixed ? '✅ YES' : '❌ NO'}`);
}

// Execute
verifyAllFixes()
  .then(() => console.log('\nVerification completed'))
  .catch(error => console.error('\nVerification failed:', error));
