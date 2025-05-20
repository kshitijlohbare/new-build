// verify-daily-practices-fix.js
// This script verifies that the daily practices fix works correctly

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configure Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://svnczxevigicuskppyfz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_ANON_KEY is required but not set in env vars');
  process.exit(1);
}

// Test user ID - replace with an actual user ID from your database
const TEST_USER_ID = process.env.TEST_USER_ID || '';

if (!TEST_USER_ID) {
  console.error('TEST_USER_ID is required but not set in env vars');
  console.log('Please provide a user ID to test with');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyDailyPracticesFix() {
  try {
    console.log(`Verifying daily practices fix for user ${TEST_USER_ID}`);
    
    // 1. Get user practices data - this contains isDaily flags
    const { data: userPracticesData, error: userPracticesError } = await supabase
      .from('user_practices')
      .select('practices')
      .eq('user_id', TEST_USER_ID)
      .single();
      
    if (userPracticesError) {
      console.error('Error fetching user practices:', userPracticesError);
      return;
    }
    
    if (!userPracticesData || !userPracticesData.practices) {
      console.log('No user practices data found');
      return;
    }
    
    // Get practices that are marked as daily in the memory
    const practices = userPracticesData.practices || [];
    console.log(`Found ${practices.length} total practices`);
    
    // Check which practices have isDaily=true
    const isDailyPractices = practices.filter(p => p.isDaily === true);
    console.log(`Found ${isDailyPractices.length} practices marked as daily in user_practices data`);
    
    // Log each daily practice
    isDailyPractices.forEach(p => console.log(`- Daily practice in memory: ID=${p.id}, completed=${p.completed}`));
    
    // 2. Get user daily practices from the junction table
    const { data: dailyPracticesJunction, error: dailyPracticesError } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', TEST_USER_ID);
      
    if (dailyPracticesError) {
      console.error('Error fetching user_daily_practices:', dailyPracticesError);
      return;
    }
    
    // IDs of practices in the junction table
    const junctionPracticeIds = (dailyPracticesJunction || []).map(p => p.practice_id);
    console.log(`Found ${junctionPracticeIds.length} practice IDs in user_daily_practices junction table`);
    console.log(`- Junction table IDs: ${junctionPracticeIds.join(', ')}`);
    
    // 3. Check for discrepancies
    const isDailyPracticeIds = isDailyPractices.map(p => p.id);
    
    // Practices that are in memory but not in junction table
    const missingInJunction = isDailyPracticeIds.filter(id => !junctionPracticeIds.includes(id));
    
    // Practices that are in junction table but not in memory
    const extraInJunction = junctionPracticeIds.filter(id => !isDailyPracticeIds.includes(id));
    
    // 4. Log results
    if (missingInJunction.length === 0 && extraInJunction.length === 0) {
      console.log('\n✅ SUCCESS: Daily practices are properly synchronized');
    } else {
      console.warn('\n⚠️ WARNING: Daily practices are NOT properly synchronized');
      
      if (missingInJunction.length > 0) {
        console.log(`Practices marked as daily in memory but missing from junction table: ${missingInJunction.join(', ')}`);
      }
      
      if (extraInJunction.length > 0) {
        console.log(`Practices in junction table but not marked as daily in memory: ${extraInJunction.join(', ')}`);
      }
    }
    
    // 5. Run the cleanup if the -fix flag is provided
    const shouldFix = process.argv.includes('--fix');
    
    if (shouldFix && (missingInJunction.length > 0 || extraInJunction.length > 0)) {
      console.log('\nApplying fixes to synchronize daily practices...');
      
      // Add missing practices to junction table
      if (missingInJunction.length > 0) {
        console.log(`Adding ${missingInJunction.length} missing practices to junction table`);
        
        for (const idToAdd of missingInJunction) {
          const { error: addError } = await supabase
            .from('user_daily_practices')
            .insert({
              user_id: TEST_USER_ID,
              practice_id: idToAdd,
              added_at: new Date().toISOString()
            });
            
          if (addError) {
            console.error(`Error adding practice ID ${idToAdd}:`, addError);
          } else {
            console.log(`Successfully added practice ID ${idToAdd} to junction table`);
          }
        }
      }
      
      // Remove extra practices from junction table
      if (extraInJunction.length > 0) {
        console.log(`Removing ${extraInJunction.length} extra practices from junction table`);
        
        for (const idToRemove of extraInJunction) {
          const { error: removeError } = await supabase
            .from('user_daily_practices')
            .delete()
            .eq('user_id', TEST_USER_ID)
            .eq('practice_id', idToRemove);
            
          if (removeError) {
            console.error(`Error removing practice ID ${idToRemove}:`, removeError);
          } else {
            console.log(`Successfully removed practice ID ${idToRemove} from junction table`);
          }
        }
      }
      
      // Verify fix
      console.log('\nVerifying fixes...');
      const { data: verifyData } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', TEST_USER_ID);
        
      const verifiedIds = (verifyData || []).map(p => p.practice_id).sort();
      const expectedIds = [...isDailyPracticeIds].sort();
      
      const fixSuccessful = 
        verifiedIds.length === expectedIds.length && 
        verifiedIds.every((id, idx) => id === expectedIds[idx]);
        
      if (fixSuccessful) {
        console.log('✅ Fix was successful! Daily practices are now properly synchronized');
      } else {
        console.warn('⚠️ Fix was NOT completely successful');
        console.log(`Expected: ${expectedIds.join(', ')}`);
        console.log(`Actual: ${verifiedIds.join(', ')}`);
      }
    } else if (missingInJunction.length > 0 || extraInJunction.length > 0) {
      console.log('\nTo fix these issues, run this script with the --fix flag:');
      console.log('  node verify-daily-practices-fix.js --fix');
    }
    
  } catch (error) {
    console.error('Error verifying daily practices fix:', error);
  }
}

// Run the verification
verifyDailyPracticesFix()
  .catch(console.error)
  .finally(() => console.log('\nVerification complete'));
