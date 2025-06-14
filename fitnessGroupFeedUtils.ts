import { supabase } from './src/lib/supabase.js';

// Types
export interface FeedPost {
  id: number;
  group_id: number;
  user_id: string;
  content: string | null;
  link_url: string | null;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  is_deleted: boolean;
  user_display_name: string;
  user_avatar_url: string | null;
  comments_count: number;
  reactions_count: number;
  my_reactions: string[];
}

export interface PostComment {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  is_deleted: boolean;
  user_display_name: string;
  user_avatar_url: string | null;
}

export interface PostReaction {
  id: number;
  post_id: number;
  user_id: string;
  reaction_type: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry';
  created_at: string;
  user_display_name: string;
}

export interface ProcessedReactions {
  like: number;
  love: number;
  laugh: number;
  wow: number;
  sad: number;
  angry: number;
  myReactions: string[];
  totalCount: number;
}

// Get posts for a specific group
export async function getGroupPosts(groupId: number): Promise<FeedPost[]> {
  const { data, error } = await supabase
    .from('fitness_group_posts')
    .select(`
      *,
      user_profiles:user_id(display_name, avatar_url),
      comments_count:fitness_group_post_comments(count),
      reactions:fitness_group_post_reactions(reaction_type, user_id)
    `)
    .eq('group_id', groupId)
    .eq('is_deleted', false)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching group posts:', error);
    return [];
  }

  // Get current user id
  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  // Transform the data
  return data.map(post => {
    const userProfile = post.user_profiles || {};
    const myReactions = post.reactions
      ? post.reactions
          .filter(r => r.user_id === userId)
          .map(r => r.reaction_type)
      : [];
    
    return {
      ...post,
      user_display_name: userProfile.display_name || 'Unknown User',
      user_avatar_url: userProfile.avatar_url,
      comments_count: post.comments_count?.[0]?.count || 0,
      reactions_count: post.reactions?.length || 0,
      my_reactions: myReactions
    };
  });
}

// Create a new post
export async function createGroupPost(
  groupId: number,
  content: string | null,
  linkUrl: string | null = null
): Promise<FeedPost | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }
  
  const { data, error } = await supabase
    .from('fitness_group_posts')
    .insert({
      group_id: groupId,
      user_id: user.id,
      content,
      link_url: linkUrl
    })
    .select('*');

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }

  // Retrieve user profile info
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('display_name, avatar_url')
    .eq('user_id', user.id)
    .single();

  if (!data || data.length === 0) return null;
  
  return {
    ...data[0],
    user_display_name: userProfile?.display_name || 'Unknown User',
    user_avatar_url: userProfile?.avatar_url || null,
    comments_count: 0,
    reactions_count: 0,
    my_reactions: []
  };
}

// Update an existing post
export async function updateGroupPost(
  postId: number, 
  content: string | null,
  linkUrl: string | null = null
): Promise<boolean> {
  const { error } = await supabase
    .from('fitness_group_posts')
    .update({
      content,
      link_url: linkUrl,
      updated_at: new Date().toISOString()
    })
    .eq('id', postId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

  if (error) {
    console.error('Error updating post:', error);
    return false;
  }
  
  return true;
}

// Soft delete a post
export async function deleteGroupPost(postId: number): Promise<boolean> {
  const { error } = await supabase
    .from('fitness_group_posts')
    .update({ is_deleted: true })
    .eq('id', postId);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }
  
  return true;
}

// Pin/unpin a post (for admins)
export async function togglePinPost(postId: number, isPinned: boolean): Promise<boolean> {
  const { error } = await supabase
    .from('fitness_group_posts')
    .update({ is_pinned: isPinned })
    .eq('id', postId);

  if (error) {
    console.error('Error toggling pin status:', error);
    return false;
  }
  
  return true;
}

// Get comments for a specific post
export async function getPostComments(postId: number): Promise<PostComment[]> {
  const { data, error } = await supabase
    .from('fitness_group_post_comments')
    .select(`
      *,
      user_profiles:user_id(display_name, avatar_url)
    `)
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching post comments:', error);
    return [];
  }

  return data.map(comment => {
    const userProfile = comment.user_profiles || {};
    
    return {
      ...comment,
      user_display_name: userProfile.display_name || 'Unknown User',
      user_avatar_url: userProfile.avatar_url,
    };
  });
}

// Add a comment to a post
export async function addPostComment(
  postId: number,
  content: string
): Promise<PostComment | null> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return null;
  }
  
  const { data, error } = await supabase
    .from('fitness_group_post_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select('*');

  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }

  // Retrieve user profile info
  const { data: userProfile } = await supabase
    .from('user_profiles')
    .select('display_name, avatar_url')
    .eq('user_id', user.id)
    .single();

  if (!data || data.length === 0) return null;
  
  return {
    ...data[0],
    user_display_name: userProfile?.display_name || 'Unknown User',
    user_avatar_url: userProfile?.avatar_url || null,
  };
}

// Update an existing comment
export async function updateComment(commentId: number, content: string): Promise<boolean> {
  const { error } = await supabase
    .from('fitness_group_post_comments')
    .update({ content })
    .eq('id', commentId)
    .eq('user_id', (await supabase.auth.getUser()).data.user?.id || '');

  if (error) {
    console.error('Error updating comment:', error);
    return false;
  }
  
  return true;
}

// Soft delete a comment
export async function deleteComment(commentId: number): Promise<boolean> {
  const { error } = await supabase
    .from('fitness_group_post_comments')
    .update({ is_deleted: true })
    .eq('id', commentId);

  if (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
  
  return true;
}

// Toggle a reaction on a post
export async function togglePostReaction(
  postId: number,
  reactionType: 'like' | 'love' | 'laugh' | 'wow' | 'sad' | 'angry'
): Promise<string[]> {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    console.error('User not authenticated');
    return [];
  }
  
  // First check if the reaction already exists
  const { data: existingReaction } = await supabase
    .from('fitness_group_post_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .eq('reaction_type', reactionType)
    .single();

  if (existingReaction) {
    // Remove the reaction if it exists
    const { error } = await supabase
      .from('fitness_group_post_reactions')
      .delete()
      .eq('id', existingReaction.id);
    
    if (error) {
      console.error('Error removing reaction:', error);
      return [];
    }
  } else {
    // Add the new reaction
    const { error } = await supabase
      .from('fitness_group_post_reactions')
      .insert({
        post_id: postId,
        user_id: user.id,
        reaction_type: reactionType
      });
    
    if (error) {
      console.error('Error adding reaction:', error);
      return [];
    }
  }

  // Get updated reactions for this user
  const { data: updatedReactions } = await supabase
    .from('fitness_group_post_reactions')
    .select('reaction_type')
    .eq('post_id', postId)
    .eq('user_id', user.id);
  
  return updatedReactions ? updatedReactions.map(r => r.reaction_type) : [];
}

// Process reactions for UI display
export function processReactions(reactions: any[]): ProcessedReactions {
  const { data: { user } } = supabase.auth.getUser();
  const userId = user?.id;
  
  const result: ProcessedReactions = {
    like: 0,
    love: 0,
    laugh: 0,
    wow: 0,
    sad: 0,
    angry: 0,
    myReactions: [],
    totalCount: reactions?.length || 0
  };

  if (!reactions) return result;
  
  reactions.forEach(reaction => {
    if (reaction.reaction_type in result) {
      result[reaction.reaction_type as keyof typeof result] += 1;
    }
    
    if (reaction.user_id === userId) {
      result.myReactions.push(reaction.reaction_type);
    }
  });
  
  return result;
}