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
        setUserProfile(profile);
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
          setUserProfile(data);
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
        setUserProfile(data);
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
      
      // Get users with most followers that the current user is not following
      const { data: suggested, error: suggestedError } = await supabase
        .from('user_profiles')
        .select('*')
        .not('id', 'in', `(${followingIds.join(',')})`)
        .order('followers_count', { ascending: false })
        .limit(5);
        
      if (suggestedError) {
        console.error('Error getting suggested users:', suggestedError);
        return;
      }
      
      setSuggestedUsers(suggested || []);
    } catch (error) {
      console.error('Error in getSuggestedUsers:', error);
    }
  };
  
  const getFollowers = async (userId: string): Promise<UserProfile[]> => {
    try {
      const { data, error } = await supabase
        .from('user_followers')
        .select(`
          follower_id,
          followers:user_profiles!user_followers_follower_id_fkey(*)
        `)
        .eq('following_id', userId);
        
      if (error) {
        console.error('Error getting followers:', error);
        return [];
      }
      
      // Extract and transform the profiles from the joined data
      const followerProfiles: UserProfile[] = [];
      
      if (data) {
        for (const item of data) {
          if (item.followers) {
            followerProfiles.push(item.followers as unknown as UserProfile);
          }
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
  
  const getUserProfile = async (userId: string) => {
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
      
      return data;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      return null;
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      getSuggestedUsers();
      getFollowing(user.id);
      getFollowers(user.id);
    }
  }, [user]);

  const value = {
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
    getUserProfile
  };

  return (
    <ProfileContext.Provider value={value}>
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
