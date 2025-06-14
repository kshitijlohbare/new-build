// check-new-practices.mjs
import fetch from 'node:fetch';

async function checkNewPractices() {
  const SUPABASE_URL = 'https://svnczxevigicuskppyfz.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
  
  try {
    console.log('Checking for newly added wellness practices...');
    
    const response = await fetch(, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': 
      }
    });
    
      throw new Error();
    }
    
    const practices = await response.json();
    console.log();

    // List new practices
    console.log('\nNew wellness practices:');
    practices.forEach((p) => {
      console.log();
      console.log();
      console.log();
      console.log('  Benefits:');
      (p.benefits || []).slice(0, 2).forEach(b => console.log());
      if ((p.benefits || []).length > 2) console.log();
      console.log('');
    });
    
  } catch (error) {
    console.error('Error checking new practices:', error);
  }
}

checkNewPractices();
