import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { savePracticeData, addToDailyPractices, removeFromDailyPractices } from './practiceUtils.fixed';
import { savePracticeDataToLocalStorage, loadPracticeDataFromLocalStorage } from './practiceUtils.localStorage';
import { supabase } from '@/lib/supabase';

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
  tags?: string[]; // Optional: Add tags for filtering
  // New fields for detailed steps
  steps?: {
    title: string;
    description: string;
    imageUrl?: string;
    completed?: boolean; // Track completion of individual steps
  }[];
  source?: string; // Attribution (e.g., "Andrew Huberman", "Naval Ravikant")
  stepProgress?: number; // Track overall progress as percentage
  isDaily?: boolean; // Added field to mark as daily practice
  userCreated?: boolean; // Track if a practice was created by the user
  createdByUserId?: string; // Store the user ID who created this practice
  isSystemPractice?: boolean; // Flag to mark system-provided practices
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
  lastCompletionDate?: string; // Track the last completion date for streak calculation
  achievements: Achievement[];
  userId?: string; // Store the user ID to ensure data is user-specific
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

// Add a new utility function for date comparisons
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
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
    isDaily: false, // No practices are daily by default (was: true)
    isSystemPractice: true, // Ensure system practice flag is set
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
    isDaily: false, // No practices are daily by default (was: true)
    isSystemPractice: true, // Ensure system practice flag is set
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
    isDaily: false, // No practices are daily by default (was: true)
    isSystemPractice: true, // Ensure system practice flag is set
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
  { id: 3, icon: "sun", name: "Morning Sunlight", description: "Wake up active.", benefits: ["Regulates circadian rhythm", "Boosts Vitamin D"], duration: 15, completed: false, streak: 0, isSystemPractice: true },
  { id: 5, name: "Outdoor Walking", description: "Clear your head.", benefits: ["Improves cardiovascular health", "Reduces anxiety"], duration: 30, completed: false, streak: 0, isSystemPractice: true },
  { id: 7, icon: "shower", name: "Evening Cold Rinse", description: "Cool down before bed.", benefits: ["May improve sleep quality", "Reduces inflammation"], duration: 2, completed: false, streak: 0, isSystemPractice: true },
  { id: 8, name: "Mindful Eating", description: "Savor your meals.", benefits: ["Improves digestion", "Increases satisfaction"], duration: 15, completed: false, streak: 0, isSystemPractice: true },
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
    isSystemPractice: true, // Ensure system practice flag is set
    source: "Inspired by The Book of Delights"
  },
  // New Neuroscience Practice: Mindful Observation
  {
    id: 10,
    icon: "brain", // Consider adding a 'brain' or 'neuron' icon to your icon set
    name: "Mindful Observation",
    description: "Practice focused attention on an object or sensory input to enhance neural pathways for concentration.",
    benefits: ["Strengthens focus", "Improves sensory acuity", "Calms the mind", "Reduces mind-wandering"],
    duration: 10, // Duration in minutes
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Neuroscience Principles",
    tags: ["neuroscience", "focus", "mindfulness"],
    steps: [
      {
        title: "Choose an Object",
        description: "Select a simple object (e.g., a pen, a leaf, your breath) or a sound to focus on.",
        imageUrl: "https://images.unsplash.com/photo-1520052205864-92d142b3f2b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bWluZGZ1bCUyMG9iamVjdHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Observe Details",
        description: "Examine its color, texture, shape, sound, or sensation without judgment. Notice as many details as possible.",
        imageUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGV0YWlsc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Acknowledge Distractions",
        description: "When your mind wanders (and it will), gently acknowledge the distraction and return your focus to the object.",
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHJlbGF4ZWR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Practice Regularly",
        description: "Start with 5-10 minutes daily and gradually increase duration. Consistency is key to building focus.",
        imageUrl: "https://images.unsplash.com/photo-1471039497385-b6d6ba609f9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29uc2lzdGVuY3l8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      }
    ]
  },
  // New Naval Ravikant Practice: Specific Knowledge
  {
    id: 11,
    icon: "anchor", // Using the anchor icon as used in Learn.tsx for Naval
    name: "Build Specific Knowledge",
    description: "Develop unique skills and knowledge that cannot be easily taught or outsourced, leveraging your genuine curiosity and passion.",
    benefits: ["Creates unique value", "Leads to leverage", "Cannot be easily replicated", "Authentic to your interests"],
    points: 20, // Assign fixed points as it's more of a long-term pursuit
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Naval Ravikant",
    tags: ["naval", "wisdom", "skill-building", "career"],
    steps: [
      {
        title: "Identify Genuine Curiosity",
        description: "What are you naturally drawn to learn or do, even if it's not for external reward? This is the foundation of specific knowledge.",
        imageUrl: "https://images.unsplash.com/photo-1531346972006-72a4e0387959?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y3VyaW9zaXR5fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Iterate and Learn",
        description: "Continuously learn and experiment in your chosen area. Don't be afraid to explore unconventional paths.",
        imageUrl: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGVhcm5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Build in Public (Optional)",
        description: "Sharing your journey and learnings can attract like-minded individuals and opportunities.",
        imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hhcmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      },
      {
        title: "Combine Skills",
        description: "Specific knowledge often arises from the unique intersection of multiple skills or interests.",
        imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29sbGFib3JhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
      }
    ]
  },
  // Vagus Nerve Breathing (Neuroscience)
  {
    id: 12,
    icon: "brain",
    name: "Vagus Nerve Breathing",
    description: "Stimulate your vagus nerve to promote calm and regulate stress.",
    benefits: ["Reduces anxiety", "Improves heart rate variability", "Promotes relaxation", "Balances nervous system"],
    duration: 5,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Neuroscience Principles",
    tags: ["neuroscience", "breathing", "calm"],
    steps: [
      { title: "Get Comfortable", description: "Sit comfortably and exhale fully." },
      { title: "Inhale", description: "Inhale through your nose for 4 seconds." },
      { title: "Exhale", description: "Exhale slowly through pursed lips for 8 seconds." },
      { title: "Repeat", description: "Repeat for 5-10 cycles, focusing on the long exhale." }
    ]
  },
  // Walking Reflection (Wisdom/Philosophy)
  {
    id: 13,
    icon: "anchor",
    name: "Walking Reflection",
    description: "Take a mindful walk and reflect on a question or idea to gain clarity.",
    benefits: ["Boosts creativity", "Improves mood", "Encourages insight", "Supports physical health"],
    duration: 15,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Naval Ravikant / Stoic Philosophy",
    tags: ["naval", "wisdom", "reflection", "walking"],
    steps: [
      { title: "Pick a Topic", description: "Choose a question or topic to reflect on." },
      { title: "Walk Mindfully", description: "Walk at a comfortable pace, focusing on your breath and surroundings." },
      { title: "Reflect", description: "Let your mind wander gently around the topic." },
      { title: "Capture Insights", description: "After 10-15 minutes, jot down any insights." }
    ]
  },
  // Implementation Intentions (Psychology)
  {
    id: 14,
    icon: "sparkles",
    name: "Implementation Intentions",
    description: "Boost your follow-through by planning exactly when, where, and how you'll act.",
    benefits: ["Increases goal achievement", "Reduces procrastination", "Clarifies intentions"],
    points: 10,
    completed: false,
    streak: 0,
    isDaily: false,
    isSystemPractice: true,
    source: "Behavioral Psychology",
    tags: ["psychology", "habits", "planning"],
    steps: [
      { title: "Choose a Goal", description: "Choose a goal or habit you want to build." },
      { title: "Write an If-Then Plan", description: "Write an 'if-then' plan (e.g., 'If it is 7am, then I will meditate for 5 minutes')." },
      { title: "Visualize", description: "Visualize yourself following through." },
      { title: "Review & Adjust", description: "Review and adjust your plan as needed." }
    ]
  }
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
  addPointsForAction: (points: number, actionName?: string) => void;
  addPractice: (newPractice: Practice) => number;
  removePractice: (practiceId: number, removeFromDaily?: boolean) => void; // Updated to handle daily practice removal
  isLoading: boolean;
  newAchievements: Achievement[];
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
      // Only set completed to false if it's not already defined
      const updatedSteps = practice.steps.map(step => ({
        ...step,
        completed: step.completed !== undefined ? step.completed : false
      }));
      
      // Calculate step progress based on completion status
      const completedSteps = updatedSteps.filter(step => step.completed).length;
      const stepProgress = updatedSteps.length > 0 
        ? (completedSteps / updatedSteps.length) * 100 
        : 0;
      
      return {
        ...practice,
        steps: updatedSteps,
        stepProgress
      };
    }
    return practice;
  });
};

