import { supabase } from '@/lib/supabaseClient';

// Define interfaces for type safety
export interface EnhancedDailyPractice {
  id: string;
  user_id: string;
  practice_ids: number[];
  points: number;
  streaks: number;
  longest_streak: number;
  last_activity_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface PracticeCompletion {
  id: string;
  user_id: string;
  practice_id: number;
  completed_at: string;
  duration_minutes: number;
  points_earned: number;
  created_at: string;
}

export interface PracticeWithPoints extends Practice {
  points_per_minute: number;
}

export interface Practice {
  id: number;
  name: string;
  description?: string;
  points_per_minute?: number;
  [key: string]: any; // Allow for additional properties
}

/**
 * Add a practice to user's daily practices
 */
export async function addEnhancedDailyPractice(userId: string, practiceId: number): Promise<boolean> {
  // Debug: print current Supabase user before making the RPC call
  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log('[DEBUG] Current Supabase user before add_daily_practice:', userData?.user, 'Error:', userError);
  try {
    const { data, error } = await supabase.rpc('add_daily_practice', {
      p_user_id: userId,
      p_practice_id: practiceId
    });
    
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error adding daily practice:', error);
    return false;
  }
}

/**
 * Remove a practice from user's daily practices
 */
export async function removeEnhancedDailyPractice(userId: string, practiceId: number): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('remove_daily_practice', {
      p_user_id: userId,
      p_practice_id: practiceId
    });
    
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error('Error removing daily practice:', error);
    return false;
  }
}

/**
 * Mark a practice as completed and earn points
 */
export async function completeEnhancedDailyPractice(
  userId: string, 
  practiceId: number, 
  durationMinutes: number
): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('complete_daily_practice', {
      p_user_id: userId,
      p_practice_id: practiceId,
      p_duration_minutes: durationMinutes
    });
    
    if (error) throw error;
    return data || 0; // Return points earned
  } catch (error) {
    console.error('Error completing daily practice:', error);
    return 0;
  }
}

/**
 * Reset daily practice completions - typically would be called by a cron job
 * For this implementation, we'll expose it for testing purposes
 */
export async function resetDailyPracticeCompletions(): Promise<number> {
  try {
    const { data, error } = await supabase.rpc('reset_daily_practice_completions');
    
    if (error) throw error;
    return data || 0; // Return number of users affected
  } catch (error) {
    console.error('Error resetting daily practice completions:', error);
    return 0;
  }
}

/**
 * Get the user's enhanced daily practices
 */
export async function getUserEnhancedDailyPractices(userId: string): Promise<EnhancedDailyPractice | null> {
  try {
    const { data, error } = await supabase
      .from('user_daily_practices_enhanced')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle(); // Use maybeSingle to avoid 406 error if no row exists
    
    if (error) throw error;
    if (!data) return null;
    return data;
  } catch (error) {
    console.error('Error getting enhanced daily practices:', error);
    return null;
  }
}

/**
 * Get the user's practice completions for a specific date range
 */
export async function getUserPracticeCompletions(
  userId: string, 
  startDate?: string, 
  endDate?: string
): Promise<PracticeCompletion[]> {
  try {
    let query = supabase
      .from('practice_completions')
      .select('*')
      .eq('user_id', userId);
      
    if (startDate) {
      query = query.gte('completed_at', startDate);
    }
    
    if (endDate) {
      query = query.lte('completed_at', endDate);
    }
    
    const { data, error } = await query.order('completed_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting practice completions:', error);
    return [];
  }
}

/**
 * Get today's practice completions for a user
 */
export async function getTodaysPracticeCompletions(userId: string): Promise<PracticeCompletion[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return getUserPracticeCompletions(
    userId,
    today.toISOString(),
    tomorrow.toISOString()
  );
}

/**
 * Get practices with their points info
 */
export async function getPracticesWithPointsInfo(): Promise<PracticeWithPoints[]> {
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('*');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting practices with points info:', error);
    return [];
  }
}

/**
 * Get the user's total points
 */
export async function getUserTotalPoints(userId: string): Promise<number> {
  try {
    const { data, error } = await supabase
      .from('user_daily_practices_enhanced')
      .select('points')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data?.points || 0;
  } catch (error) {
    console.error('Error getting user total points:', error);
    return 0;
  }
}

/**
 * Utility function to check if a date is today
 */
export function isToday(date: Date | string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const checkDate = new Date(date);
  return checkDate >= today && checkDate < tomorrow;
}

/**
 * Calculate level based on points
 */
export function calculateLevel(points: number): { 
  level: number; 
  nextLevelPoints: number;
  progress: number;
} {
  // Define level thresholds
  const levels = [
    { threshold: 0, level: 1, next: 50 },
    { threshold: 50, level: 2, next: 150 },
    { threshold: 150, level: 3, next: 300 },
    { threshold: 300, level: 4, next: 500 },
    { threshold: 500, level: 5, next: 750 },
    { threshold: 750, level: 6, next: 1000 },
    { threshold: 1000, level: 7, next: 1500 },
    { threshold: 1500, level: 8, next: 2000 },
    { threshold: 2000, level: 9, next: 3000 },
    { threshold: 3000, level: 10, next: Infinity }
  ];
  
  // Find the highest level that the user has reached
  for (let i = levels.length - 1; i >= 0; i--) {
    if (points >= levels[i].threshold) {
      const currentLevel = levels[i];
      const nextLevel = i < levels.length - 1 ? levels[i + 1] : null;
      
      if (nextLevel) {
        // Calculate progress percentage to next level
        const pointsForThisLevel = points - currentLevel.threshold;
        const pointsNeededForNextLevel = nextLevel.threshold - currentLevel.threshold;
        const progress = Math.floor((pointsForThisLevel / pointsNeededForNextLevel) * 100);
        
        return {
          level: currentLevel.level,
          nextLevelPoints: nextLevel.threshold,
          progress
        };
      } else {
        // Max level reached
        return {
          level: currentLevel.level,
          nextLevelPoints: Infinity,
          progress: 100
        };
      }
    }
  }
  
  // Default if something goes wrong
  return {
    level: 1,
    nextLevelPoints: 50,
    progress: 0
  };
}
