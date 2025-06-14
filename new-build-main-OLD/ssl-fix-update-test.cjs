// SSL fix test with practice update instead of insert
// SSL verification disabled at the start
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { createClient } = require('@supabase/supabase-js');

// Supabase client setup
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create the Supabase client with SSL verification disabled
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to update an existing practice 
async function updatePractice(practiceId, updates) {
  console.log(`Updating practice with ID ${practiceId}...`);
  
  try {
    const { data, error } = await supabase
      .from('practices')
      .update(updates)
      .eq('id', practiceId)
      .select();
    
    if (error) {
      console.error('Database error:', error);
      return false;
    }
    
    console.log('Practice updated successfully:', data);
    return true;
  } catch (e) {
    console.error('Exception during update:', e);
    return false;
  }
}

// Function to retrieve all available practices
async function listPractices() {
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('id, name, completed')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Error listing practices:', error);
      return null;
    }
    
    return data;
  } catch (e) {
    console.error('Exception listing practices:', e);
    return null;
  }
}

// Run the test
async function runTest() {
  console.log('===== FINAL SSL FIX TEST WITH PRACTICE UPDATE =====');
  
  try {
    // List all available practices
    console.log('Listing available practices...');
    const practices = await listPractices();
    
    if (!practices || practices.length === 0) {
      console.error('No practices found in the database');
      return false;
    }
    
    console.log('Found practices:', practices);
    
    // Get the first practice to update
    const practiceToUpdate = practices[0];
    console.log(`Updating practice: ${practiceToUpdate.id} - ${practiceToUpdate.name}`);
    
    // Toggle the completed status
    const newCompletedStatus = !practiceToUpdate.completed;
    const updates = {
      completed: newCompletedStatus,
      updated_at: new Date().toISOString()
    };
    
    // Update the practice
    const result = await updatePractice(practiceToUpdate.id, updates);
    
    if (result) {
      console.log(`✅ Test passed! Practice updated with completed = ${newCompletedStatus}`);
      return true;
    } else {
      console.log('❌ Test failed! Could not update practice.');
      return false;
    }
  } catch (error) {
    console.error('Test error:', error);
    return false;
  }
}

// Execute the test
runTest()
  .then(success => {
    console.log(`\nTest completed with ${success ? 'SUCCESS' : 'FAILURE'}`);
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
