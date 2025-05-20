// fix-default-daily-practices.js
// Script to ensure no practices are automatically set to daily by default
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js environment
if (typeof process !== 'undefined' && process.env) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixDailyPractices() {
  console.log('Updating practices table to ensure no practices are daily by default...');
  
  try {
    // First, check if the is_daily column exists by querying a row
    console.log('Checking if is_daily column exists...');
    const { data: columnCheck, error: columnCheckError } = await supabase
      .from('practices')
      .select('*')
      .limit(1);
    
    if (columnCheckError) {
      console.error('Error checking practices table:', columnCheckError);
      return false;
    }
    
    // Check if the column exists in the first row
    const sampleRow = columnCheck && columnCheck.length > 0 ? columnCheck[0] : null;
    const hasIsDailyColumn = sampleRow && 'is_daily' in sampleRow;
    
    if (!hasIsDailyColumn) {
      console.log('is_daily column does not exist in the practices table.');
      console.log('Please add the column manually in the Supabase dashboard:');
      console.log('ALTER TABLE practices ADD COLUMN is_daily BOOLEAN DEFAULT FALSE;');
      return false;
    }
    
    // Update all practices to have is_daily=false
    console.log('Setting all practices to have is_daily=false...');
    const { data: updateData, error: updateError } = await supabase
      .from('practices')
      .update({ is_daily: false })
      .gt('id', 0); // This will update all rows with id > 0
    
    if (updateError) {
      console.error('Error updating practices:', updateError);
      return false;
    }
    
    console.log('Successfully updated all practices to have is_daily=false');
    
    // Check if any practices are still set as daily in the database
    console.log('Verifying no practices are set as daily...');
    const { data: dailyPractices, error: checkError } = await supabase
      .from('practices')
      .select('id, name, is_daily')
      .eq('is_daily', true);
    
    if (checkError) {
      console.error('Error checking for daily practices:', checkError);
      return false;
    } 
    
    if (dailyPractices && dailyPractices.length > 0) {
      console.warn('Warning: Found practices that are still set as daily by default:', dailyPractices);
      console.log('These may need manual attention or another run of the script.');
    } else {
      console.log('Success: No practices are set as daily by default.');
    }
    
    // Count how many practices were updated
    const { data: countData, count, error: countError } = await supabase
      .from('practices')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('Error getting practice count:', countError);
    } else {
      console.log('Total practices in database: ' + (count || 0));
    }
    
    return true;
  } catch (error) {
    console.error('Exception in fixDailyPractices:', error);
    return false;
  }
}

// Execute the function
fixDailyPractices()
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
