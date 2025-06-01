// simple-practitioners-test.js
// Simple script to test practitioners data

import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Disable SSL verification in Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function testPractitioners() {
  console.log('Testing practitioners data...');
  
  try {
    // 1. Count practitioners
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
    
    // 2. List all practitioners
    const { data: practitioners, error: fetchError } = await supabase
      .from('practitioners')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching practitioners:', fetchError);
      return;
    }
    
    console.log(`Retrieved ${practitioners.length} practitioners`);
    
    // 3. Print each practitioner
    practitioners.forEach((p, i) => {
      console.log(`${i + 1}. ${p.id}: ${p.name} - ${p.specialty} - Price: $${p.price} - Location: ${p.location_type}`);
    });
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testPractitioners().catch(console.error);
