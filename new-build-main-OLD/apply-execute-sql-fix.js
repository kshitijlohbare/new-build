// apply-execute-sql-fix.js
// Script to apply the search path fix for the execute_sql function
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with your project details
// Replace these with your actual Supabase URL and key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sqlFilePath = path.resolve('./fix-execute-sql-function.sql');
let sqlQueries = '';

try {
  console.log('Reading SQL fix file...');
  sqlQueries = fs.readFileSync(sqlFilePath, 'utf8');
} catch (error) {
  console.error('Error reading SQL file:', error);
  process.exit(1);
}

async function applyExecuteSqlFix() {
  console.log('Applying security fix to execute_sql function...');
  
  try {
    // Use the Postgres function to execute raw SQL
    // Note: This requires appropriate permissions in Supabase
    const { error } = await supabase.rpc('pg_exec', { query: sqlQueries });
    
    if (error) {
      console.error('Error executing query:', error);
      console.log('Please apply the fix by running the SQL directly in the Supabase SQL Editor.');
    } else {
      console.log('Successfully applied fix to execute_sql function.');
    }
  } catch (error) {
    console.error('Exception executing query:', error);
    console.log('Please apply the fix by running the SQL directly in the Supabase SQL Editor.');
  }
}

// Run the fix
applyExecuteSqlFix().catch(error => {
  console.error('Unhandled error:', error);
});
