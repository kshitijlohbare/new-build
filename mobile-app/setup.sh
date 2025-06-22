#!/bin/bash

# Setup script for Caktus Coco Mobile App

# Create necessary directories
mkdir -p assets/fonts
mkdir -p assets/images

echo "Created directory structure"

# Check if we can find fonts in the parent project
PARENT_FONTS_DIR="../public/fonts"
if [ -d "$PARENT_FONTS_DIR" ]; then
  echo "Found fonts in parent project, copying..."
  cp -r $PARENT_FONTS_DIR/* ./assets/fonts/
else
  echo "⚠️ Font directory not found in parent project."
  echo "⚠️ You'll need to manually add the required fonts to assets/fonts/"
fi

# Create placeholder images if needed
echo "Creating placeholder images..."
touch ./assets/images/logo.png
touch ./assets/images/practitioner-placeholder.png

echo "Installing dependencies..."
npm install

echo "Setup complete! Run 'npm start' to start the Expo development server."
