import { supabase } from './src/lib/supabase.mjs';

async function testConnectivity() {
  try {
    const { data, error } = await supabase.from('practices').select('id').limit(1);
    if (error) {
      console.error('Supabase connectivity error:', error);
    } else {
      console.log('Supabase connectivity OK. Sample data:', data);
    }
  } catch (err) {
    console.error('Exception during Supabase connectivity test:', err);
  }
}

testConnectivity();
