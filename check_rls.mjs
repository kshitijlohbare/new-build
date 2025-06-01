// Script to check RLS on practitioners table
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPractitioners() {
  console.log('Checking practitioners table...');
  
  // Try direct query
  try {
    console.log('Attempting to query practitioners table...');
    const { data, error } = await supabase.from('practitioners').select('count(*)');
    if (error) {
      console.log('Error querying practitioners table:', error);
    } else {
      console.log('Practitioners count:', data);
    }
  } catch (e) {
    console.error('Exception querying practitioners:', e);
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
  
  // Check if table exists
  try {
    const { data, error } = await supabase.rpc('pg_exec', { 
      query: "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'practitioners')" 
    });
    
    if (error) {
      console.error('Error checking if table exists:', error);
    } else {
      console.log('Table exists check result:', data);
    }
  } catch (e) {
    console.error('Exception checking if table exists:', e);
  }
}

checkPractitioners().catch(console.error);
