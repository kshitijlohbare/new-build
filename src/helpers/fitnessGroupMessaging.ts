import { supabase } from '@/lib/supabase';

// Types for messaging and admin features
export interface GroupMessage {
  id: number;
  group_id: number;
  user_id: string;
  message: string;
  message_type: 'message' | 'announcement' | 'system';
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_by?: string;
  deleted_at?: string;
  user_profile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface GroupAnnouncement {
  id: number;
  group_id: number;
  created_by: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  creator_profile?: {
    username: string;
    display_name: string;
    avatar_url?: string;
  };
}

export interface MemberReport {
  id: number;
  group_id: number;
  reported_user_id: string;
  reported_by: string;
  reason: string;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  reviewed_by?: string;
  created_at: string;
  resolved_at?: string;
  reported_user_profile?: {
    username: string;
    display_name: string;
  };
  reporter_profile?: {
    username: string;
    display_name: string;
  };
}

export interface MemberBan {
  id: number;
  group_id: number;
  banned_user_id: string;
  banned_by: string;
  reason: string;
  ban_type: 'temporary' | 'permanent';
  expires_at?: string;
  created_at: string;
  is_active: boolean;
  banned_user_profile?: {
    username: string;
    display_name: string;
  };
}

export interface AdminLog {
  id: number;
  group_id: number;
  admin_user_id: string;
  action_type: 'member_removed' | 'member_banned' | 'message_deleted' | 'announcement_created' | 'member_promoted' | 'member_demoted';
  target_user_id?: string;
  target_message_id?: number;
  action_details?: any;
  created_at: string;
  admin_profile?: {
    username: string;
    display_name: string;
  };
}

/**
 * Check if user is admin of a specific group
 */
export const isGroupAdmin = async (userId: string, groupId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_members')
      .select('role')
      .eq('user_id', userId)
      .eq('group_id', groupId)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in isGroupAdmin:', error);
    return false;
  }
};

/**
 * Get messages for a specific group
 */
export const getGroupMessages = async (groupId: number, limit: number = 50, offset: number = 0): Promise<GroupMessage[]> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_messages')
      .select('*')
      .eq('group_id', groupId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching group messages:', error);
      // Return demo messages if table doesn't exist
      if (error.message.includes('does not exist')) {
        return getDemoMessages(groupId);
      }
      return [];
    }

    return (data as unknown as GroupMessage[]) || [];
  } catch (error) {
    console.error('Error in getGroupMessages:', error);
    return getDemoMessages(groupId);
  }
};

// Demo messages for when tables don't exist yet
const getDemoMessages = (groupId: number): GroupMessage[] => {
  return [
    {
      id: 1,
      group_id: groupId,
      user_id: 'demo-user-1',
      message: 'Welcome to the group! 👋',
      message_type: 'message',
      created_at: new Date(Date.now() - 60000).toISOString(),
      updated_at: new Date(Date.now() - 60000).toISOString(),
      is_deleted: false,
      user_profile: {
        username: 'admin',
        display_name: 'Group Admin',
        avatar_url: undefined
      }
    },
    {
      id: 2,
      group_id: groupId,
      user_id: 'demo-user-2',
      message: 'Looking forward to our next workout session!',
      message_type: 'message',
      created_at: new Date(Date.now() - 30000).toISOString(),
      updated_at: new Date(Date.now() - 30000).toISOString(),
      is_deleted: false,
      user_profile: {
        username: 'member1',
        display_name: 'Fitness Enthusiast',
        avatar_url: undefined
      }
    },
    {
      id: 3,
      group_id: groupId,
      user_id: 'demo-user-3',
      message: 'This is demo mode - messaging tables need to be created in Supabase for full functionality.',
      message_type: 'system',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_deleted: false,
      user_profile: {
        username: 'system',
        display_name: 'System',
        avatar_url: undefined
      }
    }
  ];
};

/**
 * Send a message to a group
 */
export const sendGroupMessage = async (groupId: number, userId: string, message: string, messageType: 'message' | 'announcement' | 'system' = 'message'): Promise<GroupMessage | null> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_messages')
      .insert([{
        group_id: groupId,
        user_id: userId,
        message: message.trim(),
        message_type: messageType
      }])
      .select('*')
      .single();

    if (error) {
      console.error('Error sending message:', error);
      // In demo mode, return a fake message
      if (error.message.includes('does not exist')) {
        return {
          id: Date.now(),
          group_id: groupId,
          user_id: userId,
          message: message.trim(),
          message_type: messageType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_deleted: false,
          user_profile: {
            username: 'you',
            display_name: 'You',
            avatar_url: undefined
          }
        };
      }
      return null;
    }

    return data as unknown as GroupMessage;
  } catch (error) {
    console.error('Error in sendGroupMessage:', error);
    return null;
  }
};

