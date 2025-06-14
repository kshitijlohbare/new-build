// verify-therapist-implementation.js
// Script to verify the therapist listing implementation
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Disable SSL verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyImplementation() {
  console.log('Verifying therapist listing implementation...');
  
  // Check that routing is set up correctly
  try {
    // 1. Check for practitioners data
    console.log('1. Checking practitioners data...');
    const { data: practitioners, error: practitionersError } = await supabase
      .from('practitioners')
      .select('*');
    
    if (practitionersError) {
      console.error('Error accessing practitioners table:', practitionersError);
    } else {
      console.log(`✅ Practitioners data available: ${practitioners.length} records found`);
    }
    
    // 2. Check App.tsx imports
    console.log('\n2. Checking App.tsx import...');
    const fs = await import('fs');
    const path = await import('path');
    
    const appTsxPath = path.resolve('/Users/kshitijlohbare/Downloads/new build/src/App.tsx');
    const appTsxContent = fs.readFileSync(appTsxPath, 'utf8');
    
    if (appTsxContent.includes("import TherapistListing from \"./pages/TherapistListing_New\"")) {
      console.log('✅ App.tsx is correctly importing TherapistListing_New as TherapistListing');
    } else {
      console.warn('❌ App.tsx may not be importing TherapistListing_New correctly');
    }
    
    // 3. Check CSS for scrollbar-hide utility
    console.log('\n3. Checking scrollbar-hide CSS utility...');
    const cssPath = path.resolve('/Users/kshitijlohbare/Downloads/new build/src/index.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    if (cssContent.includes('scrollbar-hide')) {
      console.log('✅ scrollbar-hide utility class is defined in CSS');
    } else {
      console.warn('❌ scrollbar-hide utility class might be missing from CSS');
    }
    
    // 4. Verify Sidebar routing
    console.log('\n4. Checking sidebar routing...');
    const sidebarPath = path.resolve('/Users/kshitijlohbare/Downloads/new build/src/components/layout/Sidebar.tsx');
    const sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    
    if (sidebarContent.includes('path: "/therapist-listing"')) {
      console.log('✅ Sidebar correctly links to /therapist-listing path');
    } else {
      console.warn('❌ Sidebar might not be linking to /therapist-listing correctly');
    }
    
    console.log('\n✨ Verification complete! The new TherapistListing implementation should be working.');
    console.log('Open your app and navigate to the "therapy sessions" section from the sidebar to test it.');
  } catch (error) {
    console.error('Error during verification:', error);
  }
}

verifyImplementation();
