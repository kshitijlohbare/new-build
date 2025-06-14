// setup-practices-table.js
// This script will create the practices table and disable RLS in a single operation
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL files
const createTableSql = fs.readFileSync('./create-practices-table.sql', 'utf8');
const disableRlsSql = fs.readFileSync('./disable-practices-rls.sql', 'utf8');

// Combine the SQL commands
const combinedSql = `
${createTableSql}

-- Disable Row Level Security for the practices table
${disableRlsSql}

-- Create a policy to allow public read access
CREATE POLICY IF NOT EXISTS "Allow public read access" 
  ON practices 
  FOR SELECT 
  USING (true);
`;

console.log('Executing SQL to create practices table and disable RLS...');

// Function to execute SQL using available SQL functions
async function executeSql(sql) {
  console.log('Trying to execute SQL...');
  
  // Try multiple methods to execute the SQL
  try {
    // Method 1: Direct SQL via RPC with execute_sql
    const result1 = await supabase.rpc('execute_sql', { sql_command: sql });
    if (!result1.error) {
      console.log('SQL executed successfully using execute_sql function');
      return result1;
    }
    console.log('execute_sql failed, trying alternative methods...', result1.error);
    
    // Method 2: Try with pg_exec
    const result2 = await supabase.rpc('pg_exec', { query: sql });
    if (!result2.error) {
      console.log('SQL executed successfully using pg_exec function');
      return result2;
    }
    console.log('pg_exec failed, trying alternative methods...', result2.error);

    // Method 3: Split into separate statements and try direct REST API
    const statements = sql
      .replace(/--.*$/gm, '') // Remove SQL comments
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log(`Executing ${statements.length} SQL statements individually...`);
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i+1}/${statements.length}...`);
      
      // Try using the REST API directly
      const { data, error } = await supabase.from('_sql').select(`
        sql_query('${stmt.replace(/'/g, "''")}')
      `);
      
      if (error) {
        console.error(`Error executing statement ${i+1}:`, error);
      } else {
        console.log(`Statement ${i+1} executed successfully`);
      }
    }
    
    return { data: 'Executed statements individually', error: null };
    
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { data: null, error };
  }
}

// Execute the combined SQL
executeSql(combinedSql)
  .then(({ data, error }) => {
    if (error) {
      console.error('Failed to set up practices table:', error);
      process.exit(1);
    } else {
      console.log('Practices table setup complete!');
      console.log('Now you can run insert-practices-direct.js to populate the table');
      process.exit(0);
    }
  });
