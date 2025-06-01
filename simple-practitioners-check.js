// simple-practitioners-check.js
// Simple script to verify practitioner data access and document solution

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

async function checkPractitioners() {
  console.log('Checking practitioners table access...');
  
  try {
    // Try to count practitioners
    const { data: countData, error: countError } = await supabase
      .from('practitioners')
      .select('count()')
      .single();
      
    if (countError) {
      console.error('Error counting practitioners:', countError);
      console.log('Anonymous access check: FAILED');
      return;
    }
    
    console.log(`Total practitioners: ${countData.count}`);
    
    // Try to get column structure
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error fetching practitioners:', error);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('Practitioners table structure:');
      const columns = Object.keys(data[0]);
      console.log(columns.join(', '));
      
      console.log('\nSample practitioner:');
      console.log(`Name: ${data[0].name}`);
      console.log(`Specialty: ${data[0].specialty}`);
      console.log(`Price: $${data[0].price}`);
    }
    
    console.log('\nAnonymous access check: PASSED');
    console.log('Practitioners are accessible to anonymous users.');
    console.log('The issue has been resolved or was not present.');

  } catch (err) {
    console.error('Exception during check:', err);
  }
}

checkPractitioners().catch(console.error);
