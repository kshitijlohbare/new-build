import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';

// --- Interfaces (Consider moving to a types file) ---
export interface Practice { // Export the interface
  id: number;
  icon?: string; // Keep icon for DailyPractices
  name: string; // Use name consistently (was title/subtitle before)
  description: string;
  benefits: string[];
  duration?: number;
  points?: number; // Add optional fixed points for non-duration practices
  completed: boolean;
  streak?: number;
  // New fields for detailed steps
  steps?: {
    title: string;
    description: string;
    imageUrl?: string;
    completed?: boolean; // Track completion of individual steps
  }[];
  source?: string; // Attribution (e.g., "Andrew Huberman", "Naval Ravikant")
  stepProgress?: number; // Track overall progress as percentage
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string; 
}

interface UserProgress {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  streakDays: number;
  totalCompleted: number;
  achievements: Achievement[];
}

// --- Achievement Definitions (Consider moving to a constants file) ---
const ALL_ACHIEVEMENTS: (Achievement & { criteria: (progress: UserProgress, practices: Practice[]) => boolean })[] = [
  { id: 'streak_3', name: '3-Day Streak!', description: 'Completed practices 3 days in a row.', icon: '🔥', criteria: (p) => p.streakDays >= 3 },
  { id: 'streak_7', name: '7-Day Streak!', description: 'Completed practices 7 days in a row.', icon: '🚀', criteria: (p) => p.streakDays >= 7 },
  { id: 'level_3', name: 'Level 3', description: 'Achieved Level 3.', icon: '🥉', criteria: (p) => p.level >= 3 },
  { id: 'level_5', name: 'Level 5', description: 'Achieved Level 5.', icon: '🥈', criteria: (p) => p.level >= 5 },
  { id: 'first_cold_shower', name: 'Ice Breaker', description: 'Completed your first cold shower.', icon: '🧊', criteria: (_, practices) => practices.some(pr => pr.name.toLowerCase().includes('cold shower') && pr.completed) },
  { id: 'points_100', name: 'Centurion', description: 'Earned 100 total points.', icon: '💯', criteria: (p) => p.totalPoints >= 100 },
  { id: 'points_250', name: 'Quarter Master', description: 'Earned 250 total points.', icon: '⭐', criteria: (p) => p.totalPoints >= 250 },
  // Fix type error by using boolean comparison
  { id: 'focus_master', name: 'Focus Master', description: 'Completed the 3:3:6 breathing exercise 5 times.', icon: '🧘', criteria: (_, practices) => (practices.find(pr => pr.name.toLowerCase().includes('focus breathing'))?.streak || 0) >= 5 },
  { id: 'digital_detox', name: 'Digital Detox', description: 'Successfully practiced Digital Minimalism.', icon: '📵', criteria: (_, practices) => practices.some(pr => pr.name.toLowerCase().includes('digital minimalism') && pr.completed) },
  // Fix type error by using boolean comparison
  { id: 'grateful_mind', name: 'Grateful Mind', description: 'Maintained a gratitude journal for 3 days.', icon: '🙏', criteria: (_, practices) => (practices.find(pr => pr.name.toLowerCase().includes('gratitude journal'))?.streak || 0) >= 3 },
];

// --- Helper Functions (Consider moving to a utils file) ---
const calculatePoints = (duration?: number): number => {
  // This remains for duration-based points
  return Math.max(1, duration || 1);
};

const calculateLevel = (points: number): { level: number; nextLevelPoints: number } => {
  if (points < 50) return { level: 1, nextLevelPoints: 50 };
  if (points < 150) return { level: 2, nextLevelPoints: 150 };
  if (points < 300) return { level: 3, nextLevelPoints: 300 };
  if (points < 500) return { level: 4, nextLevelPoints: 500 };
  return { level: 5, nextLevelPoints: Infinity }; // Max level 5
};

