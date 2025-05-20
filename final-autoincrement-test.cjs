// Final SSL fix test with correct table structure and auto-incrementing ID
// SSL verification disabled at the start
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { createClient } = require('@supabase/supabase-js');

// Supabase client setup
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create the Supabase client with SSL verification disabled
const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const TEST_USER_ID = 'test-user-' + Date.now();
const TEST_PRACTICE = {
  name: "Final SSL Fix Test Practice",
  description: "A test practice created to verify the final SSL fix",
  benefits: ["SSL Fix Verification"],
  completed: true,
  is_daily: true,
  streak: 1,
  icon: "test",
  user_created: true,
  created_by_user_id: TEST_USER_ID
};

// Function to save practice data with the correct structure
async function savePractice(userId, practice) {
  console.log(`Saving practice for user ${userId}...`);
  
  try {
    // Map to the correct table structure we discovered
    // Note: Not specifying id field to let database auto-increment it
    const { data, error } = await supabase
      .from('practices')
      .insert([{
        name: practice.name,
        description: practice.description,
        benefits: practice.benefits,
        completed: practice.completed,
        is_daily: practice.is_daily,
        streak: practice.streak,
        icon: practice.icon,
        user_created: practice.user_created,
        created_by_user_id: userId,
        updated_at: new Date().toISOString()
      }])
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return false;
    }
    
    console.log('Data saved successfully:', data);
    return true;
  } catch (e) {
    console.error('Exception during save:', e);
    return false;
  }
}

// Run the test
async function runTest() {
  console.log('===== FINAL SSL FIX TEST WITH CORRECT SCHEMA =====');
  
  try {
    // Test the connection first
    console.log('Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('practices')
      .select('id, name')
      .limit(1);
    
    if (testError) {
      console.error('Connection test failed:', testError);
      return false;
    } else {
      console.log('Connection successful!', testData);
    }
    
    // Save the test practice
    const result = await savePractice(TEST_USER_ID, TEST_PRACTICE);
    
    if (result) {
      console.log('✅ Test passed! Practice data saved successfully.');
      return true;
    } else {
      console.log('❌ Test failed! Could not save practice data.');
      return false;
    }
  } catch (error) {
    console.error('Test error:', error);
    return false;
  }
}

// Execute the test
runTest()
  .then(success => {
    console.log(`\nTest completed with ${success ? 'SUCCESS' : 'FAILURE'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
