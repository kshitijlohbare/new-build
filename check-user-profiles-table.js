// check-user-profiles-table.js
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Configure Supabase client
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://svnczxevigicuskppyfz.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('SUPABASE_ANON_KEY is required but not set in env vars');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkUserProfilesTable() {
  console.log('Checking user_profiles table structure...');
  
  // 1. Check if the table exists
  const { data: tableExists, error: tableError } = await supabase
    .from('user_profiles')
    .select('id')
    .limit(1);
    
  if (tableError) {
    console.error('Error checking table:', tableError);
    return;
  }
  
  console.log('Table exists:', !!tableExists);
  
  // 2. Get sample data to see structure
  const { data: sample, error: sampleError } = await supabase
    .from('user_profiles')
    .select('*')
    .limit(1);
    
  if (sampleError) {
    console.error('Error getting sample:', sampleError);
    return;
  }
  
  if (sample && sample.length > 0) {
    console.log('Sample record structure:');
    const columns = Object.keys(sample[0]);
    columns.forEach(column => {
      const value = sample[0][column];
      const type = typeof value;
      console.log(`- ${column}: ${type} (sample: ${value})`);
    });
  } else {
    console.log('No records found in table');
  }
}

checkUserProfilesTable()
  .catch(console.error)
  .finally(() => console.log('Check completed'));
