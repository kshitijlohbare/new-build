-- practices.sql - Database setup for the wellbeing app practices system

-- Create a practices table for system-defined practices
CREATE TABLE IF NOT EXISTS practices (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  benefits JSONB DEFAULT '[]'::jsonb,
  duration INTEGER,
  points INTEGER,
  icon TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  source TEXT,
  is_system_practice BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create a user_practices table to store user-specific data
CREATE TABLE IF NOT EXISTS user_practices (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practices JSONB DEFAULT '[]'::jsonb, -- Stores user-created custom practices
  progress JSONB DEFAULT '{}'::jsonb,  -- Stores user progress data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id)
);

-- Create a table for user daily practices (many-to-many relationship)
CREATE TABLE IF NOT EXISTS user_daily_practices (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_id INTEGER NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, practice_id)
);

-- Create an index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_user_daily_practices_user_id ON user_daily_practices(user_id);

-- Insert some example system practices (if needed)
INSERT INTO practices (name, description, benefits, duration, icon, tags, is_system_practice)
VALUES 
  ('Cold Shower Exposure', 'Cold exposure helps improve stress resilience, mood, and cognitive focus.', '["Improves stress resilience", "Boosts mood", "Enhances cognitive focus"]', 3, 'shower', '["stress", "focus"]', TRUE),
  ('Morning Sunlight', 'Wake up active.', '["Regulates circadian rhythm", "Boosts Vitamin D"]', 15, 'sun', '["morning", "outdoor"]', TRUE),
  ('Focus Breathing (3:3:6)', 'This breathing technique calms the nervous system and enhances focus.', '["Calms the nervous system", "Improves focus", "Reduces stress"]', 5, 'smelling', '["breathing", "focus", "stress"]', TRUE),
  ('Outdoor Walking', 'Clear your head.', '["Improves cardiovascular health", "Reduces anxiety"]', 30, null, '["outdoor", "stress"]', TRUE),
  ('Gratitude Journal', 'Gratitude journaling cultivates positivity and mental resilience.', '["Increases positive outlook", "Reduces stress", "Improves mental health"]', 10, 'moleskine', '["stress", "anxiety"]', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to practices table
DROP TRIGGER IF EXISTS update_practices_updated_at ON practices;
CREATE TRIGGER update_practices_updated_at
BEFORE UPDATE ON practices
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- Apply trigger to user_practices table
DROP TRIGGER IF EXISTS update_user_practices_updated_at ON user_practices;
CREATE TRIGGER update_user_practices_updated_at
BEFORE UPDATE ON user_practices
FOR EACH ROW EXECUTE PROCEDURE update_updated_at();
