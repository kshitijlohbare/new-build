// verify-all-tables.js
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

async function checkTable(tableName) {
  console.log(`\nChecking table: ${tableName}`);
  
  try {
    // Try to select a single row to check if table exists
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .limit(1);
    
    if (error) {
      if (error.code === '42P01') { // Table doesn't exist
        console.log(`❌ Table ${tableName} does not exist`);
        return false;
      } else {
        // Other error, but table might still exist
        console.log(`⚠️ Error accessing ${tableName}: ${error.message}`);
        return null;
      }
    }
    
    console.log(`✅ Table ${tableName} exists`);
    return true;
  } catch (err) {
    console.error(`Error checking ${tableName}:`, err);
    return null;
  }
}

async function verifyAllTables() {
  console.log('Verifying all required database tables...');
  
  const results = [];
  
  for (const table of requiredTables) {
    const result = await checkTable(table);
    results.push({ table, exists: result });
  }
  
  console.log('\nSummary:');
  results.forEach(({ table, exists }) => {
    const status = exists === true ? '✅ EXISTS' : 
                  exists === false ? '❌ MISSING' : '⚠️ UNKNOWN';
    console.log(`${table}: ${status}`);
  });
  
  const allExist = results.every(r => r.exists === true);
  console.log(`\nAll required tables exist: ${allExist ? 'YES ✅' : 'NO ❌'}`);
}

// Execute
verifyAllTables()
  .then(() => console.log('\nVerification completed'))
  .catch(error => console.error('\nVerification failed:', error));
