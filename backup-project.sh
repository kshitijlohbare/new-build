#!/bin/bash

# Script to backup unnecessary files in the project
# Created on: June 3, 2025

# Create backup directory with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="clean_project_backup_$TIMESTAMP"
mkdir -p "$BACKUP_DIR"
echo "Created backup directory: $BACKUP_DIR"

# Create subdirectories
mkdir -p "$BACKUP_DIR/scripts"
mkdir -p "$BACKUP_DIR/docs"
mkdir -p "$BACKUP_DIR/test_pages"
mkdir -p "$BACKUP_DIR/sql"
mkdir -p "$BACKUP_DIR/utility_scripts"
mkdir -p "$BACKUP_DIR/community_files"
mkdir -p "$BACKUP_DIR/assets"

# Function to backup files with logging
backup_file() {
  local src=$1
  local dest=$2
  
  if [ -f "$src" ]; then
    mkdir -p "$(dirname "$dest")"
    cp "$src" "$dest"
    echo "✅ Backed up: $src"
  else
    echo "⚠️ File not found: $src"
  fi
}

# 1. Backup root directory utility scripts
echo -e "\n==== Backing up root utility scripts ===="
for file in *.js *.mjs *.cjs *.sh; do
  # Exclude essential files from backup
  if [[ "$file" != "vite.config.js" && "$file" != "tailwind.config.js" && "$file" != "backup-unused-files.sh" && "$file" != "clean-project.sh" ]]; then
    backup_file "$file" "$BACKUP_DIR/utility_scripts/$file"
  fi
done

# 2. Backup SQL files
echo -e "\n==== Backing up SQL files ===="
for file in *.sql; do
  backup_file "$file" "$BACKUP_DIR/sql/$file"
done

# 3. Backup documentation files
echo -e "\n==== Backing up documentation files ===="
for file in *.md; do
  # Exclude essential docs like README.md
  if [[ "$file" != "README.md" ]]; then
    backup_file "$file" "$BACKUP_DIR/docs/$file"
  fi
done

# 4. Backup test and unused pages
echo -e "\n==== Backing up test and unused pages ===="
backup_file "src/pages/TestPage.tsx" "$BACKUP_DIR/test_pages/TestPage.tsx"
backup_file "src/pages/TherapistListing_Mobile.tsx" "$BACKUP_DIR/test_pages/TherapistListing_Mobile.tsx"
backup_file "src/pages/TherapistListingEnhanced.tsx" "$BACKUP_DIR/test_pages/TherapistListingEnhanced.tsx"

# 5. Backup Community-related files (if still exist)
echo -e "\n==== Backing up Community-related files (if still exist) ===="
backup_file "src/scripts/checkCommunityDelights.ts" "$BACKUP_DIR/community_files/checkCommunityDelights.ts"
backup_file "src/scripts/communityDummyData.ts" "$BACKUP_DIR/community_files/communityDummyData.ts"

# 6. Backup unused scripts
echo -e "\n==== Backing up database and unused scripts ===="
backup_file "src/scripts/addCalendlyLinkColumn.ts" "$BACKUP_DIR/scripts/addCalendlyLinkColumn.ts"
backup_file "src/scripts/addMissingPractitionerColumns.ts" "$BACKUP_DIR/scripts/addMissingPractitionerColumns.ts"
backup_file "src/scripts/checkPractitionerNotifications.ts" "$BACKUP_DIR/scripts/checkPractitionerNotifications.ts"
backup_file "src/scripts/executeSqlMigration.js" "$BACKUP_DIR/scripts/executeSqlMigration.js"
backup_file "src/scripts/fixPractitionerSchema.ts" "$BACKUP_DIR/scripts/fixPractitionerSchema.ts"
backup_file "src/scripts/validatePractitionerSchema.ts" "$BACKUP_DIR/scripts/validatePractitionerSchema.ts"

# 7. Backup Community assets (if still exist)
echo -e "\n==== Backing up Community assets (if still exist) ===="
backup_file "src/assets/icons/Community_selected.svg" "$BACKUP_DIR/assets/Community_selected.svg"
backup_file "src/assets/icons/Community_nonselected.svg" "$BACKUP_DIR/assets/Community_nonselected.svg"

# 8. Backup unused services
echo -e "\n==== Backing up potentially unused services ===="
backup_file "src/services/AppointmentBookingService.ts" "$BACKUP_DIR/scripts/AppointmentBookingService.ts"
backup_file "src/services/EmailNotificationService.ts" "$BACKUP_DIR/scripts/EmailNotificationService.ts"

echo -e "\n==== Backup Complete ===="
echo "All unnecessary files have been backed up to: $BACKUP_DIR"
echo "You can now safely remove these files from your project."
echo ""
echo "To remove the files (AFTER testing that your app still works), run:"
echo "chmod +x clean-project.sh"
echo "./clean-project.sh"
echo ""
echo "⚠️ IMPORTANT: Before removing files, please verify your application works correctly!"
