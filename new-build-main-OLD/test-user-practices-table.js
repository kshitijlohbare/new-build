// test-user-practices-table.js
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

// Test user ID - using the one from your logs
const testUserId = '32970f20-1fd8-4377-b219-835f9f070cf4';

// Test data
const testPractices = [
  { id: 1, completed: false, streak: 0, isDaily: true },
  { id: 2, completed: false, streak: 0, isDaily: true },
  { id: 4, completed: false, streak: 0, isDaily: true }
];

const testProgress = {
  totalPoints: 100,
  level: 1,
  nextLevelPoints: 200,
  streakDays: 3,
  totalCompleted: 5,
  lastCompletionDate: new Date().toISOString()
};

async function testUserPracticesTable() {
  console.log('Testing user_practices table operations...');
  
  try {
    // First check if there's an existing record
    console.log('Checking for existing record for user:', testUserId);
    
    const { data: existingData, error: checkError } = await supabase
      .from('user_practices')
      .select('*')
      .eq('user_id', testUserId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // Not found error is ok
      console.error('Error checking for existing user practices:', checkError);
      return;
    }
    
    console.log('Existing data found:', existingData ? 'YES' : 'NO');
    
    // Now try to either insert or update
    let result;
    
    if (!existingData) {
      console.log('Inserting new record...');
      
      result = await supabase
        .from('user_practices')
        .insert({
          user_id: testUserId,
          practices: testPractices,
          progress: testProgress,
          updated_at: new Date().toISOString()
        });
        
    } else {
      console.log('Updating existing record...');
      
      // Use the existing data but modify it slightly
      const updatedPractices = existingData.practices.map(p => ({
        ...p,
        streak: (p.streak || 0) + 1 // Increment streak as a test
      }));
      
      const updatedProgress = {
        ...existingData.progress,
        totalPoints: (existingData.progress.totalPoints || 0) + 10,
        streakDays: (existingData.progress.streakDays || 0) + 1
      };
      
      result = await supabase
        .from('user_practices')
        .update({
          practices: updatedPractices,
          progress: updatedProgress,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', testUserId);
    }
    
    if (result.error) {
      console.error('Error saving data:', result.error);
      return;
    }
    
    console.log('Successfully saved user practices data!');
    
    // Now retrieve the data to validate JSONB storage
    console.log('\nRetrieving data to validate...');
    
    const { data: retrievedData, error: retrieveError } = await supabase
      .from('user_practices')
      .select('*')
      .eq('user_id', testUserId)
      .single();
      
    if (retrieveError) {
      console.error('Error retrieving user practices:', retrieveError);
      return;
    }
    
    console.log('Retrieved data:');
    console.log('- User ID:', retrievedData.user_id);
    console.log('- Updated at:', retrievedData.updated_at);
    
    // Check if practices data is stored as JSONB
    if (Array.isArray(retrievedData.practices)) {
      console.log('✅ Practices data is correctly stored as JSONB array');
      console.log(`- Number of practices: ${retrievedData.practices.length}`);
      console.log('- First practice:', retrievedData.practices[0]);
    } else {
      console.error('❌ Practices data is not properly stored as JSONB array');
      console.log('Received:', retrievedData.practices);
    }
    
    // Check if progress data is stored as JSONB
    if (typeof retrievedData.progress === 'object' && retrievedData.progress !== null) {
      console.log('✅ Progress data is correctly stored as JSONB object');
      console.log('- Total points:', retrievedData.progress.totalPoints);
      console.log('- Streak days:', retrievedData.progress.streakDays);
    } else {
      console.error('❌ Progress data is not properly stored as JSONB object');
      console.log('Received:', retrievedData.progress);
    }
    
  } catch (error) {
    console.error('Error testing user_practices table:', error);
  }
}

// Execute
testUserPracticesTable()
  .then(() => console.log('\nTest completed'))
  .catch(error => console.error('\nTest failed:', error));
