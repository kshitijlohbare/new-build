import { supabase } from '../lib/supabase';

// Function to create the practitioners table
async function createPractitionersTable() {
  console.log('Creating practitioners table...');
  
  // First check if the table already exists
  const { data: existingTables } = await supabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public');
  
  const tableExists = existingTables?.some(table => table.tablename === 'practitioners');
  
  if (tableExists) {
    console.log('Table already exists. Dropping and recreating...');
    
    // Drop the existing table
    const { error: dropError } = await supabase.rpc('pg_exec', {
      query: 'DROP TABLE practitioners'
    });
    
    if (dropError) {
      console.error('Error dropping table:', dropError);
      return false;
    }
  }
  
  // Create the table
  const { error: createError } = await supabase.rpc('pg_exec', {
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
  });
  
  if (createError) {
    console.error('Error creating table:', createError);
    return false;
  }
  
  console.log('Practitioners table created successfully!');
  return true;
}

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

// Function to insert sample data
async function insertSampleData() {
  console.log('Inserting sample data...');
  
  const { error } = await supabase
    .from('practitioners')
    .insert(samplePractitioners);
  
  if (error) {
    console.error('Error inserting data:', error);
    return false;
  }
  
  console.log('Sample data inserted successfully!');
  return true;
}

// Main function to run the setup
async function setupTherapistData() {
  try {
    // Create the table
    const tableCreated = await createPractitionersTable();
    if (!tableCreated) {
      console.error('Failed to create practitioners table');
      return;
    }
    
    // Insert sample data
    const dataInserted = await insertSampleData();
    if (!dataInserted) {
      console.error('Failed to insert sample data');
      return;
    }
    
    console.log('Therapist data setup completed successfully!');
  } catch (error) {
    console.error('An error occurred during setup:', error);
  }
}

// Run the setup
setupTherapistData();