/**
 * Delete a message (admin capability)
 */
export const deleteGroupMessage = async (messageId: number, adminUserId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('delete_group_message', {
      message_id_param: messageId,
      admin_user_id: adminUserId
    });

    if (error) {
      console.error('Error deleting message:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in deleteGroupMessage:', error);
    return false;
  }
};

/**
 * Get announcements for a group
 */
export const getGroupAnnouncements = async (groupId: number): Promise<GroupAnnouncement[]> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_announcements')
      .select(`
        *,
        creator_profile:created_by (
          username,
          display_name,
          avatar_url
        )
      `)
      .eq('group_id', groupId)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching announcements:', error);
      return [];
    }

    return (data as unknown as GroupAnnouncement[]) || [];
  } catch (error) {
    console.error('Error in getGroupAnnouncements:', error);
    return [];
  }
};

/**
 * Create an announcement (admin only)
 */
export const createGroupAnnouncement = async (groupId: number, userId: string, title: string, content: string, isPinned: boolean = false): Promise<GroupAnnouncement | null> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_announcements')
      .insert([{
        group_id: groupId,
        created_by: userId,
        title: title.trim(),
        content: content.trim(),
        is_pinned: isPinned
      }])
      .select(`
        *,
        creator_profile:created_by (
          username,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating announcement:', error);
      return null;
    }

    // Log the admin action
    await supabase
      .from('fitness_group_admin_logs')
      .insert([{
        group_id: groupId,
        admin_user_id: userId,
        action_type: 'announcement_created',
        action_details: { title, content, is_pinned: isPinned }
      }]);

    return data as unknown as GroupAnnouncement;
  } catch (error) {
    console.error('Error in createGroupAnnouncement:', error);
    return null;
  }
};

/**
 * Report a group member
 */
export const reportGroupMember = async (groupId: number, reportedUserId: string, reportedBy: string, reason: string, description?: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('fitness_group_member_reports')
      .insert([{
        group_id: groupId,
        reported_user_id: reportedUserId,
        reported_by: reportedBy,
        reason: reason.trim(),
        description: description?.trim()
      }]);

    if (error) {
      console.error('Error reporting member:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in reportGroupMember:', error);
    return false;
  }
};

/**
 * Get member reports for a group (admin only)
 */
export const getGroupMemberReports = async (groupId: number): Promise<MemberReport[]> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_member_reports')
      .select(`
        *,
        reported_user_profile:reported_user_id (
          username,
          display_name
        ),
        reporter_profile:reported_by (
          username,
          display_name
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching member reports:', error);
      return [];
    }

    return (data as unknown as MemberReport[]) || [];
  } catch (error) {
    console.error('Error in getGroupMemberReports:', error);
    return [];
  }
};

/**
 * Remove a group member (admin capability)
 */
export const removeGroupMember = async (groupId: number, targetUserId: string, adminUserId: string, reason: string = 'Removed by admin'): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('remove_group_member', {
      group_id_param: groupId,
      target_user_id: targetUserId,
      admin_user_id: adminUserId,
      reason: reason
    });

    if (error) {
      console.error('Error removing member:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error in removeGroupMember:', error);
    return false;
  }
};

/**
 * Ban a group member (admin capability)
 */
export const banGroupMember = async (groupId: number, targetUserId: string, adminUserId: string, reason: string, banType: 'temporary' | 'permanent' = 'temporary', expiresAt?: string): Promise<boolean> => {
  try {
    // First remove them from the group
    const removeSuccess = await removeGroupMember(groupId, targetUserId, adminUserId, reason);
    if (!removeSuccess) {
      return false;
    }

    // Then add them to the ban list
    const { error } = await supabase
      .from('fitness_group_member_bans')
      .insert([{
        group_id: groupId,
        banned_user_id: targetUserId,
        banned_by: adminUserId,
        reason: reason.trim(),
        ban_type: banType,
        expires_at: expiresAt
      }]);

    if (error) {
      console.error('Error banning member:', error);
      return false;
    }

    // Log the admin action
    await supabase
      .from('fitness_group_admin_logs')
      .insert([{
        group_id: groupId,
        admin_user_id: adminUserId,
        action_type: 'member_banned',
        target_user_id: targetUserId,
        action_details: { reason, ban_type: banType, expires_at: expiresAt }
      }]);

    return true;
  } catch (error) {
    console.error('Error in banGroupMember:', error);
    return false;
  }
};

