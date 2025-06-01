// Comprehensive browser fetch test
import https from 'https';

// Disable SSL verification
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Test direct Supabase API call that mimics browser behavior
async function testBrowserFetch() {
  console.log('=== BROWSER FETCH SIMULATION ===');
  
  const url = 'https://svnczxevigicuskppyfz.supabase.co/rest/v1/practitioners?select=*';
  const headers = {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU',
    'Content-Type': 'application/json'
  };

  try {
    console.log('Making fetch request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: headers
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error body:', errorText);
      return;
    }

    const data = await response.json();
    console.log('✅ SUCCESS: Fetched', data.length, 'practitioners');

    // Display practitioners info
    data.forEach((practitioner, index) => {
      console.log(`\n${index + 1}. ${practitioner.name}`);
      console.log(`   Specialty: ${practitioner.specialty}`);
      console.log(`   Price: $${practitioner.price}`);
      console.log(`   Rating: ${practitioner.rating}/5`);
      console.log(`   Location: ${practitioner.location_type}`);
      console.log(`   Conditions: ${JSON.stringify(practitioner.conditions)}`);
    });

  } catch (error) {
    console.error('❌ FETCH FAILED:', error.message);
    console.error('Error details:', error);
  }
}

// Test the actual TherapistListing component query logic
async function testComponentQuery() {
  console.log('\n=== COMPONENT QUERY SIMULATION ===');
  
  // This simulates what the TherapistListing component does
  const { createClient } = await import('@supabase/supabase-js');
  
  // Disable SSL for testing
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  
  const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test basic query
    console.log('Testing basic select all...');
    const { data, error } = await supabase
      .from('practitioners')
      .select('*');

    if (error) {
      console.error('❌ Supabase query error:', error);
      return;
    }

    console.log('✅ Supabase query successful');
    console.log('Number of practitioners:', data?.length || 0);

    // Test with filters (simulate what happens in the component)
    console.log('\nTesting filtered queries...');
    
    // Test with online filter
    const { data: onlineData, error: onlineError } = await supabase
      .from('practitioners')
      .select('*')
      .in('location_type', ['online', 'both']);
    
    if (onlineError) {
      console.error('❌ Online filter error:', onlineError);
    } else {
      console.log('✅ Online practitioners:', onlineData?.length || 0);
    }

    // Test with conditions filter (this might be where issues occur)
    console.log('\nTesting conditions filter...');
    const testConditions = ['anxiety'];
    
    try {
      const { data: conditionsData, error: conditionsError } = await supabase
        .from('practitioners')
        .select('*')
        .overlaps('conditions', testConditions);
      
      if (conditionsError) {
        console.log('❌ Overlaps filter failed:', conditionsError.message);
        
        // Try fallback approach
        console.log('Trying fallback contains filter...');
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('practitioners')
          .select('*')
          .contains('conditions', testConditions);
        
        if (fallbackError) {
          console.log('❌ Contains filter also failed:', fallbackError.message);
        } else {
          console.log('✅ Fallback filter worked:', fallbackData?.length || 0, 'practitioners');
        }
      } else {
        console.log('✅ Conditions filter worked:', conditionsData?.length || 0, 'practitioners');
      }
    } catch (err) {
      console.error('❌ Exception in conditions test:', err.message);
    }

  } catch (err) {
    console.error('❌ Exception in component query test:', err.message);
  }
}

// Run both tests
async function runAllTests() {
  await testBrowserFetch();
  await testComponentQuery();
  
  console.log('\n=== TEST SUMMARY ===');
  console.log('If both tests passed, the data should be visible in the browser.');
  console.log('Check the browser console for any additional errors.');
  console.log('URL to test: http://localhost:5173/therapist-listing');
}

runAllTests();
