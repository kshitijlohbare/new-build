// test-practices-connectivity.js
// A script to test the database connectivity for practices

import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// List of tests to run
const tests = [
  // Test 1: Fetch practices
  async () => {
    console.log('Test 1: Fetching practices...');
    try {
      const { data, error } = await supabase
        .from('practices')
        .select('*');
      
      if (error) throw error;
      
      console.log(`✅ Successfully fetched ${data.length} practices from the database`);
      console.log('Sample practice:', data[0]);
      return true;
    } catch (error) {
      console.error('❌ Error fetching practices:', error);
      return false;
    }
  },
  
  // Test 2: Insert a test practice
  async () => {
    console.log('Test 2: Inserting a test practice...');
    try {
      const testPractice = {
        id: 9999,
        name: "Test Practice " + Date.now(),
        description: "This is a test practice",
        benefits: ["Testing database connectivity"],
        duration: 5,
        completed: false,
        streak: 0,
        is_daily: true,
        is_system_practice: false
      };
      
      const { data, error } = await supabase
        .from('practices')
        .upsert(testPractice)
        .select();
      
      if (error) throw error;
      
      console.log(`✅ Successfully inserted test practice: ${data[0].name}`);
      return true;
    } catch (error) {
      console.error('❌ Error inserting test practice:', error);
      return false;
    }
  },
  
  // Test 3: Update a practice
  async () => {
    console.log('Test 3: Updating a practice...');
    try {
      const { data, error } = await supabase
        .from('practices')
        .update({ description: "Updated description " + Date.now() })
        .eq('id', 9999)
        .select();
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        console.log(`✅ Successfully updated practice with new description: ${data[0].description}`);
        return true;
      } else {
        console.log('⚠️ Update succeeded but no data returned');
        return true;
      }
    } catch (error) {
      console.error('❌ Error updating practice:', error);
      return false;
    }
  },
  
  // Test 4: Delete the test practice
  async () => {
    console.log('Test 4: Deleting the test practice...');
    try {
      const { error } = await supabase
        .from('practices')
        .delete()
        .eq('id', 9999);
      
      if (error) throw error;
      
      console.log('✅ Successfully deleted test practice');
      return true;
    } catch (error) {
      console.error('❌ Error deleting test practice:', error);
      return false;
    }
  }
];

// Run all tests
async function runTests() {
  console.log('Starting database connectivity tests...');
  
  let passed = 0;
  let failed = 0;
  
  for (let i = 0; i < tests.length; i++) {
    try {
      const success = await tests[i]();
      if (success) {
        passed++;
      } else {
        failed++;
      }
      console.log('-'.repeat(50));
    } catch (error) {
      console.error(`Unhandled error in test ${i + 1}:`, error);
      failed++;
      console.log('-'.repeat(50));
    }
  }
  
  console.log('Test Summary:');
  console.log(`✅ ${passed} tests passed`);
  console.log(`❌ ${failed} tests failed`);
  console.log('-'.repeat(50));
  
  if (failed === 0) {
    console.log('🎉 All tests passed! The practices database connection is working correctly.');
    console.log('The application should now be able to load and save practice data to the database.');
  } else {
    console.log('⚠️ Some tests failed. Please check the error messages above for details.');
  }
}

// Run the tests
runTests();
