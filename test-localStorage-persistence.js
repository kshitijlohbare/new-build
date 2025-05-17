// Test script to verify localStorage persistence
// This will simulate how the application interacts with localStorage
// Run this using Node.js

console.log("Running localStorage persistence test...");

// Mock localStorage for Node.js environment
global.localStorage = {
  storage: {},
  setItem: function(key, value) {
    this.storage[key] = value;
    console.log(`localStorage.setItem('${key}', [data])`);
  },
  getItem: function(key) {
    console.log(`localStorage.getItem('${key}')`);
    return this.storage[key] || null;
  },
  removeItem: function(key) {
    delete this.storage[key];
    console.log(`localStorage.removeItem('${key}')`);
  }
};

// Create a mock user ID
const mockUserId = 'test-user-123';

// Mock practices
const mockPractices = [
  { 
    id: 1, 
    name: "Cold Shower Exposure", 
    description: "Cold exposure practice", 
    benefits: ["Improves stress resilience"], 
    duration: 3, 
    completed: false, 
    streak: 0,
    isDaily: true
  },
  { 
    id: 2, 
    name: "Gratitude Journal", 
    description: "Gratitude practice", 
    benefits: ["Improves mood"], 
    duration: 5, 
    completed: false, 
    streak: 0,
    isDaily: true
  },
  { 
    id: 3, 
    name: "Focus Breathing (3:3:6)", 
    description: "Breathing practice", 
    benefits: ["Improves focus"], 
    duration: 5, 
    completed: false, 
    streak: 0,
    isDaily: false  // Deliberately set to false to test fix
  },
  { 
    id: 4, 
    name: "Random Practice", 
    description: "Random practice", 
    benefits: ["Just testing"], 
    duration: 10, 
    completed: false, 
    streak: 0,
    isDaily: true
  }
];

// Mock user progress
const mockProgress = {
  totalPoints: 0,
  level: 1,
  nextLevelPoints: 50,
  streakDays: 0,
  totalCompleted: 0,
  achievements: []
};

// Simulate saving to localStorage
function savePracticeDataToLocalStorage(userId, practices, userProgress) {
  try {
    // Make deep copies
    const practicesCopy = JSON.parse(JSON.stringify(practices));
    const progressCopy = JSON.parse(JSON.stringify(userProgress));
    
    // Apply key practice fix
    const keyPracticeNames = [
      "Cold Shower Exposure", 
      "Gratitude Journal", 
      "Focus Breathing (3:3:6)"
    ];
    
    practicesCopy.forEach(p => {
      if (keyPracticeNames.includes(p.name)) {
        // Always set these key practices to isDaily=true, regardless of their current setting
        const oldValue = p.isDaily;
        p.isDaily = true;
        console.log(`Fixing key practice "${p.name}" to be daily (was ${oldValue})`);
      }
    });
    
    const data = {
      practices: practicesCopy,
      progress: progressCopy,
      updated_at: new Date().toISOString()
    };
    
    localStorage.setItem(`wellbeing_user_practices_${userId}`, JSON.stringify(data));
    
    const dailyPractices = practicesCopy.filter(p => p.isDaily === true);
    console.log(`Saved ${practicesCopy.length} practices to localStorage for user ${userId}`);
    console.log(`Saved ${dailyPractices.length} daily practices to localStorage:`);
    dailyPractices.forEach(p => console.log(`- "${p.name}" (ID: ${p.id})`));
    
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

// Simulate loading from localStorage
function loadPracticeDataFromLocalStorage(userId) {
  try {
    const data = localStorage.getItem(`wellbeing_user_practices_${userId}`);
    if (!data) {
      console.log(`No localStorage data found for user ${userId}`);
      return null;
    }
    
    const parsedData = JSON.parse(data);
    
    // Re-apply key practice fix when loading
    const keyPracticeNames = [
      "Cold Shower Exposure", 
      "Gratitude Journal", 
      "Focus Breathing (3:3:6)"
    ];
    
    if (Array.isArray(parsedData.practices)) {
      parsedData.practices.forEach(p => {
        if (keyPracticeNames.includes(p.name) && p.isDaily !== false) {
          p.isDaily = true;
          console.log(`Re-applying fix for key practice "${p.name}" to ensure it's daily`);
        }
      });
      
      const dailyPractices = parsedData.practices.filter(p => p.isDaily === true);
      console.log(`Loaded ${parsedData.practices.length} practices from localStorage, including ${dailyPractices.length} daily practices`);
      dailyPractices.forEach(p => console.log(`- "${p.name}" (ID: ${p.id})`));
    }
    
    console.log('Successfully loaded practice data from localStorage');
    return {
      practices: parsedData.practices,
      progress: parsedData.progress
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

// Run tests
console.log("\nTEST 1: Save practices to localStorage");
savePracticeDataToLocalStorage(mockUserId, mockPractices, mockProgress);

console.log("\nTEST 2: Load practices from localStorage");
const loadedData = loadPracticeDataFromLocalStorage(mockUserId);

// Verify key practices are set as daily
console.log("\nTEST 3: Verify key practices isDaily fix");
if (loadedData && loadedData.practices) {
  const focusBreathingPractice = loadedData.practices.find(p => p.name === "Focus Breathing (3:3:6)");
  
  if (focusBreathingPractice) {
    console.log(`Focus Breathing practice isDaily value: ${focusBreathingPractice.isDaily}`);
    console.log(`TEST ${focusBreathingPractice.isDaily === true ? 'PASSED ✅' : 'FAILED ❌'}`);
  } else {
    console.log("ERROR: Could not find Focus Breathing practice");
  }
}

console.log("\nTest complete!");
