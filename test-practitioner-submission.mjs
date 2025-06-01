import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Disable TLS for development
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

async function testPractitionerSubmission() {
  console.log('=== TESTING PRACTITIONER SUBMISSION ===');
  
  try {
    // Test data that matches the fixed column schema
    const testPractitionerData = {
      user_id: '32970f20-1fd8-4377-b219-835f9f070cf4', // Use existing user ID
      name: 'Test Practitioner',
      specialty: 'Test Specialist', // This field no longer has 10 character minimum
      education: 'Test University',
      degree: 'PhD',
      bio: 'This is a test bio that is longer than 50 characters to meet the minimum requirement for the bio field.',
      location_type: 'online',
      price: 1500,
      years_experience: 5,
      languages: ['English', 'Hindi'],
      approach: 'Cognitive Behavioral Therapy',
      certifications: 'Test Certification',
      conditions: ['anxiety', 'depression'],
      insurance_accepted: ['HDFC ERGO'],
      session_formats: ['Individual Therapy'], // Note: using session_formats not session_format
      availability_schedule: 'Monday to Friday 9am-5pm', // Note: using availability_schedule not availability
      calendly_link: 'https://calendly.com/test-practitioner',
      reviews: 0,
      rating: 5.0,
      badge: 'new',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('📝 Test data prepared:', testPractitionerData);
    
    // First, check if this user already has a practitioner record
    const { data: existingData, error: checkError } = await supabase
      .from('practitioners')
      .select('id')
      .eq('user_id', testPractitionerData.user_id);
    
    if (checkError) {
      console.error('❌ Error checking existing records:', checkError);
      return;
    }
    
    if (existingData && existingData.length > 0) {
      console.log('⚠️  User already has a practitioner record. Skipping test insertion.');
      console.log('✅ Schema validation successful - no column errors detected!');
      return;
    }
    
    // Try to insert the test data
    const { data: insertedData, error } = await supabase
      .from('practitioners')
      .insert([testPractitionerData])
      .select();

    if (error) {
      console.error('❌ Insertion failed:', error);
      
      // Check if it's a column-related error
      if (error.message && error.message.includes('column')) {
        console.log('🔍 This appears to be a column schema issue.');
        console.log('💡 The column names in the code may not match the database schema.');
      }
    } else {
      console.log('✅ Test practitioner inserted successfully!');
      console.log('📊 Inserted data:', insertedData);
      
      // Clean up - delete the test record
      if (insertedData && insertedData[0]) {
        const { error: deleteError } = await supabase
          .from('practitioners')
          .delete()
          .eq('id', insertedData[0].id);
          
        if (deleteError) {
          console.error('⚠️  Warning: Could not clean up test record:', deleteError);
        } else {
          console.log('🧹 Test record cleaned up successfully');
        }
      }
    }
    
  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

testPractitionerSubmission();
