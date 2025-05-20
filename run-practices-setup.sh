#!/bin/bash
# run-practices-setup.sh
# Script to run the complete practices setup process

echo "Running complete practices setup..."
node complete-practices-setup.js

echo ""
echo "If the setup was successful, you should now be able to:"
echo "1. Use the application normally with practices loading from the database"
echo "2. Add your own practices, which will be saved to both the database and localStorage"
echo "3. See practices with proper daily status and other attributes"
echo ""
echo "Next steps:"
echo "1. Test the application to verify practices load correctly"
echo "2. Check browser console for any errors related to practice loading"
echo "3. Verify that practice completion status is properly saved"
