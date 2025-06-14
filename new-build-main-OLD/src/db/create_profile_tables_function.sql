/**
 * SQL function to create profile tables
 * This function will be called via RPC from the client to create tables if they don't exist
 */
CREATE OR REPLACE FUNCTION public.create_profile_tables()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create user_profiles table
  CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE,
    display_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure username has no spaces and is lowercase
    CONSTRAINT valid_username CHECK (username ~ '^[a-z0-9_]{3,30}$')
  );

  -- Add an index for username lookups
  CREATE INDEX IF NOT EXISTS user_profiles_username_idx ON public.user_profiles(username);

  -- Create user_followers table for managing follow relationships
  CREATE TABLE IF NOT EXISTS public.user_followers (
    id BIGSERIAL PRIMARY KEY,
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Make sure a user can't follow the same user twice
    CONSTRAINT unique_follow UNIQUE(follower_id, following_id),
    -- Make sure a user can't follow themselves
    CONSTRAINT prevent_self_follow CHECK (follower_id <> following_id)
  );

  -- Add indexes for faster queries
  CREATE INDEX IF NOT EXISTS user_followers_follower_id_idx ON public.user_followers(follower_id);
  CREATE INDEX IF NOT EXISTS user_followers_following_id_idx ON public.user_followers(following_id);

  -- Table to track profile views
  CREATE TABLE IF NOT EXISTS public.profile_views (
    id BIGSERIAL PRIMARY KEY,
    profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,  -- Can be null for anonymous views
    view_date DATE DEFAULT CURRENT_DATE,
    viewed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Count a view only once per day per user
    CONSTRAINT unique_view_per_day UNIQUE(profile_id, viewer_id, view_date)
  );

  -- Add indexes for the views table
  CREATE INDEX IF NOT EXISTS profile_views_profile_id_idx ON public.profile_views(profile_id);
  CREATE INDEX IF NOT EXISTS profile_views_profile_date_idx ON public.profile_views(profile_id, view_date);

  -- Set up RLS (Row Level Security)
  ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.user_followers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

  -- RLS Policies: user_profiles
  -- Everyone can view profiles
  DROP POLICY IF EXISTS "Everyone can view profiles" ON public.user_profiles;
  CREATE POLICY "Everyone can view profiles" 
    ON public.user_profiles FOR SELECT USING (true);
    
  -- Users can only update their own profile
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
  CREATE POLICY "Users can update their own profile" 
    ON public.user_profiles FOR UPDATE 
    USING (auth.uid() = id);

  -- RLS Policies: user_followers
  -- Anyone can see who follows whom
  DROP POLICY IF EXISTS "Anyone can see follower relationships" ON public.user_followers;
  CREATE POLICY "Anyone can see follower relationships" 
    ON public.user_followers FOR SELECT USING (true);
    
  -- Users can follow/unfollow other users
  DROP POLICY IF EXISTS "Users can create follow relationships" ON public.user_followers;
  CREATE POLICY "Users can create follow relationships" 
    ON public.user_followers FOR INSERT 
    WITH CHECK (auth.uid() = follower_id);
    
  -- Users can only unfollow themselves
  DROP POLICY IF EXISTS "Users can delete their own follows" ON public.user_followers;
  CREATE POLICY "Users can delete their own follows" 
    ON public.user_followers FOR DELETE 
    USING (auth.uid() = follower_id);

  -- RLS Policies: profile_views
  -- Profile owners can see their views
  DROP POLICY IF EXISTS "Users can see their own profile views" ON public.profile_views;
  CREATE POLICY "Users can see their own profile views" 
    ON public.profile_views FOR SELECT 
    USING (auth.uid() = profile_id);
    
  -- Anyone can create a view
  DROP POLICY IF EXISTS "Anyone can create a view" ON public.profile_views;
  CREATE POLICY "Anyone can create a view" 
    ON public.profile_views FOR INSERT 
    WITH CHECK (viewer_id = auth.uid() OR viewer_id IS NULL);

  -- Grant permissions
  GRANT SELECT ON public.user_profiles TO anon, authenticated;
  GRANT UPDATE (display_name, avatar_url, bio, website, location, username) ON public.user_profiles TO authenticated;

  GRANT SELECT ON public.user_followers TO anon, authenticated;
  GRANT INSERT, DELETE ON public.user_followers TO authenticated;
  GRANT USAGE, SELECT ON SEQUENCE public.user_followers_id_seq TO authenticated;

  GRANT SELECT ON public.profile_views TO authenticated;
  GRANT INSERT ON public.profile_views TO anon, authenticated;
  GRANT USAGE, SELECT ON SEQUENCE public.profile_views_id_seq TO anon, authenticated;

  -- Create function for follower counts if it doesn't exist
  CREATE OR REPLACE FUNCTION update_follower_counts()
  RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      -- Increment follower/following counts
      UPDATE public.user_profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
      UPDATE public.user_profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      -- Decrement follower/following counts
      UPDATE public.user_profiles SET followers_count = followers_count - 1 WHERE id = OLD.following_id AND followers_count > 0;
      UPDATE public.user_profiles SET following_count = following_count - 1 WHERE id = OLD.follower_id AND following_count > 0;
      RETURN OLD;
    END IF;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Create triggers for maintaining follower counts
  DROP TRIGGER IF EXISTS on_follow_added ON public.user_followers;
  CREATE TRIGGER on_follow_added
  AFTER INSERT ON public.user_followers
  FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

  DROP TRIGGER IF EXISTS on_follow_removed ON public.user_followers;
  CREATE TRIGGER on_follow_removed
  AFTER DELETE ON public.user_followers
  FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

  -- Create function for new user profiles if it doesn't exist
  CREATE OR REPLACE FUNCTION handle_new_user()
  RETURNS TRIGGER AS $$
  BEGIN
    -- Create a profile entry with a username based on email or UUID
    INSERT INTO public.user_profiles (id, username, display_name)
    VALUES (
      NEW.id,
      COALESCE(
        LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '')), 
        'user_' || REPLACE(NEW.id::text, '-', '')
      ),
      COALESCE(NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1))
    );
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Create a trigger to create profiles for new users
  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
    
  -- Add function to create profiles for existing users
  PERFORM create_profiles_for_existing_users();
  
  RETURN TRUE;
END;
$$;

-- Function to create profiles for existing users
CREATE OR REPLACE FUNCTION create_profiles_for_existing_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through existing users without profiles
    FOR user_record IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN user_profiles up ON au.id = up.id
        WHERE up.id IS NULL
    LOOP
        -- Create a profile for this user
        INSERT INTO public.user_profiles (id, username, display_name)
        VALUES (
            user_record.id,
            COALESCE(
                LOWER(REGEXP_REPLACE(SPLIT_PART(user_record.email, '@', 1), '[^a-zA-Z0-9_]', '')), 
                'user_' || REPLACE(user_record.id::text, '-', '')
            ),
            COALESCE(user_record.raw_user_meta_data->>'name', SPLIT_PART(user_record.email, '@', 1))
        )
        ON CONFLICT (id) DO NOTHING;
    END LOOP;
END;
$$;
