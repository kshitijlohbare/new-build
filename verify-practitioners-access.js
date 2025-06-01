// verify-practitioners-access.js
// Simple script to verify anonymous access to practitioners

import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Initialize Supabase client with workaround for SSL issues in Node.js
const createSupabaseClient = () => {
  // Disable SSL verification in Node.js (for development only)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.warn('WARNING: SSL verification disabled. Use only in development.');
  
  return createClient(supabaseUrl, supabaseKey);
};

const supabase = createSupabaseClient();

async function verifyAccess() {
  console.log('Verifying anonymous access to practitioners...');
  
  try {
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .limit(5);
      
    if (error) {
      console.error('Error accessing practitioners:', error);
      console.log('Access verification FAILED. Practitioners are NOT accessible to anonymous users.');
      return;
    }
    
    if (!data || data.length === 0) {
      console.log('No practitioners found in the database.');
      console.log('Access verification PASSED but the table appears to be empty.');
      return;
    }
    
    console.log(`Found ${data.length} practitioners. Here's a sample:`);
    data.forEach(practitioner => {
      console.log(`- ${practitioner.name} (${practitioner.specialty})`);
    });
    console.log('Access verification PASSED. Practitioners are accessible to anonymous users.');
  } catch (err) {
    console.error('Exception during verification:', err);
    console.log('Access verification FAILED. Practitioners are NOT accessible to anonymous users.');
  }
}

verifyAccess().catch(console.error);
