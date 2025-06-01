// check-all-practitioners.js
// Comprehensive script to check all practitioners in the database

import { createClient } from '@supabase/supabase-js';

// Use the correct Supabase URL and key
const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Disable SSL verification in Node.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  try {
    // 1. Count total practitioners
    const { data: countData, error: countError } = await supabase
      .from('practitioners')
      .select('count');
      
    if (countError) {
      console.error('Error counting practitioners:', countError);
      return;
    }
    
    const totalCount = countData[0]?.count || 0;
    console.log(`Total practitioners in database: ${totalCount}`);
    
    // 2. Get all practitioners
    const { data: allPractitioners, error: fetchError } = await supabase
      .from('practitioners')
      .select('*');
      
    if (fetchError) {
      console.error('Error fetching practitioners:', fetchError);
      return;
    }
    
    if (!allPractitioners || allPractitioners.length === 0) {
      console.log('No practitioners found in the database.');
      return;
    }
    
    console.log(`Retrieved ${allPractitioners.length} practitioners`);
    
    // 3. Check for any potential filtering issues
    const issuesFound = {
      missingName: 0,
      missingSpecialty: 0,
      invalidPrice: 0,
      invalidRating: 0,
      invalidLocationType: 0,
      invalidConditions: 0,
      nullImage: 0
    };
    
    // Track practitioners with issues
    const practitionersWithIssues = [];
    
    allPractitioners.forEach((p, index) => {
      const issues = [];
      
      // Check for required fields
      if (!p.name) {
        issues.push('Missing name');
        issuesFound.missingName++;
      }
      
      if (!p.specialty) {
        issues.push('Missing specialty');
        issuesFound.missingSpecialty++;
      }
      
      if (typeof p.price !== 'number' || p.price <= 0) {
        issues.push('Invalid price');
        issuesFound.invalidPrice++;
      }
      
      if (typeof p.rating !== 'number' || p.rating < 0 || p.rating > 5) {
        issues.push('Invalid rating');
        issuesFound.invalidRating++;
      }
      
      if (!['online', 'in-person', 'both'].includes(p.location_type)) {
        issues.push('Invalid location_type');
        issuesFound.invalidLocationType++;
      }
      
      if (!Array.isArray(p.conditions) || p.conditions.length === 0) {
        issues.push('Invalid conditions');
        issuesFound.invalidConditions++;
      }
      
      if (!p.image_url) {
        issues.push('Null image');
        issuesFound.nullImage++;
      }
      
      if (issues.length > 0) {
        practitionersWithIssues.push({ 
          id: p.id, 
          name: p.name || 'NO NAME', 
          issues 
        });
      }
      
      // Print basic info for all practitioners
      console.log(`${index + 1}. ${p.id}: ${p.name || 'NO NAME'} - ${p.specialty || 'NO SPECIALTY'} - Price: ${p.price} - Type: ${p.location_type}`);
    });
    
    // 4. Summary of issues
    console.log('\n--- POTENTIAL ISSUES SUMMARY ---');
    
    if (Object.values(issuesFound).every(count => count === 0)) {
      console.log('No data issues found that would prevent display');
    } else {
      console.log('The following issues might prevent practitioners from displaying:');
      for (const [issue, count] of Object.entries(issuesFound)) {
        if (count > 0) {
          console.log(`- ${issue}: ${count} practitioners affected`);
        }
      }
      
      console.log('\nPractitioners with issues:');
      practitionersWithIssues.forEach(p => {
        console.log(`- ID ${p.id}: "${p.name}" has issues: ${p.issues.join(', ')}`);
      });
    }
    
    console.log('\n--- UI DISPLAY CHECK ---');
    console.log('The following filters in the UI could limit displayed practitioners:');
    console.log('1. Price range: Default is [0, 500] - practitioners with price outside this range won\'t show');
    console.log('2. Conditions: If filters are active, only practitioners with those conditions will show');
    console.log('3. Location type: Tab filters can restrict to "online", "face-to-face", or "both"');
    console.log('4. Search query: Text filtering can restrict based on name or specialty');
    
    console.log('\n--- RECOMMENDATION ---');
    console.log('Check that the UI filters are reset to defaults, especially:');
    console.log('- Price slider should be at full range [0, 500]');
    console.log('- No condition filters should be selected');
    console.log('- Tab should be set to "recommended" to show all location types');
    
  } catch (err) {
    console.error('Exception during check:', err);
  }
}

checkAllPractitioners().catch(console.error);
