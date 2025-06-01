import { supabase } from '../lib/supabase';
// These imports were removed as they're not used
// import fs from 'fs';
// import path from 'path';

/**
 * This script adds the calendly_link column to the practitioners table
 * Run this script if you need to update an existing database
 */
async function addCalendlyLinkColumn() {
  console.log('Checking if calendly_link column exists in practitioners table...');
  
  try {
    // Check if column exists
    const { data, error: checkError } = await supabase
      .from('information_schema.columns')
      .select('column_name')
      .eq('table_name', 'practitioners')
      .eq('column_name', 'calendly_link');
    
    if (checkError) {
      console.error('Error checking column existence:', checkError);
      return false;
    }
    
    if (data && data.length > 0) {
      console.log('Column already exists. No changes needed.');
      return true;
    }
    
    // Column doesn't exist, add it
    console.log('Adding calendly_link column to practitioners table...');
    
    const { error: alterError } = await supabase.rpc('pg_exec', {
      query: 'ALTER TABLE practitioners ADD COLUMN calendly_link TEXT'
    });
    
    if (alterError) {
      console.error('Error adding column:', alterError);
      return false;
    }
    
    console.log('calendly_link column added successfully!');
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

// Run the script if executed directly
if (require.main === module) {
  addCalendlyLinkColumn()
    .then(success => {
      console.log(success ? 'Migration completed successfully.' : 'Migration failed.');
      process.exit(success ? 0 : 1);
    })
    .catch(err => {
      console.error('Migration failed with error:', err);
      process.exit(1);
    });
}

export default addCalendlyLinkColumn;
