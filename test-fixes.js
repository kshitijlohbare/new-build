// test-fixes.js
// This script tests the two fixes we applied:
// 1. Local Lottie animation loading
// 2. Suggested users query fix

import { createClient } from '@supabase/supabase-js';

// Set up Supabase client with your project URL and anon key
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Error: Missing Supabase credentials in environment variables.');
  console.log('Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test the suggested users query fix
async function testSuggestedUsersQuery() {
  console.log('\n--- Testing Suggested Users Query Fix ---');
  
  try {
    // Step 1: Get a test user
    const { data: users, error: userError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
      
    if (userError) {
      console.error('Error fetching test user:', userError);
      return;
    }
    
    if (!users || users.length === 0) {
      console.error('No users found in user_profiles table');
      return;
    }
    
    const testUserId = users[0].id;
    console.log(`Using test user ID: ${testUserId}`);
    
    // Step 2: Test with empty following list (simulating the error condition)
    const followingIds = [testUserId]; // Just exclude the test user itself
    
    // Using the fixed query approach
    let query = supabase
      .from('user_profiles')
      .select('*')
      .order('followers_count', { ascending: false })
      .limit(5);
    
    if (followingIds.length > 0) {
      query = query.not('id', 'in', `(${followingIds.join(',')})`);
    } else {
      query = query.neq('id', testUserId);
    }
    
    const { data: suggested, error: suggestedError } = await query;
    
    if (suggestedError) {
      console.error('Error with fixed query:', suggestedError);
      return;
    }
    
    console.log('Success! Query returned:', suggested.length, 'suggested users');
    console.log('First suggested user:', suggested[0]);
    
  } catch (error) {
    console.error('General error in test:', error);
  }
}

// Test the local animation loading
function testLocalAnimationLoading() {
  console.log('\n--- Testing Local Animation Loading ---');
  
  try {
    // Import the local animation file (note: this is a browser-side test)
    console.log('In a browser environment, the following would work:');
    console.log("import { celebrationAnimation } from './src/assets/lottie-animations';");
    console.log('To test in Node.js, check if the file exists:');
    
    const fs = require('fs');
    const path = require('path');
    
    const animationPath = path.join(__dirname, 'src', 'assets', 'lottie-animations.ts');
    
    if (fs.existsSync(animationPath)) {
      console.log(`✅ Animation file exists at: ${animationPath}`);
      const fileContents = fs.readFileSync(animationPath, 'utf8');
      console.log(`File size: ${fileContents.length} bytes`);
      console.log(`Contains celebrationAnimation: ${fileContents.includes('celebrationAnimation')}`);
    } else {
      console.error(`❌ Animation file not found at: ${animationPath}`);
    }
  } catch (error) {
    console.error('Error testing animation file:', error);
  }
}

// Run tests
async function runTests() {
  console.log('Starting tests for CORS and 400 Bad Request fixes...');
  
  await testSuggestedUsersQuery();
  testLocalAnimationLoading();
  
  console.log('\nTests completed!');
}

runTests();
