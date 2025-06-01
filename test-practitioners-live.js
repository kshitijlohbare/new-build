// Test practitioners fetching with proper SSL handling
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read environment variables
const envContent = fs.readFileSync('.env', 'utf8');
const envLines = envContent.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) {
    supabaseUrl = line.split('=')[1];
  }
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) {
    supabaseKey = line.split('=')[1];
  }
}

console.log('Using Supabase URL:', supabaseUrl);
console.log('Using Supabase Key:', supabaseKey ? 'KEY_SET' : 'NO_KEY');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testPractitioners() {
  console.log('\n=== TESTING PRACTITIONERS FETCH ===');
  
  try {
    // Test basic query
    console.log('1. Testing basic select...');
    const { data: basicData, error: basicError } = await supabase
      .from('practitioners')
      .select('*');
    
    if (basicError) {
      console.error('Basic query error:', basicError);
      return;
    }
    
    console.log(`✓ Found ${basicData?.length || 0} practitioners`);
    
    // Test with debugging similar to the website
    console.log('\n2. Testing with filters (like website)...');
    let query = supabase.from('practitioners').select('*');
    
    // Apply price range filter (like website)
    query = query.gte('price', 0).lte('price', 500);
    
    const { data: filteredData, error: filteredError } = await query;
    
    if (filteredError) {
      console.error('Filtered query error:', filteredError);
      return;
    }
    
    console.log(`✓ After price filter: ${filteredData?.length || 0} practitioners`);
    
    // Show details of each practitioner
    console.log('\n3. Practitioner details:');
    filteredData?.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Specialty: ${p.specialty}`);
      console.log(`   Price: $${p.price}`);
      console.log(`   Location: ${p.location_type}`);
      console.log(`   Rating: ${p.rating} (${p.reviews} reviews)`);
      console.log(`   Conditions: ${JSON.stringify(p.conditions)}`);
      console.log(`   Image URL: ${p.image_url}`);
      console.log('');
    });
    
  } catch (err) {
    console.error('Exception:', err);
  }
}

testPractitioners();
