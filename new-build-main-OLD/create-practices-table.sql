-- Create the practices table for the wellbeing app
CREATE TABLE IF NOT EXISTS practices (
  id SERIAL PRIMARY KEY,
  icon TEXT,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  benefits JSONB DEFAULT '[]'::jsonb,
  duration INTEGER,
  points INTEGER,
  completed BOOLEAN DEFAULT FALSE,
  streak INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]'::jsonb,
  steps JSONB DEFAULT '[]'::jsonb,
  source TEXT,
  step_progress INTEGER,
  is_daily BOOLEAN DEFAULT FALSE,
  user_created BOOLEAN DEFAULT FALSE,
  created_by_user_id TEXT,
  is_system_practice BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
