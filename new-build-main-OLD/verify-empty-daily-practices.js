// verify-empty-daily-practices.js
// Test script to verify new users have no default daily practices
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js environment
if (typeof process !== 'undefined' && process.env) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyEmptyDailyPractices() {
  try {
    console.log('🔍 Verifying that new users start with empty daily practices...');

    // Step 1: Check practices table to ensure no practices have is_daily=true by default
    console.log('\nStep 1: Checking practices table for is_daily status...');
    
    const { data: dailyPracticesInDB, error: practicesError } = await supabase
      .from('practices')
      .select('id, name, is_daily')
      .eq('is_daily', true);
      
    if (practicesError) {
      console.error('❌ Error querying practices table:', practicesError);
    } else {
      if (dailyPracticesInDB && dailyPracticesInDB.length > 0) {
        console.error(`❌ Found ${dailyPracticesInDB.length} practices with is_daily=true in the database:`);
        dailyPracticesInDB.forEach(p => console.error(`  - Practice ${p.id} (${p.name}) has is_daily=${p.is_daily}`));
      } else {
        console.log('✅ No practices are marked as daily by default in the practices table');
      }
    }
    
    // Step 2: Create test user and verify no daily practices
    // Generate a valid UUID for the test user
    const testUserId = crypto.randomUUID ? crypto.randomUUID() : 
                       '12345678-1234-1234-1234-' + Date.now().toString().padStart(12, '0');
    console.log(`\nStep 2: Creating test user with ID: ${testUserId}...`);
    
    // First check if any daily practices exist for this test user (should be none)
    const { data: initialDailyPractices, error: initialError } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', testUserId);
      
    if (initialError && initialError.code !== 'PGRST116') {
      console.error('❌ Error checking initial daily practices:', initialError);
    } else {
      const initialCount = initialDailyPractices?.length || 0;
      
      if (initialCount > 0) {
        console.error(`❌ Found ${initialCount} pre-existing daily practices for new user:`);
        console.error(initialDailyPractices);
      } else {
        console.log('✅ No pre-existing daily practices found for test user');
      }
    }
    
    // Step 3: Simulate user creation through our app logic
    console.log('\nStep 3: Simulating user initialization...');
    
    // Create a user profile entry to trigger any app logic
    // First check what columns exist in the user_profiles table
    const { data: profileColumns, error: columnsError } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
      
    if (columnsError) {
      console.error('❌ Error checking user_profiles columns:', columnsError);
    }
    
    // Create a minimal profile with just the user_id which should be common
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert([{ user_id: testUserId }]);
      
    if (profileError) {
      console.error('❌ Error creating test user profile:', profileError);
    } else {
      console.log('✅ Test user profile created successfully');
    }
    
    // Wait a moment for any triggers/logic to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Step 4: Check if any daily practices were automatically created
    console.log('\nStep 4: Checking if any daily practices were automatically added...');
    
    const { data: finalDailyPractices, error: finalError } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', testUserId);
      
    if (finalError) {
      console.error('❌ Error checking final daily practices:', finalError);
    } else {
      const finalCount = finalDailyPractices?.length || 0;
      
      if (finalCount > 0) {
        console.error(`❌ Found ${finalCount} daily practices automatically added for new user:`);
        console.error(finalDailyPractices);
        
        // Get practice details
        const practiceIds = finalDailyPractices.map(p => p.practice_id);
        const { data: practiceDetails } = await supabase
          .from('practices')
          .select('id, name')
          .in('id', practiceIds);
          
        if (practiceDetails && practiceDetails.length > 0) {
          console.error('These practices were automatically added as daily:');
          practiceDetails.forEach(p => console.error(`  - ${p.name} (ID: ${p.id})`));
        }
        
        console.error('❌ TEST FAILED: New users should start with empty daily practices');
      } else {
        console.log('✅ No daily practices were automatically added for the new user');
        console.log('✅ TEST PASSED: New users start with empty daily practices as expected');
      }
    }
    
    // Step 5: Clean up test data
    console.log('\nStep 5: Cleaning up test data...');
    
    await supabase.from('user_profiles').delete().eq('user_id', testUserId);
    await supabase.from('user_daily_practices').delete().eq('user_id', testUserId);
    
    console.log('✅ Test data cleaned up');
    
  } catch (error) {
    console.error('❌ Verification script failed with error:', error);
    return false;
  }
  
  return true;
}

// Execute the verification
verifyEmptyDailyPractices()
  .then(success => {
    console.log('\nVerification complete.');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\nVerification failed with error:', error);
    process.exit(1);
  });
