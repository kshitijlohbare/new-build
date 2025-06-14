// Test script for the fixed version of daily practices with SSL workaround
import './src/lib/ssl-workaround.ts';
import { savePracticeData } from './src/context/practiceUtils.fixed';

// Mock user data for testing
const TEST_USER_ID = 'test-user-' + Date.now();
const TEST_PRACTICE = {
  id: 999,
  name: "Test Daily Practice",
  description: "A test practice created to verify SSL fixes",
  benefits: ["Testing SSL fix"],
  completed: true,
  isDaily: true,
  streak: 1
};
const TEST_PRACTICES = [TEST_PRACTICE];
const TEST_USER_PROGRESS = {
  totalPoints: 10,
  level: 1,
  nextLevelPoints: 50,
  streakDays: 1,
  totalCompleted: 1,
  achievements: []
};

async function runTest() {
  console.log('===== TESTING FIXED DAILY PRACTICES WITH SSL WORKAROUND =====');
  console.log(`Test user ID: ${TEST_USER_ID}`);
  console.log('Test practice:', TEST_PRACTICE);
  
  try {
    console.log('\nSaving practice data to Supabase...');
    const result = await savePracticeData(TEST_USER_ID, TEST_PRACTICES, TEST_USER_PROGRESS);
    
    if (result) {
      console.log('✅ SUCCESS: Practice data saved successfully!');
    } else {
      console.error('❌ FAILED: Could not save practice data');
    }
  } catch (error) {
    console.error('❌ ERROR during test:', error);
  }
}

// Run the test
runTest()
  .then(() => console.log('\nTest completed'))
  .catch(console.error);
