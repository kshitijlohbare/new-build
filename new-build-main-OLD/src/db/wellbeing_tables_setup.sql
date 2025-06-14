-- Database schema for the wellbeing application's practice management system

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

-- Create a function to insert initial system practices
CREATE OR REPLACE FUNCTION insert_initial_system_practices()
RETURNS void AS $$
BEGIN
  -- Only insert if the table is empty
  IF NOT EXISTS (SELECT 1 FROM practices LIMIT 1) THEN
    -- Cold Shower Exposure
    INSERT INTO practices (id, name, description, benefits, duration, icon, source, is_system_practice, steps)
    VALUES (
      1,
      'Cold Shower Exposure',
      'Cold exposure helps improve stress resilience, mood, and cognitive focus.',
      '["Improves stress resilience", "Boosts mood", "Enhances cognitive focus", "Reduces inflammation"]',
      3,
      'shower',
      'Andrew Huberman',
      TRUE,
      '[
        {
          "title": "Prepare",
          "description": "Start with a warm shower and gradually reduce the temperature to uncomfortably cold but safe.",
          "imageUrl": "https://images.unsplash.com/photo-1585082041509-7e1e0a4b680e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y29sZCUyMHNob3dlcnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Duration",
          "description": "Begin with 1–2 minutes and increase gradually over time (e.g., 3–5 minutes). Aim for a total of 11 minutes per week.",
          "imageUrl": "https://images.unsplash.com/photo-1536852300-aef6305d2801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGltZXJ8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Breathing",
          "description": "Maintain steady breathing to avoid hyperventilation. Use the physiological sigh if needed (double inhale followed by a long exhale).",
          "imageUrl": "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8YnJlYXRoaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Timing",
          "description": "Morning cold showers are ideal for boosting alertness; evening exposure requires more resilience due to circadian rhythm variations.",
          "imageUrl": "https://images.unsplash.com/photo-1541480601022-2308c0f02487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG1vcm5pbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Optional Movement",
          "description": "Move your hands, feet, or knees slightly during immersion to increase the cold sensation and enhance benefits.",
          "imageUrl": "https://images.unsplash.com/photo-1584825093731-35ef75c7b6fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hvd2VyfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
        }
      ]'
    );
    
    -- Digital Minimalism
    INSERT INTO practices (id, name, description, benefits, duration, source, is_system_practice, steps)
    VALUES (
      6,
      'Digital Minimalism',
      'Digital minimalism enhances productivity and mental clarity by reducing digital clutter.',
      '["Improved focus", "Reduced anxiety", "Better sleep", "Enhanced productivity", "Mental clarity"]',
      120,
      'Cal Newport',
      TRUE,
      '[
        {
          "title": "Audit Your Tools",
          "description": "List all apps, tools, and devices you use. Identify essential ones and eliminate non-essential ones (e.g., social media apps).",
          "imageUrl": "https://images.unsplash.com/photo-1556400535-930c858c0968?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGlnaXRhbCUyMGRldG94fGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Organize Digital Space",
          "description": "Group similar tasks into folders or workspaces; use color-coding for quick access.",
          "imageUrl": "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fG9yZ2FuaXplJTIwYXBwc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Minimize Notifications",
          "description": "Turn off non-essential notifications and enable Do Not Disturb mode during focus periods.",
          "imageUrl": "https://images.unsplash.com/photo-1622676666769-65633479bfd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8bm90aWZpY2F0aW9uc3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Set Boundaries",
          "description": "Schedule specific times for checking emails or social media to avoid constant interruptions.",
          "imageUrl": "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c2NoZWR1bGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=600&q=60"
        },
        {
          "title": "Full-Screen Mode",
          "description": "Use full-screen mode or Reader Mode to minimize distractions while working on tasks.",
          "imageUrl": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Zm9jdXMlMjB3b3JrfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60"
        }
      ]'
    );
    
    -- Add other system practices
    INSERT INTO practices (id, name, description, benefits, duration, icon, source, is_system_practice)
    VALUES 
      (4, 'Focus Breathing (3:3:6)', 'This breathing technique calms the nervous system and enhances focus.', '["Calms the nervous system", "Improves focus", "Reduces stress", "Increases mental clarity"]', 5, 'smelling', 'Andrew Huberman', TRUE),
      (2, 'Gratitude Journal', 'Gratitude journaling cultivates positivity and mental resilience.', '["Increases positive outlook", "Reduces stress", "Improves mental health", "Enhances sleep quality"]', 10, 'moleskine', 'Naval Ravikant', TRUE),
      (3, 'Morning Sunlight', 'Wake up active.', '["Regulates circadian rhythm", "Boosts Vitamin D"]', 15, 'sun', NULL, TRUE),
      (5, 'Outdoor Walking', 'Clear your head.', '["Improves cardiovascular health", "Reduces anxiety"]', 30, NULL, NULL, TRUE),
      (7, 'Evening Cold Rinse', 'Cool down before bed.', '["May improve sleep quality", "Reduces inflammation"]', 2, 'shower', NULL, TRUE),
      (8, 'Mindful Eating', 'Savor your meals.', '["Improves digestion", "Increases satisfaction"]', 15, NULL, NULL, TRUE),
      (9, 'Share Your Delights', 'Acknowledge and share small joys to cultivate positivity.', '["Boosts mood", "Increases gratitude", "Strengthens social connections"]', NULL, 'sparkles', 'Inspired by The Book of Delights', TRUE);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to insert initial data
SELECT insert_initial_system_practices();
