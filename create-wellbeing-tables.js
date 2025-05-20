// create-wellbeing-tables.js
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file
const sql = fs.readFileSync('./supabase-practices-tables.sql', 'utf8');

console.log('Executing SQL to create all required tables...');

async function executeSql() {
  try {
    // Method 1: Direct SQL via RPC
    const result = await supabase.rpc('execute_sql', { sql_command: sql });
    if (result.error) {
      console.error('Error executing SQL with execute_sql:', result.error);
      
      // Try alternative method
      console.log('Trying alternative method...');
      const altResult = await supabase.rpc('run_sql', { query: sql });
      
      if (altResult.error) {
        console.error('Error executing SQL with run_sql:', altResult.error);
        throw new Error('Failed to execute SQL using both methods');
      }
      
      console.log('SQL executed successfully using run_sql function');
      return altResult;
    }
    
    console.log('SQL executed successfully using execute_sql function');
    return result;
  } catch (error) {
    console.error('Error executing SQL:', error);
    throw error;
  }
}

// Execute the script
executeSql()
  .then(() => console.log('Table creation completed!'))
  .catch(error => console.error('Failed to create tables:', error));

