// Test using the enhanced Supabase client
import { supabase, createTestClient } from './src/lib/supabase-enhanced.mjs';

// Function to test Supabase connection
async function testWithRealClient() {
  try {
    console.log('Testing with regular Supabase client...');
    const { data, error } = await supabase
      .from('practices')
      .select('id, name')
      .limit(1);
      
    if (error) {
      console.error('Error with regular client:', error);
      return false;
    }
    
    console.log('Success with regular client! Data:', data);
    return true;
  } catch (err) {
    console.error('Exception with regular client:', err);
    return false;
  }
}

// Function to test Supabase connection with test client (SSL verification disabled)
async function testWithTestClient() {
  try {
    console.log('\nFalling back to test client (SSL verification disabled)...');
    
    // Create test client with SSL verification disabled
    const testClient = createTestClient();
    
    const { data, error } = await testClient
      .from('practices')
      .select('id, name')
      .limit(1);
      
    if (error) {
      console.error('Error with test client:', error);
      return false;
    }
    
    console.log('Success with test client! Data:', data);
    return true;
  } catch (err) {
    console.error('Exception with test client:', err);
    return false;
  }
}

// Run tests
async function runTests() {
  const regularSuccess = await testWithRealClient();
  
  if (!regularSuccess) {
    await testWithTestClient();
  }
}

runTests();
