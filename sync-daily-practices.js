// sync-daily-practices.js
// This script synchronizes the daily practices between the application and the database
// Run this to fix issues with daily practices that were supposed to be removed but still appear

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

// Test user ID - replace with your own when running this script
const TEST_USER_ID = process.env.TEST_USER_ID || '';

if (!TEST_USER_ID) {
  console.error('TEST_USER_ID is required but not set in env vars');
  console.log('Please provide a user ID to check their daily practices');
  process.exit(1);
}

async function syncDailyPractices(userId) {
  try {
    console.log(`Synchronizing daily practices for user ${userId}...`);
    
    // 1. First get the user_practices data (contains isDaily flags)
    const { data: userPracticesData, error: userPracticesError } = await supabase
      .from('user_practices')
      .select('practices, progress')
      .eq('user_id', userId)
      .single();
      
    if (userPracticesError) {
      console.error('Error fetching user practices:', userPracticesError);
      return;
    }
    
    if (!userPracticesData || !userPracticesData.practices) {
      console.log('No user practices data found');
      return;
    }
    
    // 2. Get the practices that are marked as daily in the userPracticesData
    const practices = userPracticesData.practices;
    console.log(`Found ${practices.length} total practices in user_practices`);
    
    const isDailyPractices = practices.filter(p => p.isDaily === true);
    console.log(`Found ${isDailyPractices.length} practices marked as daily in user_practices data`);
    isDailyPractices.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
    
    const isDailyPracticeIds = isDailyPractices.map(p => p.id);
    
    // 3. Get the practices that are in the user_daily_practices junction table
    const { data: dailyPracticesJunction, error: dailyPracticesError } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', userId);
      
    if (dailyPracticesError) {
      console.error('Error fetching user_daily_practices:', dailyPracticesError);
      if (dailyPracticesError.code === '42P01') {
        console.error('The user_daily_practices table does not exist. Creating it now...');
        // Table doesn't exist - create it
        const { error: createError } = await supabase.rpc('execute_sql', {
          query: `
            CREATE TABLE IF NOT EXISTS public.user_daily_practices (
              id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
              user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
              practice_id integer NOT NULL,
              added_at timestamp with time zone DEFAULT now(),
              UNIQUE(user_id, practice_id)
            );
            
            COMMENT ON TABLE public.user_daily_practices IS 'Junction table to track which practices are marked as daily for each user';
          `
        });
        
        if (createError) {
          console.error('Failed to create user_daily_practices table:', createError);
        } else {
          console.log('Successfully created user_daily_practices table');
        }
      }
      // Continue with empty array
      dailyPracticesJunction = [];
    }
    
    const junctionPracticeIds = (dailyPracticesJunction || []).map(p => p.practice_id);
    console.log(`Found ${junctionPracticeIds.length} practice IDs in user_daily_practices junction table`);
    console.log(`- Junction table IDs: ${junctionPracticeIds.join(', ')}`);
    
    // 4. Compare the two lists and synchronize them
    
    // a. Find practices that should be removed from the junction table
    const idsToRemove = junctionPracticeIds.filter(id => !isDailyPracticeIds.includes(id));
    
    // b. Find practices that should be added to the junction table
    const idsToAdd = isDailyPracticeIds.filter(id => !junctionPracticeIds.includes(id));
    
    console.log(`\nChanges needed:`);
    console.log(`- ${idsToAdd.length} practices need to be ADDED to user_daily_practices`);
    console.log(`- ${idsToRemove.length} practices need to be REMOVED from user_daily_practices`);
    
    // 5. Make the necessary changes
    
    // a. Remove practices from junction table
    if (idsToRemove.length > 0) {
      console.log(`\nRemoving ${idsToRemove.length} practices from user_daily_practices: ${idsToRemove.join(', ')}`);
      
      for (const idToRemove of idsToRemove) {
        const { error: removeError } = await supabase
          .from('user_daily_practices')
          .delete()
          .eq('user_id', userId)
          .eq('practice_id', idToRemove);
          
        if (removeError) {
          console.error(`Error removing practice ID ${idToRemove}:`, removeError);
        } else {
          console.log(`Successfully removed practice ID ${idToRemove} from daily list`);
        }
      }
    }
    
    // b. Add practices to junction table
    if (idsToAdd.length > 0) {
      console.log(`\nAdding ${idsToAdd.length} practices to user_daily_practices: ${idsToAdd.join(', ')}`);
      
      const practicesDataToAdd = idsToAdd.map(practiceId => ({
        user_id: userId,
        practice_id: practiceId,
        added_at: new Date().toISOString()
      }));
      
      const { error: addError } = await supabase
        .from('user_daily_practices')
        .insert(practicesDataToAdd);
        
      if (addError) {
        console.error('Error adding new daily practices:', addError);
        
        // Try inserting one by one
        console.log('Trying to insert daily practices one by one');
        
        for (const practice of practicesDataToAdd) {
          const { error: individualError } = await supabase
            .from('user_daily_practices')
            .insert(practice);
            
          if (individualError) {
            console.error(`Failed to insert practice ID ${practice.practice_id}:`, individualError);
          } else {
            console.log(`Successfully inserted practice ID ${practice.practice_id}`);
          }
        }
      } else {
        console.log(`Successfully added ${idsToAdd.length} practices to daily list`);
      }
    }
    
    // 6. Verify the final state
    const { data: finalData } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', userId);
    
    const finalIds = (finalData || []).map(p => p.practice_id).sort();
    console.log(`\nFinal daily practices in database: ${finalIds.join(', ')}`);
    
    // Check if our operation was successful
    const expectedIds = [...isDailyPracticeIds].sort();
    const successful = 
      finalIds.length === expectedIds.length && 
      finalIds.every((id, idx) => id === expectedIds[idx]);
    
    if (successful) {
      console.log('\n✅ Daily practices successfully synchronized with database');
    } else {
      console.warn('\n⚠️ Daily practices may not be fully synchronized with database');
      console.log(`Expected: ${expectedIds.join(', ')}`);
      console.log(`Actual: ${finalIds.join(', ')}`);
    }
    
  } catch (error) {
    console.error('Error synchronizing daily practices:', error);
  }
}

// Run the sync function
syncDailyPractices(TEST_USER_ID)
  .catch(console.error)
  .finally(() => console.log('\nSync process completed!'));
