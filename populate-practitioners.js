// Minimal script to populate practitioners table with sample data
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Disable SSL verification for development
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const supabase = createClient(supabaseUrl, supabaseKey);

const samplePractitioners = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Clinical Psychologist specializing in anxiety disorders',
    reviews: 124,
    rating: 4.8,
    price: 120,
    image_url: 'https://randomuser.me/api/portraits/women/22.jpg',
    badge: 'top rated',
    education: 'PhD in Clinical Psychology, Stanford University',
    degree: 'PhD',
    location_type: 'both',
    conditions: ['anxiety', 'depression', 'trauma', 'stress'],
    calendly_link: 'https://calendly.com/dr-sarah-johnson/therapy-session'
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Psychiatrist focusing on depression and mood disorders',
    reviews: 98,
    rating: 4.7,
    price: 150,
    image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    badge: 'experienced',
    education: 'MD in Psychiatry, Johns Hopkins University',
    degree: 'MD',
    location_type: 'online',
    conditions: ['depression', 'bipolar', 'anxiety', 'insomnia'],
    calendly_link: 'https://calendly.com/dr-michael-chen/psychiatric-consultation'
  },
  {
    name: 'Emily Rodriguez, LCSW',
    specialty: 'Licensed Clinical Social Worker with ADHD expertise',
    reviews: 76,
    rating: 4.5,
    price: 90,
    image_url: 'https://randomuser.me/api/portraits/women/45.jpg',
    badge: null,
    education: 'MSW, Columbia University',
    degree: 'MSW',
    location_type: 'online',
    conditions: ['adhd', 'anxiety', 'ocd', 'depression']
  }
];

async function createAndPopulateTable() {
  console.log('Creating practitioners table and inserting sample data...');
  
  try {
    // Try to insert directly - Supabase will create the table if it doesn't exist
    console.log('Attempting to insert sample practitioners...');
    const { data, error } = await supabase
      .from('practitioners')
      .insert(samplePractitioners)
      .select();
    
    if (error) {
      console.error('Error inserting practitioners:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (error.code === 'PGRST301') {
        console.log('Table does not exist. You may need to create it manually in Supabase.');
      }
      return;
    }
    
    console.log('Sample practitioners inserted successfully!');
    console.log('Inserted data:', data);
    
    // Verify the data was inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('practitioners')
      .select('*');
    
    if (verifyError) {
      console.error('Error verifying data:', verifyError);
    } else {
      console.log(`Total practitioners in database: ${verifyData.length}`);
      verifyData.forEach((practitioner, index) => {
        console.log(`${index + 1}. ${practitioner.name} - ${practitioner.specialty}`);
      });
    }
    
  } catch (error) {
    console.error('Exception occurred:', error);
  }
}

createAndPopulateTable();
