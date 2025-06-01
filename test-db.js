// Test database connection and practitioner data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

async function testDatabase() {
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('practitioners').select('*').limit(5);
    
    if (error) {
      console.error('Database error:', error);
      return;
    }
    
    console.log('Database connection successful!');
    console.log('Number of practitioners found:', data ? data.length : 0);
    
    if (data && data.length > 0) {
      console.log('First practitioner:', data[0]);
      console.log('Practitioner IDs:', data.map(p => p.id));
    } else {
      console.log('No practitioners found in database');
    }
    
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testDatabase();
