// Test file to check daily practices behavior
// Run with: node test-new-daily-practices.js
import { supabase } from './src/lib/supabase.mjs';

async function testNewDailyPractices() {
  try {
    console.log('Testing daily practices for new users...');

    // 1. Create a test user with a unique ID
    const testUserId = `test-${Date.now()}`;
    console.log(`Using test user ID: ${testUserId}`);

    // 2. Get all available practices
    console.log('Fetching all available practices...');
    const { data: allPractices, error: practicesError } = await supabase
      .from('practices')
      .select('id, name, description')
      .order('id');

    if (practicesError) {
      console.error('Error fetching practices:', practicesError);
      return;
    }

    console.log(`Found ${allPractices.length} total practices`);

    // 3. Check if any daily practices exist for the new user (should be none)
    console.log('Checking daily practices for new user...');
    const { data: dailyPractices, error: dailyError } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', testUserId);

    if (dailyError && dailyError.code !== 'PGRST116') {
      console.error('Error checking daily practices:', dailyError);
    }

    const dailyCount = dailyPractices?.length || 0;
    console.log(`Found ${dailyCount} daily practices for new user (expected: 0)`);

    if (dailyCount > 0) {
      console.warn('❌ Test FAILED: New user has daily practices, but should have none');
      console.log('Daily practices:', dailyPractices);
    } else {
      console.log('✅ Test PASSED: New user has no daily practices');
    }

    // 4. Now let's add a practice to confirm the functionality works correctly
    console.log('\nAdding a test practice to daily practices...');
    const practiceToAdd = allPractices?.[0]?.id;
    
    if (!practiceToAdd) {
      console.error('No practice available to add');
      return;
    }

    const { error: addError } = await supabase
      .from('user_daily_practices')
      .insert({
        user_id: testUserId,
        practice_id: practiceToAdd,
        added_at: new Date().toISOString()
      });

    if (addError) {
      console.error('Error adding practice to daily list:', addError);
    } else {
      console.log(`✅ Successfully added practice ID ${practiceToAdd} to daily practices`);
    }

    // 5. Verify the practice was added
    const { data: updatedDaily } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', testUserId);

    console.log(`After adding: User has ${updatedDaily?.length || 0} daily practices (expected: 1)`);

    // 6. Clean up: remove the test data
    console.log('\nCleaning up test data...');
    const { error: deleteError } = await supabase
      .from('user_daily_practices')
      .delete()
      .eq('user_id', testUserId);

    if (deleteError) {
      console.error('Error cleaning up test data:', deleteError);
    } else {
      console.log('✅ Test data cleaned up successfully');
    }

  } catch (error) {
    console.error('Error during test:', error);
  }
}

// Run the test
testNewDailyPractices();
