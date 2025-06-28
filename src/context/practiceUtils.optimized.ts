/**
 * practiceUtils.optimized.ts
 * Optimized utilities for practice data that use a single source of truth
 */

import { supabase } from '@/lib/supabase';
import { Practice, UserProgress } from '@/types/PracticeTypes';

/**
 * Simplified practice data storage using a single table approach.
 * This eliminates the need for a separate junction table by making
 * the isDaily flag the single source of truth.
 */
export async function savePracticesOptimized(
  userId: string,
  practices: Practice[],
  userProgress: UserProgress
): Promise<boolean> {
  try {
    if (!userId) {
      console.error('Cannot save practice data: No user ID provided');
      return false;
    }

    console.log(`Saving optimized practice data for user ${userId}`);
    
    // Prepare the data object - keeping all user practice data together
    const practicesData = {
      practices: practices.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        benefits: p.benefits || [],
        duration: p.duration,
        points: p.points,
        isDaily: p.isDaily === true, // Explicit boolean
        completed: p.completed === true, // Explicit boolean
        streak: p.streak || 0,
        tags: p.tags || [],
        source: p.source,
        icon: p.icon,
        steps: p.steps,
        userCreated: p.userCreated === true,
        isSystemPractice: p.isSystemPractice === true,
      })),
      progress: {
        totalPoints: userProgress.totalPoints,
        level: userProgress.level,
        nextLevelPoints: userProgress.nextLevelPoints,
        streakDays: userProgress.streakDays,
        totalCompleted: userProgress.totalCompleted,
        lastCompletionDate: userProgress.lastCompletionDate,
        achievements: userProgress.achievements,
      },
      updated_at: new Date().toISOString()
    };

    // Save to local storage as backup
    localStorage.setItem(`user_practices_optimized_${userId}`, JSON.stringify(practicesData));
    
    // Check if record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('user_practices')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing record:', checkError);
      return false;
    }

    let result;
    
    // Insert or update based on whether record exists
    if (!existingRecord) {
      // Insert new record
      result = await supabase
        .from('user_practices')
        .insert({
          user_id: userId,
          practices_data: practicesData,
          updated_at: new Date().toISOString()
        });
    } else {
      // Update existing record
      result = await supabase
        .from('user_practices')
        .update({
          practices_data: practicesData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }

    if (result.error) {
      console.error('Error saving practice data:', result.error);
      return false;
    }

    console.log('Successfully saved practice data with optimized approach');
    return true;
  } catch (error) {
    console.error('Error in savePracticesOptimized:', error);
    return false;
  }
}

/**
 * Add a practice to daily practices by setting isDaily=true
 * This is a simplified version that only updates the flag, not a separate table
 */
export async function toggleDailyPractice(
  userId: string,
  practiceId: number,
  isDaily: boolean
): Promise<boolean> {
  try {
    // Get current user data
    const { data, error } = await supabase
      .from('user_practices')
      .select('practices_data')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user practice data:', error);
      return false;
    }

    // Update the specific practice's isDaily flag
    const practices = data.practices_data.practices.map(practice =>
      practice.id === practiceId
        ? { ...practice, isDaily }
        : practice
    );

    // Save the updated practices array
    const updated = await savePracticesOptimized(
      userId,
      practices,
      data.practices_data.progress
    );

    return updated;
  } catch (error) {
    console.error(`Error toggling daily status for practice ${practiceId}:`, error);
    return false;
  }
}

/**
 * Get all daily practices for a user - simplified approach using only the isDaily flag
 */
export async function getDailyPractices(userId: string): Promise<Practice[]> {
  try {
    const { data, error } = await supabase
      .from('user_practices')
      .select('practices_data')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching daily practices:', error);
      return [];
    }

    // Filter only daily practices
    return data.practices_data.practices.filter(p => p.isDaily === true);
  } catch (error) {
    console.error('Error in getDailyPractices:', error);
    return [];
  }
}

/**
 * Load cached practice data from localStorage - used as fallback
 */
export function loadCachedPracticeData(userId: string) {
  try {
    const storedData = localStorage.getItem(`user_practices_optimized_${userId}`);
    if (!storedData) return null;
    
    const parsedData = JSON.parse(storedData);
    
    return {
      practices: parsedData.practices || [],
      progress: parsedData.progress || { totalPoints: 0, level: 1, streakDays: 0, totalCompleted: 0, achievements: [] }
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}
