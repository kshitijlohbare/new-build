// Script to check and initialize user profiles and follow functionality
import { supabase } from '../lib/supabase';

/**
 * Check if user profiles table exists and create it if needed
 */
export const checkUserProfileTables = async () => {
  try {
    console.log('Checking for user_profiles and related tables...');
    
    // Check if the user_profiles table exists
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);
      
    // Check if the user_followers table exists
    const { error: userFollowersError } = await supabase
      .from('user_followers')
      .select('id')
      .limit(1);
      
    if ((userProfilesError && userProfilesError.code === '42P01') || 
        (userFollowersError && userFollowersError.code === '42P01')) {
      console.log('Profile tables do not exist, creating them...');
      
      // Create the tables using the SQL function we'll create in Supabase
      const { error: createError } = await supabase.rpc('create_profile_tables');
      
      if (createError) {
        console.error('Error creating profile tables:', createError);
        return false;
      }
      
      console.log('Successfully created profile tables');
      return true;
    } else if (userProfilesError || userFollowersError) {
      console.error('Error checking for profile tables:', userProfilesError || userFollowersError);
      return false;
    } else {
      console.log('Profile tables already exist');
      return true;
    }
  } catch (err) {
    console.error('Unexpected error checking profile tables:', err);
    return false;
  }
};

/**
 * Check if a user has a profile, create one if they don't
 */
export const ensureUserProfile = async (userId: string, email?: string) => {
  if (!userId) {
    console.error('No user ID provided to ensureUserProfile');
    return null;
  }

  try {
    // Check if user has a profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      if (profileError.code === 'PGRST116') { // Not found error code
        // Create a profile for the user
        const username = email ? email.split('@')[0].toLowerCase() : `user_${userId.replace(/-/g, '')}`;
        const displayName = email ? email.split('@')[0] : 'User';
        
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert({
            id: userId,
            username: username,
            display_name: displayName
          })
          .select()
          .single();
        
        if (createError) {
          console.error('Error creating user profile:', createError);
          return null;
        }
        
        return newProfile;
      } else {
        console.error('Error getting user profile:', profileError);
        return null;
      }
    }
    
    return profile;
  } catch (err) {
    console.error('Unexpected error in ensureUserProfile:', err);
    return null;
  }
};

/**
 * Get suggested users to follow
 * Excludes users that the current user is already following
 */
export const getSuggestedUsersToFollow = async (userId: string, limit: number = 5) => {
  try {
    // Get IDs of users the current user is already following
    const { data: following, error: followingError } = await supabase
      .from('user_followers')
      .select('following_id')
      .eq('follower_id', userId);
      
    if (followingError) {
      console.error('Error getting following list:', followingError);
      return [];
    }
    
    // Get the actual IDs to exclude
    const followingIds = following ? following.map(f => f.following_id) : [];
    // Also exclude the current user
    followingIds.push(userId);
    
    // Get users with most followers that the current user is not following
    const { data: suggested, error: suggestedError } = await supabase
      .from('user_profiles')
      .select('*')
      .not('id', 'in', `(${followingIds.join(',')})`)
      .order('followers_count', { ascending: false })
      .limit(limit);
      
    if (suggestedError) {
      console.error('Error getting suggested users:', suggestedError);
      return [];
    }
    
    return suggested || [];
  } catch (err) {
    console.error('Unexpected error in getSuggestedUsersToFollow:', err);
    return [];
  }
};

/**
 * Follow a user
 */
export const followUser = async (followerId: string, followingId: string) => {
  try {
    if (followerId === followingId) {
      console.error('Cannot follow yourself');
      return { success: false, error: 'Cannot follow yourself' };
    }
    
    const { error } = await supabase
      .from('user_followers')
      .insert({
        follower_id: followerId,
        following_id: followingId
      });
      
    if (error) {
      console.error('Error following user:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in followUser:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

/**
 * Unfollow a user
 */
export const unfollowUser = async (followerId: string, followingId: string) => {
  try {
    const { error } = await supabase
      .from('user_followers')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
      
    if (error) {
      console.error('Error unfollowing user:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error in unfollowUser:', err);
    return { success: false, error: 'An unexpected error occurred' };
  }
};

/**
 * Check if a user is following another user
 */
export const isFollowing = async (followerId: string, followingId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_followers')
      .select('id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .single();
      
    if (error && error.code !== 'PGRST116') { // Not PGRST116 means not a "no rows returned" error
      console.error('Error checking follow status:', error);
      return false;
    }
    
    return !!data; // Return true if data exists, false otherwise
  } catch (err) {
    console.error('Unexpected error in isFollowing:', err);
    return false;
  }
};

/**
 * Get a user's followers
 */
export const getUserFollowers = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_followers')
      .select(`
        follower_id,
        follower:follower_id(
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('following_id', userId);
      
    if (error) {
      console.error('Error getting user followers:', error);
      return [];
    }
    
    // Extract the profiles from the joined data
    return data?.map(item => item.follower) || [];
  } catch (err) {
    console.error('Unexpected error in getUserFollowers:', err);
    return [];
  }
};

/**
 * Get users that a user is following
 */
export const getUserFollowing = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_followers')
      .select(`
        following_id,
        following:following_id(
          id,
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('follower_id', userId);
      
    if (error) {
      console.error('Error getting user following:', error);
      return [];
    }
    
    // Extract the profiles from the joined data
    return data?.map(item => item.following) || [];
  } catch (err) {
    console.error('Unexpected error in getUserFollowing:', err);
    return [];
  }
};

export default {
  checkUserProfileTables,
  ensureUserProfile,
  getSuggestedUsersToFollow,
  followUser,
  unfollowUser,
  isFollowing,
  getUserFollowers,
  getUserFollowing
};
