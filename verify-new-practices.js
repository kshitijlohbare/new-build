// Script to verify that new practices were added to the database
import { createClient } from '@supabase/supabase-js';

// Using the Supabase project URL and anon key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkForNewPractices() {
  // List of new practice names we want to verify
  const newPracticeNames = [
    'Daily Journaling',
    'Screen Time Limitation',
    'Daily Stretching/Yoga'
  ];
  
  console.log('Checking for newly added practices...');
  
  // Query the database for these specific practices by name
  const { data, error } = await supabase
    .from('practices')
    .select('id, name, description, is_daily, created_at')
    .in('name', newPracticeNames);
    
  if (error) {
    console.error('Error fetching practices:', error);
    return;
  }
  
  console.log(`Found ${data.length} out of ${newPracticeNames.length} expected new practices:`);
  
  // Check each practice we're looking for
  for (const practiceName of newPracticeNames) {
    const found = data.find(p => p.name === practiceName);
    if (found) {
      console.log(`✅ "${practiceName}" found in database (ID: ${found.id}, Added: ${new Date(found.created_at).toLocaleString()})`);
      console.log(`   Description: ${found.description.substring(0, 50)}...`);
      console.log(`   Is Daily: ${found.is_daily ? 'Yes' : 'No'}`);
    } else {
      console.log(`❌ "${practiceName}" NOT found in database`);
    }
  }
  
  // Also check the total number of practices to ensure we have what we expect
  const { data: allPractices, error: countError } = await supabase
    .from('practices')
    .select('count');
    
  if (countError) {
    console.error('Error counting practices:', countError);
    return;
  }
  
  console.log(`\nTotal practices in database: ${allPractices[0].count}`);
}

checkForNewPractices().catch(console.error);
