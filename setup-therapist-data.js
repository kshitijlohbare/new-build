// Direct script to set up therapist data in Supabase
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sample data for practitioners
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
    conditions: ['anxiety', 'depression', 'trauma', 'stress']
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
    conditions: ['depression', 'bipolar', 'anxiety', 'insomnia']
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
  },
  {
    name: 'Dr. Robert Taylor',
    specialty: 'Marriage counselor and family therapist',
    reviews: 112,
    rating: 4.6,
    price: 110,
    image_url: 'https://randomuser.me/api/portraits/men/67.jpg',
    badge: 'top rated',
    education: 'PhD in Marriage and Family Therapy, UCLA',
    degree: 'PhD',
    location_type: 'in-person',
    conditions: ['relationships', 'family issues', 'stress', 'grief']
  },
  {
    name: 'Jennifer Wu, LPC',
    specialty: 'Licensed Professional Counselor specializing in OCD',
    reviews: 64,
    rating: 4.9,
    price: 100,
    image_url: 'https://randomuser.me/api/portraits/women/28.jpg',
    badge: 'experienced',
    education: 'MA in Counseling Psychology, NYU',
    degree: 'MA',
    location_type: 'both',
    conditions: ['ocd', 'anxiety', 'depression', 'phobias']
  },
  {
    name: 'Dr. David Wilson',
    specialty: 'Neuropsychologist specializing in cognitive behavioral therapy',
    reviews: 87,
    rating: 4.4,
    price: 140,
    image_url: 'https://randomuser.me/api/portraits/men/52.jpg',
    badge: null,
    education: 'PhD in Neuropsychology, Harvard University',
    degree: 'PhD',
    location_type: 'in-person',
    conditions: ['trauma', 'adhd', 'anxiety', 'learning disorders']
  },
  {
    name: 'Lisa Patel, LMHC',
    specialty: 'Mental Health Counselor focusing on postpartum depression',
    reviews: 41,
    rating: 4.7,
    price: 95,
    image_url: 'https://randomuser.me/api/portraits/women/37.jpg',
    badge: 'new',
    education: 'MS in Mental Health Counseling, Boston College',
    degree: 'MS',
    location_type: 'online',
    conditions: ['postpartum', 'depression', 'anxiety', 'stress']
  },
  {
    name: 'James Thompson, LMFT',
    specialty: 'Licensed Marriage and Family Therapist',
    reviews: 103,
    rating: 4.5,
    price: 105,
    image_url: 'https://randomuser.me/api/portraits/men/42.jpg',
    badge: 'experienced',
    education: 'MA in Marriage and Family Therapy, Pepperdine University',
    degree: 'MA',
    location_type: 'both',
    conditions: ['relationships', 'family issues', 'communication', 'grief']
  },
  {
    name: 'Dr. Rebecca Martinez',
    specialty: 'Clinical Psychologist specializing in bipolar disorder',
    reviews: 89,
    rating: 4.8,
    price: 130,
    image_url: 'https://randomuser.me/api/portraits/women/56.jpg',
    badge: 'top rated',
    education: 'PsyD in Clinical Psychology, University of Chicago',
    degree: 'PsyD',
    location_type: 'online',
    conditions: ['bipolar', 'depression', 'anxiety', 'mood disorders']
  },
  {
    name: 'Andrew Kim, LCSW',
    specialty: 'Social Worker specializing in trauma and PTSD',
    reviews: 52,
    rating: 4.6,
    price: 85,
    image_url: 'https://randomuser.me/api/portraits/men/29.jpg',
    badge: 'new',
    education: 'MSW, University of Michigan',
    degree: 'MSW',
    location_type: 'in-person',
    conditions: ['trauma', 'ptsd', 'anxiety', 'depression']
  }
];

// Main function to run the setup
async function setupTherapistData() {
  try {
    console.log('Creating practitioners table...');
    
    // Check if the table already exists
    const { data: tableInfo, error: tableCheckError } = await supabase
      .from('practitioners')
      .select('*')
      .limit(1);
    
    if (tableCheckError && tableCheckError.code !== 'PGRST116') {
      // If the table doesn't exist, create it
      const { error: createError } = await supabase.rpc('rest', {
        endpoint: '/rest/v1/rpc/pgexec',
        body: {
          query: `
            CREATE TABLE practitioners (
              id SERIAL PRIMARY KEY,
              name TEXT NOT NULL,
              specialty TEXT NOT NULL,
              reviews INTEGER DEFAULT 0,
              rating NUMERIC(3,1) DEFAULT 0.0,
              price INTEGER NOT NULL,
              image_url TEXT,
              badge TEXT CHECK (badge IN ('top rated', 'new', 'experienced', NULL)),
              education TEXT,
              degree TEXT,
              location_type TEXT CHECK (location_type IN ('online', 'in-person', 'both')),
              conditions TEXT[] DEFAULT '{}',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
          `
        }
      });
      
      if (createError) {
        // If there was an error creating the table, fallback to insert only
        console.log('Could not create table. Attempting to insert data into existing table:', createError);
      } else {
        console.log('Practitioners table created successfully!');
      }
    } else {
      console.log('Practitioners table already exists, proceeding with data insertion');
    }
    
    // Insert the sample practitioners
    console.log('Inserting sample practitioners data...');
    
    // Delete existing data if any
    const { error: deleteError } = await supabase
      .from('practitioners')
      .delete()
      .gte('id', 0);
    
    if (deleteError) {
      console.warn('Warning: Could not clear existing data:', deleteError);
    }
    
    // Insert new data
    const { error: insertError } = await supabase
      .from('practitioners')
      .insert(samplePractitioners);
    
    if (insertError) {
      console.error('Error inserting data:', insertError);
      return;
    }
    
    console.log('Sample data inserted successfully!');
    
    // Verify the data was inserted
    const { data: verifyData, error: verifyError } = await supabase
      .from('practitioners')
      .select('*');
    
    if (verifyError) {
      console.error('Error verifying data:', verifyError);
    } else {
      console.log(`Successfully inserted ${verifyData.length} practitioners.`);
    }
    
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

// Run the setup
setupTherapistData();