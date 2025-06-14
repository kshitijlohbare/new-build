-- Create practitioners table
CREATE TABLE IF NOT EXISTS practitioners (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  reviews INTEGER DEFAULT 0,
  rating NUMERIC(3,1) DEFAULT 0.0,
  price INTEGER NOT NULL,
  image_url TEXT,
  badge TEXT CHECK (badge IN ('top rated', 'new', 'experienced', NULL)),
  education TEXT,
  degree TEXT,
  location_type TEXT CHECK (location_type IN ('online', 'in-person', 'both')),
  conditions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Clear existing data if any
DELETE FROM practitioners WHERE id > 0;

-- Insert sample practitioners data
INSERT INTO practitioners (name, specialty, reviews, rating, price, image_url, badge, education, degree, location_type, conditions) 
VALUES
  (
    'Dr. Sarah Johnson',
    'Clinical Psychologist specializing in anxiety disorders',
    124,
    4.8,
    120,
    'https://randomuser.me/api/portraits/women/22.jpg',
    'top rated',
    'PhD in Clinical Psychology, Stanford University',
    'PhD',
    'both',
    ARRAY['anxiety', 'depression', 'trauma', 'stress']
  ),
  (
    'Dr. Michael Chen',
    'Psychiatrist focusing on depression and mood disorders',
    98,
    4.7,
    150,
    'https://randomuser.me/api/portraits/men/32.jpg',
    'experienced',
    'MD in Psychiatry, Johns Hopkins University',
    'MD',
    'online',
    ARRAY['depression', 'bipolar', 'anxiety', 'insomnia']
  ),
  (
    'Emily Rodriguez, LCSW',
    'Licensed Clinical Social Worker with ADHD expertise',
    76,
    4.5,
    90,
    'https://randomuser.me/api/portraits/women/45.jpg',
    NULL,
    'MSW, Columbia University',
    'MSW',
    'online',
    ARRAY['adhd', 'anxiety', 'ocd', 'depression']
  ),
  (
    'Dr. Robert Taylor',
    'Marriage counselor and family therapist',
    112,
    4.6,
    110,
    'https://randomuser.me/api/portraits/men/67.jpg',
    'top rated',
    'PhD in Marriage and Family Therapy, UCLA',
    'PhD',
    'in-person',
    ARRAY['relationships', 'family issues', 'stress', 'grief']
  ),
  (
    'Jennifer Wu, LPC',
    'Licensed Professional Counselor specializing in OCD',
    64,
    4.9,
    100,
    'https://randomuser.me/api/portraits/women/28.jpg',
    'experienced',
    'MA in Counseling Psychology, NYU',
    'MA',
    'both',
    ARRAY['ocd', 'anxiety', 'depression', 'phobias']
  ),
  (
    'Dr. David Wilson',
    'Neuropsychologist specializing in cognitive behavioral therapy',
    87,
    4.4,
    140,
    'https://randomuser.me/api/portraits/men/52.jpg',
    NULL,
    'PhD in Neuropsychology, Harvard University',
    'PhD',
    'in-person',
    ARRAY['trauma', 'adhd', 'anxiety', 'learning disorders']
  ),
  (
    'Lisa Patel, LMHC',
    'Mental Health Counselor focusing on postpartum depression',
    41,
    4.7,
    95,
    'https://randomuser.me/api/portraits/women/37.jpg',
    'new',
    'MS in Mental Health Counseling, Boston College',
    'MS',
    'online',
    ARRAY['postpartum', 'depression', 'anxiety', 'stress']
  ),
  (
    'James Thompson, LMFT',
    'Licensed Marriage and Family Therapist',
    103,
    4.5,
    105,
    'https://randomuser.me/api/portraits/men/42.jpg',
    'experienced',
    'MA in Marriage and Family Therapy, Pepperdine University',
    'MA',
    'both',
    ARRAY['relationships', 'family issues', 'communication', 'grief']
  ),
  (
    'Dr. Rebecca Martinez',
    'Clinical Psychologist specializing in bipolar disorder',
    89,
    4.8,
    130,
    'https://randomuser.me/api/portraits/women/56.jpg',
    'top rated',
    'PsyD in Clinical Psychology, University of Chicago',
    'PsyD',
    'online',
    ARRAY['bipolar', 'depression', 'anxiety', 'mood disorders']
  ),
  (
    'Andrew Kim, LCSW',
    'Social Worker specializing in trauma and PTSD',
    52,
    4.6,
    85,
    'https://randomuser.me/api/portraits/men/29.jpg',
    'new',
    'MSW, University of Michigan',
    'MSW',
    'in-person',
    ARRAY['trauma', 'ptsd', 'anxiety', 'depression']
  );

-- Verify the data was inserted
SELECT COUNT(*) FROM practitioners;