// Simple script to create the therapists table
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Hard-coded therapists data for insertion
const therapistData = [
  {
    name: 'Dr. Sarah Johnson',
    specialty: 'Cognitive Behavioral Therapy',
    location: 'New York, NY',
    rating: 4.9,
    bio: 'Specialized in anxiety and depression treatment with over a decade of experience helping patients develop coping strategies.',
    years_experience: 12
  },
  {
    name: 'Dr. Michael Chen',
    specialty: 'Trauma Therapy',
    location: 'Los Angeles, CA',
    rating: 4.7,
    bio: 'Focuses on helping patients heal from past trauma using evidence-based approaches and compassionate care.',
    years_experience: 15
  },
  {
    name: 'Lisa Rodriguez, LMFT',
    specialty: 'Family Therapy',
    location: 'Chicago, IL',
    rating: 4.8,
    bio: 'Dedicated to strengthening family bonds and resolving conflicts through collaborative therapeutic approaches.',
    years_experience: 8
  }
];

async function createTherapistsTableSimple() {
  console.log('Starting therapists table creation...');
  
  // Get Supabase credentials from environment variables or .env file
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Supabase credentials not found in environment variables');
    console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in .env file');
    
    // Log environment variables for debugging
    console.log('Available environment variables:', Object.keys(process.env));
    return;
  }
  
  console.log(`Using Supabase URL: ${supabaseUrl}`);
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Step 1: Create the therapists table
    console.log('Creating therapists table if it does not exist...');
    
    // Create table with UUID and other required fields
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS public.therapists (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        name TEXT NOT NULL,
        specialty TEXT NOT NULL,
        location TEXT NOT NULL,
        rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
        image_url TEXT,
        bio TEXT NOT NULL,
        years_experience INTEGER NOT NULL
      );
    `;
    
    // Execute create table query
    const { error: createError } = await supabase.rpc('pg_execute', { 
      query: createTableQuery 
    });
    
    if (createError) {
      console.error('Error creating table:', createError);
      return;
    }
    
    console.log('Table created or already exists');
    
    // Step 2: Insert sample therapist data
    console.log('Inserting sample therapist data...');
    
    // Insert data directly using .insert()
    const { error: insertError } = await supabase
      .from('therapists')
      .insert(therapistData);
      
    if (insertError) {
      console.error('Error inserting therapist data:', insertError);
      // Continue even if insert fails (might be duplicates)
    } else {
      console.log('Sample therapist data inserted successfully');
    }
    
    // Step 3: Add RLS policies
    console.log('Setting up RLS policies...');
    
    const enableRLSQuery = `
      ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;
    `;
    
    const publicReadQuery = `
      CREATE POLICY IF NOT EXISTS "Allow public read access to therapists" 
      ON public.therapists FOR SELECT 
      USING (true);
    `;
    
    const authenticatedInsertQuery = `
      CREATE POLICY IF NOT EXISTS "Allow authenticated users to insert therapists" 
      ON public.therapists FOR INSERT 
      WITH CHECK (auth.role() = 'authenticated');
    `;
    
    const authenticatedUpdateQuery = `
      CREATE POLICY IF NOT EXISTS "Allow authenticated users to update therapists" 
      ON public.therapists FOR UPDATE 
      USING (auth.role() = 'authenticated');
    `;
    
    // Execute RLS queries
    await supabase.rpc('pg_execute', { query: enableRLSQuery });
    await supabase.rpc('pg_execute', { query: publicReadQuery });
    await supabase.rpc('pg_execute', { query: authenticatedInsertQuery });
    await supabase.rpc('pg_execute', { query: authenticatedUpdateQuery });
    
    console.log('RLS policies added');
    
    // Step 4: Verify the table exists
    const { data: tableData, error: tableError } = await supabase
      .from('therapists')
      .select('count(*)', { count: 'exact' });
    
    if (tableError) {
      console.error('Error verifying therapists table:', tableError);
      return;
    }
    
    console.log(`Therapists table contains ${tableData[0].count} records`);
    console.log('Therapists table setup complete!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createTherapistsTableSimple();