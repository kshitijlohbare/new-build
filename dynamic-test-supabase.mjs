// Simple test for the updated Supabase client using dynamic import
async function runTest() {
  try {
    // Dynamic import to handle both ESM and CJS
    const { supabase } = await import('./src/lib/supabase.js');
    
    console.log('Testing updated Supabase client...');
    
    // Test by fetching some data
    const { data, error } = await supabase.from('practices').select('id').limit(5);
    
    if (error) {
      console.error('Error connecting to Supabase:', error.message);
      console.log('❌ Supabase client test failed');
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Fetched data:', data);
      console.log('✅ Supabase client test passed');
    }
  } catch (e) {
    console.error('Test error:', e);
    console.log('❌ Test failed due to import or execution error');
  }
}

runTest();
