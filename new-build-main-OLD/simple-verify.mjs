// simple-verify.js - Using fetch API
// A simpler script to test database connectivity and practices

async function checkPractices() {
  const SUPABASE_URL = 'https://svnczxevigicuskppyfz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
  
  try {
    console.log('Checking practices in database...');
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/practices?select=*`, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const practices = await response.json();
    console.log(`Found ${practices.length} practices in the database`);
    
    // Count by category
    const systemPractices = practices.filter(p => p.is_system_practice === true);
    const dailyPractices = practices.filter(p => p.is_daily === true);
    
    console.log(`- ${systemPractices.length} system practices`);
    console.log(`- ${dailyPractices.length} daily practices`);
    
    // List all practices
    console.log('\nPractices in database:');
    practices.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} (ID: ${p.id}, Daily: ${p.is_daily ? 'Yes' : 'No'}, System: ${p.is_system_practice ? 'Yes' : 'No'})`);
    });
    
    console.log('\nDatabase fetch successful');
  } catch (error) {
    console.error('Error checking practices:', error);
  }
}

checkPractices();
