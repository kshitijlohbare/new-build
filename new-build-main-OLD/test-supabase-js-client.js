// Simple test for the updated Supabase client in supabase.js
const { supabase } = require('./src/lib/supabase.js');

async function testSupabaseClient() {
  console.log('Testing updated Supabase client...');
  
  try {
    // Test by fetching some data
    const { data, error } = await supabase.from('practices').select('id').limit(5);
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      return false;
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Fetched data:', data);
      return true;
    }
  } catch (e) {
    console.error('Unexpected error:', e);
    return false;
  }
}

// Run the test
testSupabaseClient()
  .then(success => {
    if (success) {
      console.log('✅ Supabase client test passed');
    } else {
      console.log('❌ Supabase client test failed');
    }
  })
  .catch(err => {
    console.error('Test execution error:', err);
  });
