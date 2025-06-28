import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  EnhancedDailyPractice,
  PracticeCompletion,
  PracticeWithPoints,
  addEnhancedDailyPractice,
  removeEnhancedDailyPractice,
  completeEnhancedDailyPractice,
  getUserEnhancedDailyPractices,
  getTodaysPracticeCompletions,
  getPracticesWithPointsInfo,
  calculateLevel,
  // isToday is unused but available in practicePointsUtils if needed
} from './practicePointsUtils';

// Define context interfaces 
export interface DailyPracticeContextType {
  // Data states
  dailyPractices: PracticeWithPoints[];
  todayCompletedPractices: PracticeCompletion[];
  userPoints: number;
  userStreaks: number;
  longestStreak: number;
  levelInfo: {
    level: number;
    nextLevelPoints: number;
    progress: number;
  };
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addToDailyPractices: (practiceId: number) => Promise<boolean>;
  removeFromDailyPractices: (practiceId: number) => Promise<boolean>;
  completePractice: (practiceId: number, durationMinutes: number) => Promise<number>;
  refreshDailyPractices: () => Promise<void>;
}

// Create context with default values
const DailyPracticeContext = createContext<DailyPracticeContextType | undefined>(undefined);

// Provider component
export const DailyPracticeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [dailyPractices, setDailyPractices] = useState<PracticeWithPoints[]>([]);
  const [allPractices, setAllPractices] = useState<PracticeWithPoints[]>([]);
  const [todayCompletedPractices, setTodayCompletedPractices] = useState<PracticeCompletion[]>([]);
  const [enhancedUserPractice, setEnhancedUserPractice] = useState<EnhancedDailyPractice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Computed values
  const userPoints = enhancedUserPractice?.points || 0;
  const userStreaks = enhancedUserPractice?.streaks || 0;
  const longestStreak = enhancedUserPractice?.longest_streak || 0;
  const levelInfo = calculateLevel(userPoints);

  // Load daily practices and user data
  const loadData = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get all practices first
      const practices = await getPracticesWithPointsInfo();
      setAllPractices(practices);
      
      // Get user's enhanced daily practice data
      const userPractice = await getUserEnhancedDailyPractices(user.id);
      setEnhancedUserPractice(userPractice);
      
      // Get today's completed practices
      const todayPractices = await getTodaysPracticeCompletions(user.id);
      setTodayCompletedPractices(todayPractices);
      
      // Filter daily practices
      if (userPractice?.practice_ids) {
        const userDailyPractices = practices.filter(practice => 
          userPractice.practice_ids.includes(practice.id)
        );
        setDailyPractices(userDailyPractices);
      } else {
        setDailyPractices([]);
      }
    } catch (err) {
      console.error('Error loading daily practice data:', err);
      setError('Failed to load daily practice data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Add a practice to daily practices
  const addToDailyPractices = useCallback(async (practiceId: number): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const success = await addEnhancedDailyPractice(user.id, practiceId);
      
      if (success) {
        // Update the local state
        const practiceToAdd = allPractices.find(p => p.id === practiceId);
        if (practiceToAdd) {
          setDailyPractices(prev => [...prev, practiceToAdd]);
        }
        
        // Refresh enhancedUserPractice data
        const userPractice = await getUserEnhancedDailyPractices(user.id);
        setEnhancedUserPractice(userPractice);
      }
      
      return success;
    } catch (err) {
      console.error('Error adding practice to daily practices:', err);
      setError('Failed to add practice to daily practices.');
      return false;
    }
  }, [user?.id, allPractices]);

  // Remove a practice from daily practices
  const removeFromDailyPractices = useCallback(async (practiceId: number): Promise<boolean> => {
    if (!user?.id) return false;
    
    try {
      const success = await removeEnhancedDailyPractice(user.id, practiceId);
      
      if (success) {
        // Update the local state
        setDailyPractices(prev => prev.filter(p => p.id !== practiceId));
        
        // Refresh enhancedUserPractice data
        const userPractice = await getUserEnhancedDailyPractices(user.id);
        setEnhancedUserPractice(userPractice);
      }
      
      return success;
    } catch (err) {
      console.error('Error removing practice from daily practices:', err);
      setError('Failed to remove practice from daily practices.');
      return false;
    }
  }, [user?.id]);

  // Complete a practice and earn points
  const completePractice = useCallback(async (practiceId: number, durationMinutes: number): Promise<number> => {
    if (!user?.id) return 0;
    
    try {
      const pointsEarned = await completeEnhancedDailyPractice(user.id, practiceId, durationMinutes);
      
      if (pointsEarned > 0) {
        // Refresh all data to get the latest information
        await loadData();
      }
      
      return pointsEarned;
    } catch (err) {
      console.error('Error completing practice:', err);
      setError('Failed to mark practice as complete.');
      return 0;
    }
  }, [user?.id, loadData]);

  // Manual refresh function
  const refreshDailyPractices = useCallback(async (): Promise<void> => {
    await loadData();
  }, [loadData]);

  // Load data on mount and when user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Create the context value
  const contextValue: DailyPracticeContextType = {
    dailyPractices,
    todayCompletedPractices, 
    userPoints,
    userStreaks,
    longestStreak,
    levelInfo,
    isLoading,
    error,
    
    addToDailyPractices,
    removeFromDailyPractices,
    completePractice,
    refreshDailyPractices
  };

  return (
    <DailyPracticeContext.Provider value={contextValue}>
      {children}
    </DailyPracticeContext.Provider>
  );
};

// Custom hook to use the context
export function useDailyPractices() {
  const context = useContext(DailyPracticeContext);
  
  if (context === undefined) {
    throw new Error('useDailyPractices must be used within a DailyPracticeProvider');
  }
  
  return context;
}
