-- upsert-practices.sql
-- This script removes any existing practice with the same name and inserts the new, detailed version.

-- Example for Box Breathing
DELETE FROM practices WHERE LOWER(name) = LOWER('Box Breathing');
INSERT INTO practices (
  name, description, benefits, duration, points, icon, tags, steps, source, is_system_practice, created_at, updated_at
) VALUES (
  'Box Breathing',
  'Practice 4-4-4-4 breathing for 5 minutes daily to calm the nervous system. Purpose: Calms the nervous system, reduces stress, and improves focus.',
  '["Calms the nervous system", "Reduces stress", "Improves focus"]',
  5,
  NULL,
  'breath',
  '["stress", "anxiety", "focus"]',
  '["Inhale for 4 seconds", "Hold for 4 seconds", "Exhale for 4 seconds", "Hold for 4 seconds", "Repeat for 5 minutes"]',
  'Daily Wellbeing Routine',
  TRUE,
  NOW(),
  NOW()
);

-- Example for Mindfulness Meditation
DELETE FROM practices WHERE LOWER(name) = LOWER('Mindfulness Meditation');
INSERT INTO practices (
  name, description, benefits, duration, points, icon, tags, steps, source, is_system_practice, created_at, updated_at
) VALUES (
  'Mindfulness Meditation',
  'Spend 5-10 minutes focusing on your breath or using a guided meditation. Purpose: Reduces anxiety, improves attention, and enhances emotional regulation.',
  '["Reduces anxiety", "Improves attention", "Enhances emotional regulation"]',
  10,
  NULL,
  'meditation',
  '["stress", "focus", "calm"]',
  '["Sit comfortably", "Focus on your breath", "Gently return attention when distracted", "Use a guided meditation if desired"]',
  'Daily Wellbeing Routine',
  TRUE,
  NOW(),
  NOW()
);

-- Journaling
DELETE FROM practices WHERE LOWER(name) = LOWER('Journaling');
INSERT INTO practices (
  name, description, benefits, duration, points, icon, tags, steps, source, is_system_practice, created_at, updated_at
) VALUES (
  'Journaling',
  'Process emotions, reduce stress, and foster gratitude or clarity by writing for 5 minutes daily. Choose a focus: gratitude, emotions, or free writing.',
  '["Clarifies thoughts", "Reduces mental clutter", "Boosts mood", "Tracks progress"]',
  5,
  NULL,
  'journal',
  '["gratitude", "reflection", "stress"]',
  '["Set aside 5 minutes in a quiet space", "Choose a focus: gratitude, emotions, or free writing", "Write without editing", "List specific moments for gratitude", "End by reviewing or noting a positive insight"]',
  'Daily Wellbeing Routine',
  TRUE,
  NOW(),
  NOW()
);

-- Limit Screen Time
DELETE FROM practices WHERE LOWER(name) = LOWER('Limit Screen Time');
INSERT INTO practices (
  name, description, benefits, duration, points, icon, tags, steps, source, is_system_practice, created_at, updated_at
) VALUES (
  'Limit Screen Time',
  'Reduce overstimulation, improve sleep, and free mental space by limiting screen use 30-60 minutes before bed.',
  '["Improves sleep quality", "Lowers mental fatigue", "Creates space for reflection"]',
  30,
  NULL,
  'screen',
  '["sleep", "focus", "digital detox"]',
  '["No screens 30-60 minutes before bed", "Replace with calming activities", "Use phone settings to block notifications", "Use blue-light filters if needed", "Track adherence"]',
  'Daily Wellbeing Routine',
  TRUE,
  NOW(),
  NOW()
);

-- Stretching/Yoga
DELETE FROM practices WHERE LOWER(name) = LOWER('Stretching/Yoga');
INSERT INTO practices (
  name, description, benefits, duration, points, icon, tags, steps, source, is_system_practice, created_at, updated_at
) VALUES (
  'Stretching/Yoga',
  'Improve flexibility, reduce muscle tension, and boost energy with a 5-10 minute stretching or yoga routine.',
  '["Improves flexibility", "Reduces muscle tension", "Boosts energy"]',
  10,
  NULL,
  'yoga',
  '["mobility", "energy", "relaxation"]',
  '["Choose a 5-10 minute routine", "Neck rolls: 5 times each direction", "Cat-cow pose: 5 breaths", "Forward fold: hold 30 seconds", "Side stretch"]',
  'Daily Wellbeing Routine',
  TRUE,
  NOW(),
  NOW()
);

-- Continue for all other practices, translating Polish entries to English as needed.
