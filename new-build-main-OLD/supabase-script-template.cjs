#!/usr/bin/env node
/**
 * Template script for Supabase operations with SSL workaround
 * This demonstrates the correct pattern to use for any script that needs to connect to Supabase
 */

// STEP 1: Apply SSL workaround before any imports
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log('SSL certificate verification disabled for Supabase connection');

// STEP 2: Import Supabase after the SSL workaround
const { createClient } = require('@supabase/supabase-js');

// STEP 3: Configure Supabase
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// STEP 4: Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// STEP 5: Define your database operations
async function listPractices() {
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('id, name, completed')
      .order('id')
      .limit(5);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error listing practices:', error);
    return [];
  }
}

async function togglePracticeCompletion(practiceId) {
  try {
    // First get the current status
    const { data: current, error: getError } = await supabase
      .from('practices')
      .select('completed')
      .eq('id', practiceId)
      .single();
    
    if (getError) throw getError;
    
    // Toggle the status
    const newStatus = !current.completed;
    
    const { data, error } = await supabase
      .from('practices')
      .update({ completed: newStatus })
      .eq('id', practiceId)
      .select('name, completed');
    
    if (error) throw error;
    return { data, newStatus };
  } catch (error) {
    console.error(`Error toggling practice ${practiceId}:`, error);
    return null;
  }
}

// STEP 6: Run your script
async function main() {
  console.log('===== SUPABASE SCRIPT WITH SSL WORKAROUND =====');
  
  // List practices
  const practices = await listPractices();
  console.log('\nCurrent practices:');
  practices.forEach(p => {
    console.log(`- ID ${p.id}: ${p.name} (completed: ${p.completed})`);
  });
  
  // Toggle a practice if any were found
  if (practices.length > 0) {
    const practiceToToggle = practices[0];
    console.log(`\nToggling completion status for "${practiceToToggle.name}"...`);
    
    const result = await togglePracticeCompletion(practiceToToggle.id);
    
    if (result) {
      console.log(`✅ Status changed to: completed=${result.newStatus}`);
    } else {
      console.log('❌ Failed to toggle practice status');
    }
  }
  
  console.log('\nScript completed successfully!');
}

// Run the script
main().catch(error => {
  console.error('Script failed:', error);
  process.exit(1);
});
