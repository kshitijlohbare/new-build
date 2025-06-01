import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Test with more detailed debugging
async function detailedTest() {
  console.log('=== DETAILED PRACTITIONERS TEST ===');
  console.log('URL:', supabaseUrl);
  console.log('Key exists:', !!supabaseKey);
  
  try {
    // First test - check if table exists and get structure
    console.log('\n1. Testing table existence...');
    const { data: tableTest, error: tableError } = await supabase
      .from('practitioners')
      .select('id')
      .limit(1);
    
    if (tableError) {
      console.error('❌ Table access error:', tableError);
      return;
    }
    
    console.log('✅ Table exists and is accessible');
    
    // Second test - get all data
    console.log('\n2. Getting all practitioners...');
    const { data: allData, error: allError } = await supabase
      .from('practitioners')
      .select('*');
      
    if (allError) {
      console.error('❌ All data error:', allError);
      return;
    }
    
    console.log('✅ All data retrieved successfully');
    console.log('Total practitioners:', allData?.length || 0);
    
    if (allData && allData.length > 0) {
      console.log('\n3. Sample practitioner structure:');
      const sample = allData[0];
      console.log('Sample practitioner keys:', Object.keys(sample));
      console.log('Sample practitioner:', JSON.stringify(sample, null, 2));
      
      // Check for filtering issues
      console.log('\n4. Testing filters that might be causing issues...');
      
      // Test price range filter
      const { data: priceTest, error: priceError } = await supabase
        .from('practitioners')
        .select('*')
        .gte('price', 0)
        .lte('price', 500);
        
      if (priceError) {
        console.error('❌ Price filter error:', priceError);
      } else {
        console.log(`✅ Price filter (0-500): ${priceTest?.length || 0} results`);
      }
      
      // Test location filter
      const { data: locationTest, error: locationError } = await supabase
        .from('practitioners')
        .select('*')
        .in('location_type', ['online', 'both']);
        
      if (locationError) {
        console.error('❌ Location filter error:', locationError);
      } else {
        console.log(`✅ Location filter (online/both): ${locationTest?.length || 0} results`);
      }
    }
    
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

detailedTest();
