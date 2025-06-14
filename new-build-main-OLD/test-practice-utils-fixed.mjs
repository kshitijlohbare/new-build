// Test for practiceUtils.fixed.ts implementation
import { savePracticeData, addToDailyPractices } from './src/context/practiceUtils.fixed.js';

// Mock practice and user data
const mockUserId = 'test-user-123';
const mockPractice = {
  id: 1,
  name: "Test Practice",
  description: "A test practice",
  benefits: ["Testing"],
  completed: false,
  isDaily: true
};

const mockPractices = [mockPractice];
const mockUserProgress = {
  totalPoints: 0,
  level: 1,
  nextLevelPoints: 50,
  streakDays: 0,
  totalCompleted: 0,
  achievements: []
};

// Test functions
async function testSavePracticeData() {
  console.log('Testing savePracticeData function...');
  
  try {
    const result = await savePracticeData(mockUserId, mockPractices, mockUserProgress);
    console.log('savePracticeData result:', result);
    return result;
  } catch (error) {
    console.error('Error in savePracticeData:', error);
    return false;
  }
}

async function testAddToDailyPractices() {
  console.log('Testing addToDailyPractices function...');
  
  try {
    // Clone and modify the practice to mark as daily
    const practiceToAdd = { ...mockPractice, isDaily: true };
    const result = await addToDailyPractices(mockUserId, practiceToAdd);
    console.log('addToDailyPractices result:', result);
    return result;
  } catch (error) {
    console.error('Error in addToDailyPractices:', error);
    return false;
  }
}

// Run the tests
async function runTests() {
  console.log('Starting tests for practiceUtils.fixed.js...');
  
  const saveResult = await testSavePracticeData();
  if (saveResult) {
    console.log('✅ savePracticeData test passed');
  } else {
    console.log('❌ savePracticeData test failed');
  }
  
  const addResult = await testAddToDailyPractices();
  if (addResult) {
    console.log('✅ addToDailyPractices test passed');
  } else {
    console.log('❌ addToDailyPractices test failed');
  }
  
  console.log('Tests completed');
}

// Execute the tests
runTests();
