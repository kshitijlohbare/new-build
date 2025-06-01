#!/bin/bash

# execute-complete-fix.sh
# This script will apply the complete practitioner schema fix to your Supabase database

echo "====================================================="
echo "Practitioner Schema Fix - Complete Version"
echo "====================================================="
echo "This script will add all missing columns to the practitioners table."
echo "You will need your Supabase project URL and service role key."
echo ""

# Set default values from the file
DEFAULT_URL="https://svnczxevigicuskppyfz.supabase.co"
DEFAULT_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bmN6eGV2aWdpY3Vza3BweWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwNDk1NDAsImV4cCI6MjA1OTYyNTU0MH0.00MNZRYjGKHTEFvF0enW-VCZ4qgDnXC4LeV8XsjGaEU"

read -p "Enter your Supabase project URL [$DEFAULT_URL]: " SUPABASE_URL
SUPABASE_URL=${SUPABASE_URL:-$DEFAULT_URL}

read -p "Enter your Supabase service role key [$DEFAULT_KEY]: " SUPABASE_SERVICE_ROLE_KEY
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY:-$DEFAULT_KEY}

# Verify inputs
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Supabase URL and service role key are required"
  exit 1
fi

echo ""
echo "Using SQL from fix-practitioners-schema-complete.sql"
echo ""

# Read the SQL file
SQL_FILE="./fix-practitioners-schema-complete.sql"
if [ ! -f "$SQL_FILE" ]; then
  echo "Error: SQL file not found at $SQL_FILE"
  exit 1
fi

# Create a temporary file with the SQL content
TEMP_FILE=$(mktemp)
cat "$SQL_FILE" > "$TEMP_FILE"

echo "Applying database fixes..."

# Execute the SQL using the Supabase REST API
curl -X POST \
  "$SUPABASE_URL/rest/v1/rpc/exec" \
  -H "apikey: $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"sql\": \"$(cat $TEMP_FILE | tr -d '\n' | sed 's/"/\\"/g')\"}"

# Clean up the temporary file
rm "$TEMP_FILE"

echo ""
echo "Database fix completed. Check for any error messages above."
echo "====================================================="
