import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Avatar,
  Button,
  Chip,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Divider,
  Stack,
  IconButton
} from '@mui/material';
import { 
  People as PeopleIcon, 
  Event as EventIcon, 
  LocationOn as LocationIcon,
  Groups as GroupsIcon,
  CalendarMonth,
  Fitness,
  Add as AddIcon
} from '@mui/icons-material';
import GroupFeed from './GroupFeed';
import { supabase } from './lib/supabaseClient';

interface RouteParams {
  groupId: string;
  [key: string]: string | undefined;
}

interface FitnessGroup {
  id: number;
  name: string;
  description: string;
  category: string;
  location: string;
  members_count: number;
  is_private: boolean;
  created_at: string;
  next_event_date: string | null;
  admin_id: string;
}

interface GroupMember {
  id: number;
  user_id: string;
  user_display_name: string;
  user_avatar_url: string | null;
  role: 'member' | 'admin';
  joined_at: string;
}

const FitnessGroupPage: React.FC = () => {
  const { groupId } = useParams<RouteParams>();
  const [activeTab, setActiveTab] = useState(0);
  const [group, setGroup] = useState<FitnessGroup | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);
  
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };

    fetchCurrentUser();
  }, []);
  
  useEffect(() => {
    if (!groupId) return;
    
    const fetchGroupData = async () => {
      setLoading(true);
      
      // Fetch group details
      const { data: groupData, error: groupError } = await supabase
        .from('fitness_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (groupError) {
        console.error('Error fetching group:', groupError);
      } else if (groupData) {
        setGroup(groupData);
      }
      
      // Fetch group members
      const { data: membersData, error: membersError } = await supabase
        .from('fitness_group_members')
        .select(`
          *,
          user_profiles:user_id(display_name, avatar_url)
        `)
        .eq('group_id', groupId);
      
      if (membersError) {
        console.error('Error fetching members:', membersError);
      } else if (membersData) {
        const formattedMembers = membersData.map(m => ({
          id: m.id,
          user_id: m.user_id,
          user_display_name: m.user_profiles?.display_name || 'Unknown User',
          user_avatar_url: m.user_profiles?.avatar_url,
          role: m.role,
          joined_at: m.created_at
        }));
        
        setMembers(formattedMembers);
        
        // Check if current user is admin
        if (currentUserId) {
          const userMember = formattedMembers.find(m => m.user_id === currentUserId);
          setIsAdmin(userMember?.role === 'admin');
          setIsMember(!!userMember);
        }
      }
      
      setLoading(false);
    };
    
    fetchGroupData();
  }, [groupId, currentUserId]);
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };
  
  const handleJoinGroup = async () => {
    if (!currentUserId || !groupId) return;
    
    const { error } = await supabase
      .from('fitness_group_members')
      .insert({
        group_id: parseInt(groupId),
        user_id: currentUserId,
        role: 'member'
      });
      
    if (error) {
      console.error('Error joining group:', error);
    } else {
      // Refresh members
      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('display_name, avatar_url')
        .eq('user_id', currentUserId)
        .single();
        
      setMembers([
        ...members,
        {
          id: Date.now(), // Temporary ID
          user_id: currentUserId,
          user_display_name: userProfile?.display_name || 'Unknown User',
          user_avatar_url: userProfile?.avatar_url,
          role: 'member',
          joined_at: new Date().toISOString()
        }
      ]);
      
      setIsMember(true);
    }
  };
  
  if (loading) {
    return (
      <Container>
        <Box my={4} display="flex" justifyContent="center">
          <Typography>Loading group...</Typography>
        </Box>
      </Container>
    );
  }
  
  if (!group) {
    return (
      <Container>
        <Box my={4}>
          <Typography variant="h5">Group not found</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Group Header */}
      <Paper 
        sx={{ 
          mt: 4, 
          mb: 3, 
          borderRadius: 3, 
          overflow: 'hidden',
          position: 'relative'
        }}
        elevation={2}
      >
        {/* Cover Background */}
        <Box
          sx={{
            height: 200,
            bgcolor: 'primary.light',
            background: 'linear-gradient(to right, #4f46e5, #9333ea)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            position: 'relative'
          }}
        >
          <GroupsIcon sx={{ fontSize: 80, opacity: 0.3 }} />
          <Chip 
            label={group.category} 
            color="primary" 
            variant="filled" 
            sx={{ 
              position: 'absolute', 
              top: 20, 
              left: 20,
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              color: 'primary.main',
              fontWeight: 'bold'
            }} 
          />
        </Box>
        
        {/* Group Info */}
        <Box sx={{ p: 3, pt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h4" fontWeight="bold">{group.name}</Typography>
              <Typography variant="body1" color="text.secondary" mt={1}>
                {group.description}
              </Typography>
              
              <Stack direction="row" spacing={3} mt={2}>
                <Box display="flex" alignItems="center">
                  <PeopleIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {group.members_count} members
                  </Typography>
                </Box>
                {group.location && (
                  <Box display="flex" alignItems="center">
                    <LocationIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {group.location}
                    </Typography>
                  </Box>
                )}
                {group.next_event_date && (
                  <Box display="flex" alignItems="center">
                    <CalendarMonth fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Next event: {new Date(group.next_event_date).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
            
            <Grid item xs={12} md={4} display="flex" justifyContent={{xs: 'flex-start', md: 'flex-end'}} alignItems="center">
              {!isMember ? (
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleJoinGroup}
                  sx={{
                    background: 'linear-gradient(45deg, #4f46e5 30%, #9333ea 90%)',
                    color: 'white',
                    boxShadow: '0 3px 5px 2px rgba(79, 70, 229, .3)',
                  }}
                >
                  Join Group
                </Button>
              ) : (
                <Chip 
                  label="Member" 
                  color="success" 
                  icon={<PeopleIcon />}
                  variant="outlined"
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Tabs */}
      <Paper sx={{ borderRadius: 2, mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Feed" />
          <Tab label="Members" />
          <Tab label="Events" />
          <Tab label="About" />
        </Tabs>
      </Paper>
      
      {/* Tab Content */}
      <Box sx={{ mb: 4 }}>
        {/* Feed Tab */}
        {activeTab === 0 && (
          <Box>
            {!isMember ? (
              <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <Fitness sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h5" gutterBottom>Join this group to see the feed</Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Become a member to post, comment, and interact with other fitness enthusiasts.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={handleJoinGroup}
                  sx={{
                    background: 'linear-gradient(45deg, #4f46e5 30%, #9333ea 90%)',
                    color: 'white',
                    mt: 2
                  }}
                >
                  Join Group
                </Button>
              </Paper>
            ) : (
              <GroupFeed groupId={parseInt(groupId || '0')} isAdmin={isAdmin} />
            )}
          </Box>
        )}
        
        {/* Members Tab */}
        {activeTab === 1 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Members ({members.length})</Typography>
              {isAdmin && (
                <Button startIcon={<AddIcon />} variant="outlined">
                  Invite Members
                </Button>
              )}
            </Box>
            
            <Grid container spacing={2}>
              {members.map((member) => (
                <Grid item xs={12} sm={6} md={4} key={member.id}>
                  <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                    <Avatar 
                      src={member.user_avatar_url || undefined} 
                      alt={member.user_display_name}
                      sx={{ width: 50, height: 50, mr: 2 }}
                    >
                      {member.user_display_name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{member.user_display_name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.role === 'admin' ? 'Admin' : 'Member'}
                      </Typography>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
        
        {/* Events Tab */}
        {activeTab === 2 && (
          <Paper sx={{ p: 3, borderRadius: 2, textAlign: 'center' }}>
            <EventIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>No upcoming events</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              There are no scheduled events for this group yet.
            </Typography>
            {isAdmin && (
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
              >
                Create Event
              </Button>
            )}
          </Paper>
        )}
        
        {/* About Tab */}
        {activeTab === 3 && (
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>About this group</Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="body1" paragraph>
              {group.description}
            </Typography>
            
            <Box mt={3}>
              <Typography variant="subtitle1" fontWeight="bold">Details</Typography>
              <Stack spacing={2} mt={2}>
                <Box display="flex">
                  <Typography variant="body2" fontWeight="medium" width={120}>Category:</Typography>
                  <Typography variant="body2">{group.category}</Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body2" fontWeight="medium" width={120}>Location:</Typography>
                  <Typography variant="body2">{group.location || 'Not specified'}</Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body2" fontWeight="medium" width={120}>Created:</Typography>
                  <Typography variant="body2">
                    {new Date(group.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
                <Box display="flex">
                  <Typography variant="body2" fontWeight="medium" width={120}>Privacy:</Typography>
                  <Typography variant="body2">
                    {group.is_private ? 'Private group' : 'Public group'}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        )}
      </Box>
    </Container>
  );
};

export default FitnessGroupPage;