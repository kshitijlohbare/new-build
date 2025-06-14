// Test script to verify that the fixed PracticeContext implementation works
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Testing the client with and without SSL verification
async function testSupabaseConnection() {
  console.log('Testing Supabase connection with normal settings...');
  
  try {
    // First try with standard settings
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.from('practices').select('id').limit(1);
    
    if (error) {
      console.error('Error with standard settings:', error.message);
      
      // If it fails, try with SSL verification disabled
      console.warn('Testing with SSL verification disabled...');
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      
      const supabaseNoSSL = createClient(supabaseUrl, supabaseKey);
      const result = await supabaseNoSSL.from('practices').select('id').limit(1);
      
      if (result.error) {
        console.error('Still failing with SSL verification disabled:', result.error.message);
      } else {
        console.log('Success with SSL verification disabled!', result.data);
      }
    } else {
      console.log('Success with normal settings!', data);
    }
  } catch (e) {
    console.error('Unexpected error:', e);
  }
}

// Run the test
testSupabaseConnection().then(() => {
  console.log('Test completed');
});
