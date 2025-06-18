// Simple Supabase connection test script
import { createClient } from '@supabase/supabase-js';

// Use the config from your application
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false // Don't persist session for this test
  }
});

// Simple health check function to test connection
async function checkSupabaseHealth() {
  console.log('Supabase Auth Test');
  console.log('=================');
  console.log(`URL: ${supabaseUrl}`);
  console.log(`Key: ${supabaseKey.substring(0, 20)}...`);
  console.log('\nTesting connection...');

  try {
    // Try to get a public table
    console.log('\nTest 1: Querying public table');
    const { data: practicesData, error: practicesError } = await supabase
      .from('practices')
      .select('id')
      .limit(1);
    
    if (practicesError) {
      console.error('❌ Error querying practices table:', practicesError);
    } else {
      console.log('✅ Successfully queried practices table');
      console.log('Data:', practicesData);
    }

    // Try to get system health status
    console.log('\nTest 2: Getting auth configuration');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('❌ Error getting auth config:', authError);
    } else {
      console.log('✅ Successfully got auth configuration');
    }

  } catch (err) {
    console.error('❌ Exception during testing:', err);
  }
}

// Run the test
checkSupabaseHealth().catch(console.error);
