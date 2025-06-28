/**
 * DEPRECATED: This file is no longer used. All daily practices logic has moved to the enhanced system (practicePointsUtils.ts, DailyPracticeContext.tsx).
 * All code that references user_daily_practices is now commented out or removed.
 */

/**
 * practiceUtils.persistence-fix.ts
 * Enhanced utility functions for ensuring Daily Practices persistence
 */

import { supabase } from '@/lib/supabase';
import { Practice } from './PracticeContext';

// Debug level configuration
const DEBUG_LEVEL = {
  VERBOSE: true, // Set to false to reduce console output
};

/**
 * Enhanced function to save daily practice selection
 * - Ensures practices are saved correctly in user_daily_practices table
 * - Provides robust error recovery
 * - Implements multiple persistence approaches for redundancy
 */
export async function ensureDailyPracticesPersistence(userId: string, practices: Practice[]) {
  if (!userId) {
    console.error('Cannot save daily practices: No user ID provided');
    return false;
  }

  try {
    // 1. Filter practices that are explicitly marked as daily (using strict boolean check)
    const dailyPractices = practices.filter(p => p.isDaily === true);
    
    if (DEBUG_LEVEL.VERBOSE) {
      console.log(`[DAILY PRACTICES] Found ${dailyPractices.length} daily practices to save for user ${userId}`);
      dailyPractices.forEach(p => console.log(`[DAILY PRACTICES] ✓ "${p.name}" (ID: ${p.id})`));
    }

    // Early return if there are no daily practices
    if (dailyPractices.length === 0) {
      if (DEBUG_LEVEL.VERBOSE) console.log('[DAILY PRACTICES] No daily practices found, will clear existing entries');
    }

    // 2. Store in localStorage as backup
    saveToLocalStorage(userId, dailyPractices);

    // 3. Database operations - with enhanced error handling
    const dbResult = await saveDailyPracticesToDb(userId, dailyPractices);

    return dbResult;
  } catch (error) {
    console.error('[DAILY PRACTICES] Error in persistence:', error);
    return false;
  }
}

/**
 * Save daily practices to the database with enhanced error recovery
 */
async function saveDailyPracticesToDb(userId: string, dailyPractices: Practice[]) {
  try {
    // 1. Verify the table exists
    const tablesExist = await ensureRequiredTablesExist();
    if (!tablesExist) {
      console.error('[DAILY PRACTICES] Required tables still unavailable after creation attempts');
      return false;
    }

    // 2. Get current daily practices from DB to compare
    const { data: currentPractices, error: fetchError } = await supabase
      .from('user_daily_practices')
      .select('practice_id')
      .eq('user_id', userId);

    if (fetchError) {
      console.error('[DAILY PRACTICES] Error fetching current daily practices:', fetchError);
    }

    const currentPracticeIds = new Set((currentPractices || []).map(p => p.practice_id));
    const desiredPracticeIds = new Set(dailyPractices.map(p => p.id));

    // 3. Calculate changes needed
    const practiceIdsToAdd = [...desiredPracticeIds].filter(id => !currentPracticeIds.has(id));
    const practiceIdsToRemove = [...currentPracticeIds].filter(id => !desiredPracticeIds.has(id));

    if (DEBUG_LEVEL.VERBOSE) {
      console.log(`[DAILY PRACTICES] Changes needed: ${practiceIdsToAdd.length} to add, ${practiceIdsToRemove.length} to remove`);
    }

    // 4. Remove practices no longer marked as daily
    if (practiceIdsToRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from('user_daily_practices')
        .delete()
        .eq('user_id', userId)
        .in('practice_id', practiceIdsToRemove);

      if (deleteError) {
        console.error('[DAILY PRACTICES] Error removing practices no longer daily:', deleteError);
      } else if (DEBUG_LEVEL.VERBOSE) {
        console.log(`[DAILY PRACTICES] Removed ${practiceIdsToRemove.length} practices no longer marked as daily`);
      }
    }

    // 5. Add newly marked daily practices
    if (practiceIdsToAdd.length > 0) {
      const practicesDataToAdd = practiceIdsToAdd.map(practiceId => ({
        user_id: userId,
        practice_id: practiceId,
        added_at: new Date().toISOString()
      }));

      const { error: insertError } = await supabase
        .from('user_daily_practices')
        .insert(practicesDataToAdd);

      if (insertError) {
        console.error('[DAILY PRACTICES] Error adding new daily practices:', insertError);
        
        // Fallback: try inserting one by one for better fault tolerance
        let successCount = 0;
        for (const practice of practicesDataToAdd) {
          const { error: individualError } = await supabase
            .from('user_daily_practices')
            .insert(practice);
            
          if (!individualError) successCount++;
        }
        
        if (DEBUG_LEVEL.VERBOSE) {
          console.log(`[DAILY PRACTICES] Individual insertion fallback: ${successCount}/${practiceIdsToAdd.length} successful`);
        }
      } else if (DEBUG_LEVEL.VERBOSE) {
        console.log(`[DAILY PRACTICES] Added ${practiceIdsToAdd.length} new daily practices`);
      }
    }

    // 6. Force a full replacement approach as final fallback
    if (practiceIdsToAdd.length > 0 || practiceIdsToRemove.length > 0) {
      await forceReplaceDailyPractices(userId, dailyPractices);
    }

    return true;
  } catch (error) {
    console.error('[DAILY PRACTICES] Database operation failed:', error);
    return false;
  }
}

