// fix-practice-completion.js
// Script to ensure no practices are incorrectly marked as complete by default
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js environment
if (typeof process !== 'undefined' && process.env) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixPracticeCompletionStatus() {
  console.log('Checking and fixing practice completion status...');
  
  try {
    // 1. First check the system practices table to ensure none have completed=true by default
    console.log('Setting all system practices to have completed=false by default...');
    const { error: updateSystemError } = await supabase
      .from('practices')
      .update({ completed: false })
      .is('user_id', null); // System practices have null user_id
    
    if (updateSystemError) {
      console.error('Error updating system practices:', updateSystemError);
      return false;
    }
    
    // 2. Check user_practices table for practices array with incorrect completed status
    console.log('Checking user_practices table for practices with incorrect completion status...');
    const { data: userPracticesData, error: userPracticesError } = await supabase
      .from('user_practices')
      .select('id, user_id, practices');
    
    if (userPracticesError) {
      console.error('Error fetching user practices:', userPracticesError);
      return false;
    }
    
    // 3. Process each user's practices
    let fixCount = 0;
    for (const userPractice of userPracticesData || []) {
      let needsUpdate = false;
      const practices = userPractice.practices || [];
      
      // Check if any practice has incorrect completion status
      for (const practice of practices) {
        if (practice.isSystemPractice && practice.completed === true) {
          // Fix the completed status
          practice.completed = false;
          needsUpdate = true;
          fixCount++;
          console.log(`Fixed practice ${practice.id} for user ${userPractice.user_id}`);
        }
      }
      
      // Update if any practices were fixed
      if (needsUpdate) {
        const { error: updateError } = await supabase
          .from('user_practices')
          .update({ 
            practices: practices,
            updated_at: new Date().toISOString()
          })
          .eq('id', userPractice.id);
        
        if (updateError) {
          console.error(`Error updating user practice ${userPractice.id}:`, updateError);
        } else {
          console.log(`Successfully updated user practice record ${userPractice.id}`);
        }
      }
    }
    
    // 4. Also fix the user_daily_practices junction table if needed
    console.log('Checking user_daily_practices table...');
    const { data: userDailyPracticesData, error: userDailyPracticesError } = await supabase
      .from('user_daily_practices')
      .select('*');
    
    if (userDailyPracticesError) {
      console.error('Error fetching user daily practices:', userDailyPracticesError);
    } else {
      console.log(`Found ${userDailyPracticesData?.length || 0} entries in user_daily_practices table`);
    }
    
    console.log(`Fixed completion status for ${fixCount} practices`);
    return true;
  } catch (error) {
    console.error('Exception in fixPracticeCompletionStatus:', error);
    return false;
  }
}

// Execute the function
fixPracticeCompletionStatus()
  .then(success => {
    if (success) {
      console.log('Script completed successfully.');
      process.exit(0);
    } else {
      console.log('Script completed with errors.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Script failed with error:', error);
    process.exit(1);
  });
