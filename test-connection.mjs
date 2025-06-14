import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL, 
  process.env.VITE_SUPABASE_ANON_KEY
);

console.log('🔍 Testing Supabase connection...');
console.log('URL:', process.env.VITE_SUPABASE_URL);
console.log('Key exists:', !!process.env.VITE_SUPABASE_ANON_KEY);

try {
  // Check if fitness_groups table exists
  const { data, error } = await supabase
    .from('fitness_groups')
    .select('*')
    .limit(1);
    
  if (error) {
    console.log('❌ fitness_groups table check failed:', error.message);
  } else {
    console.log('✅ fitness_groups table exists, found', data?.length || 0, 'records');
  }
} catch (err) {
  console.log('❌ Connection error:', err.message);
}
