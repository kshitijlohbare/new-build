// verify-table-schemas.js
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

// List of tables to check
const requiredTables = [
  'practices',
  'user_practices',
  'user_daily_practices',
  'user_profiles',
  'user_followers',
  'community_delights'
];

async function getTableSchema(tableName) {
  console.log(`\nChecking schema for table: ${tableName}`);
  
  try {
    // Get table columns using Postgres information_schema
    const sql = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = '${tableName}'
      ORDER BY ordinal_position;
    `;
    
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql_command: sql 
    });
    
    if (error) {
      console.error(`Error getting schema for ${tableName}:`, error);
      return null;
    }
    
    if (!data || data.length === 0) {
      console.log(`❌ Could not retrieve schema for ${tableName}`);
      return null;
    }
    
    console.log(`✅ Retrieved schema for ${tableName}:`);
    
    // Parse the result and display in a readable format
    try {
      const rows = JSON.parse(data);
      console.table(rows);
      return rows;
    } catch (parseErr) {
      console.log(`Raw schema data:`, data);
      return data;
    }
  } catch (err) {
    console.error(`Error checking schema for ${tableName}:`, err);
    return null;
  }
}

// Function to check the specific user_practices table schema
async function checkUserPracticesSchema() {
  console.log('\n🔍 Examining user_practices table structure in detail...');
  
  try {
    // Check if the practices column is JSONB as expected
    const sql = `
      SELECT column_name, data_type 
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND table_name = 'user_practices'
      AND column_name IN ('practices', 'progress');
    `;
    
    const { data, error } = await supabase.rpc('execute_sql', { 
      sql_command: sql 
    });
    
    if (error) {
      console.error('Error checking user_practices JSONB columns:', error);
      return;
    }
    
    try {
      const columns = JSON.parse(data);
      
      // Check for JSONB columns
      const practicesColumn = columns.find(col => col.column_name === 'practices');
      const progressColumn = columns.find(col => col.column_name === 'progress');
      
      if (!practicesColumn || practicesColumn.data_type !== 'jsonb') {
        console.error('❌ The practices column is not JSONB type or is missing');
      } else {
        console.log('✅ The practices column is correctly defined as JSONB');
      }
      
      if (!progressColumn || progressColumn.data_type !== 'jsonb') {
        console.error('❌ The progress column is not JSONB type or is missing');
      } else {
        console.log('✅ The progress column is correctly defined as JSONB');
      }
      
    } catch (parseErr) {
      console.log('Could not parse column data:', data);
    }
    
  } catch (err) {
    console.error('Error checking user_practices schema details:', err);
  }
}

async function verifyAllSchemas() {
  console.log('Verifying schemas for all required database tables...');
  
  // Check all table schemas
  for (const table of requiredTables) {
    await getTableSchema(table);
  }
  
  // Special check for user_practices
  await checkUserPracticesSchema();
  
  console.log('\nSchema verification completed');
}

// Execute
verifyAllSchemas()
  .then(() => console.log('\nAll checks completed'))
  .catch(error => console.error('\nVerification failed:', error));
