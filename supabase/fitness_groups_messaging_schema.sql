-- SQL schema for fitness group messaging and enhanced admin features

-- Create group messages table
CREATE TABLE IF NOT EXISTS public.fitness_group_messages (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'message' CHECK (message_type IN ('message', 'announcement', 'system')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create group announcements table (for admin-only announcements)
CREATE TABLE IF NOT EXISTS public.fitness_group_announcements (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_pinned BOOLEAN DEFAULT FALSE
);

-- Create member reports table (for reporting inappropriate behavior)
CREATE TABLE IF NOT EXISTS public.fitness_group_member_reports (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  reported_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reported_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create member bans table (for temporarily or permanently banning members)
CREATE TABLE IF NOT EXISTS public.fitness_group_member_bans (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  banned_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  banned_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  ban_type TEXT DEFAULT 'temporary' CHECK (ban_type IN ('temporary', 'permanent')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create admin action logs table (for tracking admin actions)
CREATE TABLE IF NOT EXISTS public.fitness_group_admin_logs (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('member_removed', 'member_banned', 'message_deleted', 'announcement_created', 'member_promoted', 'member_demoted')),
  target_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_message_id INTEGER REFERENCES public.fitness_group_messages(id) ON DELETE SET NULL,
  action_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_fitness_group_messages_group_id ON public.fitness_group_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_fitness_group_messages_created_at ON public.fitness_group_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_fitness_group_announcements_group_id ON public.fitness_group_announcements(group_id);
CREATE INDEX IF NOT EXISTS idx_fitness_group_member_reports_group_id ON public.fitness_group_member_reports(group_id);
CREATE INDEX IF NOT EXISTS idx_fitness_group_member_bans_group_id ON public.fitness_group_member_bans(group_id);
CREATE INDEX IF NOT EXISTS idx_fitness_group_admin_logs_group_id ON public.fitness_group_admin_logs(group_id);

-- Enable Row Level Security
ALTER TABLE public.fitness_group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_member_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_member_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_admin_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Messages
CREATE POLICY read_group_messages ON public.fitness_group_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = fitness_group_messages.group_id 
      AND user_id = auth.uid()
    ) AND is_deleted = FALSE
  );

CREATE POLICY create_group_messages ON public.fitness_group_messages
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = NEW.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY update_own_messages ON public.fitness_group_messages
  FOR UPDATE USING (
    user_id = auth.uid() AND
    created_at > (CURRENT_TIMESTAMP - INTERVAL '15 minutes')
  );

-- RLS Policies for Announcements
CREATE POLICY read_group_announcements ON public.fitness_group_announcements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = fitness_group_announcements.group_id 
      AND user_id = auth.uid()
    )
  );

CREATE POLICY create_group_announcements ON public.fitness_group_announcements
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    created_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = NEW.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY update_group_announcements ON public.fitness_group_announcements
  FOR UPDATE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = fitness_group_announcements.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY delete_group_announcements ON public.fitness_group_announcements
  FOR DELETE USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = fitness_group_announcements.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for Reports
CREATE POLICY read_group_reports ON public.fitness_group_member_reports
  FOR SELECT USING (
    reported_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = fitness_group_member_reports.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY create_group_reports ON public.fitness_group_member_reports
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    reported_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = NEW.group_id 
      AND user_id = auth.uid()
    )
  );

-- RLS Policies for Bans (only admins can view and manage)
CREATE POLICY read_group_bans ON public.fitness_group_member_bans
  FOR SELECT USING (
    banned_user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = fitness_group_member_bans.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY create_group_bans ON public.fitness_group_member_bans
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    banned_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = NEW.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- RLS Policies for Admin Logs (only admins can view)
CREATE POLICY read_admin_logs ON public.fitness_group_admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = fitness_group_admin_logs.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

CREATE POLICY create_admin_logs ON public.fitness_group_admin_logs
  FOR INSERT WITH CHECK (
    auth.role() = 'authenticated' AND
    admin_user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.fitness_group_members 
      WHERE group_id = NEW.group_id 
      AND user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Functions for enhanced admin capabilities

-- Function to check if user is admin of a group
CREATE OR REPLACE FUNCTION is_group_admin(group_id_param INTEGER, user_id_param UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.fitness_group_members 
    WHERE group_id = group_id_param 
    AND user_id = user_id_param 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to soft delete messages (admin capability)
CREATE OR REPLACE FUNCTION delete_group_message(message_id_param INTEGER, admin_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  msg_group_id INTEGER;
BEGIN
  -- Get the group ID for the message
  SELECT group_id INTO msg_group_id 
  FROM public.fitness_group_messages 
  WHERE id = message_id_param;
  
  -- Check if user is admin of the group
  IF NOT is_group_admin(msg_group_id, admin_user_id) THEN
    RETURN FALSE;
  END IF;
  
  -- Soft delete the message
  UPDATE public.fitness_group_messages 
  SET is_deleted = TRUE, 
      deleted_by = admin_user_id, 
      deleted_at = CURRENT_TIMESTAMP
  WHERE id = message_id_param;
  
  -- Log the admin action
  INSERT INTO public.fitness_group_admin_logs (
    group_id, admin_user_id, action_type, target_message_id, action_details
  ) VALUES (
    msg_group_id, admin_user_id, 'message_deleted', message_id_param, 
    jsonb_build_object('message_id', message_id_param)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove member (admin capability)
CREATE OR REPLACE FUNCTION remove_group_member(group_id_param INTEGER, target_user_id UUID, admin_user_id UUID, reason TEXT DEFAULT 'Removed by admin')
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if user is admin of the group
  IF NOT is_group_admin(group_id_param, admin_user_id) THEN
    RETURN FALSE;
  END IF;
  
  -- Cannot remove yourself
  IF target_user_id = admin_user_id THEN
    RETURN FALSE;
  END IF;
  
  -- Remove the member
  DELETE FROM public.fitness_group_members 
  WHERE group_id = group_id_param AND user_id = target_user_id;
  
  -- Log the admin action
  INSERT INTO public.fitness_group_admin_logs (
    group_id, admin_user_id, action_type, target_user_id, action_details
  ) VALUES (
    group_id_param, admin_user_id, 'member_removed', target_user_id, 
    jsonb_build_object('reason', reason)
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fitness_group_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fitness_group_announcements TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.fitness_group_member_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.fitness_group_member_bans TO authenticated;
GRANT SELECT, INSERT ON public.fitness_group_admin_logs TO authenticated;

-- Grant usage on sequences
GRANT USAGE, SELECT ON SEQUENCE public.fitness_group_messages_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.fitness_group_announcements_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.fitness_group_member_reports_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.fitness_group_member_bans_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.fitness_group_admin_logs_id_seq TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION is_group_admin(INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_group_message(INTEGER, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_group_member(INTEGER, UUID, UUID, TEXT) TO authenticated;
