// test-user-daily-practices-table.js
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

// List of practice IDs that should be marked as daily
// Based on the log output from your app
const dailyPracticeIds = [1, 2, 4, 15, 16, 17, 18, 19, 20, 21, 22, 23];

async function testUserDailyPracticesTable() {
  console.log('Testing user_daily_practices table operations...');
  
  try {
    // First, check what's currently in the table
    console.log('Checking existing daily practices for user:', testUserId);
    
    const { data: existingData, error: checkError } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', testUserId);
      
    if (checkError) {
      console.error('Error checking existing daily practices:', checkError);
      return;
    }
    
    const existingPracticeIds = (existingData || []).map(row => row.practice_id);
    console.log(`Found ${existingPracticeIds.length} existing daily practices`);
    console.log('Existing practice IDs:', existingPracticeIds);
    
    // Find practice IDs that need to be added
    const practiceIdsToAdd = dailyPracticeIds.filter(id => 
      !existingPracticeIds.includes(id));
      
    console.log(`Need to add ${practiceIdsToAdd.length} new daily practices`);
    
    if (practiceIdsToAdd.length > 0) {
      // Prepare data for insertion
      const rowsToInsert = practiceIdsToAdd.map(practiceId => ({
        user_id: testUserId,
        practice_id: practiceId
      }));
      
      console.log('Inserting new daily practices:', practiceIdsToAdd);
      
      // Insert the new daily practices
      const { error: insertError } = await supabase
        .from('user_daily_practices')
        .insert(rowsToInsert);
        
      if (insertError) {
        console.error('Error inserting daily practices:', insertError);
        return;
      }
      
      console.log('Successfully added new daily practices!');
    }
    
    // Verify the updated list of daily practices
    console.log('\nVerifying updated daily practices...');
    
    const { data: updatedData, error: verifyError } = await supabase
      .from('user_daily_practices')
      .select('practice_id, added_at')
      .eq('user_id', testUserId)
      .order('practice_id', { ascending: true });
      
    if (verifyError) {
      console.error('Error verifying daily practices:', verifyError);
      return;
    }
    
    console.log(`Found ${updatedData.length} daily practices after update`);
    console.log('Current daily practices:');
    
    updatedData.forEach(row => {
      console.log(`- Practice ID: ${row.practice_id}, Added: ${row.added_at}`);
    });
    
    // Verify all expected practice IDs are present
    const currentPracticeIds = updatedData.map(row => row.practice_id);
    const missingIds = dailyPracticeIds.filter(id => 
      !currentPracticeIds.includes(id));
      
    if (missingIds.length === 0) {
      console.log('✅ All expected daily practices are correctly stored in the database');
    } else {
      console.error('❌ Some daily practices are missing in the database:', missingIds);
    }
    
  } catch (error) {
    console.error('Error testing user_daily_practices table:', error);
  }
}

// Execute
testUserDailyPracticesTable()
  .then(() => console.log('\nTest completed'))
  .catch(error => console.error('\nTest failed:', error));
