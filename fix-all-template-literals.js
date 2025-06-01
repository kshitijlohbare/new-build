// fix-all-template-literals.js
// Script to fix all incorrectly escaped template literals in the codebase

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Scanning for files with incorrectly escaped template literals...');

// File extensions to check
const extensions = ['js', 'jsx', 'ts', 'tsx'];
const filePattern = `src/**/*.{${extensions.join(',')}}`;

// Find all files matching the pattern
const files = globSync(filePattern, { cwd: __dirname });
console.log(`Found ${files.length} files to check`);

let totalFilesWithIssues = 0;
let totalIssuesFixed = 0;

// Regular expressions for different types of template literal issues
const patterns = [
  // Pattern for className with escaped backticks
  {
    name: 'Escaped backticks in JSX attributes',
    regex: /className=\{\\\`(.*?)\\\`\}/g,
    replacement: 'className={`$1`}'
  },
  // Pattern for other JSX attributes with escaped backticks
  {
    name: 'Other JSX attributes with escaped backticks',
    regex: /([a-zA-Z0-9_]+)=\{\\\`(.*?)\\\`\}/g,
    replacement: '$1={`$2`}'
  },
  // Pattern for general escaped backticks in expressions
  {
    name: 'Escaped backticks in expressions',
    regex: /\\\`(.*?)\\\`/g,
    replacement: '`$1`'
  }
];

// Process each file
files.forEach(relativeFilePath => {
  const filePath = path.join(__dirname, relativeFilePath);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileHasIssues = false;
    
    // Apply each pattern
    patterns.forEach(pattern => {
      const matches = content.match(pattern.regex);
      if (matches && matches.length > 0) {
        fileHasIssues = true;
        console.log(`Found ${matches.length} ${pattern.name} in ${relativeFilePath}`);
        totalIssuesFixed += matches.length;
        
        // Apply the fix
        content = content.replace(pattern.regex, pattern.replacement);
      }
    });
    
    // Save changes if the file was modified
    if (fileHasIssues) {
      totalFilesWithIssues++;
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed issues in ${relativeFilePath}`);
    }
    
  } catch (error) {
    console.error(`Error processing ${relativeFilePath}:`, error.message);
  }
});

console.log('\nScan complete!');
console.log(`Fixed ${totalIssuesFixed} template literal issues in ${totalFilesWithIssues} files.`);

if (totalFilesWithIssues > 0) {
  console.log('\nTry running the build now to see if issues are resolved.');
} else {
  console.log('\nNo template literal issues found.');
}