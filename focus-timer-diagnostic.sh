#!/bin/bash

# Focus Timer Diagnostic and Fix Script
echo "🔍 Focus Timer Diagnostic and Fix Script"
echo "======================================"
echo ""

# Step 1: Check file existence and content
echo "Step 1: Checking key files..."
if [ -f "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx" ]; then
  echo "✅ FocusTimer.tsx exists"
  FILESIZE=$(stat -f%z "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx")
  echo "   File size: $FILESIZE bytes"
  if [ $FILESIZE -lt 100 ]; then
    echo "❌ WARNING: File appears to be empty or corrupted"
    echo "   Attempting to restore from backup..."
    if [ -f "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx.bak" ]; then
      cp "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx.bak" "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx"
      echo "   Restored from backup file"
    elif [ -f "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx.new" ]; then
      cp "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx.new" "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx"
      echo "   Restored from new file"
    else
      echo "❌ No backup files found"
    fi
  else
    echo "✅ File size looks good"
  fi
else
  echo "❌ FocusTimer.tsx not found"
fi

echo ""
echo "Step 2: Checking import in App.tsx..."
if grep -q "import FocusTimer from \"./pages/FocusTimer\"" "/Users/kshitijlohbare/Downloads/new build/src/App.tsx"; then
  echo "✅ Import statement is correct in App.tsx"
else
  echo "❌ Import statement is incorrect or missing"
  echo "   Fixing import statement..."
  sed -i '' 's/import FocusTimer from ".*"/import FocusTimer from ".\/pages\/FocusTimer"/' "/Users/kshitijlohbare/Downloads/new build/src/App.tsx"
  echo "   Import statement fixed"
fi

echo ""
echo "Step 3: Checking CSS..."
if grep -q ".timer-display" "/Users/kshitijlohbare/Downloads/new build/src/index.css"; then
  echo "✅ Timer display CSS found"
else
  echo "❌ Timer display CSS not found"
fi

if grep -q ".timer-progress" "/Users/kshitijlohbare/Downloads/new build/src/index.css"; then
  echo "✅ Timer progress CSS found"
else
  echo "❌ Timer progress CSS not found"
fi

echo ""
echo "Step 4: Killing any possible cached processes..."
pkill -f "npm run dev" || echo "No running processes found"

echo ""
echo "Step 5: Updating cache busting timestamp..."
TIMESTAMP=$(date +%s)
echo "VITE_CACHE_BUST=$TIMESTAMP" > "/Users/kshitijlohbare/Downloads/new build/.env"
echo "✅ Updated cache buster to $TIMESTAMP"

echo ""
echo "Step 6: Clearing Vite cache..."
rm -rf "/Users/kshitijlohbare/Downloads/new build/node_modules/.vite"
echo "✅ Vite cache cleared"

echo ""
echo "🚀 Diagnostic complete! Now follow these steps:"
echo "1. Run the dev server with force flag: npm run dev -- --force"
echo "2. Open the browser in incognito/private mode to: http://localhost:5173/focus-timer"
echo "3. If you still don't see the Focus Timer UI, try restarting your browser completely"
echo ""
echo "For manual CSS check, look for these classes in your browser DevTools:"
echo "- .timer-display"
echo "- .timer-progress"
echo "- .timer-inner"
echo ""
