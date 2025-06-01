// fix-backticks.js
// Script to fix escaped backtick issue in PractitionerEditProfile.tsx

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const filePath = path.join(__dirname, 'src', 'pages', 'PractitionerEditProfile.tsx');

try {
  console.log(`Reading file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix all instances of escaped backticks in className attributes
  content = content.replace(/className=\{\\\`(.*?)\\\`\}/g, 'className={`$1`}');

  // Fix all instances of escaped backticks in literal strings
  content = content.replace(/\\\`(₹?\$\{.*?\}.*?)\\\`/g, '`$1`');

  fs.writeFileSync(filePath, content);
  console.log('Successfully fixed backtick issues in PractitionerEditProfile.tsx');
} catch (error) {
  console.error('Error processing file:', error);
}
