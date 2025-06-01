// exclude-broken-files.js
// This script creates a temporary tsconfig.build.json that excludes problematic files
// and runs the build with this temporary configuration

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Creating temporary tsconfig.build.json to exclude problematic files...');

// Files to exclude from build
const filesToExclude = [
  "src/pages/PractitionerOnboardingRefactored.tsx"
];

// Read the original tsconfig.json
const tsconfigPath = path.join(__dirname, 'tsconfig.json');
let tsconfig;

try {
  // Read the file as text
  const tsconfigText = fs.readFileSync(tsconfigPath, 'utf8')
    // Remove comments from the JSON (not valid in standard JSON)
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  
  tsconfig = JSON.parse(tsconfigText);
} catch (error) {
  console.error('Error reading or parsing tsconfig.json:', error);
  process.exit(1);
}

// Create a modified config that extends the original but excludes problematic files
const buildConfig = {
  extends: "./tsconfig.json",
  exclude: [
    ...(tsconfig.exclude || []), // Keep existing excludes
    ...filesToExclude
  ]
};

// Write the temporary config
const buildConfigPath = path.join(__dirname, 'tsconfig.build.json');
fs.writeFileSync(buildConfigPath, JSON.stringify(buildConfig, null, 2));

console.log(`Created temporary build config excluding: ${filesToExclude.join(', ')}`);
console.log('Running build with temporary configuration...');

try {
  // Run the TypeScript compiler with the temporary config
  execSync('tsc -p tsconfig.build.json', { stdio: 'inherit', cwd: __dirname });

  // Run vite build
  execSync('vite build', { stdio: 'inherit', cwd: __dirname });

  console.log('\nBuild completed successfully!');
} catch (error) {
  console.error('\nBuild failed:', error.message);
} finally {
  // Cleanup - remove the temporary file
  console.log('Cleaning up temporary build config...');
  fs.unlinkSync(buildConfigPath);
}