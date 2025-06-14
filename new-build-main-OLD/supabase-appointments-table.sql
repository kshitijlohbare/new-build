-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practitioner_id INTEGER NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  practitioner_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  session_type TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own appointments
CREATE POLICY "Users can view their own appointments"
  ON appointments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own appointments
CREATE POLICY "Users can create their own appointments"
  ON appointments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own appointments
CREATE POLICY "Users can update their own appointments"
  ON appointments
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own appointments
CREATE POLICY "Users can delete their own appointments"
  ON appointments
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster user_id lookups
CREATE INDEX idx_appointments_user_id ON appointments(user_id);