// fix-daily-practices-sync.js
// This script ensures that deleted practices don't reappear in the daily practices list
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configure Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://svnczxevigicuskppyfz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_ANON_KEY is required but not set in env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function fixDailyPracticesSync() {
  try {
    // Step 1: Create a better trigger to keep daily practices in sync
    console.log('Creating trigger to automatically sync daily practices...');
    
    const { error: triggerError } = await supabase.rpc('execute_sql', {
      query: `
      -- First, create or replace the function to handle user_practices updates
      CREATE OR REPLACE FUNCTION sync_daily_practices_on_update()
      RETURNS TRIGGER AS $$
      DECLARE
        practice RECORD;
        daily_practice BOOLEAN;
      BEGIN
        -- When user_practices are updated, check if daily practices need to be updated
        IF (TG_OP = 'UPDATE' OR TG_OP = 'INSERT') THEN
          -- Loop through each practice in the practices array
          FOR practice IN SELECT * FROM jsonb_to_recordset(NEW.practices) AS x(id int, isDaily boolean)
          LOOP
            daily_practice := practice.isDaily;
            
            -- If practice is marked as daily but not in user_daily_practices, add it
            IF daily_practice = true THEN
              INSERT INTO user_daily_practices (user_id, practice_id, added_at)
              VALUES (NEW.user_id, practice.id, NOW())
              ON CONFLICT (user_id, practice_id) DO NOTHING;
            ELSE
              -- If practice is not marked as daily but exists in user_daily_practices, remove it
              DELETE FROM user_daily_practices
              WHERE user_id = NEW.user_id AND practice_id = practice.id;
            END IF;
          END LOOP;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      -- Check if the trigger already exists and drop it if it does
      DROP TRIGGER IF EXISTS sync_daily_practices_trigger ON user_practices;
      
      -- Create the trigger
      CREATE TRIGGER sync_daily_practices_trigger
      AFTER INSERT OR UPDATE ON user_practices
      FOR EACH ROW
      EXECUTE FUNCTION sync_daily_practices_on_update();
      
      -- Add a comment explaining what this trigger does
      COMMENT ON TRIGGER sync_daily_practices_trigger ON user_practices IS 
      'Automatically keeps user_daily_practices table in sync with the isDaily field in the practices jsonb array';
      `
    });
    
    if (triggerError) {
      console.error('Error creating trigger:', triggerError);
    } else {
      console.log('Successfully created trigger to sync daily practices');
    }
    
    // Step 2: Fix any practices that may be out of sync
    console.log('\nGetting all users to check for sync issues...');
    
    const { data: users, error: usersError } = await supabase
      .from('user_practices')
      .select('user_id, practices');
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.log('No users found with practice data');
      return;
    }
    
    console.log(`Found ${users.length} users with practice data`);
    
    // Process each user
    for (const userData of users) {
      const userId = userData.user_id;
      const practices = userData.practices || [];
      
      console.log(`\nProcessing user ${userId} with ${practices.length} practices`);
      
      // Get practices marked as daily in user_practices
      const isDailyPractices = practices.filter(p => p.isDaily === true);
      console.log(`User has ${isDailyPractices.length} practices marked as daily in user_practices data`);
      
      const isDailyPracticeIds = isDailyPractices.map(p => p.id);
      
      // Get practices from junction table
      const { data: dailyPracticesJunction, error: dailyPracticesError } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', userId);
        
      if (dailyPracticesError) {
        console.error(`Error fetching daily practices for user ${userId}:`, dailyPracticesError);
        continue;
      }
      
      const junctionPracticeIds = (dailyPracticesJunction || []).map(p => p.practice_id);
      console.log(`User has ${junctionPracticeIds.length} practices in user_daily_practices junction table`);
      
      // Find differences
      const idsToRemove = junctionPracticeIds.filter(id => !isDailyPracticeIds.includes(id));
      const idsToAdd = isDailyPracticeIds.filter(id => !junctionPracticeIds.includes(id));
      
      console.log(`Changes needed: ${idsToAdd.length} to add, ${idsToRemove.length} to remove`);
      
      // Remove practices that shouldn't be daily
      if (idsToRemove.length > 0) {
        console.log(`Removing ${idsToRemove.length} practices: ${idsToRemove.join(', ')}`);
        
        for (const idToRemove of idsToRemove) {
          const { error: removeError } = await supabase
            .from('user_daily_practices')
            .delete()
            .eq('user_id', userId)
            .eq('practice_id', idToRemove);
          
          if (removeError) {
            console.error(`Error removing practice ID ${idToRemove}:`, removeError);
          }
        }
      }
      
      // Add practices that should be daily
      if (idsToAdd.length > 0) {
        console.log(`Adding ${idsToAdd.length} practices: ${idsToAdd.join(', ')}`);
        
        const practicesDataToAdd = idsToAdd.map(practiceId => ({
          user_id: userId,
          practice_id: practiceId,
          added_at: new Date().toISOString()
        }));
        
        for (const practice of practicesDataToAdd) {
          const { error: addError } = await supabase
            .from('user_daily_practices')
            .insert(practice);
            
          if (addError) {
            console.error(`Error adding practice ID ${practice.practice_id}:`, addError);
          }
        }
      }
    }
    
    console.log('\n✅ Daily practices sync process completed!');
    
  } catch (error) {
    console.error('Error in fixDailyPracticesSync:', error);
  }
}

// Run the function
fixDailyPracticesSync()
  .catch(console.error)
  .finally(() => console.log('Process completed'));
