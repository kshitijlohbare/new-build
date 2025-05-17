// Test script for the actual localStorage utilities
// This will use our real localStorage utility functions
import { savePracticeDataToLocalStorage, loadPracticeDataFromLocalStorage } from './src/context/practiceUtils.localStorage.js';

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

console.log("Running test with actual localStorage utilities...");

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

// Test saving
console.log("\nTEST 1: Save practices with actual utility");
savePracticeDataToLocalStorage(mockUserId, mockPractices, mockProgress);

// Test loading
console.log("\nTEST 2: Load practices with actual utility");
const loadedData = loadPracticeDataFromLocalStorage(mockUserId);

// Verify key practices
console.log("\nTEST 3: Verify key practices isDaily fix");
if (loadedData && loadedData.practices) {
  const focusBreathingPractice = loadedData.practices.find(p => p.name === "Focus Breathing (3:3:6)");
  
  if (focusBreathingPractice) {
    console.log(`Focus Breathing practice isDaily value: ${focusBreathingPractice.isDaily}`);
    console.log(`TEST ${focusBreathingPractice.isDaily === true ? 'PASSED ✅' : 'FAILED ❌'}`);
  } else {
    console.log("ERROR: Could not find Focus Breathing practice");
  }
} else {
  console.log("ERROR: Could not load practice data");
}

console.log("\nTest complete!");