// --- Initial Data (Consider fetching from API/storage) ---
const INITIAL_PRACTICE_DATA: Practice[] = [
  // Cold Shower Exposure (Andrew Huberman)
  { 
    id: 1, 
    icon: "shower", 
    name: "Cold Shower Exposure", 
    description: "Cold exposure helps improve stress resilience, mood, and cognitive focus.", 
    benefits: ["Improves stress resilience", "Boosts mood", "Enhances cognitive focus", "Reduces inflammation"], 
    duration: 3, 
    completed: false, 
    streak: 0,
    source: "Andrew Huberman",
    steps: [
      {
        title: "Prepare",
        description: "Start with a warm shower and gradually reduce the temperature to 'uncomfortably cold' but safe.",
        imageUrl: "https://images.unsplash.com/photo-1585082041509-7e1e0a4b680e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sZCUyMHNob3dlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Duration",
        description: "Begin with 1–2 minutes and increase gradually over time (e.g., 3–5 minutes). Aim for a total of 11 minutes per week.",
        imageUrl: "https://images.unsplash.com/photo-1536852300-aef6305d2801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGltZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Breathing",
        description: "Maintain steady breathing to avoid hyperventilation. Use the physiological sigh if needed (double inhale followed by a long exhale).",
        imageUrl: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnJlYXRoaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Timing",
        description: "Morning cold showers are ideal for boosting alertness; evening exposure requires more resilience due to circadian rhythm variations.",
        imageUrl: "https://images.unsplash.com/photo-1541480601022-2308c0f02487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vcm5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Optional Movement",
        description: "Move your hands, feet, or knees slightly during immersion to increase the cold sensation and enhance benefits.",
        imageUrl: "https://images.unsplash.com/photo-1584825093731-35ef75c7b6fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvd2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
      }
    ]
  },
  
  // Digital Minimalism
  { 
    id: 6, 
    name: "Digital Minimalism", 
    description: "Digital minimalism enhances productivity and mental clarity by reducing digital clutter.", 
    benefits: ["Improved focus", "Reduced anxiety", "Better sleep", "Enhanced productivity", "Mental clarity"], 
    duration: 120, 
    completed: false, 
    streak: 0,
    source: "Cal Newport",
    steps: [
      {
        title: "Audit Your Tools",
        description: "List all apps, tools, and devices you use. Identify essential ones and eliminate non-essential ones (e.g., social media apps).",
        imageUrl: "https://images.unsplash.com/photo-1556400535-930c858c0968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMGRldG94fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Organize Digital Space",
        description: "Group similar tasks into folders or workspaces; use color-coding for quick access.",
        imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG9yZ2FuaXplJTIwYXBwc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Minimize Notifications",
        description: "Turn off non-essential notifications and enable 'Do Not Disturb' mode during focus periods.",
        imageUrl: "https://images.unsplash.com/photo-1622676666769-65633479bfd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bm90aWZpY2F0aW9uc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Set Boundaries",
        description: "Schedule specific times for checking emails or social media to avoid constant interruptions.",
        imageUrl: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2NoZWR1bGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Full-Screen Mode",
        description: "Use full-screen mode or 'Reader Mode' to minimize distractions while working on tasks.",
        imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXMlMjB3b3JrfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
      }
    ]
  },
  
  // Focus Breathing 3:3:6
  { 
    id: 4, 
    icon: "smelling", 
    name: "Focus Breathing (3:3:6)", 
    description: "This breathing technique calms the nervous system and enhances focus.", 
    benefits: ["Calms the nervous system", "Improves focus", "Reduces stress", "Increases mental clarity"], 
    duration: 5, 
    completed: false, 
    streak: 0,
    source: "Andrew Huberman",
    steps: [
      {
        title: "Posture",
        description: "Sit upright in a comfortable position with relaxed shoulders and neck.",
        imageUrl: "https://images.unsplash.com/photo-1514845994104-1be22149278b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2l0dGluZyUyMHBvc3R1cmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Inhale",
        description: "Breathe in deeply through your nose for 3 seconds, focusing on expanding your belly rather than your chest.",
        imageUrl: "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YnJlYXRoaW5nJTIwaW58ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Hold",
        description: "Hold your breath for 3 seconds without straining.",
        imageUrl: "https://images.unsplash.com/photo-1606471191009-63994c53433b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Exhale",
        description: "Slowly exhale through your mouth for 6 seconds, ensuring the exhale is longer than the inhale to activate the parasympathetic nervous system (calming response).",
        imageUrl: "https://images.unsplash.com/photo-1474418397713-7ede21d49118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnJlYXRoaW5nJTIwb3V0fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Repeat",
        description: "Perform this cycle for 2–5 minutes or until you feel calm and focused.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlbGF4ZWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      }
    ]
  },
  
  // Gratitude Journal
  { 
    id: 2, 
    icon: "moleskine", 
    name: "Gratitude Journal", 
    description: "Gratitude journaling cultivates positivity and mental resilience.", 
    benefits: ["Increases positive outlook", "Reduces stress", "Improves mental health", "Enhances sleep quality"], 
    duration: 10, 
    completed: false, 
    streak: 0,
    source: "Naval Ravikant",
    steps: [
      {
        title: "Choose a Journal",
        description: "Use a physical notebook or a digital app dedicated to gratitude journaling.",
        imageUrl: "https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8am91cm5hbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Daily Practice",
        description: "Write down 3–5 things you're grateful for each day. Focus on small, specific moments (e.g., 'I'm grateful for the sunny weather today').",
        imageUrl: "https://images.unsplash.com/photo-1455849318743-b2233052fcff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8d3JpdGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Consistency",
        description: "Keep it simple to stay consistent; allocate just 2–5 minutes daily.",
        imageUrl: "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29uc2lzdGVuY3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Reflect During Tough Times",
        description: "Revisit past entries when feeling stressed or anxious to shift your mindset toward positivity.",
        imageUrl: "https://images.unsplash.com/photo-1519834022362-cf872776bc7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8cmVmbGVjdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      }
    ]
  },
  
  // Keep other original practices but without detailed steps
  { id: 3, icon: "sun", name: "Morning Sunlight", description: "Wake up active.", benefits: ["Regulates circadian rhythm", "Boosts Vitamin D"], duration: 15, completed: false, streak: 0 },
  { id: 5, name: "Outdoor Walking", description: "Clear your head.", benefits: ["Improves cardiovascular health", "Reduces anxiety"], duration: 30, completed: false, streak: 0 },
  { id: 7, icon: "shower", name: "Evening Cold Rinse", description: "Cool down before bed.", benefits: ["May improve sleep quality", "Reduces inflammation"], duration: 2, completed: false, streak: 0 },
  { id: 8, name: "Mindful Eating", description: "Savor your meals.", benefits: ["Improves digestion", "Increases satisfaction"], duration: 15, completed: false, streak: 0 },
  // Add Share Your Delights
  { 
    id: 9, 
    icon: "sparkles", // Example icon name, replace if needed
    name: "Share Your Delights", 
    description: "Acknowledge and share small joys to cultivate positivity.", 
    benefits: ["Boosts mood", "Increases gratitude", "Strengthens social connections"], 
    points: 5, // Assign fixed points
    completed: false, 
    streak: 0, // Can track streak if desired
    source: "Inspired by The Book of Delights"
  },
];


// --- Context Definition ---
type PracticeContextType = {
  practices: Practice[];
  userProgress: UserProgress;
  togglePracticeCompletion: (id: number) => void;
  updatePracticeDuration: (id: number, duration: number) => void;
  getPracticeById: (id: number) => Practice | undefined;
  toggleStepCompletion: (practiceId: number, stepIndex: number) => void;
  getStepProgress: (practiceId: number) => number;
  addPointsForAction: (points: number, actionName?: string) => void; // Add function to add arbitrary points
  isLoading: boolean;
};

const PracticeContext = createContext<PracticeContextType | undefined>(undefined);

// --- Provider Component ---
interface PracticeProviderProps {
  children: ReactNode;
}

// Function to initialize step completion status
const initializeStepsCompletion = (practices: Practice[]): Practice[] => {
  return practices.map(practice => {
    if (practice.steps && practice.steps.length > 0) {
      return {
        ...practice,
        steps: practice.steps.map(step => ({ ...step, completed: false })),
        stepProgress: 0
      };
    }
    return practice;
  });
};

export const PracticeProvider: React.FC<PracticeProviderProps> = ({ children }) => {
  const [practices, setPractices] = useState<Practice[]>(initializeStepsCompletion(INITIAL_PRACTICE_DATA));
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    nextLevelPoints: 50,
    streakDays: 0,
    totalCompleted: 0,
    achievements: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading

  // --- Effect for Initial Calculation ---
  useEffect(() => {
    // Simulate loading if needed, or fetch data here
    setIsLoading(true);
    const initialCompleted = practices.filter(p => p.completed);
    const initialPoints = initialCompleted.reduce((sum, p) => sum + calculatePoints(p.duration), 0);
    const { level, nextLevelPoints } = calculateLevel(initialPoints);
    // More robust streak calculation needed if based on historical data
    const initialStreak = initialCompleted.length > 0 ? 1 : 0; // Simplified: Assume 1 day streak if any completed initially

    const initialAchievements = ALL_ACHIEVEMENTS
      .filter(ach => ach.criteria({ ...userProgress, totalPoints: initialPoints, level, streakDays: initialStreak }, practices))
      .map(({ criteria, ...rest }) => rest);

    setUserProgress({
      totalPoints: initialPoints,
      level,
      nextLevelPoints,
      streakDays: initialStreak,
      totalCompleted: initialCompleted.length,
      achievements: initialAchievements,
    });
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Recalculate only if initial data source changes (e.g., fetched data)

  // --- Update Logic (Centralized) ---
  // Refactored recalculateProgress to accept points directly
  const recalculateProgressAndAchievements = useCallback((currentPoints: number, updatedPractices: Practice[]) => {
    const { level, nextLevelPoints } = calculateLevel(currentPoints);

    // Basic daily streak logic - Needs improvement for real-world app
    const completedPractices = updatedPractices.filter(p => p.completed);
    const todaysCompletions = completedPractices.length;
    const prevTotalCompleted = userProgress.totalCompleted; // Get previous count
    let newStreak = userProgress.streakDays;
    // Simplified streak logic - needs date tracking for accuracy
    if (todaysCompletions > 0 && prevTotalCompleted === 0) {
        newStreak = 1;
    } else if (todaysCompletions > 0 && prevTotalCompleted > 0) {
        newStreak += 1; // Incrementing daily for now
    } else if (todaysCompletions === 0) {
        newStreak = 0;
    }

    // Check for new achievements
    const currentAchievements = userProgress.achievements;
    const potentialNewProgress = { ...userProgress, totalPoints: currentPoints, level, streakDays: newStreak };
    const newlyEarnedAchievements = ALL_ACHIEVEMENTS
      .filter(ach => !currentAchievements.some(earned => earned.id === ach.id))
      .filter(ach => ach.criteria(potentialNewProgress, updatedPractices))
      .map(({ criteria, ...rest }) => rest);

    setUserProgress(prev => ({
      ...prev,
      totalPoints: currentPoints,
      level,
      nextLevelPoints,
      totalCompleted: completedPractices.length, // Keep this based on practices
      streakDays: newStreak,
      achievements: [...prev.achievements, ...newlyEarnedAchievements],
    }));

    if (newlyEarnedAchievements.length > 0) {
      console.log("New achievements unlocked:", newlyEarnedAchievements.map(a => a.name).join(', '));
      // TODO: Integrate toast notifications if available
    }
  }, [userProgress]); // Dependency includes userProgress for streak/achievement logic

  // Function to add points for specific actions (like sharing a delight)
  const addPointsForAction = useCallback((pointsToAdd: number, actionName: string = 'Action') => {
    console.log(`Adding ${pointsToAdd} points for: ${actionName}`);
    const newTotalPoints = userProgress.totalPoints + pointsToAdd;
    // Pass the current practices state to recalculate achievements correctly
    recalculateProgressAndAchievements(newTotalPoints, practices);
  }, [userProgress.totalPoints, practices, recalculateProgressAndAchievements]);

  const togglePracticeCompletion = useCallback((id: number) => {
    let pointsChange = 0;
    const updatedPractices = practices.map(practice => {
      if (practice.id === id) {
        const nowCompleted = !practice.completed;
        const practicePoints = practice.points ?? calculatePoints(practice.duration);
        pointsChange = nowCompleted ? practicePoints : -practicePoints;
        const updatedStreak = nowCompleted ? (practice.streak || 0) + 1 : 0;
        return { ...practice, completed: nowCompleted, streak: updatedStreak };
      }
      return practice;
    });
    setPractices(updatedPractices);
    // Update total points directly and recalculate
    const newTotalPoints = userProgress.totalPoints + pointsChange;
    recalculateProgressAndAchievements(newTotalPoints, updatedPractices);
  }, [practices, userProgress.totalPoints, recalculateProgressAndAchievements]);

  const updatePracticeDuration = useCallback((id: number, duration: number) => {
    let pointsDifference = 0;
    const updatedPractices = practices.map(practice => {
      if (practice.id === id) {
        if (practice.completed) {
          const oldPoints = practice.points ?? calculatePoints(practice.duration);
          const newPoints = calculatePoints(duration); // Duration change implies calculated points
          pointsDifference = newPoints - oldPoints;
        }
        // Update duration, potentially remove fixed points if duration is now set
        return { ...practice, duration: duration, points: undefined };
      }
      return practice;
    });
    setPractices(updatedPractices);
    if (pointsDifference !== 0) {
       const newTotalPoints = userProgress.totalPoints + pointsDifference;
       recalculateProgressAndAchievements(newTotalPoints, updatedPractices);
    }
  }, [practices, userProgress.totalPoints, recalculateProgressAndAchievements]);

  const getPracticeById = useCallback((id: number) => {
      return practices.find(p => p.id === id);
  }, [practices]);

  const toggleStepCompletion = useCallback((practiceId: number, stepIndex: number) => {
    const updatedPractices = practices.map(practice => {
      if (practice.id === practiceId && practice.steps) {
        const updatedSteps = practice.steps.map((step, index) => {
          if (index === stepIndex) {
            return { ...step, completed: !step.completed };
          }
          return step;
        });
        const completedSteps = updatedSteps.filter(step => step.completed).length;
        const stepProgress = (completedSteps / updatedSteps.length) * 100;
        return { ...practice, steps: updatedSteps, stepProgress };
      }
      return practice;
    });
    setPractices(updatedPractices);
  }, [practices]);

  const getStepProgress = useCallback((practiceId: number) => {
    const practice = practices.find(p => p.id === practiceId);
    return practice?.stepProgress || 0;
  }, [practices]);

  // --- Context Value ---
  const value = {
    practices,
    userProgress,
    togglePracticeCompletion,
    updatePracticeDuration,
    getPracticeById,
    toggleStepCompletion,
    getStepProgress,
    addPointsForAction, // Expose the new function
    isLoading,
  };

  return <PracticeContext.Provider value={value}>{children}</PracticeContext.Provider>;
};

// --- Hook for Consuming Context ---
export const usePractices = (): PracticeContextType => {
  const context = useContext(PracticeContext);
  if (context === undefined) {
    throw new Error('usePractices must be used within a PracticeProvider');
  }
  return context;
};
