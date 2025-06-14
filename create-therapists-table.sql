-- Create therapists table
CREATE TABLE IF NOT EXISTS public.therapists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  name TEXT NOT NULL,
  specialty TEXT NOT NULL,
  location TEXT NOT NULL,
  rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  image_url TEXT,
  bio TEXT NOT NULL,
  years_experience INTEGER NOT NULL
);

-- Add sample data
INSERT INTO public.therapists (name, specialty, location, rating, bio, years_experience)
VALUES
  ('Dr. Sarah Johnson', 'Cognitive Behavioral Therapy', 'New York, NY', 4.9, 'Specialized in anxiety and depression treatment with over a decade of experience helping patients develop coping strategies.', 12),
  ('Dr. Michael Chen', 'Trauma Therapy', 'Los Angeles, CA', 4.7, 'Focuses on helping patients heal from past trauma using evidence-based approaches and compassionate care.', 15),
  ('Lisa Rodriguez, LMFT', 'Family Therapy', 'Chicago, IL', 4.8, 'Dedicated to strengthening family bonds and resolving conflicts through collaborative therapeutic approaches.', 8),
  ('Dr. James Wilson', 'Mindfulness-Based Therapy', 'Seattle, WA', 4.5, 'Integrates mindfulness practices with traditional therapy to help clients manage stress and improve well-being.', 10),
  ('Emily Parker, LCSW', 'Child Psychology', 'Boston, MA', 4.6, 'Specializes in working with children facing developmental challenges, anxiety, and family transitions.', 7);

-- Add RLS policies (optional)
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read therapists data
CREATE POLICY "Allow public read access to therapists" 
  ON public.therapists FOR SELECT 
  USING (true);

-- Only allow authenticated users to create/update therapists
CREATE POLICY "Allow authenticated users to insert therapists" 
  ON public.therapists FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update therapists" 
  ON public.therapists FOR UPDATE 
  USING (auth.role() = 'authenticated');