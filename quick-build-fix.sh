#!/bin/bash
# quick-build-fix.sh
# Simple script to temporarily rename problematic files and run the build

echo "===== Building Project with Problematic Files Excluded ====="

# Backup and rename the problematic file
if [ -f "./src/pages/PractitionerOnboardingRefactored.tsx" ]; then
  echo "Moving problematic file..."
  mv ./src/pages/PractitionerOnboardingRefactored.tsx ./src/pages/PractitionerOnboardingRefactored.tsx.bak
  echo "File temporarily moved."
else
  echo "PractitionerOnboardingRefactored.tsx not found or already moved."
fi

echo "Running build command..."
npm run build

# Restore the problematic file
if [ -f "./src/pages/PractitionerOnboardingRefactored.tsx.bak" ]; then
  echo "Restoring problematic file..."
  mv ./src/pages/PractitionerOnboardingRefactored.tsx.bak ./src/pages/PractitionerOnboardingRefactored.tsx
  echo "File restored."
fi

echo "===== Build process complete ====="
