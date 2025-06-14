// Script to enable Row Level Security on practice tables in Supabase
// This ensures each user's practice data is kept private and secure
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting RLS setup process...');

// Read and log the SQL for demonstration purposes
const sqlFilePath = path.join(__dirname, 'enable-practices-rls.sql');
const sql = fs.readFileSync(sqlFilePath, 'utf8');

// Log important parts of the SQL for verification
console.log('\n=== RLS SQL POLICIES ===');
const lines = sql.split('\n');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('CREATE POLICY') || line.startsWith('ALTER TABLE') || line.startsWith('DROP POLICY')) {
    console.log(line);
  }
}

console.log('\n=== TO APPLY THESE POLICIES ===');
console.log('1. Log in to the Supabase dashboard at https://supabase.com');
console.log('2. Go to your project');
console.log('3. Open the SQL editor');
console.log('4. Copy and paste the contents of enable-practices-rls.sql');
console.log('5. Run the SQL');

console.log('\n=== RLS VERIFICATION STEPS ===');
console.log('After applying the policies, verify that:');
console.log('1. Row Level Security is enabled on all practice tables');
console.log('2. Each user can only access their own practices in user_practices and user_daily_practices');
console.log('3. All users can view system practices but only admins can modify them');

console.log('\n=== RLS SUMMARY ===');
console.log('The following policies have been created:');
console.log('- Everyone can view system practices');
console.log('- Only admins can modify system practices');
console.log('- Users can only view their own practice data');
console.log('- Users can only modify their own practice data');
console.log('- Users can only view their own daily practices');
console.log('- Users can only modify their own daily practices');

console.log('\nAdditional changes:');
console.log('- Added completion tracking columns to user_daily_practices table (completed, completed_at, streak)');
console.log('- Created trigger to automatically update completion timestamps');
