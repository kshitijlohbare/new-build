import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Disable TLS for development
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

async function checkTableColumns() {
  console.log('=== CHECKING PRACTITIONERS TABLE COLUMNS ===');
  
  try {
    // Try to get one record and see what columns are returned
    const { data, error } = await supabase
      .from('practitioners')
      .select('*')
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('✅ Available columns in practitioners table:');
    console.log(Object.keys(data));
    console.log('\nSample record:');
    console.log(data);
    
    // Check specifically for availability-related columns
    const availabilityColumns = Object.keys(data).filter(col => col.includes('availability'));
    console.log('\n🔍 Availability-related columns:', availabilityColumns);
    
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

checkTableColumns();
