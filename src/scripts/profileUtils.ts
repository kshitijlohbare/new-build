import { supabase } from '@/lib/supabase';

/**
 * Ensures that necessary user profile tables exist in the database
 * @returns {Promise<boolean>} True if setup was successful
 */
export const checkUserProfileTables = async (): Promise<boolean> => {
  try {
    // Check if the user_profiles table exists
    const { error: userProfilesError } = await supabase
      .from('user_profiles')
      .select('id')
      .limit(1);

    // If there was an error (like table doesn't exist), log it but don't fail
    if (userProfilesError) {
      console.warn('User profiles table may need to be created:', userProfilesError.message);
      return false;
    }

    console.log('User profile tables verified successfully');
    return true;
  } catch (error) {
    console.error('Error checking user profile tables:', error);
    return false;
  }
};

/**
 * Ensures a user profile exists for the current user
 * @param {string} userId - The ID of the user to ensure a profile for
 * @param {string} userEmail - Optional email of the user for generating username
 * @returns {Promise<any>} Profile data if exists or was created, false otherwise
 */
export const ensureUserProfile = async (userId: string, userEmail?: string): Promise<any> => {
  if (!userId) {
    console.error('Cannot ensure profile for empty user ID');
    return false;
  }

  try {
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    // If profile already exists, return profile data
    if (existingProfile) {
      return existingProfile;
    }

    // Handle potential fetch error other than "not found"
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching user profile:', fetchError.message);
      return false;
    }

    // Generate a username from email or user ID
    const username = userEmail 
      ? `user_${userEmail.split('@')[0]}`.toLowerCase().replace(/[^a-z0-9_]/g, '_')
      : `user_${userId.substring(0, 8)}`;

    // Create default profile if none exists
    const { data: newProfile, error: createError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: userId,
          username,
          display_name: 'New User',
          followers_count: 0,
          following_count: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (createError) {
      console.error('Error creating user profile:', createError.message);
      return false;
    }

    return newProfile[0];
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return false;
  }
};

/**
 * Checks if a user is following another user
 * @param {string} followerId - The ID of the follower
 * @param {string} targetUserId - The ID of the user being followed
 * @returns {Promise<boolean>} True if the follower is following the target user
 */
export const isFollowing = async (followerId: string, targetUserId: string): Promise<boolean> => {
  try {
    if (!followerId || !targetUserId) {
      console.error('Invalid follower or target IDs');
      return false;
    }

    const { data, error } = await supabase
      .from('user_follows')
      .select('*')
      .eq('follower_id', followerId)
      .eq('following_id', targetUserId)
      .maybeSingle();

    if (error) {
      console.error('Error checking follow status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isFollowing:', error);
    return false;
  }
};

/**
 * Checks if a user is a member of a fitness group
 * @param {string} userId - The ID of the user
 * @param {number} groupId - The ID of the fitness group
 * @returns {Promise<boolean>} True if the user is a member of the group
 */
export const isGroupMember = async (userId: string, groupId: number): Promise<boolean> => {
  try {
    if (!userId || !groupId) {
      console.error('Invalid user or group ID');
      return false;
    }
    const { data, error } = await supabase
      .from('fitness_group_members')
      .select('*')
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .maybeSingle();

    if (error) {
      console.error('Error checking group membership:', error);
      return false;
    }
    return !!data;
  } catch (error) {
    console.error('Error in isGroupMember:', error);
    return false;
  }
};

/**
 * Checks if fitness groups tables exist in the database
 * @returns {Promise<boolean>} True if fitness tables exist
 */
export const checkFitnessGroupsTables = async (): Promise<boolean> => {
  try {
    // Check if the fitness_groups table exists
    const { error: groupsError } = await supabase
      .from('fitness_groups')
      .select('id')
      .limit(1);

    // Check if the fitness_group_members table exists
    const { error: membersError } = await supabase
      .from('fitness_group_members')
      .select('id')
      .limit(1);

    if (groupsError || membersError) {
      console.warn('Fitness groups tables may need to be created:', {
        groupsError: groupsError?.message,
        membersError: membersError?.message
      });
      return false;
    }

    console.log('Fitness groups tables verified successfully');
    return true;
  } catch (error) {
    console.error('Error checking fitness groups tables:', error);
    return false;
  }
};