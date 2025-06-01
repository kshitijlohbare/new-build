-- Database schema for appointment meetings and calendar integration

-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  practitioner_id INTEGER NOT NULL,
  practitioner_name TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  session_type TEXT NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'completed', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create appointment_meetings table for video meeting details
CREATE TABLE IF NOT EXISTS appointment_meetings (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('zoom', 'google-meet', 'microsoft-teams', 'other')),
  meeting_url TEXT NOT NULL,
  meeting_id TEXT,
  meeting_password TEXT,
  host_email TEXT,
  guest_email TEXT,
  calendar_event_id TEXT, -- For Google Calendar/Outlook integration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(appointment_id)
);

-- Create calendar_integrations table for practitioner calendar connections
CREATE TABLE IF NOT EXISTS calendar_integrations (
  id SERIAL PRIMARY KEY,
  practitioner_id INTEGER NOT NULL,
  calendar_type TEXT NOT NULL CHECK (calendar_type IN ('google', 'microsoft', 'apple')),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  calendar_id TEXT,
  email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(practitioner_id, calendar_type)
);

-- Create email_notifications table for tracking sent emails
CREATE TABLE IF NOT EXISTS email_notifications (
  id SERIAL PRIMARY KEY,
  appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  recipient_email TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('confirmation', 'reminder', 'cancellation', 'rescheduling')),
  email_subject TEXT NOT NULL,
  email_body TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'pending')),
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_practitioner_id ON appointments(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointment_meetings_appointment_id ON appointment_meetings(appointment_id);
CREATE INDEX IF NOT EXISTS idx_calendar_integrations_practitioner_id ON calendar_integrations(practitioner_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_appointment_id ON email_notifications(appointment_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to relevant tables
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointment_meetings_updated_at ON appointment_meetings;
CREATE TRIGGER update_appointment_meetings_updated_at
    BEFORE UPDATE ON appointment_meetings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_calendar_integrations_updated_at ON calendar_integrations;
CREATE TRIGGER update_calendar_integrations_updated_at
    BEFORE UPDATE ON calendar_integrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample calendar integration data for testing (optional)
-- This would normally be populated when practitioners connect their calendars
-- INSERT INTO calendar_integrations (practitioner_id, calendar_type, access_token, email)
-- VALUES 
--   (1, 'google', 'sample_access_token', 'dr.sarah.johnson@example.com'),
--   (2, 'microsoft', 'sample_access_token', 'dr.mike.chen@example.com');
