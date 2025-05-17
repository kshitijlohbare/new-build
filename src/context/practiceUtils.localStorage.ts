// localStorage utility functions for practice data persistence
// Directly define the Practice interface to avoid circular dependencies
export interface Practice {
  id: number;
  icon?: string;
  name: string;
  description: string;
  benefits: string[];
  duration?: number;
  points?: number;
  completed: boolean;
  streak?: number;
  tags?: string[];
  steps?: {
    title: string;
    description: string;
    imageUrl?: string;
    completed?: boolean;
  }[];
  source?: string;
  stepProgress?: number;
  isDaily?: boolean;
  userCreated?: boolean;
  createdByUserId?: string;
  isSystemPractice?: boolean;
}

interface UserProgress {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  streakDays: number;
  totalCompleted: number;
  lastCompletionDate?: string;
  achievements: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
  }>;
}

// LocalStorage key
const LS_USER_PRACTICES_KEY = 'wellbeing_user_practices';

/**
 * Save practices and progress data to localStorage
 */
export function savePracticeDataToLocalStorage(userId: string, practices: Practice[], userProgress: UserProgress) {
  try {
    // Make a deep copy to ensure we don't store any unwanted references
    const practicesCopy = JSON.parse(JSON.stringify(practices));
    const progressCopy = JSON.parse(JSON.stringify(userProgress));
    
    // Ensure key practices are always marked as daily
    const keyPracticeNames = [
      "Cold Shower Exposure", 
      "Gratitude Journal", 
      "Focus Breathing (3:3:6)"
    ];
    
    practicesCopy.forEach((p: Practice) => {
      if (keyPracticeNames.includes(p.name)) {
        // Always force these key practices to be daily regardless of their current setting
        const oldValue = p.isDaily;
        p.isDaily = true;
        if (oldValue !== true) {
          console.log(`Fixed key practice "${p.name}" to be daily (was ${oldValue})`);
        }
      }
    });
    
    const data = {
      practices: practicesCopy,
      progress: progressCopy,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(`${LS_USER_PRACTICES_KEY}_${userId}`, JSON.stringify(data));
    
    const dailyPractices = practicesCopy.filter((p: Practice) => p.isDaily === true);
    console.log(`Saved ${practicesCopy.length} practices to localStorage for user ${userId}, including ${dailyPractices.length} daily practices`);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load practices and progress data from localStorage
 */
export function loadPracticeDataFromLocalStorage(userId: string) {
  try {
    const data = localStorage.getItem(`${LS_USER_PRACTICES_KEY}_${userId}`);
    if (!data) {
      console.log('No data found in localStorage for user', userId);
      return null;
    }
    
    const parsedData = JSON.parse(data);
    
    // Validate data structure
    if (!parsedData.practices || !Array.isArray(parsedData.practices)) {
      console.error('Invalid practices data in localStorage');
      return null;
    }
    
    // Apply key practice fix when loading too
    const keyPracticeNames = [
      "Cold Shower Exposure", 
      "Gratitude Journal", 
      "Focus Breathing (3:3:6)"
    ];
    
    parsedData.practices.forEach((p: Practice) => {
      if (keyPracticeNames.includes(p.name)) {
        // Always set these key practices to isDaily=true, regardless of their stored value
        const oldValue = p.isDaily;
        p.isDaily = true;
        if (oldValue !== true) {
          console.log(`Fixed key practice "${p.name}" to be daily on load (was ${oldValue})`);
        }
      }
    });
    
    const dailyPractices = parsedData.practices.filter((p: Practice) => p.isDaily === true);
    console.log(`Loaded ${parsedData.practices.length} practices from localStorage, including ${dailyPractices.length} daily practices`);
    
    // Log the daily practices
    if (dailyPractices.length > 0) {
      dailyPractices.forEach((p: Practice) => console.log(`- "${p.name}" (ID: ${p.id})`));
    }
    
    return {
      practices: parsedData.practices,
      progress: parsedData.progress || {
        totalPoints: 0,
        level: 1,
        nextLevelPoints: 50,
        streakDays: 0,
        totalCompleted: 0,
        achievements: []
      }
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Clear practices data from localStorage
 */
export function clearPracticeDataFromLocalStorage(userId: string) {
  try {
    localStorage.removeItem(`${LS_USER_PRACTICES_KEY}_${userId}`);
    console.log('Practice data cleared from localStorage');
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}
