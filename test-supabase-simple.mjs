import { createClient } from '@supabase/supabase-js';

// Configuration
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Disable SSL verification in Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('=== QUICK SUPABASE CONNECTION TEST ===');
console.log('URL:', supabaseUrl);
console.log('Key exists:', !!supabaseKey);

async function testConnection() {
    try {
        console.log('Testing basic connection...');
        const { data, error } = await supabase.from('practitioners').select('*').limit(5);
        
        if (error) {
            console.error('❌ Connection Error:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
        } else {
            console.log('✅ Connection Success!');
            console.log('Number of records found:', data?.length || 0);
            if (data && data.length > 0) {
                console.log('Sample practitioner:');
                console.log({
                    id: data[0].id,
                    name: data[0].name,
                    specialty: data[0].specialty,
                    price: data[0].price,
                    location_type: data[0].location_type
                });
            }
        }
    } catch (err) {
        console.error('❌ Exception:', err.message);
    }
}

testConnection();
