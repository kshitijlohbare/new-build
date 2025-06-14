// apply-rls-fixes.js
// Script to apply RLS policy fixes for improved performance
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sqlFilePath = path.resolve('./fix-rls-policies.sql');
let sqlQueries = '';

try {
  sqlQueries = fs.readFileSync(sqlFilePath, 'utf8');
} catch (error) {
  console.error('Error reading SQL file:', error);
  process.exit(1);
}

// Split the SQL file into individual queries
const queries = sqlQueries
  .replace(/--.*$/gm, '') // Remove SQL comments
  .split(';')
  .filter(query => query.trim() !== '');

async function applyRLSFixes() {
  console.log('Applying RLS policy fixes to improve query performance...');
  
  // Execute each query
  for (const query of queries) {
    try {
      // Use the Postgres function to execute raw SQL
      const { error } = await supabase.rpc('pg_exec', { query: query.trim() });
      
      if (error) {
        console.error('Error executing query:', error);
        console.error('Problem query:', query);
      } else {
        console.log('Successfully executed query.');
      }
    } catch (error) {
      console.error('Exception executing query:', error);
      console.error('Problem query:', query);
    }
  }
  
  console.log('RLS policy fixes have been applied.');
  console.log('Note: For this to work, you need appropriate permissions in Supabase.');
  console.log('If you encounter errors, please run these SQL statements directly in the Supabase SQL editor.');
}

// Run the fixes
applyRLSFixes().catch(error => {
  console.error('Unhandled error while applying fixes:', error);
});
