import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import BadgeAnimation from '@/components/ui/badge-animation';
import { usePractices } from './PracticeContext';

// Types
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface AchievementContextType {
  showAchievementPopup: (achievement: Achievement) => void;
}

// Create context
const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Provider component
interface AchievementProviderProps {
  children: ReactNode;
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [previousAchievements, setPreviousAchievements] = useState<string[]>([]);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const { userProgress, newAchievements } = usePractices();

  // Unified effect to process achievements from both sources
  useEffect(() => {
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
      setPreviousAchievements(prev => [
        ...prev,
        ...newlyDetectedAchievements.map(a => a.id)
      ]);
      
      console.log("New achievements detected:", 
        newlyDetectedAchievements.map(a => a.name).join(', '));
    }
  }, [newAchievements, userProgress?.achievements]);

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
      if (!achievement.id.includes('test') && !achievement.id.includes('manual')) {
        setPreviousAchievements(prev => [...prev, achievement.id]);
      }
    }
  };

  // Handler for closing the popup
  const handleClosePopup = () => {
    setCurrentAchievement(null);
  };

  return (
    <AchievementContext.Provider value={{ showAchievementPopup }}>
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