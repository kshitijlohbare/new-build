// Browser and Node.js compatibility test for Supabase
import { supabase } from './src/lib/supabase.js';

async function runTest() {
  console.log('Environment check:', typeof window !== 'undefined' ? 'Browser' : 'Node.js');
  
  try {
    // Detailed Supabase client check
    console.log('Testing Supabase connection...');
    console.log('Supabase client:', supabase);
    
    // Try a simple query
    console.log('Running a test query...');
    const { data, error } = await supabase.from('practices').select('id').limit(1);
    
    if (error) {
      console.error('Error with Supabase query:', error);
      
      // More detailed error info
      if (error.message?.includes('fetch failed')) {
        console.log('This appears to be an SSL certificate verification error');
        // Check if NODE_TLS_REJECT_UNAUTHORIZED is set
        if (typeof process !== 'undefined') {
          console.log('NODE_TLS_REJECT_UNAUTHORIZED setting:', process.env.NODE_TLS_REJECT_UNAUTHORIZED);
        }
      }
    } else {
      console.log('Supabase query successful!', data);
    }
  } catch (error) {
    console.error('Exception occurred:', error);
  }
}

// Run the test
runTest();