/**
 * Nuclear option: Delete all and recreate
 * Used as a fallback when incremental updates fail
 */
async function forceReplaceDailyPractices(userId: string, dailyPractices: Practice[]) {
  try {
    // 1. Delete all existing records for this user (complete replacement approach)
    const { error: deleteError } = await supabase
      .from('user_daily_practices')
      .delete()
      .eq('user_id', userId);
      
    if (deleteError) {
      console.error('[DAILY PRACTICES] Fallback replacement - Delete error:', deleteError);
      return false;
    }
    
    // Skip insertion if there are no daily practices
    if (dailyPractices.length === 0) return true;

    // 2. Insert all current daily practices
    const practicesDataToAdd = dailyPractices.map(practice => ({
      user_id: userId,
      practice_id: practice.id,
      added_at: new Date().toISOString()
    }));
    
    const { error: insertError } = await supabase
      .from('user_daily_practices')
      .insert(practicesDataToAdd);
    
    if (insertError) {
      console.error('[DAILY PRACTICES] Fallback replacement - Insert error:', insertError);
      return false;
    }
    
    if (DEBUG_LEVEL.VERBOSE) {
      console.log(`[DAILY PRACTICES] Force replaced with ${dailyPractices.length} practices`);
    }
    
    return true;
  } catch (error) {
    console.error('[DAILY PRACTICES] Force replacement failed:', error);
    return false;
  }
}

/**
 * Ensure the required database tables exist
 */
async function ensureRequiredTablesExist() {
  try {
    // Check if the user_daily_practices table exists
    const { error: tableCheckError } = await supabase
      .from('user_daily_practices')
      .select('user_id')
      .limit(1);
    
    // If no error, table exists
    if (!tableCheckError) return true;
    
    // Try to create the table if it doesn't exist
    if (tableCheckError.code === '404' || tableCheckError.code === 'PGRST301') {
      console.log('[DAILY PRACTICES] Table does not exist, creating...');
      
      // Create the table using RPC
      const { error: createError } = await supabase.rpc('create_user_daily_practices_table');
      
      if (createError) {
        console.error('[DAILY PRACTICES] Error creating user_daily_practices table:', createError);
        return false;
      }
      
      return true;
    }
    
    console.error('[DAILY PRACTICES] Error checking for table existence:', tableCheckError);
    return false;
  } catch (error) {
    console.error('[DAILY PRACTICES] Error in table check:', error);
    return false;
  }
}

/**
 * Save daily practices to localStorage as backup
 */
function saveToLocalStorage(userId: string, dailyPractices: Practice[]) {
  try {
    const key = `daily_practices_${userId}`;
    localStorage.setItem(key, JSON.stringify({
      practices: dailyPractices.map(p => ({ id: p.id, name: p.name })),
      updated_at: new Date().toISOString()
    }));
    return true;
  } catch (error) {
    console.error('[DAILY PRACTICES] Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load daily practices from localStorage
 */
export function loadDailyPracticesFromLocalStorage(userId: string) {
  try {
    const key = `daily_practices_${userId}`;
    const data = localStorage.getItem(key);
    if (!data) return [];
    
    const parsed = JSON.parse(data);
    return parsed.practices || [];
  } catch (error) {
    console.error('[DAILY PRACTICES] Error loading from localStorage:', error);
    return [];
  }
}
