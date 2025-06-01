// Simple script to check practitioners data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPractitioners() {
  console.log('Checking practitioners table...');
  
  try {
    // Check if table exists and get all practitioners
    const { data, error } = await supabase
      .from('practitioners')
      .select('*');
    
    if (error) {
      console.error('Error querying practitioners:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return;
    }
    
    console.log(`Found ${data.length} practitioners in the database:`);
    
    if (data.length === 0) {
      console.log('No practitioners found in the database!');
    } else {
      data.forEach((practitioner, index) => {
        console.log(`${index + 1}. ${practitioner.name} - ${practitioner.specialty}`);
        console.log(`   Rating: ${practitioner.rating}, Price: $${practitioner.price}`);
        console.log(`   Location: ${practitioner.location_type}`);
        console.log(`   Conditions: ${JSON.stringify(practitioner.conditions)}`);
        console.log('   ---');
      });
    }
    
    // Check specific fields that might cause issues
    const issuesFound = data.filter(p => 
      !p.name || !p.specialty || typeof p.price !== 'number' || 
      !p.location_type || !p.conditions || !Array.isArray(p.conditions)
    );
    
    if (issuesFound.length > 0) {
      console.log('\nPotential data issues found:');
      issuesFound.forEach(p => {
        console.log(`Practitioner ID ${p.id} (${p.name || 'NO NAME'}) has incomplete data`);
      });
    } else {
      console.log('\nAll practitioner data appears to be valid!');
    }
    
  } catch (error) {
    console.error('Exception occurred:', error);
  }
}

checkPractitioners();
