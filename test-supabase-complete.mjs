// Enhanced test with API key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

async function testSupabaseConnection() {
  try {
    const res = await fetch(`${supabaseUrl}/rest/v1/practices?select=id,name&limit=1`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    console.log('Status:', res.status);
    console.log('Response:', await res.text());
    return true;
  } catch (err) {
    console.error('Connection error:', err);
    return false;
  }
}

// Test with SSL bypassed (ONLY FOR TESTING)
async function testWithBypassedSsl() {
  console.log('\n--- TESTING WITH BYPASSED SSL (INSECURE) ---');
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  const success = await testSupabaseConnection();
  console.log('Connection test with bypassed SSL:', success ? 'SUCCESS' : 'FAILED');
}

// Run tests
testWithBypassedSsl();
