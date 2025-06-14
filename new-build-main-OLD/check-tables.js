// check-tables.js
import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// SSL workaround for Node.js
const isNode = typeof window === 'undefined' && typeof process !== 'undefined';
if (isNode) {
  console.warn('Node.js environment detected, disabling SSL verification');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  try {
    console.log('Checking database tables...');
    
    // Query to list all tables in the public schema
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (error) {
      console.error('Error querying tables:', error);
      
      // Try alternative approach
      console.log('Trying alternative approach to list tables...');
      
      // Try direct query to user_practices table
      const practicesCheck = await supabase
        .from('user_practices')
        .select('count(*)', { count: 'exact', head: true });
        
      if (practicesCheck.error) {
        console.error('Error checking user_practices table:', practicesCheck.error);
        
        if (practicesCheck.error.code === '42P01') { // Table doesn't exist
          console.log('The user_practices table does not exist!');
        }
      } else {
        console.log('The user_practices table exists! Count:', practicesCheck.count);
      }
      
      return;
    }
    
    console.log('Tables in the database:');
    data.forEach(table => {
      console.log(`- ${table.table_name}`);
    });
    
    // Check if user_practices exists
    const userPracticesExists = data.some(table => table.table_name === 'user_practices');
    console.log(`user_practices table ${userPracticesExists ? 'exists' : 'does not exist'}`);
    
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

// Run the check
checkTables()
  .then(() => console.log('Table check completed!'))
  .catch(error => console.error('Error during table check:', error));
