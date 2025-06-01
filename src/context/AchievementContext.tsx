import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { BadgeAnimation } from '@/components/ui/badge-animation';
import { usePractices } from './PracticeContext';
import { useAuth } from '@/context/AuthContext';

// Types
interface Achievement {
  id: string;
  badgeId?: string; // A user-friendly badge ID that will be displayed to users
  name: string;
  description: string;
  icon: string;
}

interface AchievementContextType {
  showAchievementPopup: (achievement: Achievement) => void;
  getAllUserAchievements: () => Achievement[];
}

// Create context
const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Provider component
interface AchievementProviderProps {
  children: ReactNode;
}

// Local storage key for seen achievements
const SEEN_ACHIEVEMENTS_KEY = 'wellbeing_seen_achievements';

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [previousAchievements, setPreviousAchievements] = useState<string[]>([]);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const { userProgress, newAchievements } = usePractices();
  const { user } = useAuth();
  
  // Load previously seen achievements from localStorage on mount
  useEffect(() => {
    if (!user?.id) return;
    
    try {
      const storedAchievements = localStorage.getItem(`${SEEN_ACHIEVEMENTS_KEY}_${user.id}`);
      if (storedAchievements) {
        const parsedAchievements = JSON.parse(storedAchievements);
        setPreviousAchievements(parsedAchievements);
        console.log("Loaded previously seen achievements:", parsedAchievements.length);
      }
    } catch (error) {
      console.error("Error loading seen achievements:", error);
    }
  }, [user?.id]);

  // Unified effect to process achievements from both sources
  useEffect(() => {
    if (!user?.id) return;
    
    // Create an array to hold new achievements from both sources
    let newlyDetectedAchievements: Achievement[] = [];
    
    // Process newAchievements from PracticeContext
    if (newAchievements && newAchievements.length > 0) {
      const filteredFromNewAchievements = newAchievements.filter(
        achievement => !previousAchievements.includes(achievement.id)
      );
      newlyDetectedAchievements = [...newlyDetectedAchievements, ...filteredFromNewAchievements];
    }
    
    // Process userProgress.achievements
    if (userProgress && userProgress.achievements) {
      const filteredFromUserProgress = userProgress.achievements.filter(
        achievement => 
          !previousAchievements.includes(achievement.id) && 
          // Avoid duplicates with achievements already found in newAchievements
          !newlyDetectedAchievements.some(a => a.id === achievement.id)
      );
      newlyDetectedAchievements = [...newlyDetectedAchievements, ...filteredFromUserProgress];
    }
    
    if (newlyDetectedAchievements.length > 0) {
      // Add to queue
      setAchievementQueue(prev => [...prev, ...newlyDetectedAchievements]);
      
      // Record as seen
      const updatedSeenAchievements = [
        ...previousAchievements,
        ...newlyDetectedAchievements.map(a => a.id)
      ];
      
      setPreviousAchievements(updatedSeenAchievements);
      
      // Save to localStorage to persist between sessions
      localStorage.setItem(`${SEEN_ACHIEVEMENTS_KEY}_${user.id}`, JSON.stringify(updatedSeenAchievements));
      
      console.log("New achievements detected:", 
        newlyDetectedAchievements.map(a => a.name).join(', '));
    }
  }, [newAchievements, userProgress?.achievements, previousAchievements, user?.id]);

  // Display achievements from the queue one at a time
  useEffect(() => {
    if (achievementQueue.length > 0 && !currentAchievement) {
      // Get the first achievement from the queue
      const nextAchievement = achievementQueue[0];
      
      // Remove it from the queue
      setAchievementQueue(prev => prev.slice(1));
      
      // Display it
      setCurrentAchievement(nextAchievement);
      
      // Optionally, play a sound effect here
      // const audioEffect = new Audio('/sounds/achievement-unlocked.mp3');
      // audioEffect.play();
    }
  }, [achievementQueue, currentAchievement]);

  // Function to show achievement popup
  const showAchievementPopup = (achievement: Achievement) => {
    if (currentAchievement) {
      // If there's already an achievement showing, add to queue
      setAchievementQueue(prev => [...prev, achievement]);
    } else {
      // Otherwise show immediately
      setCurrentAchievement(achievement);
      
      // Only add to previousAchievements if it's not a test/manual achievement
      if (!achievement.id.includes('test') && !achievement.id.includes('manual') && user?.id) {
        const updatedSeenAchievements = [...previousAchievements, achievement.id];
        setPreviousAchievements(updatedSeenAchievements);
        
        // Save to localStorage to persist between sessions
        localStorage.setItem(`${SEEN_ACHIEVEMENTS_KEY}_${user.id}`, JSON.stringify(updatedSeenAchievements));
      }
    }
  };

  // Handler for closing the popup
  const handleClosePopup = () => {
    setCurrentAchievement(null);
  };
  
  // Function to get all user achievements for display in UI components
  const getAllUserAchievements = (): Achievement[] => {
    if (!userProgress?.achievements) return [];
    // Ensure badges are unique by filtering out duplicates
    const uniqueAchievements = new Map<string, Achievement>();
    userProgress.achievements.forEach((achievement) => {
      if (!uniqueAchievements.has(achievement.id)) {
        // Create a badge ID if it doesn't exist
        const enhancedAchievement = {
          ...achievement,
          badgeId: `BADGE-${achievement.id.substring(0, 6).toUpperCase()}`
        };
        uniqueAchievements.set(achievement.id, enhancedAchievement);
      }
    });
    return Array.from(uniqueAchievements.values());
  };

  return (
    <AchievementContext.Provider value={{ showAchievementPopup, getAllUserAchievements }}>
      {children}
      
      {/* Render the badge animation popup when an achievement is available */}
      {currentAchievement && (
        <BadgeAnimation 
          achievement={currentAchievement}
          onClose={handleClosePopup}
          autoClose={true}
          autoCloseTime={6000}
        />
      )}
    </AchievementContext.Provider>
  );
};

// Custom hook for using the achievement context
export const useAchievement = (): AchievementContextType => {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error('useAchievement must be used within an AchievementProvider');
  }
  return context;
};