/**
 * Get admin logs for a group (admin only)
 */
export const getGroupAdminLogs = async (groupId: number, limit: number = 50): Promise<AdminLog[]> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_admin_logs')
      .select(`
        *,
        admin_profile:admin_user_id (
          username,
          display_name
        )
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching admin logs:', error);
      return [];
    }

    return (data as unknown as AdminLog[]) || [];
  } catch (error) {
    console.error('Error in getGroupAdminLogs:', error);
    return [];
  }
};

/**
 * Promote member to admin
 */
export const promoteToAdmin = async (groupId: number, targetUserId: string, adminUserId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('fitness_group_members')
      .update({ role: 'admin' })
      .eq('group_id', groupId)
      .eq('user_id', targetUserId);

    if (error) {
      console.error('Error promoting member:', error);
      return false;
    }

    // Log the admin action
    await supabase
      .from('fitness_group_admin_logs')
      .insert([{
        group_id: groupId,
        admin_user_id: adminUserId,
        action_type: 'member_promoted',
        target_user_id: targetUserId,
        action_details: { role: 'admin' }
      }]);

    return true;
  } catch (error) {
    console.error('Error in promoteToAdmin:', error);
    return false;
  }
};

/**
 * Demote admin to member
 */
export const demoteToMember = async (groupId: number, targetUserId: string, adminUserId: string): Promise<boolean> => {
  try {
    // Check if target is the group creator (cannot demote creator)
    const { data: groupData } = await supabase
      .from('fitness_groups')
      .select('creator_id')
      .eq('id', groupId)
      .single();

    if (groupData?.creator_id === targetUserId) {
      console.error('Cannot demote group creator');
      return false;
    }

    const { error } = await supabase
      .from('fitness_group_members')
      .update({ role: 'member' })
      .eq('group_id', groupId)
      .eq('user_id', targetUserId);

    if (error) {
      console.error('Error demoting member:', error);
      return false;
    }

    // Log the admin action
    await supabase
      .from('fitness_group_admin_logs')
      .insert([{
        group_id: groupId,
        admin_user_id: adminUserId,
        action_type: 'member_demoted',
        target_user_id: targetUserId,
        action_details: { role: 'member' }
      }]);

    return true;
  } catch (error) {
    console.error('Error in demoteToMember:', error);
    return false;
  }
};

/**
 * Check if user is banned from a group
 */
export const isUserBanned = async (userId: string, groupId: number): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_member_bans')
      .select('*')
      .eq('banned_user_id', userId)
      .eq('group_id', groupId)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.error('Error checking ban status:', error);
      return false;
    }

    if (!data) return false;

    // Check if temporary ban has expired
    if (data.ban_type === 'temporary' && data.expires_at) {
      const expiresAt = new Date(data.expires_at as string);
      const now = new Date();
      
      if (now > expiresAt) {
        // Deactivate expired ban
        await supabase
          .from('fitness_group_member_bans')
          .update({ is_active: false })
          .eq('id', data.id as number);
        
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in isUserBanned:', error);
    return false;
  }
};

/**
 * Get group members with their roles (for admin management)
 */
export const getGroupMembersWithRoles = async (groupId: number): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('fitness_group_members')
      .select(`
        *,
        user_profile:user_id (
          username,
          display_name,
          avatar_url,
          created_at
        )
      `)
      .eq('group_id', groupId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching group members:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getGroupMembersWithRoles:', error);
    return [];
  }
};

/**
 * Subscribe to real-time message updates
 */
export const subscribeToGroupMessages = (groupId: number, callback: (payload: any) => void) => {
  return supabase
    .channel(`group_messages_${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'fitness_group_messages',
        filter: `group_id=eq.${groupId}`
      },
      callback
    )
    .subscribe();
};

/**
 * Subscribe to real-time announcement updates
 */
export const subscribeToGroupAnnouncements = (groupId: number, callback: (payload: any) => void) => {
  return supabase
    .channel(`group_announcements_${groupId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'fitness_group_announcements',
        filter: `group_id=eq.${groupId}`
      },
      callback
    )
    .subscribe();
};
