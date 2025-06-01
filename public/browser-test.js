// Browser test for practitioners loading issue
const testPractitioners = async () => {
  console.log('=== BROWSER PRACTITIONERS TEST ===');
  
  // Import the Supabase client
  const { createClient } = await import('@supabase/supabase-js');
  
  const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';
  
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log('1. Testing basic connection...');
    const { data, error } = await supabase
      .from('practitioners')
      .select('*');
    
    if (error) {
      console.error('❌ Database error:', error);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${data?.length || 0} practitioners in database`);
    
    if (data && data.length > 0) {
      console.log('\n📋 Practitioner details:');
      data.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name} - ${p.specialty} - $${p.price}`);
        console.log(`   Location: ${p.location_type}, Rating: ${p.rating}`);
        console.log(`   Conditions: ${JSON.stringify(p.conditions)}`);
        console.log('');
      });
      
      // Test filters that might be causing issues
      console.log('\n🔍 Testing filters...');
      
      // Test price range filter
      const { data: priceFiltered, error: priceError } = await supabase
        .from('practitioners')
        .select('*')
        .gte('price', 0)
        .lte('price', 500);
      
      if (priceError) {
        console.error('❌ Price filter error:', priceError);
      } else {
        console.log(`✅ Price filter (0-500): ${priceFiltered?.length || 0} practitioners`);
      }
      
      // Test conditions overlap filter
      console.log('\n🔍 Testing conditions filter...');
      try {
        const { data: conditionsFiltered, error: conditionsError } = await supabase
          .from('practitioners')
          .select('*')
          .overlaps('conditions', ['anxiety']);
        
        if (conditionsError) {
          console.error('❌ Conditions filter error:', conditionsError);
        } else {
          console.log(`✅ Conditions filter (anxiety): ${conditionsFiltered?.length || 0} practitioners`);
        }
      } catch (err) {
        console.error('❌ Conditions filter exception:', err);
      }
      
    } else {
      console.log('⚠️ No practitioners found in database');
    }
    
  } catch (err) {
    console.error('❌ Exception:', err);
  }
};

// Run the test
testPractitioners();
