import { supabase } from '@/lib/supabase';

export interface FitnessGroupPost {
  id: string;
  group_id: string;
  user_id: string;
  post_type: 'text' | 'image' | 'link';
  content_text?: string;
  content_image_url?: string;
  content_link_url?: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_avatar_url?: string; // To display user avatar
  user_display_name?: string; // To display user name
  comments_count?: number;
  reactions?: { type: string; count: number; users: string[] }[]; // Simplified reactions
}

export interface FitnessGroupPostComment {
  id: string;
  post_id: string;
  user_id: string;
  comment_text: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  user_avatar_url?: string;
  user_display_name?: string;
}

export interface FitnessGroupPostReaction {
  id: string;
  post_id: string;
  user_id: string;
  reaction_type: string; // e.g., 'like', 'love', 'celebrate'
  created_at: string;
}

// Fetch posts for a group
export const getGroupPosts = async (groupId: string): Promise<FitnessGroupPost[]> => {
  const { data, error } = await supabase
    .from('fitness_group_posts')
    .select(`
      *,
      user_profiles ( avatar_url, display_name ),
      fitness_group_post_comments ( count ),
      fitness_group_post_reactions ( reaction_type, user_id )
    `)
    .eq('group_id', groupId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching group posts:', error);
    throw error;
  }

  // Process data to structure it as FitnessGroupPost[]
  return data.map(post => ({
    ...post,
    user_avatar_url: post.user_profiles?.avatar_url,
    user_display_name: post.user_profiles?.display_name,
    comments_count: (post.fitness_group_post_comments as any)?.[0]?.count || 0,
    reactions: processReactions(post.fitness_group_post_reactions as any[]),
  })) as FitnessGroupPost[];
};

// Helper to process raw reactions from Supabase
const processReactions = (rawReactions: { reaction_type: string; user_id: string }[]): FitnessGroupPost['reactions'] => {
  if (!rawReactions || rawReactions.length === 0) return [];
  const reactionMap = new Map<string, { type: string; count: number; users: string[] }>();
  rawReactions.forEach(r => {
    if (!reactionMap.has(r.reaction_type)) {
      reactionMap.set(r.reaction_type, { type: r.reaction_type, count: 0, users: [] });
    }
    const reaction = reactionMap.get(r.reaction_type)!;
    reaction.count++;
    reaction.users.push(r.user_id);
  });
  return Array.from(reactionMap.values());
};


// Create a new post
export const createGroupPost = async (
  groupId: string,
  userId: string,
  postType: 'text' | 'image' | 'link',
  contentText?: string,
  contentImageUrl?: string,
  contentLinkUrl?: string
): Promise<FitnessGroupPost | null> => {
  const { data, error } = await supabase
    .from('fitness_group_posts')
    .insert([{
      group_id: groupId,
      user_id: userId,
      post_type: postType,
      content_text: contentText,
      content_image_url: contentImageUrl,
      content_link_url: contentLinkUrl,
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    throw error;
  }
  return data as FitnessGroupPost;
};

// Fetch comments for a post
export const getPostComments = async (postId: string): Promise<FitnessGroupPostComment[]> => {
  const { data, error } = await supabase
    .from('fitness_group_post_comments')
    .select('*, user_profiles ( avatar_url, display_name )')
    .eq('post_id', postId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
  return data.map(comment => ({
    ...comment,
    user_avatar_url: comment.user_profiles?.avatar_url,
    user_display_name: comment.user_profiles?.display_name,
  })) as FitnessGroupPostComment[];
};

// Add a comment to a post
export const addPostComment = async (
  postId: string,
  userId: string,
  commentText: string
): Promise<FitnessGroupPostComment | null> => {
  const { data, error } = await supabase
    .from('fitness_group_post_comments')
    .insert([{ post_id: postId, user_id: userId, comment_text: commentText }])
    .select('*, user_profiles ( avatar_url, display_name )')
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
  return {
    ...data,
    user_avatar_url: data.user_profiles?.avatar_url,
    user_display_name: data.user_profiles?.display_name,
  } as FitnessGroupPostComment;
};

// Add or remove a reaction to a post
export const togglePostReaction = async (
  postId: string,
  userId: string,
  reactionType: string
): Promise<{ reactionAdded: boolean; newReactionList: FitnessGroupPostReaction[] }> => {
  // Check if the user has already reacted with this type
  const { data: existingReaction, error: fetchError } = await supabase
    .from('fitness_group_post_reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .eq('reaction_type', reactionType)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching existing reaction:', fetchError);
    throw fetchError;
  }

  let reactionAdded = false;
  if (existingReaction) {
    // Reaction exists, so remove it
    const { error: deleteError } = await supabase
      .from('fitness_group_post_reactions')
      .delete()
      .match({ id: existingReaction.id });
    if (deleteError) {
      console.error('Error deleting reaction:', deleteError);
      throw deleteError;
    }
    reactionAdded = false;
  } else {
    // Reaction does not exist, so add it
    const { error: insertError } = await supabase
      .from('fitness_group_post_reactions')
      .insert([{ post_id: postId, user_id: userId, reaction_type: reactionType }]);
    if (insertError) {
      console.error('Error inserting reaction:', insertError);
      throw insertError;
    }
    reactionAdded = true;
  }

  // Fetch the updated list of reactions for the post
  const { data: updatedReactions, error: updatedReactionsError } = await supabase
    .from('fitness_group_post_reactions')
    .select('*')
    .eq('post_id', postId);

  if (updatedReactionsError) {
    console.error('Error fetching updated reactions:', updatedReactionsError);
    throw updatedReactionsError;
  }

  return { reactionAdded, newReactionList: updatedReactions as FitnessGroupPostReaction[] };
};

// TODO:
// - Soft delete post (set is_deleted = true)
// - Update post (only by author or admin)
// - Soft delete comment (set is_deleted = true)
// - Update comment (only by author or admin)
// - Image upload to Supabase Storage for image posts
