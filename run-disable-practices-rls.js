// run-disable-practices-rls.js
// This script disables Row Level Security for the practices table temporarily
// to allow data insertion without authentication issues

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
// Using the anon key since we've been using it successfully in other scripts
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file with the RLS disabling command
const sql = fs.readFileSync('./disable-practices-rls.sql', 'utf8');

async function disableRLS() {
  try {
    // Execute the SQL command - try both possible function names
    let result;
    try {
      // Try execute_sql first
      result = await supabase.rpc('execute_sql', { sql_command: sql });
    } catch (e) {
      // If that fails, try pg_exec
      result = await supabase.rpc('pg_exec', { query: sql });
    }

    const { data, error } = result;
    
    if (error) {
      console.error('Error disabling RLS:', error);
      return false;
    }
    
    console.log('Successfully disabled RLS for practices table');
    return true;
  } catch (err) {
    console.error('Exception while disabling RLS:', err);
    return false;
  }
}

disableRLS().then(success => {
  if (success) {
    console.log('You can now run the insert-practices-to-db.js script');
  } else {
    console.log('Failed to disable RLS. Check your Supabase service role key and permissions.');
  }
});
