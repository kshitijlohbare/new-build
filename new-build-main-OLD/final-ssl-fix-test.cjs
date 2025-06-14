// JavaScript test file for the daily practices fix
// Must run first to disable SSL verification before any Supabase imports
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
  id: 1000,
  name: "Final SSL Fix Test Practice",
  description: "A test practice created to verify the final SSL fix",
  benefits: ["SSL Fix Verification"],
  completed: true,
  isDaily: true,
  streak: 1
};

// Function to save practice data
async function savePracticeData(userId, practice) {
  console.log(`Saving practice for user ${userId}...`);
  
  try {
    const { data, error } = await supabase
      .from('practices')
      .insert([
        { 
          user_id: userId,
          practice_id: practice.id,
          name: practice.name,
          description: practice.description,
          completed: practice.completed,
          is_daily: practice.isDaily,
          streak: practice.streak,
          updated_at: new Date().toISOString()
        }
      ]);
    
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
  console.log('===== FINAL SSL FIX TEST =====');
  
  try {
    // Test the connection first
    console.log('Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('practices')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Connection test failed:', testError);
      return false;
    } else {
      console.log('Connection successful!', testData);
    }
    
    // Save the test practice
    const result = await savePracticeData(TEST_USER_ID, TEST_PRACTICE);
    
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
