-- Helper function to get daily practices from the practices_data JSON
-- This SQL can be run in the Supabase SQL Editor

-- Create a function to get only daily practices for a user
CREATE OR REPLACE FUNCTION get_daily_practices(p_user_id UUID)
RETURNS JSONB AS $$
DECLARE
  all_practices JSONB;
  daily_practices JSONB;
BEGIN
  -- Get the user's practice data
  SELECT practices_data->'practices'
  INTO all_practices
  FROM user_practices
  WHERE user_id = p_user_id;
  
  -- Filter for only daily practices
  SELECT jsonb_agg(practice)
  INTO daily_practices
  FROM jsonb_array_elements(all_practices) practice
  WHERE (practice->>'isDaily')::BOOLEAN = true;
  
  -- If no daily practices, return empty array
  IF daily_practices IS NULL THEN
    return '[]'::JSONB;
  END IF;
  
  RETURN daily_practices;
END;
$$ LANGUAGE plpgsql;

-- Usage example:
-- SELECT get_daily_practices('user-uuid-here');

-- Create an RPC endpoint for this function
-- This allows you to call it directly from the client
COMMENT ON FUNCTION get_daily_practices IS 'Get daily practices for a user';

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_daily_practices TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_practices TO service_role;
