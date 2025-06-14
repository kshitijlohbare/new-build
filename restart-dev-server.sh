#!/bin/bash

# A helper script to restart the dev server
echo "🚀 Restarting the development server..."

# Stop any running processes
echo "Stopping any running npm processes..."
pkill -f "npm run dev" || echo "No processes found to stop"

# Clear the node_modules/.vite cache
echo "Clearing Vite cache..."
rm -rf node_modules/.vite

# Update cache busting timestamp
echo "Updating cache bust timestamp..."
TIMESTAMP=$(date +%s)
echo "VITE_CACHE_BUST=$TIMESTAMP" > .env

# Start the dev server with force flag
echo "Starting development server..."
npm run dev -- --force
