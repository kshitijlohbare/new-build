// File: final-supabase-test.mjs
// Test the updated Supabase client with SSL workaround

import { supabase } from './src/lib/supabase.js';

// Wait a moment for potential SSL fallback to complete
setTimeout(async () => {
  try {
    console.log('Testing Supabase client after potential SSL fallback...');
    const { data, error } = await supabase.from('practices').select('id').limit(5);
    
    if (error) {
      console.error('Error after waiting for SSL fallback:', error.message);
      console.log('❌ Supabase client test failed');
    } else {
      console.log('Successfully connected to Supabase!');
      console.log('Fetched data:', data);
      console.log('✅ Supabase client test passed');
    }
  } catch (e) {
    console.error('Test error:', e);
  }
}, 2000); // Wait 2 seconds for the SSL fallback to complete

console.log('Waiting for SSL fallback to complete...');
