#!/bin/bash

# Create a backup directory with timestamp
BACKUP_DIR="./backup-unused-files-$(date +"%Y%m%d-%H%M%S")"
echo "Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Function to backup files matching a pattern
backup_files() {
  local pattern=$1
  local target_dir=$2
  mkdir -p "$BACKUP_DIR/$target_dir"
  
  # Find files matching the pattern and move them
  find . -maxdepth 1 -type f -name "$pattern" -not -path "*/node_modules/*" -not -path "*/backup-*/*" | while read file; do
    echo "Moving $file to $BACKUP_DIR/$target_dir/"
    mv "$file" "$BACKUP_DIR/$target_dir/"
  done
}

# Backup root directory scripts
echo "Backing up root directory script files..."
backup_files "*.js" "root-scripts/js"
backup_files "*.mjs" "root-scripts/mjs"
backup_files "*.cjs" "root-scripts/cjs"
backup_files "*.sh" "root-scripts/sh"
backup_files "*.sql" "root-scripts/sql"

# Backup documentation files
echo "Backing up documentation files..."
backup_files "*.md" "documentation"

# Backup test and unused pages
echo "Backing up test and unused pages..."
mkdir -p "$BACKUP_DIR/unused-pages"
test_files=(
  "src/pages/TestPage.tsx"
  "src/pages/TherapistListing_Mobile.tsx"
  "src/pages/TherapistListingEnhanced.tsx"
)
for file in "${test_files[@]}"; do
  if [ -f "$file" ]; then
    echo "Moving $file to $BACKUP_DIR/unused-pages/"
    mkdir -p "$BACKUP_DIR/$(dirname "$file")"
    mv "$file" "$BACKUP_DIR/$(dirname "$file")/"
  fi
done

# Backup community-related files
echo "Backing up community-related files (if they exist)..."
community_files=(
  "src/scripts/checkCommunityDelights.ts"
  "src/scripts/communityDummyData.ts"
  "src/assets/icons/Community_selected.svg"
  "src/assets/icons/Community_nonselected.svg"
)
for file in "${community_files[@]}"; do
  if [ -f "$file" ]; then
    echo "Moving $file to $BACKUP_DIR/$(dirname "$file")/"
    mkdir -p "$BACKUP_DIR/$(dirname "$file")"
    mv "$file" "$BACKUP_DIR/$(dirname "$file")/"
  fi
done

# Backup database script files
echo "Backing up database script files..."
db_script_files=(
  "src/scripts/addCalendlyLinkColumn.ts"
  "src/scripts/addMissingPractitionerColumns.ts"
  "src/scripts/checkPractitionerNotifications.ts"
  "src/scripts/executeSqlMigration.js"
  "src/scripts/fixPractitionerSchema.ts"
  "src/scripts/validatePractitionerSchema.ts"
)
for file in "${db_script_files[@]}"; do
  if [ -f "$file" ]; then
    echo "Moving $file to $BACKUP_DIR/$(dirname "$file")/"
    mkdir -p "$BACKUP_DIR/$(dirname "$file")"
    mv "$file" "$BACKUP_DIR/$(dirname "$file")/"
  fi
done

echo "✓ Backup completed! Unused files moved to $BACKUP_DIR"
echo "The website should now contain only essential files for operation."
echo "If you encounter any issues, you can restore files from the backup directory."
