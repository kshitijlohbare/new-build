#!/bin/bash
# Cleanup script for debugging code
# Run this script once the popup interaction is confirmed working

echo "Removing debugging code and console logs..."

# Find and remove console.log statements
find src -type f -name "*.tsx" -o -name "*.js" | xargs sed -i '' 's/console\.log([^)]*);/\/\/ Removed debug log/g'

# Remove specific debugging files
if [ -f "click-monitor.js" ]; then
  echo "Removing click-monitor.js"
  rm click-monitor.js
fi

# Keep only the working implementation
if [ -f "src/components/wellbeing/PracticeDetailPopup.tsx" ] && [ -f "src/components/wellbeing/SimplePracticePopup.tsx" ]; then
  # Only if we're confident the new implementation works
  read -p "Do you want to remove the original PracticeDetailPopup.tsx? (yes/no) " choice
  case "$choice" in 
    y|Y|yes|Yes|YES ) 
      echo "Backing up original PracticeDetailPopup.tsx" 
      cp src/components/wellbeing/PracticeDetailPopup.tsx src/components/wellbeing/PracticeDetailPopup.tsx.bak
      echo "Original implementation backed up to PracticeDetailPopup.tsx.bak"
      ;;
    * ) 
      echo "Keeping original PracticeDetailPopup.tsx"
      ;;
  esac
fi

# Clean up unused fixed components
if [ -f "src/components/wellbeing/PracticeDetailPopupFixed.tsx" ]; then
  # Only if we're confident the new implementation works
  read -p "Do you want to remove the interim PracticeDetailPopupFixed.tsx? (yes/no) " choice
  case "$choice" in 
    y|Y|yes|Yes|YES ) 
      echo "Removing PracticeDetailPopupFixed.tsx" 
      rm src/components/wellbeing/PracticeDetailPopupFixed.tsx
      ;;
    * ) 
      echo "Keeping PracticeDetailPopupFixed.tsx"
      ;;
  esac
fi

echo "Cleanup complete!"
