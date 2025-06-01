import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPractitionersDetailed() {
  console.log('=== COMPREHENSIVE PRACTITIONERS TEST ===');
  
  try {
    // 1. Basic connection test
    console.log('\n1. 🔌 Testing basic connection...');
    const { data: basicData, error: basicError } = await supabase
      .from('practitioners')
      .select('*');
    
    if (basicError) {
      console.error('❌ Connection failed:', basicError);
      return;
    }
    
    console.log(`✅ Connection successful! Found ${basicData?.length || 0} practitioners`);
    
    if (!basicData || basicData.length === 0) {
      console.log('⚠️ No practitioners found in database');
      return;
    }
    
    // 2. Log all practitioners
    console.log('\n2. 📋 All practitioners in database:');
    basicData.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name}`);
      console.log(`   Specialty: ${p.specialty}`);
      console.log(`   Price: $${p.price}`);
      console.log(`   Location: ${p.location_type}`);
      console.log(`   Rating: ${p.rating} (${p.reviews} reviews)`);
      console.log(`   Conditions: ${JSON.stringify(p.conditions)}`);
      console.log(`   Image: ${p.image_url}`);
      console.log(`   Badge: ${p.badge}`);
      console.log('');
    });
    
    // 3. Test the exact query from TherapistListing component
    console.log('\n3. 🔍 Testing exact query from component...');
    
    // Simulate default filters from the component
    let query = supabase.from('practitioners').select('*');
    
    // Apply price range filter (default 0-500)
    query = query.gte('price', 0).lte('price', 500);
    
    const { data: filteredData, error: filteredError } = await query;
    
    if (filteredError) {
      console.error('❌ Filtered query failed:', filteredError);
    } else {
      console.log(`✅ Filtered query successful! Found ${filteredData?.length || 0} practitioners`);
      
      if (filteredData && filteredData.length > 0) {
        console.log('✅ Practitioners that should appear on website:');
        filteredData.forEach((p, i) => {
          console.log(`${i + 1}. ${p.name} - $${p.price} - ${p.location_type}`);
        });
      }
    }
    
    // 4. Test individual filter components
    console.log('\n4. 🧪 Testing individual filters...');
    
    // Test price filters
    const priceTests = [
      { min: 0, max: 100, name: 'Low price (0-100)' },
      { min: 100, max: 300, name: 'Mid price (100-300)' },
      { min: 300, max: 500, name: 'High price (300-500)' },
      { min: 0, max: 1000, name: 'All prices (0-1000)' }
    ];
    
    for (const test of priceTests) {
      const { data: testData, error: testError } = await supabase
        .from('practitioners')
        .select('*')
        .gte('price', test.min)
        .lte('price', test.max);
      
      if (testError) {
        console.error(`❌ ${test.name} filter failed:`, testError);
      } else {
        console.log(`✅ ${test.name}: ${testData?.length || 0} practitioners`);
      }
    }
    
    // 5. Test location type filters
    console.log('\n5. 🌍 Testing location filters...');
    const locationTests = ['online', 'in-person', 'both'];
    
    for (const location of locationTests) {
      const { data: locationData, error: locationError } = await supabase
        .from('practitioners')
        .select('*')
        .eq('location_type', location);
      
      if (locationError) {
        console.error(`❌ Location ${location} filter failed:`, locationError);
      } else {
        console.log(`✅ Location ${location}: ${locationData?.length || 0} practitioners`);
      }
    }
    
    // 6. Test conditions filter
    console.log('\n6. 🎯 Testing conditions filters...');
    const conditionsToTest = ['anxiety', 'depression', 'adhd'];
    
    for (const condition of conditionsToTest) {
      try {
        const { data: conditionData, error: conditionError } = await supabase
          .from('practitioners')
          .select('*')
          .overlaps('conditions', [condition]);
        
        if (conditionError) {
          console.error(`❌ Condition ${condition} filter failed:`, conditionError);
        } else {
          console.log(`✅ Condition ${condition}: ${conditionData?.length || 0} practitioners`);
        }
      } catch (err) {
        console.error(`❌ Condition ${condition} filter exception:`, err);
      }
    }
    
    // 7. Summary
    console.log('\n7. 📊 SUMMARY:');
    console.log(`Total practitioners in database: ${basicData.length}`);
    console.log(`Practitioners passing default filters: ${filteredData?.length || 0}`);
    
    if (basicData.length > 0 && (filteredData?.length || 0) === 0) {
      console.log('🚨 ISSUE FOUND: All practitioners are being filtered out!');
      console.log('This means the website filters are too restrictive.');
    } else if (basicData.length > 0 && (filteredData?.length || 0) > 0) {
      console.log('✅ Data should be visible on website');
    }
    
  } catch (err) {
    console.error('❌ Test failed with exception:', err);
  }
}

testPractitionersDetailed();
