import { supabase } from '@/lib/supabase';
import { isGroupMember } from '@/scripts/profileUtils';

// Define types for better type safety
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface FitnessGroup {
  id: number;
  name: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  category: string;
  meeting_frequency?: string;
  creator_id: string;
  memberCount?: number;
  isJoined?: boolean;
  created_at: string;
  updated_at?: string;
}

/**
 * Fetches all fitness groups from the database
 * @returns {Promise<FitnessGroup[]>} - Array of fitness groups
 */
export const getFitnessGroups = async (): Promise<FitnessGroup[]> => {
  try {
    // First get all fitness groups
    const { data: groups, error } = await supabase
      .from('fitness_groups')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching fitness groups:', error);
      return [];
    }

    if (!groups) {
      return [];
    }

    // Get member counts for each group
    const groupsWithCounts = await Promise.all(
      groups.map(async (group) => {
        const { count } = await supabase
          .from('fitness_group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);

        return {
          ...group,
          memberCount: count || 0
        };
      })
    );

    return groupsWithCounts;
  } catch (error) {
    console.error('Error in getFitnessGroups:', error);
    return [];
  }
};

/**
 * Fetch groups that the user has joined
 * @param {string} userId - The user's ID
 * @returns {Promise<FitnessGroup[]>} - Array of joined fitness groups
 */
export const getUserGroups = async (userId: string): Promise<FitnessGroup[]> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_members')
      .select(`
        group_id,
        fitness_groups (
          id,
          name,
          description,
          location,
          latitude,
          longitude,
          category,
          meeting_frequency,
          creator_id,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching user groups:', error);
      return [];
    }

    if (!data) {
      return [];
    }
    
    // Transform the data to match our FitnessGroup interface
    const userGroups = data
      .filter((item: any) => item.fitness_groups) // Filter out null fitness_groups
      .map((item: any) => ({
        ...item.fitness_groups,
        isJoined: true,
        memberCount: 0 // Will be updated separately if needed
      }));

    // Get member counts for each group
    const groupsWithCounts = await Promise.all(
      userGroups.map(async (group: FitnessGroup) => {
        const { count } = await supabase
          .from('fitness_group_members')
          .select('*', { count: 'exact', head: true })
          .eq('group_id', group.id);

        return {
          ...group,
          memberCount: count || 0
        };
      })
    );

    return groupsWithCounts;
  } catch (error) {
    console.error('Error in getUserGroups:', error);
    return [];
  }
};

/**
 * Find nearby fitness groups based on user location
 * @param {FitnessGroup[]} groups - All available fitness groups
 * @param {LocationCoordinates} userLocation - User's location coordinates
 * @param {number} radiusKm - Search radius in kilometers
 * @returns {FitnessGroup[]} - Filtered array of nearby groups
 */
export const findNearbyGroups = (
  groups: FitnessGroup[], 
  userLocation: LocationCoordinates, 
  radiusKm: number = 10
): FitnessGroup[] => {
  if (!userLocation || !groups?.length) return [];
  
  return groups.filter(group => {
    if (!group.latitude || !group.longitude) return false;
    
    // Calculate distance using Haversine formula
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      group.latitude,
      group.longitude
    );
    
    return distance <= radiusKm;
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Convert degrees to radians
 */
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Join a fitness group
 * @param {string} userId - The user ID
 * @param {number} groupId - The group ID
 * @returns {Promise<boolean>} - Whether the join operation was successful
 */
export const joinFitnessGroup = async (userId: string, groupId: number): Promise<boolean> => {
  try {
    // Check if user is already a member
    const isMember = await isGroupMember(userId, groupId);
    if (isMember) return true;
    
    // Add user to group members
    const { error } = await supabase.from('fitness_group_members').insert([
      {
        user_id: userId,
        group_id: groupId,
        joined_at: new Date().toISOString(),
        role: 'member'
      }
    ]);
    
    if (error) {
      console.error('Error joining fitness group:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error joining fitness group:', error);
    return false;
  }
};

/**
 * Leave a fitness group
 * @param {string} userId - The user ID
 * @param {number} groupId - The group ID
 * @returns {Promise<boolean>} - Whether the leave operation was successful
 */
export const leaveFitnessGroup = async (userId: string, groupId: number): Promise<boolean> => {
  try {
    // Remove user from group members
    const { error } = await supabase
      .from('fitness_group_members')
      .delete()
      .eq('user_id', userId)
      .eq('group_id', groupId);
    
    if (error) {
      console.error('Error leaving fitness group:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error leaving fitness group:', error);
    return false;
  }
};

/**
 * Create a new fitness group
 * @param {Omit<FitnessGroup, 'id' | 'created_at' | 'updated_at'>} groupData - The group data
 * @returns {Promise<FitnessGroup | null>} - The created group or null if failed
 */
export const createFitnessGroup = async (
  groupData: Omit<FitnessGroup, 'id' | 'created_at' | 'updated_at'>
): Promise<FitnessGroup | null> => {
  try {
    const { data, error } = await supabase
      .from('fitness_groups')
      .insert([groupData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating fitness group:', error);
      return null;
    }
    
    // Add creator as a member with admin role
    const { error: memberError } = await supabase
      .from('fitness_group_members')
      .insert([
        {
          user_id: groupData.creator_id,
          group_id: data.id,
          joined_at: new Date().toISOString(),
          role: 'admin'
        }
      ]);
    
    if (memberError) {
      console.error('Error adding creator as member:', memberError);
    }
    
    return {
      ...data,
      memberCount: 1,
      isJoined: true
    } as FitnessGroup;
  } catch (error) {
    console.error('Error in createFitnessGroup:', error);
    return null;
  }
};
