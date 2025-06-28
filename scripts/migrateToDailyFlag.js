/**
 * migrateToDailyFlag.js
 * A script to migrate from the dual-table approach to the optimized single source of truth approach.
 * This ensures that all daily practices in the junction table have their isDaily flag set correctly.
 */

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (replace with your own values in production)
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'your-service-key'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

/**
 * Migrates user practice data to ensure isDaily flags match junction table entries
 */
async function migrateUserPracticeData() {
  console.log('Starting migration of user practice data...');
  
  try {
    // Get list of all users with practice data
    const { data: users, error: userError } = await supabase
      .from('user_practices')
      .select('user_id');
      
    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }
    
    console.log(`Found ${users.length} users with practice data`);
    
    // Process each user
    let processedCount = 0;
    let errorCount = 0;
    
    for (const user of users) {
      try {
        await migrateUserPractices(user.user_id);
        processedCount++;
        
        // Log progress periodically
        if (processedCount % 10 === 0) {
          console.log(`Processed ${processedCount}/${users.length} users`);
        }
      } catch (error) {
        console.error(`Error processing user ${user.user_id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Migration complete. Processed ${processedCount} users with ${errorCount} errors.`);
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

/**
 * Migrate a single user's practice data
 */
async function migrateUserPractices(userId) {
  // Get user practice data
  const { data: userData, error: practiceError } = await supabase
    .from('user_practices')
    .select('practices_data')
    .eq('user_id', userId)
    .single();
    
  if (practiceError) {
    throw new Error(`Error fetching practice data for user ${userId}: ${practiceError.message}`);
  }
  
  // Get daily practices from junction table
  const { data: dailyPractices, error: dailyError } = await supabase
    .from('user_daily_practices')
    .select('practice_id')
    .eq('user_id', userId);
    
  if (dailyError) {
    throw new Error(`Error fetching daily practices for user ${userId}: ${dailyError.message}`);
  }
  
  // Create a set of practice IDs that should be marked as daily
  const dailyPracticeIds = new Set(dailyPractices.map(p => p.practice_id));
  
  // Create a copy of practices data to modify
  const practicesData = { ...userData.practices_data };
  
  // Update isDaily flag on each practice
  if (Array.isArray(practicesData.practices)) {
    let changesCount = 0;
    
    practicesData.practices = practicesData.practices.map(practice => {
      const shouldBeDaily = dailyPracticeIds.has(practice.id);
      const currentlyDaily = practice.isDaily === true;
      
      // If current state doesn't match desired state, update and count the change
      if (shouldBeDaily !== currentlyDaily) {
        changesCount++;
        return { ...practice, isDaily: shouldBeDaily };
      }
      
      return practice;
    });
    
    // Only update if changes were made
    if (changesCount > 0) {
      console.log(`Updating ${changesCount} practices for user ${userId}`);
      
      // Update the user_practices record
      const { error: updateError } = await supabase
        .from('user_practices')
        .update({ practices_data: practicesData })
        .eq('user_id', userId);
        
      if (updateError) {
        throw new Error(`Error updating practice data for user ${userId}: ${updateError.message}`);
      }
    } else {
      console.log(`No changes needed for user ${userId}`);
    }
  } else {
    console.warn(`User ${userId} has no practices array or invalid format`);
  }
}

/**
 * Verify migration results by comparing isDaily flags with junction table
 */
async function verifyMigration() {
  console.log('Verifying migration results...');
  
  try {
    // Get list of all users with practice data
    const { data: users, error: userError } = await supabase
      .from('user_practices')
      .select('user_id');
      
    if (userError) {
      throw new Error(`Error fetching users: ${userError.message}`);
    }
    
    let inconsistentUsers = 0;
    
    for (const user of users) {
      const userId = user.user_id;
      
      // Get user practice data
      const { data: userData, error: practiceError } = await supabase
        .from('user_practices')
        .select('practices_data')
        .eq('user_id', userId)
        .single();
        
      if (practiceError) continue;
      
      // Get daily practices from junction table
      const { data: dailyPractices, error: dailyError } = await supabase
        .from('user_daily_practices')
        .select('practice_id')
        .eq('user_id', userId);
        
      if (dailyError) continue;
      
      // Create a set of practice IDs that should be marked as daily
      const dailyPracticeIds = new Set(dailyPractices.map(p => p.practice_id));
      
      // Check for inconsistencies
      let hasInconsistencies = false;
      
      if (Array.isArray(userData.practices_data.practices)) {
        for (const practice of userData.practices_data.practices) {
          const shouldBeDaily = dailyPracticeIds.has(practice.id);
          const currentlyDaily = practice.isDaily === true;
          
          if (shouldBeDaily !== currentlyDaily) {
            hasInconsistencies = true;
            break;
          }
        }
      }
      
      if (hasInconsistencies) {
        inconsistentUsers++;
      }
    }
    
    console.log(`Verification complete. Found ${inconsistentUsers} users with inconsistencies.`);
  } catch (error) {
    console.error('Verification failed:', error);
  }
}

// Run the migration
async function runMigration() {
  console.log('=== DATABASE MIGRATION: DAILY PRACTICES ===');
  
  try {
    // First, run the migration
    await migrateUserPracticeData();
    
    // Then verify the results
    await verifyMigration();
    
    console.log('Migration process complete!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
