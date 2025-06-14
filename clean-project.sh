#!/bin/bash

# Script to remove unnecessary files after backing them up
# Created on: June 3, 2025
# ⚠️ WARNING: Run backup-project.sh FIRST and verify app functionality before running this!

echo "⚠️ This script will PERMANENTLY delete unnecessary files from your project."
echo "Make sure you've run backup-project.sh first and tested your app!"
read -p "Do you want to continue? (y/n): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "Operation cancelled."
  exit 0
fi

echo "Starting cleanup process..."

# Function to remove files/folders and log results
remove_item() {
  local item=$1
  if [ -e "$item" ]; then
    rm -rf "$item"
    echo "✅ Removed: $item"
  else
    echo "⚠️ Not found: $item"
  fi
}

# 1. Remove root directory utility scripts (excluding essential files)
echo -e "\n==== Removing utility scripts ===="
for file in $(find . -maxdepth 1 -type f \( -name "*.js" -o -name "*.mjs" -o -name "*.cjs" \) -not -name "vite.config.js" -not -name "tailwind.config.js" | sort); do
  remove_item "$file"
done

# 2. Remove SQL files
echo -e "\n==== Removing SQL files ===="
for file in $(find . -maxdepth 1 -type f -name "*.sql" | sort); do
  remove_item "$file"
done

# 3. Remove documentation files
echo -e "\n==== Removing documentation files ===="
for file in $(find . -maxdepth 1 -type f -name "*.md" -not -name "README.md" | sort); do
  remove_item "$file"
done

# 4. Remove shell scripts (excluding this one and backup scripts)
echo -e "\n==== Removing shell scripts ===="
for file in $(find . -maxdepth 1 -type f -name "*.sh" -not -name "clean-project.sh" -not -name "backup-project.sh" -not -name "backup-unused-files.sh" | sort); do
  remove_item "$file"
done

# 5. Remove test and unused pages
echo -e "\n==== Removing test and unused pages ===="
remove_item "src/pages/TestPage.tsx"
remove_item "src/pages/TherapistListing_Mobile.tsx"
remove_item "src/pages/TherapistListingEnhanced.tsx"
remove_item "src/pages/PractitionerOnboardingRefactored.tsx"
remove_item "src/pages/__tests__"
remove_item "tests"
remove_item "src/tests"

# 6. Remove Community-related files (if still exist)
echo -e "\n==== Removing Community-related files (if still exist) ===="
remove_item "src/pages/Community.tsx"
remove_item "src/scripts/checkCommunityDelights.ts"
remove_item "src/scripts/communityDummyData.ts"
remove_item "src/components/ui/DummyDataLoader.tsx"
remove_item "src/components/community/CommunityDelights.tsx"
remove_item "src/components/community/CommunityPractices.tsx"
remove_item "src/components/community/CommunityTips.tsx"
remove_item "src/components/community/DelightCard.tsx"
remove_item "src/components/community/PracticeCard.tsx"
remove_item "src/components/community/StoryCard.tsx"
remove_item "src/components/community/TipCard.tsx"
remove_item "src/components/wellbeing/ShareToCommunity.tsx"

# 7. Remove unused scripts
echo -e "\n==== Removing database and unused scripts ===="
remove_item "src/scripts/addCalendlyLinkColumn.ts"
remove_item "src/scripts/addMissingPractitionerColumns.ts"
remove_item "src/scripts/checkPractitionerNotifications.ts"
remove_item "src/scripts/executeSqlMigration.js"
remove_item "src/scripts/fixPractitionerSchema.ts"
remove_item "src/scripts/validatePractitionerSchema.ts"

# 8. Remove Community assets (if still exist)
echo -e "\n==== Removing Community assets (if still exist) ===="
remove_item "src/assets/icons/Community_selected.svg"
remove_item "src/assets/icons/Community_nonselected.svg"

# 9. Prompt for removing services
echo -e "\n==== Potentially used services ===="
echo "The following services might be used by your application."
echo "Only remove if you're sure they're not needed."
read -p "Remove AppointmentBookingService.ts? (y/n): " remove_booking
if [[ "$remove_booking" == "y" || "$remove_booking" == "Y" ]]; then
  remove_item "src/services/AppointmentBookingService.ts"
fi
read -p "Remove EmailNotificationService.ts? (y/n): " remove_email
if [[ "$remove_email" == "y" || "$remove_email" == "Y" ]]; then
  remove_item "src/services/EmailNotificationService.ts"
fi

echo -e "\n==== Cleanup Complete ===="
echo "All unnecessary files have been removed from your project."
echo "A cleaner, more production-ready version of your app is now ready!"
echo ""
echo "Consider running 'npm run build' to verify everything works correctly."
