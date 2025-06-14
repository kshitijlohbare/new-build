// Simple script to check if we can retrieve therapists from Supabase
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (we'll use environment variables if available)
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTherapists() {
  console.log('Checking Supabase connection and therapists table...');
  
  try {
    // Check if we can connect to Supabase
    const { data: tableData, error: tableError } = await supabase
      .from('therapists')
      .select('count()', { count: 'exact' });
      
    if (tableError) {
      console.error('Error connecting to therapists table:', tableError);
      return;
    }
    
    console.log('Successfully connected to Supabase');
    console.log(`Number of therapists in the database: ${tableData[0].count}`);
    
    // Get a sample of therapists
    const { data, error } = await supabase
      .from('therapists')
      .select('*')
      .limit(3);
      
    if (error) {
      console.error('Error fetching therapists sample:', error);
      return;
    }
    
    console.log('Sample therapist data:');
    console.log(JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

// Run the check
checkTherapists();