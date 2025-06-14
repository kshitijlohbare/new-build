import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/useToast';
import { ensureUserProfile, isFollowing } from '@/scripts/profileUtils';

interface UserProfile {
  id: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  location?: string;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
}

interface ProfileContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: any }>;
  followUser: (userId: string) => Promise<boolean>;
  unfollowUser: (userId: string) => Promise<boolean>;
  isFollowingUser: (userId: string) => Promise<boolean>;
  refreshProfile: () => Promise<void>;
  suggestedUsers: UserProfile[];
  getSuggestedUsers: () => Promise<void>;
  followingList: UserProfile[];
  followersList: UserProfile[];
  getFollowers: (userId: string) => Promise<UserProfile[]>;
  getFollowing: (userId: string) => Promise<UserProfile[]>;
  getUserProfile: (userId: string) => Promise<UserProfile | null>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [suggestedUsers, setSuggestedUsers] = useState<UserProfile[]>([]);
  const [followingList, setFollowingList] = useState<UserProfile[]>([]);
  const [followersList, setFollowersList] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setUserProfile(null);
      setLoading(false);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Ensure user has a profile
      const profile = await ensureUserProfile(user.id, user.email);
      
      if (profile) {
        // Map to UserProfile interface with explicit type casting
        const userProfileData: UserProfile = {
          id: String(profile.id),
          username: String(profile.username),
          display_name: String(profile.display_name),
          avatar_url: profile.avatar_url ? String(profile.avatar_url) : undefined,
          bio: profile.bio ? String(profile.bio) : undefined,
          website: profile.website ? String(profile.website) : undefined,
          location: profile.location ? String(profile.location) : undefined,
          followers_count: Number(profile.followers_count),
          following_count: Number(profile.following_count),
          created_at: String(profile.created_at),
          updated_at: String(profile.updated_at),
        };
        setUserProfile(userProfileData);
      } else {
        // Try to fetch existing profile if ensureUserProfile failed
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching user profile:', error);
        } else if (data) {
          const userProfileData: UserProfile = {
            id: String(data.id),
            username: String(data.username),
            display_name: String(data.display_name),
            avatar_url: data.avatar_url ? String(data.avatar_url) : undefined,
            bio: data.bio ? String(data.bio) : undefined,
            website: data.website ? String(data.website) : undefined,
            location: data.location ? String(data.location) : undefined,
            followers_count: Number(data.followers_count),
            following_count: Number(data.following_count),
            created_at: String(data.created_at),
            updated_at: String(data.updated_at),
          };
          setUserProfile(userProfileData);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error) {
        console.error('Error refreshing user profile:', error);
      } else if (data) {
        const userProfileData: UserProfile = {
          id: String(data.id),
          username: String(data.username),
          display_name: String(data.display_name),
          avatar_url: data.avatar_url ? String(data.avatar_url) : undefined,
          bio: data.bio ? String(data.bio) : undefined,
          website: data.website ? String(data.website) : undefined,
          location: data.location ? String(data.location) : undefined,
          followers_count: Number(data.followers_count),
          following_count: Number(data.following_count),
          created_at: String(data.created_at),
          updated_at: String(data.updated_at),
        };
        setUserProfile(userProfileData);
      }
    } catch (error) {
      console.error('Error in refreshProfile:', error);
    }
  };
  
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'User not authenticated' };
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);
      
      if (!error) {
        setUserProfile(prev => prev ? { ...prev, ...updates } : null);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully',
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error };
    }
  };
  
  const followUser = async (targetUserId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_followers')
        .insert({
          follower_id: user.id,
          following_id: targetUserId
        });
      
      if (error) {
        console.error('Error following user:', error);
        if (error.code !== '23505') { // Not a unique constraint error (already following)
          toast({
            title: 'Error',
            description: 'Could not follow this user. Please try again.',
            variant: 'destructive'
          });
        }
        return false;
      }
      
      // Update local state
      await getSuggestedUsers();
      await getFollowing(user.id);
      
      toast({
        title: 'Success',
        description: 'You are now following this user',
      });
      
      return true;
    } catch (error) {
      console.error('Error in followUser:', error);
      return false;
    }
  };
  
  const unfollowUser = async (targetUserId: string) => {
    if (!user) return false;
    
    try {
      const { error } = await supabase
        .from('user_followers')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      
      if (error) {
        console.error('Error unfollowing user:', error);
        toast({
          title: 'Error',
          description: 'Could not unfollow this user. Please try again.',
          variant: 'destructive'
        });
        return false;
      }
      
      // Update local state
      await getFollowing(user.id);
      
      toast({
        title: 'Success',
        description: 'You have unfollowed this user',
      });
      
      return true;
    } catch (error) {
      console.error('Error in unfollowUser:', error);
      return false;
    }
  };
  
  const isFollowingUser = async (targetUserId: string) => {
    if (!user) return false;
    return isFollowing(user.id, targetUserId);
  };
  
  const getSuggestedUsers = async () => {
    if (!user) return;
    
    try {
      // Get IDs of users the current user is already following
      const { data: following, error: followingError } = await supabase
        .from('user_followers')
        .select('following_id')
        .eq('follower_id', user.id);
        
      if (followingError) {
        console.error('Error getting following list:', followingError);
        return;
      }
      
      // Get the actual IDs to exclude
      const followingIds = following ? following.map(f => f.following_id) : [];
      // Also exclude the current user
      followingIds.push(user.id);
      
      // The error shows that 'followers_count' doesn't exist as a column
      // Let's query without trying to order by that non-existent column
      let query = supabase
        .from('user_profiles')
        .select('*')
        .limit(10);  // Get more results since we can't sort by popularity
      
      // Only apply the "not in" filter if there are IDs to exclude
      // This avoids the SQL syntax error with empty parentheses
      if (followingIds.length > 0) {
        query = query.not('id', 'in', `(${followingIds.join(',')})`);
      } else {
        // If no IDs to exclude, just exclude the current user
        query = query.neq('id', user.id);
      }
      
      // Execute the query
      const { data: suggested, error: suggestedError } = await query;
      
      if (suggestedError) {
        console.error('Error getting suggested users:', suggestedError);
        return;
      }
      
      setSuggestedUsers((suggested || []).map((u: any) => ({
        id: String(u.id),
        username: String(u.username),
        display_name: String(u.display_name),
        avatar_url: u.avatar_url ? String(u.avatar_url) : undefined,
        bio: u.bio ? String(u.bio) : undefined,
        website: u.website ? String(u.website) : undefined,
        location: u.location ? String(u.location) : undefined,
        followers_count: Number(u.followers_count),
        following_count: Number(u.following_count),
        created_at: String(u.created_at),
        updated_at: String(u.updated_at),
      })));
    } catch (error) {
      console.error('Error in getSuggestedUsers:', error);
      console.error('Request details:', { followingIds: user ? [user.id] : [] });
    }
  };
  
  const getFollowers = async (userId: string): Promise<UserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('user_followers')
        .select('follower_id')
        .eq('following_id', userId);
        
      if (error) {
        console.error('Error getting followers:', error);
        return [];
      }
      
      // Fetch user profiles for followers separately
      const followerIds = data ? data.map(item => item.follower_id) : [];
      let followerProfiles: UserProfile[] = [];
      
      if (followerIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .in('id', followerIds);
          
        if (profilesError) {
          console.error('Error getting follower profiles:', profilesError);
        } else {
          followerProfiles = (profiles || []).map((u: any) => ({
            id: String(u.id),
            username: String(u.username),
            display_name: String(u.display_name),
            avatar_url: u.avatar_url ? String(u.avatar_url) : undefined,
            bio: u.bio ? String(u.bio) : undefined,
            website: u.website ? String(u.website) : undefined,
            location: u.location ? String(u.location) : undefined,
            followers_count: Number(u.followers_count),
            following_count: Number(u.following_count),
            created_at: String(u.created_at),
            updated_at: String(u.updated_at),
          }));
        }
      }
      
      setFollowersList(followerProfiles);
      return followerProfiles;
    } catch (error) {
      console.error('Error in getFollowers:', error);
      return [];
    }
  };
  
  const getFollowing = async (userId: string): Promise<UserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('user_followers')
        .select(`
          following_id,
          following:user_profiles!user_followers_following_id_fkey(*)
        `)
        .eq('follower_id', userId);
        
      if (error) {
        console.error('Error getting following:', error);
        return [];
      }
      
      // Extract and transform the profiles from the joined data
      const followingProfiles: UserProfile[] = [];
      
      if (data) {
        for (const item of data) {
          if (item.following) {
            followingProfiles.push(item.following as unknown as UserProfile);
          }
        }
      }
      
      setFollowingList(followingProfiles);
      return followingProfiles;
    } catch (error) {
      console.error('Error in getFollowing:', error);
      return [];
    }
  };
  
  const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (error) {
        console.error('Error getting user profile:', error);
        return null;
      }
      if (!data) return null;
      const userProfileData: UserProfile = {
        id: String(data.id),
        username: String(data.username),
        display_name: String(data.display_name),
        avatar_url: data.avatar_url ? String(data.avatar_url) : undefined,
        bio: data.bio ? String(data.bio) : undefined,
        website: data.website ? String(data.website) : undefined,
        location: data.location ? String(data.location) : undefined,
        followers_count: Number(data.followers_count),
        following_count: Number(data.following_count),
        created_at: String(data.created_at),
        updated_at: String(data.updated_at),
      };
      return userProfileData;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };
  
  return (
    <ProfileContext.Provider value={{
      userProfile,
      loading,
      updateProfile,
      followUser,
      unfollowUser,
      isFollowingUser,
      refreshProfile,
      suggestedUsers,
      getSuggestedUsers,
      followingList,
      followersList,
      getFollowers,
      getFollowing,
      getUserProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
