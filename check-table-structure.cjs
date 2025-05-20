// Script to check the structure of the practices table
// SSL verification is disabled at the start
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const { createClient } = require('@supabase/supabase-js');

// Supabase client setup
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Create the Supabase client with SSL verification disabled
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTableStructure() {
  console.log('Checking practices table structure...');
  
  try {
    // Check if the table exists first
    const { data: tableData, error: tableError } = await supabase
      .rpc('check_table_exists', { table_name: 'practices' });
    
    if (tableError) {
      console.error('Error checking if table exists:', tableError);
      
      // Alternative approach - query directly
      const { data: practices, error: practicesError } = await supabase
        .from('practices')
        .select('*')
        .limit(1);
      
      if (practicesError) {
        console.error('Error getting practices:', practicesError);
      } else {
        console.log('Sample practice data:', practices);
        if (practices && practices.length > 0) {
          console.log('Columns available:', Object.keys(practices[0]));
        }
      }
    } else {
      console.log('Table exists check result:', tableData);
    }
    
    // Try listing all tables
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (tablesError) {
      console.error('Error listing tables:', tablesError);
    } else {
      console.log('Available tables:', tables.map(t => t.table_name));
    }
    
    // Alternative - try querying user_practices table if it exists
    const { data: userPractices, error: userPracticesError } = await supabase
      .from('user_practices')
      .select('*')
      .limit(1);
    
    if (userPracticesError) {
      console.error('Error querying user_practices:', userPracticesError);
    } else {
      console.log('Sample user_practices data:', userPractices);
      if (userPractices && userPractices.length > 0) {
        console.log('Columns available in user_practices:', Object.keys(userPractices[0]));
      }
    }
    
    // Try inserting with modified column structure
    console.log('\nTrying different table names and structures...');
    
    const testUserId = 'test-user-' + Date.now();
    const testPractice = {
      id: 1001,
      name: "Structure Test Practice",
      completed: true
    };
    
    // Try with user_practices table
    const { data: insertData, error: insertError } = await supabase
      .from('user_practices')
      .insert([
        {
          user_id: testUserId,
          practice_id: testPractice.id,
          name: testPractice.name,
          completed: testPractice.completed,
          updated_at: new Date().toISOString()
        }
      ]);
    
    if (insertError) {
      console.error('Insert error:', insertError);
    } else {
      console.log('Insert successful:', insertData);
    }
  } catch (e) {
    console.error('Exception during table check:', e);
  }
}

// Run the test
checkTableStructure()
  .then(() => {
    console.log('\nTable structure check completed');
  })
  .catch(err => {
    console.error('Unexpected error:', err);
  });
