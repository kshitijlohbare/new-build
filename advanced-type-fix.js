// advanced-type-fix.js
// Script to fix type issues in PractitionerEditProfile.tsx by adding proper type assertions

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, 'src', 'pages', 'PractitionerEditProfile.tsx');

console.log('Applying advanced type fixes to PractitionerEditProfile.tsx...');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Fix the data fetching part to include type assertion
  content = content.replace(
    /const \{ data, error \} = await supabase\.from\('practitioners'\)\.select\('\*'\)\.eq\('user_id', user\.id\)\.single\(\);/g,
    `const { data: practitionerData, error } = await supabase.from('practitioners').select('*').eq('user_id', user.id).single();
      // Use type assertion to avoid type errors with optional fields
      const data = practitionerData as any;`
  );

  // 2. Fix the form data setting part - replace the entire block with proper type assertions
  content = content.replace(
    /setFormData\(\{[\s\S]*?name: data\?\.name \|\| '',[\s\S]*?calendly_link: data\?\.calendly_link \|\| '',[\s\S]*?\}\);/g,
    `setFormData({
            name: (data?.name as string) || '',
            specialty: (data?.specialty as string) || '',
            education: (data?.education as string) || '',
            degree: (data?.degree as string) || '',
            bio: (data?.bio as string) || '',
            location_type: (data?.location_type as string) || 'online',
            price: (data?.price as number) || 1500,
            years_experience: (data?.years_experience as number) || 1,
            languages: (data?.languages as string[]) || ['English'],
            approach: (data?.approach as string) || '',
            certifications: (data?.certifications as string) || '',
            conditions: (data?.conditions_treated as string[]) || [],
            insurance_accepted: (data?.insurance_accepted as string[]) || [],
            session_formats: (data?.session_formats as string[]) || ['Individual Therapy'],
            availability_schedule: (data?.availability_schedule as string) || 'Weekdays 9am-5pm',
            calendly_link: (data?.calendly_link as string) || '',
          });`
  );

  // 3. Fix the image preview setting
  content = content.replace(
    /setImagePreview\(data\?\.profile_image_url \|\| null\);/g,
    `setImagePreview((data?.profile_image_url as string) || null);`
  );

  // 4. Fix any other occurrences of data usage with type assertions
  content = content.replace(
    /if \(data\.profile_image_url\) \{/g,
    `if (data && data.profile_image_url) {`
  );

  // Write back to file
  fs.writeFileSync(filePath, content);
  console.log('Successfully applied advanced type fixes to PractitionerEditProfile.tsx!');

  // Now also fix the addCalendlyLinkColumn.ts unused imports
  const calendarFilePath = path.join(__dirname, 'src', 'scripts', 'addCalendlyLinkColumn.ts');
  if (fs.existsSync(calendarFilePath)) {
    console.log('Fixing unused imports in addCalendlyLinkColumn.ts...');
    let calendarContent = fs.readFileSync(calendarFilePath, 'utf8');
    
    // Remove unused imports
    calendarContent = calendarContent.replace(
      /import fs from 'fs';\nimport path from 'path';/g,
      `// These imports were removed as they're not used
// import fs from 'fs';
// import path from 'path';`
    );
    
    fs.writeFileSync(calendarFilePath, calendarContent);
    console.log('Fixed unused imports in addCalendlyLinkColumn.ts.');
  }

} catch (error) {
  console.error('Error applying type fixes:', error.message);
}
