// check-existing-practices.mjs
import { createClient } from '@supabase/supabase-js';

// Using the Supabase project URL and anon key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingPractices() {
  const practiceNames = ['Box Breathing', 'Mindfulness Meditation'];
  
  console.log('Checking existing practices with similar names:');
  
  const { data, error } = await supabase
    .from('practices')
    .select('*')
    .in('name', practiceNames);
    
  if (error) {
    console.error('Error fetching practices:', error);
    return;
  }

  if (data.length === 0) {
    console.log('No matching practices found');
    return;
  }
  
  for (const practice of data) {
    console.log(`\n== Practice: ${practice.name} (ID: ${practice.id}) ==`);
    console.log(`Description: ${practice.description}`);
    console.log(`Source: ${practice.source}`);
    console.log(`Is Daily: ${practice.is_daily}`);
    console.log(`Benefits: ${JSON.stringify(practice.benefits)}`);
    
    if (practice.steps && practice.steps.length > 0) {
      console.log(`\nSteps (${practice.steps.length}):`);
      practice.steps.forEach((step, index) => {
        console.log(`  ${index + 1}. ${step.title}: ${step.description.substring(0, 50)}...`);
      });
    } else {
      console.log('\nNo steps defined');
    }
  }
}

checkExistingPractices().catch(console.error);
