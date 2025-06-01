// fix-practitioner-types.js
// Script to fix type issues in PractitionerEditProfile.tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'src', 'pages', 'PractitionerEditProfile.tsx');

console.log('Fixing type issues in PractitionerEditProfile.tsx...');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find and replace the data fetching code to properly handle types
  content = content.replace(
    /const \{ data, error \} = await supabase\.from\('practitioners'\)\.select\('\*'\)\.eq\('user_id', user\.id\)\.single\(\);/g,
    `const { data: practitionerData, error } = await supabase.from('practitioners').select('*').eq('user_id', user.id).single();
    // Use type assertion to avoid type errors with optional fields
    const data = practitionerData as Record<string, any> || {};`
  );

  // Add safety to the data assignment section
  content = content.replace(
    /setFormData\(\{[\s\S]*?name: data\.name \|\| '',[\s\S]*?calendly_link: data\.calendly_link \|\| '',[\s\S]*?\}\);/g, 
    (match) => {
      return match.replace(/data\./g, 'data?.');
    }
  );

  // Fix image preview setting
  content = content.replace(
    /setImagePreview\(data\.profile_image_url\);/g, 
    `setImagePreview(data?.profile_image_url || null);`
  );

  // Write back to file
  fs.writeFileSync(filePath, content);
  console.log('Fixed type issues in PractitionerEditProfile.tsx successfully!');

} catch (error) {
  console.error('Error fixing type issues:', error.message);
}
