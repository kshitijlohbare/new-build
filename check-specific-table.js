// check-specific-table.js
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';
if (isNode) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Function to create a simplified SQL executor
async function executeSqlAndLog(sql) {
  try {
    console.log(`Executing: ${sql}`);
    const { data, error } = await supabase.rpc('execute_sql', {
      sql_command: sql
    });
    
    if (error) {
      console.error('SQL Error:', error);
      return null;
    }
    
    console.log('SQL Result:', data);
    return data;
  } catch (err) {
    console.error('Execution error:', err);
    return null;
  }
}

// Main function
async function checkSpecificTable() {
  console.log('Checking if user_practices table exists...');
  
  // SQL to check if table exists
  const checkTableSql = `
    SELECT EXISTS (
      SELECT FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename = 'user_practices'
    );
  `;
  
  await executeSqlAndLog(checkTableSql);
  
  // Try to get table structure if it exists
  const tableStructureSql = `
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_practices';
  `;
  
  await executeSqlAndLog(tableStructureSql);
}

// Execute
checkSpecificTable()
  .then(() => console.log('Check completed'))
  .catch(err => console.error('Error during check:', err));
