#!/bin/bash

# Booking Journey Production Finalization Script
# This script helps prepare the booking journey for production

echo "=== Booking Journey Production Finalization ==="
echo "This script will help finalize the booking journey for production release."

# Create output directory
mkdir -p ./prod-checks

# Check for CSS issues
echo -e "\n📋 Checking for CSS issues..."
npx stylelint "src/pages/*.css" "src/styles/*.css" "src/components/**/*.css" \
  --custom-formatter=./node_modules/stylelint-formatter-pretty \
  > ./prod-checks/css-report.txt

if [ $? -eq 0 ]; then
  echo "✅ No CSS issues found!"
else
  echo "⚠️ CSS issues found. See ./prod-checks/css-report.txt for details."
fi

# Check for TypeScript errors
echo -e "\n📋 Checking for TypeScript errors..."
npx tsc --noEmit > ./prod-checks/typescript-report.txt

if [ $? -eq 0 ]; then
  echo "✅ No TypeScript issues found!"
else
  echo "⚠️ TypeScript issues found. See ./prod-checks/typescript-report.txt for details."
fi

# Run ESLint
echo -e "\n📋 Running ESLint..."
npx eslint src/pages/TherapistListing_New.tsx src/pages/PractitionerDetail.tsx \
  src/components/appointment/VideoCallSetup.tsx src/components/appointment/CalendarIntegration.tsx \
  src/services/AppointmentBookingService.ts src/services/EmailNotificationService.ts \
  --format=pretty > ./prod-checks/eslint-report.txt

if [ $? -eq 0 ]; then
  echo "✅ No ESLint issues found!"
else
  echo "⚠️ ESLint issues found. See ./prod-checks/eslint-report.txt for details."
fi

# Check for console.log statements
echo -e "\n📋 Checking for console.log statements..."
grep -r "console\.log" --include="*.ts" --include="*.tsx" ./src/pages ./src/components/appointment ./src/services > ./prod-checks/console-log-report.txt

if [ -s ./prod-checks/console-log-report.txt ]; then
  echo "⚠️ console.log statements found. See ./prod-checks/console-log-report.txt for details."
else
  echo "✅ No console.log statements found in production code!"
fi

# Check for mock/demo data
echo -e "\n📋 Checking for mock/demo/fallback code..."
grep -r -E "(mock|demo|fallback)" --include="*.ts" --include="*.tsx" ./src/pages ./src/components/appointment ./src/services > ./prod-checks/mock-code-report.txt

if [ -s ./prod-checks/mock-code-report.txt ]; then
  echo "⚠️ Potential mock/demo code found. See ./prod-checks/mock-code-report.txt for details."
else
  echo "✅ No mock/demo code indicators found!"
fi

# Check for browser compatibility
echo -e "\n📋 Checking for browser compatibility issues..."
npx browserslist-lint ./src/pages/*.css ./src/styles/*.css > ./prod-checks/browser-compatibility-report.txt

echo -e "\n📋 Running build to check for production errors..."
npm run build > ./prod-checks/build-report.txt 2>&1

if [ $? -eq 0 ]; then
  echo "✅ Production build successful!"
else
  echo "⚠️ Production build has issues. See ./prod-checks/build-report.txt for details."
fi

echo -e "\n✨ Finalization checks complete! Review the reports in ./prod-checks/ directory."
echo "Please fix any issues before deploying to production."
