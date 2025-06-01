// test-practitioners.mjs
// Test script for practitioners data using ESM syntax

import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Disable SSL verification in Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log('SSL verification disabled for testing only');

// Main function
async function main() {
  console.log('Testing practitioners data...');
  
  try {
    console.log('Fetching practitioners count...');
    const { data: countData, error: countError } = await supabase
      .from('practitioners')
      .select('count');
      
    if (countError) {
      console.error('Error counting practitioners:', countError);
      return;
    }
    
    console.log('Count result:', countData);
    const totalCount = countData[0].count;
    console.log(`Total practitioners in database: ${totalCount}`);
    
    console.log('\nFetching all practitioners...');
    const { data: practitioners, error: fetchError } = await supabase
      .from('practitioners')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching practitioners:', fetchError);
      return;
    }
    
    console.log(`\nRetrieved ${practitioners.length} practitioners:`);
    
    practitioners.forEach((p, i) => {
      console.log(`${i + 1}. ${p.id}: ${p.name} - ${p.specialty} - $${p.price} - ${p.location_type}`);
    });
    
    console.log('\nCheckpoint: Reviewing for potential display issues...');
    console.log('UI filters that could limit displayed practitioners:');
    console.log('- Price range filter (default: $0-$500)');
    console.log('- Location type filter (online/in-person/both)');
    console.log('- Condition filters (if any are selected)');
    console.log('- Search text filtering');
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Execute main function
main().catch(console.error);