export const PracticeProvider: React.FC<PracticeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [practices, setPractices] = useState<Practice[]>([]); // Initialize empty, will load from database
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalPoints: 0,
    level: 1,
    nextLevelPoints: 50,
    streakDays: 0,
    totalCompleted: 0,
    lastCompletionDate: undefined, // Initialize without a completion date
    achievements: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start as loading
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]); // State to track new achievements
  // Status for potential UI feedback in the future
  const [, setSaveStatus] = useState<'idle' | 'saving' | 'error' | 'success'>('idle');

  // --- Effect for Data Loading from database with localStorage backup ---
  useEffect(() => {
    // This effect is used for data loading
    // Note: Removed unused syncDailyPracticesWithDatabase function
    
    // Main function to load user data
    const loadUserData = async () => {
      console.log("PracticeContext - loadUserData starting", { userId: user?.id });
      setIsLoading(true);
      
      if (user?.id) {
        try {
          // First try to load data from Supabase database
          let practicesFromDb: Practice[] = [];
          let dbFetchSuccessful = false;
          let timeStarted = Date.now();
          
          try {
            console.log("Attempting to fetch practices from Supabase...");
            
            // Set a timeout in case the database query takes too long
            const timeoutPromise = new Promise<{data: null, error: any}>((resolve) => {
              setTimeout(() => {
                resolve({
                  data: null, 
                  error: { message: "Database query timed out after 3 seconds" }
                });
              }, 3000);
            });
            
            // Race the database query against the timeout
            const { data: practicesData, error } = await Promise.race([
              supabase.from('practices').select('*'),
              timeoutPromise
            ]);
              
            if (error) {
              console.error("Error fetching practices from Supabase:", error);
            } else if (practicesData && practicesData.length > 0) {
              console.log(`Fetched ${practicesData.length} practices from Supabase database in ${Date.now() - timeStarted}ms`);
              dbFetchSuccessful = true;
              
              // Transform data to match Practice interface
              practicesFromDb = practicesData.map((p: any) => ({
                id: Number(p.id),
                icon: p.icon,
                name: String(p.name),
                description: String(p.description),
                benefits: Array.isArray(p.benefits) ? p.benefits : [],
                duration: p.duration !== undefined ? Number(p.duration) : undefined,
                points: p.points !== undefined ? Number(p.points) : undefined,
                completed: Boolean(p.completed),
                streak: p.streak !== undefined ? Number(p.streak) : 0,
                tags: Array.isArray(p.tags) ? p.tags : [],
                steps: Array.isArray(p.steps) ? p.steps : [],
                source: p.source,
                stepProgress: p.step_progress !== undefined ? Number(p.step_progress) : undefined,
                isDaily: p.is_daily === true,
                userCreated: p.user_created === true,
                createdByUserId: p.created_by_user_id,
                isSystemPractice: p.is_system_practice === true
              }));
              
              // Debug log for isDaily status
              const dailyPractices = practicesFromDb.filter(p => p.isDaily === true);
              console.log(`Found ${dailyPractices.length} practices marked as daily in the database`);
              dailyPractices.forEach(p => console.log(`- Daily practice: ${p.name} (ID: ${p.id})`));
              
            } else {
              console.log("No practices found in database or empty response");
            }
          } catch (dbError) {
            console.error("Exception fetching practices from Supabase:", dbError);
          }
          
          // Try to load data from localStorage as a fallback or for personal preferences
          let userData = loadPracticeDataFromLocalStorage(user.id);
          
          if (dbFetchSuccessful && practicesFromDb.length > 0) {
            console.log("Using database practices as primary source");
            
            // Start with database practices
            const mergedPractices = [...practicesFromDb];
            
            // If we also have user data in localStorage, merge the user-specific fields
            if (userData && userData.practices && userData.practices.length > 0) {
              console.log("Merging with user preferences from localStorage");
              
              // Update with user's completion status, streaks, etc. from localStorage
              userData.practices.forEach((localPractice: Practice) => {
                const index = mergedPractices.findIndex(p => p.id === localPractice.id);
                if (index !== -1) {
                  // Debug step completion status
                  if (localPractice.steps && localPractice.steps.length > 0) {
                    console.log(`Practice "${localPractice.name}" has ${localPractice.steps.length} steps with completion status:`, 
                      localPractice.steps.map(s => s.completed));
                  }
                  
                  // Update existing practice with user data
                  mergedPractices[index] = {
                    ...mergedPractices[index],
                    completed: localPractice.completed,
                    streak: localPractice.streak,
                    steps: localPractice.steps, // Preserve steps with their completion status
                    stepProgress: localPractice.stepProgress,
                    // Preserve other user-specific fields
                  };
                } else {
                  // If not in DB but exists in localStorage, it might be a user-created practice
                  if (localPractice.userCreated) {
                    mergedPractices.push(localPractice);
                  }
                }
              });
            }
            
            const dailyPracticesCount = mergedPractices.filter(p => p.isDaily === true).length;
            console.log(`Using ${mergedPractices.length} practices with ${dailyPracticesCount} daily practices`);
            
            setPractices(initializeStepsCompletion(mergedPractices));
            
            // Set user progress from localStorage if available
            if (userData && userData.progress) {
              setUserProgress(userData.progress);
            }
          } else if (userData && userData.practices && userData.practices.length > 0) {
            // Database fetch failed or no data, use localStorage
            console.log("Using localStorage practices as fallback");
            
            setPractices(initializeStepsCompletion(userData.practices));
            
            if (userData.progress) {
              setUserProgress(userData.progress);
            } else {
              // Initialize basic progress
              setUserProgress({
                totalPoints: 0,
                level: 1,
                nextLevelPoints: 50,
                streakDays: 0,
                totalCompleted: 0,
                achievements: [],
              });
            }
          } else {
            // No saved data at all - initialize with default practices
            console.log("No user data found, initializing with defaults");
            
            const defaultPractices = INITIAL_PRACTICE_DATA.map(p => ({
              ...p,
              // All practices start with isDaily = false for new users
              isDaily: false, // No practices are daily by default
              completed: false, // Ensure nothing is marked completed
              streak: 0 // Reset streaks
            }));
            
            setPractices(initializeStepsCompletion(defaultPractices));
            
            // Initialize basic progress
            setUserProgress({
              totalPoints: 0,
              level: 1,
              nextLevelPoints: 50,
              streakDays: 0,
              totalCompleted: 0,
              achievements: [],
            });
            
            // Save this initial data
            try {
              // Always save to localStorage first as a backup
              savePracticeDataToLocalStorage(user.id, defaultPractices, {
                totalPoints: 0,
                level: 1,
                nextLevelPoints: 50,
                streakDays: 0,
                totalCompleted: 0,
                achievements: [],
              });
              
              console.log("Saved initial user data to localStorage");
              
              // Then try to save to database if it's working
              if (dbFetchSuccessful) {
                await savePracticeData(user.id, defaultPractices, {
                  totalPoints: 0,
                  level: 1,
                  nextLevelPoints: 50,
                  streakDays: 0,
                  totalCompleted: 0,
                  achievements: [],
                });
                console.log("Saved initial user data to database");
              }
            } catch (saveError) {
              console.error("Error saving initial user data:", saveError);
              // We still have localStorage backup at this point
            }
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        // No user - use default initialization with no daily practices (for demo/guest mode)
        console.log("No user logged in, using demo mode");
        const demoPractices = INITIAL_PRACTICE_DATA.map(p => ({
          ...p,
          // All practices start with isDaily = false for demo mode
          isDaily: false, // No practices are daily by default
          completed: false,
          streak: 0
        }));
        setPractices(initializeStepsCompletion(demoPractices));
        
        setUserProgress({
          totalPoints: 0,
          level: 1,
          nextLevelPoints: 50,
          streakDays: 0,
          totalCompleted: 0,
          achievements: [],
        });
        
        setIsLoading(false);
      }
    };

    loadUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Reload whenever the user ID changes

  // --- Update Logic (Centralized) ---
  // Refactored recalculateProgress to accept points directly
  const recalculateProgressAndAchievements = useCallback((currentPoints: number, updatedPractices: Practice[]) => {
    const { level, nextLevelPoints } = calculateLevel(currentPoints);

    // Daily streak logic with proper date tracking
    const completedPractices = updatedPractices.filter(p => p.completed);
    const today = new Date();
    let newStreak = userProgress.streakDays;
    const lastCompletionDate = userProgress.lastCompletionDate ? new Date(userProgress.lastCompletionDate) : null;
    
    if (completedPractices.length > 0) {
      // If this is the first completion ever
      if (!lastCompletionDate) {
        newStreak = 1;
      } 
      // If there was a previous completion
      else {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // If the last completion was yesterday, increment the streak
        if (isSameDay(lastCompletionDate, yesterday)) {
          newStreak += 1;
        } 
        // If the last completion was today, maintain the streak
        else if (isSameDay(lastCompletionDate, today)) {
          // No change to streak - already counted for today
        } 
        // If more than one day has passed, reset the streak to 1
        else {
          newStreak = 1;
        }
      }
    } else {
      // If no practices are completed, check if streak should be reset
      if (lastCompletionDate) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // If the last completion wasn't yesterday or today, reset streak
        if (!isSameDay(lastCompletionDate, yesterday) && !isSameDay(lastCompletionDate, today)) {
          newStreak = 0;
        }
      }
    }

    // Check for new achievements
    const currentAchievements = userProgress.achievements;
    const potentialNewProgress = { 
      ...userProgress, 
      totalPoints: currentPoints, 
      level, 
      streakDays: newStreak,
      lastCompletionDate: completedPractices.length > 0 ? today.toISOString() : userProgress.lastCompletionDate
    };
    
    const newlyEarnedAchievements = ALL_ACHIEVEMENTS
      .filter(ach => !currentAchievements.some(earned => earned.id === ach.id))
      .filter(ach => ach.criteria(potentialNewProgress, updatedPractices))
      .map(({ criteria, ...rest }) => rest);

    setUserProgress(prev => ({
      ...prev,
      totalPoints: currentPoints,
      level,
      nextLevelPoints,
      totalCompleted: completedPractices.length,
      streakDays: newStreak,
      lastCompletionDate: completedPractices.length > 0 ? today.toISOString() : prev.lastCompletionDate,
      achievements: [...prev.achievements, ...newlyEarnedAchievements],
    }));

    if (newlyEarnedAchievements.length > 0) {
      console.log("New achievements unlocked:", newlyEarnedAchievements.map(a => a.name).join(', '));
      setNewAchievements(newlyEarnedAchievements); // Update state with new achievements
    }
  }, [userProgress]); // Dependency includes userProgress for streak/achievement logic

  // Effect to save data after state changes
  useEffect(() => {
    // Don't save during initial loading
    if (isLoading) return;
    
    // Don't attempt to save if no user is logged in
    if (!user?.id) return;
    
    // Debounce saving to avoid excessive database calls
    const saveTimeout = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        // Make a deep copy of the data to avoid any reference issues
        const practicesCopy = JSON.parse(JSON.stringify(practices));
        const progressCopy = JSON.parse(JSON.stringify(userProgress));
        
        // Log daily practices in detail
        const dailyPractices = practicesCopy.filter((p: Practice) => p.isDaily === true);
        console.log(`Saving data for user ${user.id}: ${dailyPractices.length} daily practices out of ${practicesCopy.length} total`);
        
        // Show detailed info about each daily practice
        dailyPractices.forEach((p: Practice) => {
          console.log(`Daily practice being saved: "${p.name}" (ID: ${p.id})`);
        });
        
        // Always save to localStorage as a failsafe backup first
        savePracticeDataToLocalStorage(user.id, practicesCopy, progressCopy);
        
        // Then try to save to Supabase
        const success = await savePracticeData(user.id, practicesCopy, progressCopy);
        setSaveStatus(success ? 'success' : 'error');
        
        if (!success) {
          console.warn("Data saved to localStorage but Supabase save may have failed");
          console.log("Using localStorage as primary data source");
        } else {
          console.log("Successfully saved practice data and daily practices to both localStorage and Supabase");
        }
      } catch (error) {
        console.error("Error saving data:", error);
        setSaveStatus('error');
      }
    }, 1000); // Wait 1 second after changes before saving
    
    return () => clearTimeout(saveTimeout);
  }, [practices, userProgress, user?.id, isLoading]);

  // Function to add points for specific actions (like sharing a delight)
  const addPointsForAction = useCallback((pointsToAdd: number, actionName: string = 'Action') => {
    console.log(`Adding ${pointsToAdd} points for: ${actionName}`);
    const newTotalPoints = userProgress.totalPoints + pointsToAdd;
    // Pass the current practices state to recalculate achievements correctly
    recalculateProgressAndAchievements(newTotalPoints, practices);
  }, [userProgress.totalPoints, practices, recalculateProgressAndAchievements]);

  // Function to add a new practice or update an existing one (e.g., for isDaily)
  const addPractice = useCallback((practiceToUpdate: Practice) => {
    console.log("addPractice called with:", { 
      practiceId: practiceToUpdate.id, 
      name: practiceToUpdate.name,
      isDaily: practiceToUpdate.isDaily,
      fullObject: JSON.stringify(practiceToUpdate)
    });
    
    // Special handling for our key practices - ensure they're always properly marked
    // Make a copy with proper handling for isDaily
    let practiceToAdd = {...practiceToUpdate};
    
    // No special treatment for key practices - they should only be daily if explicitly marked
    // by the user through the UI
    
    // Track if we're adding a practice to daily that wasn't daily before
    let wasAddedToDaily = false;
    let practiceId = practiceToAdd.id;
    
    setPractices(prevPractices => {
      const existingPracticeIndex = prevPractices.findIndex(p => p.id === practiceToAdd.id);

      if (existingPracticeIndex !== -1) {
        // Practice exists, update it (e.g., setting isDaily)
        const updatedPractices = [...prevPractices];
        const existingPractice = updatedPractices[existingPracticeIndex];
        
        // Check if we're newly adding this to daily practices
        const wasDaily = existingPractice.isDaily === true;
        const willBeDaily = practiceToAdd.isDaily === true;
        wasAddedToDaily = !wasDaily && willBeDaily;
        
        // Ensure isDaily is explicitly set as a boolean with the value from practiceToAdd, defaulting to the existing value
        const updatedPractice = {
          ...existingPractice,
          ...practiceToAdd, // Apply general updates
          // Force isDaily to be an explicit boolean - important for database persistence
          isDaily: practiceToAdd.isDaily === true ? true : 
                  (practiceToAdd.isDaily === false ? false : 
                  (existingPractice.isDaily === true))
        };
        
        // No special treatment for key practices anymore - they should 
        // only be marked as daily if explicitly done by the user
        
        updatedPractices[existingPracticeIndex] = updatedPractice;
        // Immediately persist to backend after local state update
        if (user?.id) {
          savePracticeData(user.id, updatedPractices, userProgress);
        }
        return updatedPractices;
      } else {
        // Practice does not exist, add it as a new practice
        // Ensure required fields are present for a truly new practice
        if (!practiceToUpdate.name || practiceToUpdate.id === undefined) {
          console.error("Cannot add new practice: missing required fields (name, id)");
          return prevPractices; // Return previous state if validation fails
        }
        
        // For new practices added by the user, ensure they're marked as user-created
        const practiceWithDefaults = {
          ...practiceToUpdate,
          completed: practiceToUpdate.completed || false,
          streak: practiceToUpdate.streak || 0,
          duration: practiceToUpdate.duration || 5,
          benefits: Array.isArray(practiceToUpdate.benefits) && practiceToUpdate.benefits.length > 0
            ? practiceToUpdate.benefits
            : ["Customized for you"],
          // Ensure isDaily is explicitly set if it's a new practice being added as daily
          isDaily: practiceToUpdate.isDaily || false,
          userCreated: true, // Mark as user-created to differentiate from built-in practices
          isSystemPractice: practiceToUpdate.isSystemPractice || false, // Default to not a system practice
          createdByUserId: user?.id || undefined, // Set the creator's user ID
        };
        
        // Check if this new practice should be added to daily
        wasAddedToDaily = practiceWithDefaults.isDaily === true;
        
        console.log("Added new practice:", practiceWithDefaults.name, "by user:", practiceWithDefaults.createdByUserId);
        // Immediately persist to backend after local state update
        if (user?.id) {
          savePracticeData(user.id, [...prevPractices, practiceWithDefaults], userProgress);
        }
        return [...prevPractices, practiceWithDefaults];
      }
    });
    
    // If the practice was added to daily practices, immediately update the database relation
    // instead of waiting for the next auto-save cycle
    if (wasAddedToDaily && user?.id && practiceId !== undefined) {
      console.log(`Direct database update: Adding practice ID ${practiceId} to daily practices for user ${user.id}`);
      addToDailyPractices(user.id, practiceId)
        .then((success: boolean) => {
          if (success) {
            console.log(`Successfully added practice ID ${practiceId} to user_daily_practices table`);
          } else {
            console.error(`Failed to add practice ID ${practiceId} to user_daily_practices table`);
          }
        })
        .catch((err: Error) => {
          console.error('Error in direct daily practice update:', err);
        });
    }
    
    return practiceToUpdate.id; // Return the ID for reference
  }, [user?.id, userProgress]);

  // Function to remove a practice from the user's list or just remove from daily practices
  const removePractice = useCallback((practiceId: number, removeFromDaily = true) => {
    // Track if we're removing from daily
    let wasRemovedFromDaily = false;
    
    setPractices(prevPractices => {
      const practiceToUpdate = prevPractices.find(p => p.id === practiceId);
      
      // If practice doesn't exist, return current state
      if (!practiceToUpdate) {
        console.error("Cannot remove non-existent practice:", practiceId);
        return prevPractices;
      }
      
      // If removeFromDaily is true, just update isDaily flag, otherwise completely remove the practice
      if (removeFromDaily) {
        // Check if it was marked as daily before
        wasRemovedFromDaily = practiceToUpdate.isDaily === true;
        
        // Create a new array with the practice's isDaily set to false
        const updatedPractices = prevPractices.map(p => {
          if (p.id === practiceId) {
            return { ...p, isDaily: false }; // Explicitly set to false, not undefined
          }
          return p;
        });

        // Immediately persist to database to ensure sync between states
        if (user?.id) {
          console.log(`Saving updated practices after removing practice ${practiceId} from daily`);
          savePracticeData(user.id, updatedPractices, userProgress);
        }
        
        return updatedPractices;
      } else {
        // Only completely remove if it's a user-created practice, otherwise just remove from daily
        if (practiceToUpdate.userCreated) {
          // Check if it was daily before removal
          wasRemovedFromDaily = practiceToUpdate.isDaily === true;
          
          const updatedPractices = prevPractices.filter(p => p.id !== practiceId);
          console.log("Removed user-created practice with ID:", practiceId);
          
          // Immediately persist to backend after local state update
          if (user?.id) {
            savePracticeData(user.id, updatedPractices, userProgress);
          }
          return updatedPractices;
        } else {
          // For built-in practices, just mark as not daily
          // Check if it was daily before removal
          wasRemovedFromDaily = practiceToUpdate.isDaily === true;
          
          console.log("Built-in practice removed from daily list:", practiceId);
          const updated = prevPractices.map(p => {
            if (p.id === practiceId) {
              return { ...p, isDaily: false }; // Explicitly set to false
            }
            return p;
          });
          
          // Immediately persist to backend after local state update
          if (user?.id) {
            savePracticeData(user.id, updated, userProgress);
          }
          return updated;
        }
      }
    });
    
    // If the practice was removed from daily, immediately update the database relation
    if (wasRemovedFromDaily && user?.id) {
      console.log(`Direct database update: Removing practice ID ${practiceId} from daily practices for user ${user.id}`);
      removeFromDailyPractices(user.id, practiceId)
        .then((success: boolean) => {
          if (success) {
            console.log(`Successfully removed practice ID ${practiceId} from user_daily_practices table`);
          } else {
            console.error(`Failed to remove practice ID ${practiceId} from user_daily_practices table`);
          }
        })
        .catch((err: Error) => {
          console.error('Error in direct daily practice removal:', err);
        });
    }
  }, [user?.id, userProgress]);

  const togglePracticeCompletion = useCallback((id: number) => {
    let pointsChange = 0;
    // First check if this practice exists, if not, it's a new practice from the dialog
    const practiceExists = practices.some(p => p.id === id);
    
    if (!practiceExists) {
      // Handle case when practice doesn't exist yet
      console.log("Practice not found, might be a new practice pending addition");
      return;
    }
    
    try {
      const updatedPractices = practices.map(practice => {
        if (practice.id === id) {
          const nowCompleted = !practice.completed;
          // Calculate points based on either fixed points or duration
          const practicePoints = practice.points ?? calculatePoints(practice.duration);
          // Points change based on completion status
          pointsChange = nowCompleted ? practicePoints : -practicePoints;
          // Update streak - increment if completing, reset if uncompleting
          const updatedStreak = nowCompleted ? (practice.streak || 0) + 1 : 0;
          
          // Return updated practice
          return { 
            ...practice, 
            completed: nowCompleted, 
            streak: updatedStreak,
            lastCompletedAt: nowCompleted ? new Date().toISOString() : undefined
          };
        }
        return practice;
      });
      
      // Update practices state
      setPractices(updatedPractices);
      
      // Update total points and recalculate achievements
      const newTotalPoints = Math.max(0, userProgress.totalPoints + pointsChange);
      recalculateProgressAndAchievements(newTotalPoints, updatedPractices);
      
      console.log(`Practice '${practices.find(p => p.id === id)?.name}' ${pointsChange > 0 ? 'completed' : 'uncompleted'}`);
    } catch (error) {
      console.error("Error toggling practice completion:", error);
    }
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
    addPractice, // Expose the function to add practices
    removePractice, // Expose removePractice
    isLoading,
    newAchievements, // Expose the new achievements
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
