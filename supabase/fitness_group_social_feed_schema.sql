-- Fitness Group Social Feed Schema

-- Posts table
CREATE TABLE IF NOT EXISTS public.fitness_group_posts (
  id SERIAL PRIMARY KEY,
  group_id INTEGER REFERENCES public.fitness_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT,
  image_url TEXT,
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

-- RLS policies (example, expand as needed)
ALTER TABLE public.fitness_group_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fitness_group_post_reactions ENABLE ROW LEVEL SECURITY;

-- Only group members can select/insert posts
CREATE POLICY select_group_posts ON public.fitness_group_posts FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.fitness_group_members WHERE group_id = fitness_group_posts.group_id AND user_id = auth.uid())
);
CREATE POLICY insert_group_posts ON public.fitness_group_posts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.fitness_group_members WHERE group_id = fitness_group_posts.group_id AND user_id = auth.uid())
);

-- Only post author or admin can delete (soft delete)
CREATE POLICY update_group_posts ON public.fitness_group_posts FOR UPDATE USING (
  user_id = auth.uid() OR (
    EXISTS (SELECT 1 FROM public.fitness_group_members WHERE group_id = fitness_group_posts.group_id AND user_id = auth.uid() AND role = 'admin')
  )
);

-- Similar policies for comments and reactions (not shown for brevity)
