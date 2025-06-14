const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Tests adding, removing, and persisting daily practices
 */
async function testDailyPracticesPersistence() {
  try {
    console.log('Running enhanced daily practices persistence test...');

    // 1. Check if tables exist
    console.log('Checking database tables...');
    const tables = ['user_practices', 'practices', 'user_daily_practices'];
    
    let allTablesExist = true;
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count(*)')
          .limit(1)
          .single();
          
        if (error) {
          console.error(`Error accessing ${table} table:`, error);
          allTablesExist = false;
        } else {
          console.log(`✅ Table ${table} exists and is accessible`);
        }
      } catch (err) {
        console.error(`Exception checking table ${table}:`, err);
        allTablesExist = false;
      }
    }
    
    if (!allTablesExist) {
      console.error('Some required tables are missing. Please run the database setup script first.');
      return;
    }
    
    // Use a test user ID - replace with a real user ID from your auth system for testing
    // const testUserId = 'e4c3f3a6-8c4d-4a78-a3f3-05534fa58a7f';
    const testUserId = process.env.TEST_USER_ID || 'test-user-id';
    
    // Clear any existing daily practices for clean test
    console.log(`\nClearing existing daily practices for user ${testUserId}...`);
    try {
      const { error: clearError } = await supabase
        .from('user_daily_practices')
        .delete()
        .eq('user_id', testUserId);
        
      if (clearError) {
        console.error('Error clearing existing daily practices:', clearError);
      } else {
        console.log('✅ Successfully cleared existing daily practices');
      }
    } catch (err) {
      console.error('Exception clearing daily practices:', err);
    }
    
    // 2. Add test daily practices
    console.log('\nAdding test daily practices...');
    const testPractices = [1, 2, 4]; // Cold Shower, Gratitude Journal, Focus Breathing
    
    for (const practiceId of testPractices) {
      try {
        // Check if this practice is already daily for this user
        const { data: existing, error: checkError } = await supabase
          .from('user_daily_practices')
          .select('id')
          .eq('user_id', testUserId)
          .eq('practice_id', practiceId)
          .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`Error checking if practice ${practiceId} is already daily:`, checkError);
          continue;
        }
        
        // If already exists, do nothing
        if (existing) {
          console.log(`Practice ID ${practiceId} is already in daily practices - skipping`);
          continue;
        }
        
        // Otherwise add to daily practices
        const { error } = await supabase
          .from('user_daily_practices')
          .insert({
            user_id: testUserId,
            practice_id: practiceId,
            added_at: new Date().toISOString()
          });
        
        if (error) {
          console.error(`Error adding practice ID ${practiceId} to daily:`, error);
        } else {
          console.log(`✅ Successfully added practice ID ${practiceId} to daily practices`);
        }
      } catch (err) {
        console.error(`Exception adding practice ID ${practiceId} to daily:`, err);
      }
    }
    
    // 3. Verify daily practices were added
    console.log('\nVerifying daily practices were added...');
    try {
      const { data: dailyPractices, error } = await supabase
        .from('user_daily_practices')
        .select('practice_id, added_at')
        .eq('user_id', testUserId);
      
      if (error) {
        console.error('Error retrieving daily practices:', error);
      } else if (dailyPractices && dailyPractices.length > 0) {
        console.log(`Found ${dailyPractices.length} daily practices for the user:`);
        dailyPractices.forEach(practice => {
          console.log(`- Practice ID: ${practice.practice_id}, Added at: ${practice.added_at}`);
        });
        
        // Verify all test practices were added
        const addedIds = dailyPractices.map(p => p.practice_id);
        const allPracticesAdded = testPractices.every(id => addedIds.includes(id));
        
        if (allPracticesAdded) {
          console.log('✅ All test practices were successfully added to daily practices');
        } else {
          const missingIds = testPractices.filter(id => !addedIds.includes(id));
          console.error(`❌ Some test practices are missing: ${missingIds.join(', ')}`);
        }
      } else {
        console.error('❌ No daily practices found - insertion failed');
      }
    } catch (err) {
      console.error('Exception verifying daily practices:', err);
    }
    
    // 4. Test removing a practice from daily
    console.log('\nTesting removal of a practice from daily...');
    try {
      // Remove the first practice
      const practiceToRemove = testPractices[0];
      
      const { error } = await supabase
        .from('user_daily_practices')
        .delete()
        .eq('user_id', testUserId)
        .eq('practice_id', practiceToRemove);
      
      if (error) {
        console.error(`Error removing practice ID ${practiceToRemove}:`, error);
      } else {
        console.log(`✅ Successfully removed practice ID ${practiceToRemove} from daily`);
      }
      
      // Verify it was removed
      const { data: remainingPractices, error: checkError } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', testUserId);
      
      if (checkError) {
        console.error('Error checking remaining practices:', checkError);
      } else {
        const remainingIds = remainingPractices.map(p => p.practice_id);
        if (!remainingIds.includes(practiceToRemove)) {
          console.log(`✅ Verified practice ID ${practiceToRemove} was removed`);
        } else {
          console.error(`❌ Practice ID ${practiceToRemove} was not removed`);
        }
      }
    } catch (err) {
      console.error('Exception testing practice removal:', err);
    }
    
    // 5. Get practice details for the daily practices
    console.log('\nFetching practice details for daily practices...');
    try {
      const { data: dailyPractices, error: dailyError } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', testUserId);
      
      if (dailyError) {
        console.error('Error retrieving daily practice IDs:', dailyError);
        return;
      }
      
      if (!dailyPractices || dailyPractices.length === 0) {
        console.log('No daily practices found');
        return;
      }
      
      const dailyPracticeIds = dailyPractices.map(p => p.practice_id);
      
      const { data: practices, error: practicesError } = await supabase
        .from('practices')
        .select('id, name, description')
        .in('id', dailyPracticeIds);
      
      if (practicesError) {
        console.error('Error fetching practice details:', practicesError);
      } else if (practices && practices.length > 0) {
        console.log('Daily practice details:');
        practices.forEach(practice => {
          console.log(`- ID: ${practice.id}, Name: ${practice.name}`);
          console.log(`  Description: ${practice.description.substring(0, 50)}...`);
        });
      } else {
        console.log('No practice details found');
      }
    } catch (err) {
      console.error('Exception fetching practice details:', err);
    }
    
    console.log('\nTests completed!');
  } catch (error) {
    console.error('Unhandled error in tests:', error);
  }
}

// Run the tests
testDailyPracticesPersistence();
