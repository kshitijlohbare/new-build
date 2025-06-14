// query-practices-table.js
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

// Try to directly query both tables
async function queryPracticesTables() {
  console.log('Attempting to query practices tables...');
  
  try {
    // First check the practices table
    console.log('\nQuerying practices table...');
    const practicesResult = await supabase
      .from('practices')
      .select('id, name')
      .limit(3);
    
    if (practicesResult.error) {
      console.error('Error querying practices table:', practicesResult.error);
    } else {
      console.log('Practices table exists! Sample data:', practicesResult.data);
    }
  } catch (err) {
    console.error('Error accessing practices table:', err);
  }
  
  try {
    // Then check the user_practices table 
    console.log('\nQuerying user_practices table...');
    const userPracticesResult = await supabase
      .from('user_practices')
      .select('id, user_id')
      .limit(3);
    
    if (userPracticesResult.error) {
      console.error('Error querying user_practices table:', userPracticesResult.error);
      
      // If we get a 404, the table doesn't exist
      if (userPracticesResult.error.code === 'PGRST16') {
        console.log('\n❌ user_practices table DOES NOT EXIST!');
      } 
    } else {
      console.log('✅ user_practices table exists! Sample data:', userPracticesResult.data);
    }
  } catch (err) {
    console.error('Error accessing user_practices table:', err);
  }
}

// Run the query
queryPracticesTables()
  .then(() => console.log('\nQuery completed'))
  .catch(err => console.error('\nError during query:', err));
