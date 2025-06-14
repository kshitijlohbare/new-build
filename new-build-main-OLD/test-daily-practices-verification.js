// Daily practices persistence verification script
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Verifies that daily practices are correctly persisted in the database
 * This test script simulates adding and removing practices from daily practices
 * directly, as would happen through the UI.
 */
async function verifyDailyPracticesPersistence() {
  try {
    console.log('==========================================');
    console.log('Daily Practices Persistence Verification');
    console.log('==========================================');

    // Use test user ID from .env or fallback
    const testUserId = process.env.TEST_USER_ID || 'test-user-id';
    console.log(`Testing with user ID: ${testUserId}`);
    
    // 1. First check if we have access to all required tables
    const requiredTables = ['practices', 'user_practices', 'user_daily_practices'];
    let allTablesAccessible = true;
    
    console.log('\n1. Verifying database table access:');
    for (const table of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count(*)')
          .limit(1)
          .single();
          
        if (error) {
          console.error(`❌ Cannot access ${table} table:`, error.message);
          allTablesAccessible = false;
        } else {
          console.log(`✅ Table ${table} is accessible`);
        }
      } catch (err) {
        console.error(`❌ Exception accessing ${table} table:`, err.message);
        allTablesAccessible = false;
      }
    }
    
    if (!allTablesAccessible) {
      console.error('\n❌ Cannot proceed with tests - database tables not accessible');
      return;
    }
    
    // 2. Get current daily practices for the user
    console.log('\n2. Getting current daily practices:');
    let initialDailyPractices = [];
    try {
      const { data, error } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', testUserId);
      
      if (error) {
        console.error('❌ Error retrieving initial daily practices:', error.message);
      } else {
        initialDailyPractices = data || [];
        console.log(`✅ Retrieved ${initialDailyPractices.length} initial daily practices`);
        if (initialDailyPractices.length > 0) {
          console.log('   Daily practice IDs:', initialDailyPractices.map(p => p.practice_id).join(', '));
        }
      }
    } catch (err) {
      console.error('❌ Exception retrieving initial daily practices:', err.message);
    }
    
    // 3. Get available practices from the system
    console.log('\n3. Retrieving available practices:');
    let availablePractices = [];
    try {
      const { data, error } = await supabase
        .from('practices')
        .select('id, name')
        .order('id');
      
      if (error) {
        console.error('❌ Error retrieving available practices:', error.message);
      } else {
        availablePractices = data || [];
        console.log(`✅ Retrieved ${availablePractices.length} available practices`);
        availablePractices.slice(0, 5).forEach(p => {
          console.log(`   - ID: ${p.id}, Name: ${p.name}`);
        });
        if (availablePractices.length > 5) {
          console.log(`   - ... and ${availablePractices.length - 5} more`);
        }
      }
    } catch (err) {
      console.error('❌ Exception retrieving available practices:', err.message);
    }
    
    if (availablePractices.length === 0) {
      console.error('\n❌ Cannot proceed with tests - no practices available');
      return;
    }
    
    // 4. Find a practice that is NOT in daily practices to test adding
    console.log('\n4. Selecting a practice to add to daily practices:');
    const currentDailyIds = initialDailyPractices.map(p => p.practice_id);
    const practiceToAdd = availablePractices.find(p => !currentDailyIds.includes(p.id));
    
    if (!practiceToAdd) {
      console.log('   All practices are already in daily practices. Removing one to test adding it back.');
      // If all practices are in daily, remove one to test adding it back
      const practiceToRemoveTemp = availablePractices[0];
      
      try {
        const { error } = await supabase
          .from('user_daily_practices')
          .delete()
          .eq('user_id', testUserId)
          .eq('practice_id', practiceToRemoveTemp.id);
        
        if (error) {
          console.error(`❌ Error removing practice ${practiceToRemoveTemp.id} for testing:`, error.message);
          return;
        } else {
          console.log(`✅ Temporarily removed practice ${practiceToRemoveTemp.id} (${practiceToRemoveTemp.name}) for testing`);
          practiceToAdd = practiceToRemoveTemp;
        }
      } catch (err) {
        console.error(`❌ Exception removing practice for testing:`, err.message);
        return;
      }
    } else {
      console.log(`✅ Selected practice ID ${practiceToAdd.id} (${practiceToAdd.name}) for testing`);
    }
    
    // 5. Test adding a practice to daily practices
    console.log(`\n5. Adding practice ID ${practiceToAdd.id} to daily practices:`);
    try {
      const { error } = await supabase
        .from('user_daily_practices')
        .insert({
          user_id: testUserId,
          practice_id: practiceToAdd.id,
          added_at: new Date().toISOString()
        });
      
      if (error) {
        console.error(`❌ Error adding practice to daily practices:`, error.message);
      } else {
        console.log(`✅ Successfully added practice ID ${practiceToAdd.id} to daily practices`);
      }
    } catch (err) {
      console.error(`❌ Exception adding practice to daily practices:`, err.message);
    }
    
    // 6. Verify the practice was added
    console.log(`\n6. Verifying practice was added to daily practices:`);
    try {
      const { data, error } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', testUserId)
        .eq('practice_id', practiceToAdd.id);
      
      if (error) {
        console.error(`❌ Error verifying practice addition:`, error.message);
      } else if (data && data.length > 0) {
        console.log(`✅ Confirmed practice ID ${practiceToAdd.id} was added to daily practices`);
      } else {
        console.error(`❌ Practice ID ${practiceToAdd.id} was not found in daily practices!`);
      }
    } catch (err) {
      console.error(`❌ Exception verifying practice addition:`, err.message);
    }
    
    // 7. Test removing the practice from daily practices
    console.log(`\n7. Removing practice ID ${practiceToAdd.id} from daily practices:`);
    try {
      const { error } = await supabase
        .from('user_daily_practices')
        .delete()
        .eq('user_id', testUserId)
        .eq('practice_id', practiceToAdd.id);
      
      if (error) {
        console.error(`❌ Error removing practice from daily practices:`, error.message);
      } else {
        console.log(`✅ Successfully removed practice ID ${practiceToAdd.id} from daily practices`);
      }
    } catch (err) {
      console.error(`❌ Exception removing practice from daily practices:`, err.message);
    }
    
    // 8. Verify the practice was removed
    console.log(`\n8. Verifying practice was removed from daily practices:`);
    try {
      const { data, error } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', testUserId)
        .eq('practice_id', practiceToAdd.id);
      
      if (error) {
        console.error(`❌ Error verifying practice removal:`, error.message);
      } else if (!data || data.length === 0) {
        console.log(`✅ Confirmed practice ID ${practiceToAdd.id} was removed from daily practices`);
      } else {
        console.error(`❌ Practice ID ${practiceToAdd.id} is still in daily practices!`);
      }
    } catch (err) {
      console.error(`❌ Exception verifying practice removal:`, err.message);
    }
    
    // 9. Verify the final state of daily practices matches expected state (should be same as initial)
    console.log(`\n9. Verifying final state of daily practices:`);
    try {
      const { data, error } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', testUserId);
      
      if (error) {
        console.error(`❌ Error verifying final state:`, error.message);
      } else {
        const finalPracticeIds = (data || []).map(p => p.practice_id).sort();
        const initialPracticeIds = initialDailyPractices.map(p => p.practice_id).sort();
        
        const finalMatches = JSON.stringify(finalPracticeIds) === JSON.stringify(initialPracticeIds);
        
        if (finalMatches) {
          console.log(`✅ Final state of daily practices matches initial state`);
          console.log(`   Current daily practice IDs: ${finalPracticeIds.join(', ')}`);
        } else {
          console.log(`⚠️ Final state of daily practices differs from initial state`);
          console.log(`   Initial daily practice IDs: ${initialPracticeIds.join(', ')}`);
          console.log(`   Current daily practice IDs: ${finalPracticeIds.join(', ')}`);
        }
      }
    } catch (err) {
      console.error(`❌ Exception verifying final state:`, err.message);
    }
    
    console.log('\n==========================================');
    console.log('Daily Practices Verification Complete');
    console.log('==========================================');
  } catch (error) {
    console.error('Unhandled error during verification:', error);
  }
}

// Run the verification
verifyDailyPracticesPersistence();
