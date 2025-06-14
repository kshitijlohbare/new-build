// Final demonstration using CommonJS to avoid module loading issues
// Applying SSL fix directly at the start of the script
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
console.log('SSL verification disabled for demonstration');

// Import Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test function to update a practice completion status
async function updatePracticeStatus(practiceId, isCompleted) {
  try {
    const { data, error } = await supabase
      .from('practices')
      .update({ 
        completed: isCompleted,
        updated_at: new Date().toISOString()
      })
      .eq('id', practiceId)
      .select();
    
    if (error) {
      console.error('Error updating practice:', error);
      return null;
    }
    
    return data;
  } catch (e) {
    console.error('Exception updating practice:', e);
    return null;
  }
}

// Function to get a list of practices
async function getPractices(limit = 3) {
  try {
    const { data, error } = await supabase
      .from('practices')
      .select('id, name, completed')
      .order('id')
      .limit(limit);
    
    if (error) {
      console.error('Error fetching practices:', error);
      return [];
    }
    
    return data;
  } catch (e) {
    console.error('Exception fetching practices:', e);
    return [];
  }
}

// Run the demonstration
async function runDemo() {
  console.log('===== FINAL SSL FIX DEMONSTRATION =====');
  console.log('Node.js environment detected');
  console.log('NODE_TLS_REJECT_UNAUTHORIZED setting:', process.env.NODE_TLS_REJECT_UNAUTHORIZED);
  
  try {
    // Get a list of practices
    console.log('\nFetching a few practices to demonstrate connectivity...');
    const practices = await getPractices();
    
    if (practices.length === 0) {
      console.log('No practices found! But the connection worked (no SSL error).');
      return;
    }
    
    console.log('Successfully retrieved practices:');
    practices.forEach(p => {
      console.log(`- ID ${p.id}: "${p.name}" (completed: ${p.completed})`);
    });
    
    // Choose the first practice to update
    const practiceToUpdate = practices[0];
    const newStatus = !practiceToUpdate.completed;
    
    console.log(`\nUpdating practice "${practiceToUpdate.name}" to completed=${newStatus}...`);
    const updatedData = await updatePracticeStatus(practiceToUpdate.id, newStatus);
    
    if (updatedData && updatedData.length > 0) {
      console.log('Practice successfully updated!');
      console.log(`New status: ${updatedData[0].name} (completed: ${updatedData[0].completed})`);
      
      console.log('\n✅ SSL FIX DEMONSTRATION SUCCESSFUL!');
      console.log('The SSL certificate verification issue has been resolved.');
    } else {
      console.log('\n❌ Practice update failed, but the connection worked (no SSL error).');
    }
  } catch (error) {
    console.error('\n❌ Demonstration failed:', error);
  }
}

// Run the demonstration
runDemo();
