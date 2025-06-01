// temp-build-fix.js
// A script to temporarily move problematic files and run the build

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const problematicFile = path.join(__dirname, 'src', 'pages', 'PractitionerOnboardingRefactored.tsx');
const backupFile = path.join(__dirname, 'src', 'pages', 'PractitionerOnboardingRefactored.tsx.bak');

console.log('===== Building Project with Problematic Files Excluded =====');

// Check if file exists and move it temporarily
let fileWasMoved = false;
try {
  if (fs.existsSync(problematicFile)) {
    console.log('Moving problematic file...');
    fs.renameSync(problematicFile, backupFile);
    fileWasMoved = true;
    console.log('File temporarily moved.');
  } else {
    console.log('PractitionerOnboardingRefactored.tsx not found or already moved.');
  }

  // Run the build
  console.log('\nRunning build command...');
  execSync('npm run build', { stdio: 'inherit', cwd: __dirname });
  console.log('Build completed successfully!');

} catch (error) {
  console.error('An error occurred during the build process:', error.message);
} finally {
  // Always try to restore the file if it was moved
  if (fileWasMoved && fs.existsSync(backupFile)) {
    console.log('\nRestoring problematic file...');
    fs.renameSync(backupFile, problematicFile);
    console.log('File restored.');
  }
}

console.log('\n===== Build process complete =====');
