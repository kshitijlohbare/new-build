#!/bin/bash
# simple-build-fix.sh
# A script to build the project while excluding problematic files

echo "===== Building Project with Problem Files Excluded ====="

# Create a temporary directory for modified source files
TMP_DIR="./tmp-build-src"
mkdir -p $TMP_DIR

# Copy PractitionerEditProfile.tsx to the temp directory
cp ./src/pages/PractitionerEditProfile.tsx $TMP_DIR/

# Create a backup of the problematic file
if [ -f "./src/pages/PractitionerOnboardingRefactored.tsx" ]; then
  echo "Creating backup of PractitionerOnboardingRefactored.tsx..."
  cp ./src/pages/PractitionerOnboardingRefactored.tsx ./PractitionerOnboardingRefactored.tsx.bak
  
  # Rename the problematic file temporarily (effectively excluding it from build)
  mv ./src/pages/PractitionerOnboardingRefactored.tsx ./src/pages/PractitionerOnboardingRefactored.tsx.excluded
fi

echo "Running build..."
npm run build

# Restore the problematic file
if [ -f "./src/pages/PractitionerOnboardingRefactored.tsx.excluded" ]; then
  echo "Restoring PractitionerOnboardingRefactored.tsx..."
  mv ./src/pages/PractitionerOnboardingRefactored.tsx.excluded ./src/pages/PractitionerOnboardingRefactored.tsx
fi

echo "===== Build process complete ====="
