-- Fitness Group Social Feed Schema

-- Posts table
CREATE TABLE IF NOT EXISTS public.fitness_group_posts (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  link_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Comments table
CREATE TABLE IF NOT EXISTS public.fitness_group_post_comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES public.fitness_group_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Reactions table
CREATE TABLE IF NOT EXISTS public.fitness_group_post_reactions (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES public.fitness_group_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id, reaction_type)
);

-- RLS policies
ALTER TABLE public.fitness_group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_post_reactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid errors
DO $$
BEGIN
  -- Posts policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_posts' AND policyname = 'select_group_posts'
  ) THEN
    DROP POLICY select_group_posts ON public.fitness_group_posts;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_posts' AND policyname = 'insert_group_posts'
  ) THEN
    DROP POLICY insert_group_posts ON public.fitness_group_posts;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_posts' AND policyname = 'update_group_posts'
  ) THEN
    DROP POLICY update_group_posts ON public.fitness_group_posts;
  END IF;

  -- Comments policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_post_comments' AND policyname = 'select_group_post_comments'
  ) THEN
    DROP POLICY select_group_post_comments ON public.fitness_group_post_comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_post_comments' AND policyname = 'insert_group_post_comments'
  ) THEN
    DROP POLICY insert_group_post_comments ON public.fitness_group_post_comments;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_post_comments' AND policyname = 'update_group_post_comments'
  ) THEN
    DROP POLICY update_group_post_comments ON public.fitness_group_post_comments;
  END IF;

  -- Reactions policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_post_reactions' AND policyname = 'select_group_post_reactions'
  ) THEN
    DROP POLICY select_group_post_reactions ON public.fitness_group_post_reactions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_post_reactions' AND policyname = 'insert_group_post_reactions'
  ) THEN
    DROP POLICY insert_group_post_reactions ON public.fitness_group_post_reactions;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'fitness_group_post_reactions' AND policyname = 'delete_group_post_reactions'
  ) THEN
    DROP POLICY delete_group_post_reactions ON public.fitness_group_post_reactions;
  END IF;
END;
$$;

-- Create policies for posts
CREATE POLICY select_group_posts ON public.fitness_group_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.fitness_group_members WHERE group_id = fitness_group_posts.group_id AND user_id = auth.uid())
);

CREATE POLICY insert_group_posts ON public.fitness_group_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.fitness_group_members WHERE group_id = fitness_group_posts.group_id AND user_id = auth.uid())
);

CREATE POLICY update_group_posts ON public.fitness_group_posts FOR UPDATE USING (
  user_id = auth.uid() OR (
    EXISTS (SELECT 1 FROM public.fitness_group_members WHERE group_id = fitness_group_posts.group_id AND user_id = auth.uid() AND role = 'admin')
  )
);

-- Policies for comments
CREATE POLICY select_group_post_comments ON public.fitness_group_post_comments FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.fitness_group_posts p
    JOIN public.fitness_group_members m ON p.group_id = m.group_id
    WHERE p.id = fitness_group_post_comments.post_id
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY insert_group_post_comments ON public.fitness_group_post_comments FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.fitness_group_posts p
    JOIN public.fitness_group_members m ON p.group_id = m.group_id
    WHERE p.id = fitness_group_post_comments.post_id
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY update_group_post_comments ON public.fitness_group_post_comments FOR UPDATE USING (
  user_id = auth.uid() OR (
    EXISTS (
      SELECT 1 FROM public.fitness_group_posts p
      JOIN public.fitness_group_members m ON p.group_id = m.group_id
      WHERE p.id = fitness_group_post_comments.post_id
      AND m.user_id = auth.uid()
      AND m.role = 'admin'
    )
  )
);

-- Policies for reactions
CREATE POLICY select_group_post_reactions ON public.fitness_group_post_reactions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.fitness_group_posts p
    JOIN public.fitness_group_members m ON p.group_id = m.group_id
    WHERE p.id = fitness_group_post_reactions.post_id
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY insert_group_post_reactions ON public.fitness_group_post_reactions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.fitness_group_posts p
    JOIN public.fitness_group_members m ON p.group_id = m.group_id
    WHERE p.id = fitness_group_post_reactions.post_id
    AND m.user_id = auth.uid()
  )
);

CREATE POLICY delete_group_post_reactions ON public.fitness_group_post_reactions FOR DELETE USING (
  user_id = auth.uid()
);