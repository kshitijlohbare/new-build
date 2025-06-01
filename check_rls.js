// Script to check RLS on practitioners table
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPractitioners() {
  console.log('Checking practitioners table...');
  
  // Check RLS is enabled
  try {
    const { data: rlsData, error: rlsError } = await supabase.rpc('check_table_rls', { table_name: 'practitioners' });
    if (rlsError) {
      console.log('Error checking RLS:', rlsError);
      console.log('Trying alternative method...');
      
      const { data, error } = await supabase.from('practitioners').select('count(*)');
      if (error) {
        console.log('Error querying practitioners table:', error);
      } else {
        console.log('Practitioners query successful, count:', data);
      }
    } else {
      console.log('RLS status:', rlsData);
    }
  } catch (e) {
    console.error('Exception checking RLS:', e);
    
    // Try direct query
    try {
      const { data, error } = await supabase.from('practitioners').select('count(*)');
      if (error) {
        console.log('Error querying practitioners table:', error);
      } else {
        console.log('Practitioners count:', data);
      }
    } catch (e2) {
      console.error('Exception querying practitioners:', e2);
    }
  }
  
  // Try to describe the table
  try {
    console.log('Fetching sample data from practitioners table...');
    const { data, error } = await supabase.from('practitioners').select('*').limit(1);
    if (error) {
      console.error('Error fetching practitioners data:', error);
    } else {
      console.log('Sample data:', data);
      console.log('Table accessible, column names:', data && data.length > 0 ? Object.keys(data[0]) : 'No data found');
    }
  } catch (e) {
    console.error('Exception querying practitioners sample:', e);
  }
}

checkPractitioners().catch(console.error);
