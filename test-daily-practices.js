// Daily practices test script
import { supabase } from './src/lib/supabase.js';

async function testDailyPractices() {
  try {
    console.log('Testing daily practices persistence...');

    // 1. Check if tables exist
    console.log('Checking database tables...');
    const tables = ['user_practices', 'practices', 'user_daily_practices'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count(*)')
          .limit(1)
          .single();
          
        if (error) {
          console.error(`Error accessing ${table} table:`, error);
        } else {
          console.log(`✅ Table ${table} exists and is accessible`);
        }
      } catch (err) {
        console.error(`Exception checking table ${table}:`, err);
      }
    }
    
    // 2. Test getting daily practices for a specific user
    // Note: Replace with an actual user ID from your auth system
    const testUserId = 'e4c3f3a6-8c4d-4a78-a3f3-05534fa58a7f'; // Replace with a real user ID
    
    console.log(`\nLooking for daily practices for user ${testUserId}...`);
    try {
      const { data: dailyPractices, error } = await supabase
        .from('user_daily_practices')
        .select('practice_id, added_at')
        .eq('user_id', testUserId);
      
      if (error) {
        console.error('Error getting daily practices:', error);
      } else if (dailyPractices && dailyPractices.length > 0) {
        console.log(`Found ${dailyPractices.length} daily practices for the user:`);
        console.log(dailyPractices);
        
        // 3. Get the practice details for these daily practices
        console.log('\nFetching practice details...');
        const { data: practices, error: practicesError } = await supabase
          .from('practices')
          .select('id, name, description')
          .in('id', dailyPractices.map(dp => dp.practice_id));
          
        if (practicesError) {
          console.error('Error fetching practice details:', practicesError);
        } else if (practices) {
          console.log('Practice details:');
          console.log(practices);
        } else {
          console.log('No practice details found');
        }
      } else {
        console.log('No daily practices found for this user');
        
        // 4. Let's add some test daily practices
        console.log('\nAdding test daily practices...');
        const testPractices = [1, 2, 4]; // Cold Shower, Gratitude Journal, Focus Breathing
        
        const dailyPracticesData = testPractices.map(practiceId => ({
          user_id: testUserId,
          practice_id: practiceId,
          added_at: new Date().toISOString()
        }));
        
        const { error: insertError } = await supabase
          .from('user_daily_practices')
          .insert(dailyPracticesData);
          
        if (insertError) {
          console.error('Error adding test daily practices:', insertError);
        } else {
          console.log('✅ Successfully added test daily practices');
        }
      }
    } catch (err) {
      console.error('Exception testing daily practices:', err);
    }
  } catch (error) {
    console.error('Error testing daily practices:', error);
  }
}

// Run the test
testDailyPractices();
