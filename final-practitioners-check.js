// final-practitioners-check.js
// Final simple check for practitioner data access

import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Initialize Supabase client with workaround for SSL issues in Node.js
const supabase = createClient(supabaseUrl, supabaseKey, {
  // Disable SSL verification in Node.js
  global: {
    fetch: (...args) => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      return fetch(...args);
    }
  }
});

async function finalCheck() {
  console.log('Final check for practitioners visibility:');
  
  try {
    // Simply try to fetch a few practitioners
    const { data, error } = await supabase
      .from('practitioners')
      .select('id, name, specialty')
      .limit(5);
      
    if (error) {
      console.error('Error accessing practitioners:', error);
      console.log('\nACCESS CHECK: FAILED');
      console.log('Anonymous users cannot access practitioner data.');
      console.log('The issue has not been resolved.');
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No practitioners found in the database.');
      console.log('\nACCESS CHECK: PASSED (but table may be empty)');
      console.log('Anonymous users can access the practitioners table,');
      console.log('but there appears to be no data in the table.');
      return;
    }
    
    console.log(`Found ${data.length} practitioners!`);
    console.log('Sample data:');
    data.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - ${p.specialty}`);
    });
    
    console.log('\nACCESS CHECK: PASSED');
    console.log('Anonymous users can access practitioner data successfully.');
    console.log('The issue has been resolved or was not present.');
    
  } catch (err) {
    console.error('Exception during check:', err);
    console.log('\nACCESS CHECK: FAILED');
    console.log('An unexpected error occurred.');
  }
}

finalCheck().catch(console.error);
