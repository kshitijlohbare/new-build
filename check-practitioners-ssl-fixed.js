import { createClient } from '@supabase/supabase-js';

// Disable SSL verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPractitioners() {
  try {
    console.log('Checking practitioners table...');
    
    const { data, error } = await supabase
      .from('practitioners')
      .select('*');
    
    if (error) {
      console.error('Error querying practitioners:', error);
      return;
    }
    
    console.log(`Found ${data?.length || 0} practitioners:`);
    
    if (data && data.length > 0) {
      data.forEach((practitioner, index) => {
        console.log(`\n${index + 1}. ${practitioner.name}`);
        console.log(`   Specialty: ${practitioner.specialty}`);
        console.log(`   Price: $${practitioner.price}`);
        console.log(`   Location: ${practitioner.location_type}`);
        console.log(`   Rating: ${practitioner.rating}/5 (${practitioner.reviews} reviews)`);
        console.log(`   Conditions: ${JSON.stringify(practitioner.conditions)}`);
        console.log(`   Education: ${practitioner.education}`);
        console.log(`   Degree: ${practitioner.degree}`);
      });
    } else {
      console.log('No practitioners found in the database.');
    }
    
  } catch (err) {
    console.error('Exception occurred:', err);
  }
}

checkPractitioners();
