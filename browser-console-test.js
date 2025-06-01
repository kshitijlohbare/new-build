// Browser console test script for practitioner fetching
// Paste this into the browser console to test the Supabase connection

console.log('=== BROWSER CONSOLE TEST ===');

// Test if the Supabase client is available
if (typeof window !== 'undefined' && window.supabase) {
  console.log('Supabase client found in window');
} else {
  console.log('Creating new Supabase client for testing...');
}

// Import and test Supabase directly
const testSupabaseConnection = async () => {
  try {
    // Try to create a Supabase client in the browser
    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    
    const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('Testing practitioner fetch...');
    const { data, error } = await supabase
      .from('practitioners')
      .select('*');
      
    console.log('BROWSER TEST RESULTS:');
    console.log('Data:', data);
    console.log('Error:', error);
    console.log('Data length:', data?.length);
    
    if (data && data.length > 0) {
      console.log('✅ SUCCESS: Can fetch practitioners in browser');
      data.forEach((p, i) => {
        console.log(`${i+1}. ${p.name} - ${p.specialty} - $${p.price}`);
      });
    } else {
      console.log('❌ ISSUE: No data or error occurred');
    }
    
  } catch (err) {
    console.error('❌ BROWSER TEST FAILED:', err);
  }
};

// Run the test
testSupabaseConnection();

// Also test with a simple fetch request
console.log('=== DIRECT FETCH TEST ===');
fetch('https://svnczxevigicuskppyfz.supabase.co/rest/v1/practitioners?select=*', {
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU'
  }
})
.then(response => {
  console.log('Direct fetch response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Direct fetch SUCCESS:', data.length, 'practitioners found');
  data.forEach((p, i) => {
    console.log(`${i+1}. ${p.name} - ${p.specialty} - $${p.price}`);
  });
})
.catch(err => {
  console.error('❌ Direct fetch FAILED:', err);
});
