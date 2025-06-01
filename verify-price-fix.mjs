import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyFix() {
  console.log('=== VERIFYING PRICE RANGE FIX ===');
  
  try {
    // Test the old restrictive range
    console.log('\n1. Testing old price range (0-500):');
    const { data: oldRange, error: oldError } = await supabase
      .from('practitioners')
      .select('*')
      .gte('price', 0)
      .lte('price', 500);
      
    if (oldError) {
      console.error('❌ Error:', oldError);
    } else {
      console.log(`✅ Old range (0-500): ${oldRange?.length || 0} practitioners found`);
      oldRange?.forEach(p => console.log(`  - ${p.name}: ₹${p.price}`));
    }
    
    // Test the new expanded range
    console.log('\n2. Testing new price range (0-5000):');
    const { data: newRange, error: newError } = await supabase
      .from('practitioners')
      .select('*')
      .gte('price', 0)
      .lte('price', 5000);
      
    if (newError) {
      console.error('❌ Error:', newError);
    } else {
      console.log(`✅ New range (0-5000): ${newRange?.length || 0} practitioners found`);
      newRange?.forEach(p => console.log(`  - ${p.name}: ₹${p.price}`));
    }
    
    // Show all prices to understand the range
    console.log('\n3. All practitioner prices:');
    const { data: allPrices, error: priceError } = await supabase
      .from('practitioners')
      .select('name, price')
      .order('price', { ascending: true });
      
    if (priceError) {
      console.error('❌ Error:', priceError);
    } else {
      console.log('✅ All prices (sorted):');
      allPrices?.forEach(p => console.log(`  - ${p.name}: ₹${p.price}`));
      
      if (allPrices && allPrices.length > 0) {
        const prices = allPrices.map(p => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        console.log(`\n📊 Price range summary:`);
        console.log(`   Min price: ₹${minPrice}`);
        console.log(`   Max price: ₹${maxPrice}`);
        console.log(`   Recommended filter range: [0, ${Math.max(maxPrice + 500, 5000)}]`);
      }
    }
    
  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

verifyFix();
