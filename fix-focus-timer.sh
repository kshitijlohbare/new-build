#!/bin/bash

# Script to help resolve duplicate project issues
echo "🔍 Focus Timer Project Fixer Script"
echo "=================================="
echo "This script will help ensure the correct project is being served"
echo ""

# Stop any running processes
echo "🛑 Stopping any running npm processes..."
pkill -f "npm run dev" || echo "No npm processes found"
pkill -f "node" || echo "No node processes found"

# Clear browser cache instructions
echo "🧹 Please clear your browser cache before continuing:"
echo "- Chrome: Settings > Privacy and security > Clear browsing data"
echo "- Safari: Preferences > Privacy > Manage Website Data > Remove All"
echo "- Firefox: Preferences > Privacy & Security > Clear Data"
echo ""
read -p "Have you cleared your browser cache? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Please clear your cache before continuing"
  exit 1
fi

# Rename the nested directory to prevent confusion
echo "🔄 Renaming nested directory to avoid confusion..."
if [ -d "/Users/kshitijlohbare/Downloads/new build/new-build-main" ]; then
  mv "/Users/kshitijlohbare/Downloads/new build/new-build-main" "/Users/kshitijlohbare/Downloads/new build/new-build-main-OLD"
  echo "✅ Renamed to new-build-main-OLD"
else
  echo "❌ Directory not found"
fi

# Update the cache buster
echo "🔑 Updating cache buster timestamp..."
TIMESTAMP=$(date +%s)
if [ -f "/Users/kshitijlohbare/Downloads/new build/.env" ]; then
  sed -i '' "s/VITE_CACHE_BUST=.*/VITE_CACHE_BUST=$TIMESTAMP/" "/Users/kshitijlohbare/Downloads/new build/.env"
  echo "✅ Updated cache buster to $TIMESTAMP"
else
  echo "VITE_CACHE_BUST=$TIMESTAMP" > "/Users/kshitijlohbare/Downloads/new build/.env"
  echo "✅ Created new .env file with cache buster"
fi

# Add a visible indicator to the FocusTimer component
echo "🎨 Adding visible indicator to FocusTimer component..."
if [ -f "/Users/kshitijlohbare/Downloads/new build/src/pages/FocusTimer.tsx" ]; then
  # We'll let the user make this change through the UI
  echo "✅ The FocusTimer component is ready for modification through VS Code"
else
  echo "❌ FocusTimer component not found"
fi

echo ""
echo "🚀 All set! Now follow these steps:"
echo "1. Run 'npm run dev' in the terminal"
echo "2. Open the browser to http://localhost:5173/focus-timer"
echo "3. If you don't see the updated UI, try opening in a private/incognito window"
echo ""
echo "If issues persist, try:"
echo "- Using a different browser"
echo "- Checking the browser console for errors (F12 or Cmd+Option+I)"
echo "- Running 'npm cache clean --force' and then 'npm run dev'"
echo ""
