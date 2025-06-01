// standardize-api-keys.js
// Script to help find and fix inconsistent API keys

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Correct API key and URL from production code
const correctUrl = 'https://svnczxevigicuskppyfz.supabase.co';
const correctKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU';

// Incorrect key pattern - the 'ref' claim contains 'piyfz' instead of 'ppyfz'
const incorrectKeyPattern = /eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BpeWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0\.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU/g;

async function findAndFixApiKeys() {
  console.log('Scanning for files with inconsistent API keys...');

  // Files to check (JS, TS, SQL, JSON)
  const filesToCheck = globSync([
    path.join(__dirname, '**/*.js'),
    path.join(__dirname, '**/*.ts'),
    path.join(__dirname, '**/*.mjs'),
    path.join(__dirname, '**/*.cjs'),
    path.join(__dirname, '**/*.sql'),
    path.join(__dirname, '**/*.json'),
  ]);

  const issuesFound = [];
  const filesFixed = [];

  // Check each file
  for (const filePath of filesToCheck) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Skip node_modules and empty files
      if (filePath.includes('node_modules') || !content.trim()) {
        continue;
      }
      
      // Check if file contains incorrect API key
      if (content.match(incorrectKeyPattern)) {
        issuesFound.push(filePath);
        
        // Fix the file content
        const fixedContent = content.replace(incorrectKeyPattern, correctKey);
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        filesFixed.push(filePath);
      }
    } catch (err) {
      console.error(`Error processing file ${filePath}:`, err.message);
    }
  }

  // Report results
  console.log(`\nScan complete! Checked ${filesToCheck.length} files.`);
  
  if (issuesFound.length === 0) {
    console.log('No API key inconsistencies found. All files are using the correct key.');
  } else {
    console.log(`\nFound ${issuesFound.length} files with incorrect API keys:`);
    for (const file of issuesFound) {
      const relativePath = path.relative(__dirname, file);
      console.log(` - ${relativePath}`);
    }
    
    console.log(`\nFixed ${filesFixed.length} files:`);
    for (const file of filesFixed) {
      const relativePath = path.relative(__dirname, file);
      console.log(` - ${relativePath}`);
    }
  }
}

findAndFixApiKeys().catch(console.error);
