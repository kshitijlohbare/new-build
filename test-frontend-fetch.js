// Test script to verify frontend functionality
console.log('Testing practitioner fetch from browser environment...');

// Disable SSL verification for testing
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Simulate the fetch that would happen in the browser
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
  try {
    console.log('=== FRONTEND SIMULATION TEST ===');
    
    const { data, error } = await supabase
      .from('practitioners')
      .select('*');
    
    console.log('Frontend test - Data:', data);
    console.log('Frontend test - Error:', error);
    console.log('Frontend test - Data length:', data?.length);
    
    if (data && data.length > 0) {
      console.log('SUCCESS: Frontend can fetch practitioners');
      data.forEach((p, i) => {
        console.log(`${i+1}. ${p.name} - ${p.specialty} - $${p.price}`);
      });
    } else {
      console.log('ISSUE: No data returned or error occurred');
    }
    
  } catch (err) {
    console.error('Frontend test exception:', err);
  }
}

testFetch();
