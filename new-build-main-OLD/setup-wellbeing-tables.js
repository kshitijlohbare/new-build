// setup-wellbeing-tables.js
// Script to set up the required wellbeing tables in Supabase
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Read SQL file
const sqlFilePath = path.resolve('./src/db/wellbeing_tables_setup.sql');
let sqlQueries = '';

try {
  sqlQueries = fs.readFileSync(sqlFilePath, 'utf8');
} catch (error) {
  console.error('Error reading SQL file:', error);
  process.exit(1);
}

// Split the SQL file into individual queries
// This is a simple split that works for most SQL files but may need to be improved
// for more complex SQL with embedded semicolons
const queries = sqlQueries
  .replace(/--.*$/gm, '') // Remove SQL comments
  .split(';')
  .filter(query => query.trim() !== '');

async function setupWellbeingTables() {
  console.log('Setting up wellbeing tables in Supabase...');
  
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
  
  // Verify tables were created
  const requiredTables = ['practices', 'user_practices', 'user_daily_practices'];
  
  for (const table of requiredTables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);
        
      if (error) {
        console.error(`Failed to verify table '${table}':`, error);
      } else {
        console.log(`Table '${table}' is accessible.`);
      }
    } catch (error) {
      console.error(`Exception verifying table '${table}':`, error);
    }
  }
  
  console.log('Setup process completed.');
}

// Run the setup
setupWellbeingTables().catch(error => {
  console.error('Unhandled error during setup:', error);
});
