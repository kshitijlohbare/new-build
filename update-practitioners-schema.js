/**
 * Update Practitioners Schema
 * 
 * This script updates the practitioners table schema to include fields
 * needed by the therapist listing page.
 * 
 * Usage:
 * 1. node update-practitioners-schema.js
 *    (Uses environment variables from .env file)
 *    
 * 2. node update-practitioners-schema.js <SUPABASE_URL> <SUPABASE_KEY>
 *    (Uses command line arguments)
 *    
 * 3. node update-practitioners-schema.js --use-default
 *    (Uses default credentials from env-config.js)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Check if we should use default credentials
const useDefault = process.argv.includes('--use-default');

// Function to get Supabase config from env-config.js if available
function getDefaultSupabaseConfig() {
  try {
    // Try to load the env-config.js file
    const envConfigPath = path.resolve('./src/lib/env-config.js');
    
    if (fs.existsSync(envConfigPath)) {
      // We can't directly import it because it's an ES module
      // So we'll extract the values using regex
      const content = fs.readFileSync(envConfigPath, 'utf-8');
      
      // Extract URL
      const urlMatch = content.match(/'https:\/\/[^']+\.supabase\.co'/);
      const url = urlMatch ? urlMatch[0].replace(/'/g, '') : null;
      
      // Extract key
      const keyMatch = content.match(/'sb_publishable_[^']+'/);
      const key = keyMatch ? keyMatch[0].replace(/'/g, '') : null;
      
      if (url && key) {
        console.log('Using default Supabase configuration from env-config.js');
        return { supabaseUrl: url, supabaseKey: key };
      }
    }
  } catch (error) {
    console.error('Error reading env-config.js:', error);
  }
  
  return null;
}

// Get Supabase credentials
let supabaseUrl, supabaseKey;

if (useDefault) {
  const defaultConfig = getDefaultSupabaseConfig();
  if (defaultConfig) {
    supabaseUrl = defaultConfig.supabaseUrl;
    supabaseKey = defaultConfig.supabaseKey;
  }
} else {
  supabaseUrl = process.env.VITE_SUPABASE_URL || process.argv[2];
  supabaseKey = process.env.VITE_SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.argv[3];
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials');
  console.error('Usage:');
  console.error('  node update-practitioners-schema.js');
  console.error('  node update-practitioners-schema.js <SUPABASE_URL> <SUPABASE_KEY>');
  console.error('  node update-practitioners-schema.js --use-default');
  console.error('\nPlease provide credentials via:');
  console.error('  1. Environment variables in a .env file');
  console.error('  2. Command line arguments');
  console.error('  3. Use the --use-default flag to use credentials from env-config.js');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePractitionersSchema() {
  try {
    console.log('Updating practitioners schema...');
    
    // Add years_experience column if it doesn't exist
    console.log('Adding years_experience column...');
    await supabase.rpc('pg_execute', {
      query: `
        ALTER TABLE public.practitioners 
        ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 5;
      `
    });
    
    // Add languages column if it doesn't exist
    console.log('Adding languages column...');
    await supabase.rpc('pg_execute', {
      query: `
        ALTER TABLE public.practitioners 
        ADD COLUMN IF NOT EXISTS languages TEXT[] DEFAULT ARRAY['English'];
      `
    });
    
    // Add user_id column if it doesn't exist (for RLS)
    console.log('Adding user_id column for RLS...');
    await supabase.rpc('pg_execute', {
      query: `
        ALTER TABLE public.practitioners 
        ADD COLUMN IF NOT EXISTS user_id UUID DEFAULT NULL;
      `
    });
    
    console.log('✅ Practitioners schema has been successfully updated!');
    
    // Now check if there's any data in the table
    const { count, error } = await supabase
      .from('practitioners')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error checking practitioners count:', error);
      return;
    }
    
    console.log(`Found ${count} practitioners in the database.`);
    
    // If no data, insert some sample practitioners
    if (count === 0) {
      console.log('No practitioners found. Adding sample data...');
      
      const samplePractitioners = [
        {
          name: 'Dr. Sarah Johnson',
          specialty: 'Clinical Psychologist',
          reviews: 48,
          rating: 4.9,
          price: 120,
          image_url: 'https://randomuser.me/api/portraits/women/22.jpg',
          badge: 'top rated',
          education: 'PhD in Clinical Psychology',
          degree: 'PhD',
          location_type: 'both',
          conditions: ['anxiety', 'depression', 'stress', 'burnout'],
          calendly_link: 'https://calendly.com/drsarahjohnson',
          years_experience: 10,
          languages: ['English', 'Spanish']
        },
        {
          name: 'Dr. Michael Chen',
          specialty: 'Cognitive Behavioral Therapist',
          reviews: 36,
          rating: 4.7,
          price: 100,
          image_url: 'https://randomuser.me/api/portraits/men/62.jpg',
          badge: 'experienced',
          education: 'PsyD in Clinical Psychology',
          degree: 'PsyD',
          location_type: 'online',
          conditions: ['anxiety', 'trauma', 'PTSD', 'OCD'],
          calendly_link: 'https://calendly.com/drmichaelchen',
          years_experience: 8,
          languages: ['English', 'Mandarin']
        },
        {
          name: 'Amanda Rodriguez',
          specialty: 'Marriage & Family Therapist',
          reviews: 27,
          rating: 4.8,
          price: 90,
          image_url: 'https://randomuser.me/api/portraits/women/43.jpg',
          badge: null,
          education: 'Master of Family Therapy',
          degree: 'MFT',
          location_type: 'both',
          conditions: ['relationships', 'family issues', 'couples therapy'],
          calendly_link: 'https://calendly.com/amandarodriguez',
          years_experience: 6,
          languages: ['English', 'Spanish']
        },
        {
          name: 'Dr. James Wilson',
          specialty: 'Psychiatrist',
          reviews: 52,
          rating: 4.6,
          price: 150,
          image_url: 'https://randomuser.me/api/portraits/men/32.jpg',
          badge: 'top rated',
          education: 'MD, Psychiatry',
          degree: 'MD',
          location_type: 'both',
          conditions: ['depression', 'anxiety', 'bipolar disorder', 'ADHD'],
          calendly_link: 'https://calendly.com/drjameswilson',
          years_experience: 12,
          languages: ['English']
        },
        {
          name: 'Olivia Patel',
          specialty: 'Mental Health Counselor',
          reviews: 19,
          rating: 4.5,
          price: 80,
          image_url: 'https://randomuser.me/api/portraits/women/67.jpg',
          badge: 'new',
          education: 'Master in Counseling Psychology',
          degree: 'MA',
          location_type: 'online',
          conditions: ['stress', 'anxiety', 'career counseling', 'life transitions'],
          calendly_link: 'https://calendly.com/oliviapatel',
          years_experience: 3,
          languages: ['English', 'Hindi']
        }
      ];
      
      const { error: insertError } = await supabase
        .from('practitioners')
        .insert(samplePractitioners);
      
      if (insertError) {
        console.error('Error inserting sample practitioners:', insertError);
      } else {
        console.log('✅ Sample practitioners added successfully!');
      }
    }
    
  } catch (error) {
    console.error('Error updating practitioners schema:', error.message);
    process.exit(1);
  }
}

// Run the update function
updatePractitionersSchema()
  .then(() => {
    console.log('Schema update process completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('An unexpected error occurred:', error);
    process.exit(1);
  });
