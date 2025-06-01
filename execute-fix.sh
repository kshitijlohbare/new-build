#!/bin/bash

# execute-fix.sh
# This script will apply the missing columns fix to your Supabase database

# Set your Supabase credentials
echo "This script will add missing columns to the practitioners table."
echo "You will need your Supabase project URL and API key."
echo ""

read -p "Enter your Supabase project URL: " SUPABASE_URL
read -p "Enter your Supabase service role key: " SUPABASE_SERVICE_ROLE_KEY

# Verify inputs
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Supabase URL and service role key are required"
  exit 1
fi

# Create a temporary file with the SQL query
TEMP_FILE=$(mktemp)

cat > "$TEMP_FILE" << 'EOSQL'
-- Add conditions_treated as a text array
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS conditions_treated TEXT[];

-- Add session_formats as a text array
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS session_formats TEXT[];

-- Add availability_schedule as text field
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS availability_schedule TEXT;

-- Add calendly_link as text field
ALTER TABLE public.practitioners ADD COLUMN IF NOT EXISTS calendly_link TEXT;
EOSQL

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
echo "Database fix completed."
echo "Please check your Supabase database to verify the changes."
