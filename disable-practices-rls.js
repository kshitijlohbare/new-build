// disable-practices-rls.js
// Script to disable Row Level Security for the practices table to allow bulk inserts
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client with the anon key (for initial testing)
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
// Using the anon key since we don't have the service role key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL script
const sqlFilePath = path.resolve('./disable-practices-rls.sql');
let sqlContent;

try {
  sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
  console.log("SQL file content loaded");
} catch (error) {
  console.error('Error reading SQL file:', error);
  process.exit(1);
}

async function disableRLS() {
  try {
    // Execute the SQL command using Supabase's RPC function
    const { data, error } = await supabase.rpc('exec_sql', { 
      sql_query: sqlContent 
    });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return false;
    }
    
    console.log('Successfully disabled RLS for practices table');
    return true;
  } catch (err) {
    console.error('Exception when executing SQL:', err);
    return false;
  }
}

disableRLS().then(success => {
  if (success) {
    console.log('✅ RLS disabled successfully. You can now run the insert-practices-to-db.js script');
  } else {
    console.log('❌ Failed to disable RLS. Check your Supabase service role key.');
  }
});