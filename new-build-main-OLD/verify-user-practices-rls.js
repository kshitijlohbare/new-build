// Script to verify that Row Level Security is working correctly
// for user-specific daily practices
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please update your .env file.');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test user IDs (replace with actual test user IDs from your system)
const testUser1Id = 'test-user-1-uuid';
const testUser2Id = 'test-user-2-uuid';

async function verifyRLS() {
  console.log('Verifying Row Level Security for user-specific practices...\n');
  
  // Test 1: Check if practices table is publicly accessible
  console.log('TEST 1: Checking if system practices are visible to all users');
  try {
    const { data: systemPractices, error: systemError } = await supabase
      .from('practices')
      .select('id, name, description')
      .limit(3);
      
    if (systemError) {
      console.error('Error accessing system practices:', systemError);
      console.log('❌ TEST 1 FAILED: Could not access system practices');
    } else if (systemPractices && systemPractices.length > 0) {
      console.log('✅ TEST 1 PASSED: System practices are visible');
      console.log(`Found ${systemPractices.length} system practices`);
    } else {
      console.log('⚠️ TEST 1 INCONCLUSIVE: No system practices found');
    }
  } catch (error) {
    console.error('Exception in TEST 1:', error);
  }
  
  console.log('\n-----------------------------------\n');

  // Test 2: Simulate Test User 1 adding a practice to their daily list
  console.log(`TEST 2: Adding a practice to Test User 1's daily list (${testUser1Id})`);
  try {
    // Add practice ID 1 to test user 1's daily practices
    const { error: addError } = await supabase
      .from('user_daily_practices')
      .insert({
        user_id: testUser1Id,
        practice_id: 1,
        added_at: new Date().toISOString()
      });
      
    if (addError) {
      if (addError.code === '42501') { // Permission denied
        console.log('✅ TEST 2 PASSED: RLS blocked direct insert without auth');
      } else {
        console.error('Error in TEST 2:', addError);
        console.log('❌ TEST 2 FAILED: Error occurred, but not due to RLS restrictions');
      }
    } else {
      console.log('⚠️ TEST 2 INCONCLUSIVE: Insert operation succeeded without auth - RLS might not be enabled');
    }
  } catch (error) {
    console.error('Exception in TEST 2:', error);
  }
  
  console.log('\n-----------------------------------\n');
  
  // Test 3: Simulate login for test users and verify isolation
  console.log('TEST 3: Verifying user data isolation with simulated login');
  console.log('Note: This test needs to be run in the actual app with authenticated users');
  console.log('Steps to verify manually:');
  console.log('1. Log in as User A');
  console.log('2. Add several practices to daily list');
  console.log('3. Log out and log in as User B');
  console.log('4. Verify User B cannot see User A\'s daily practices');
  console.log('5. Add different practices to User B\'s daily list');
  console.log('6. Log back in as User A and verify their list is unchanged');

  console.log('\n-----------------------------------\n');
  console.log('RLS VERIFICATION SUMMARY:');
  console.log('• System practices should be visible to all users');
  console.log('• Each user should only see their own daily practices');
  console.log('• When logged out, no user practices should be accessible');
  console.log('• Each user should only be able to modify their own practices');
}

// Run the verification function
verifyRLS().catch(console.error);
