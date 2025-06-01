// Quick Supabase Test
import { supabase } from './src/lib/supabase.ts';

console.log('=== QUICK SUPABASE TEST ===');
console.log('Supabase URL:', supabase.supabaseUrl);
console.log('Supabase Key exists:', !!supabase.supabaseKey);

async function testConnection() {
    try {
        console.log('Testing basic connection...');
        const { data, error } = await supabase.from('practitioners').select('*').limit(1);
        
        if (error) {
            console.error('❌ Connection Error:', error);
        } else {
            console.log('✅ Connection Success! Sample data:', data);
        }
    } catch (err) {
        console.error('❌ Exception:', err);
    }
}

testConnection();
